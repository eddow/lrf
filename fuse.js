const {
	Sparky, FuseBox, UglifyJSPlugin, TypeScriptHelpers, EnvPlugin, VueComponentPlugin,
	JSONPlugin, BabelPlugin, HotReloadPlugin, QuantumPlugin, 
	SassPlugin, CSSPlugin, CSSResourcePlugin, RawPlugin
} = require('fuse-box');
const {ConfigPlugin} = require('bundle-config/fuse-box');
let producer;
let production = 'production'=== process.env.NODE_ENV;
function VuePlugin() {
	return VueComponentPlugin({
		style: [
			SassPlugin({
				importer: true
			}),
			CSSResourcePlugin(),
			CSSPlugin({
				group: 'components.css',
				inject: 'components.css'
			})
		]
	});
}
Sparky.task("build", ()=> {
	const fuse = FuseBox.init({
		homeDir: "src",
		output: "dist/$name.js",
		package: 'lrf',
		useTypescriptCompiler : true,
		plugins: [
			RawPlugin([".dot.txt", ".dot.html"]),
			JSONPlugin(),
			TypeScriptHelpers(),
			EnvPlugin({NODE_ENV: production ? "production" : "development"}),
			CSSPlugin(),
			ConfigPlugin(),
			production && UglifyJSPlugin({/*Do not put arguments here : it breaks everything!*/})
		],
		hash: production,
		cache: !production,
		alias: {
			models: "~/common/models",
			common: "~/common",
			bluebird: 'bluebird/js/release/bluebird.js',
			//vue: 'vue/dist/vue.js',
			biz: '~/client/business',
			components: '~/client/components'
		},
		shim: {
			jquery: {exports: "$"},
			alertify: {exports: "alertify"},
			ace: {exports: "ace"},
			vue: {exports: 'window.Vue'},
			string: {exports: 'S'},
			ajv: {exports: 'Ajv'}
		},
		debug: true, log: true
	});

	fuse.bundle("server/app").target('server')
		.watch("(server|common)/**")
		.instructions("> [server/index.ts] +[common/**/*.*] -*.d.ts")
		.completed(proc=> {
			proc.require();
		});

	fuse.bundle("client/app").target('browser')
		.watch("(client|common)/**")
		.alias({
			'device.dependant': '~/client/device.desktop'
		})
		.plugin(VuePlugin())
    //.instructions('!> [client/index.ts] +[client/routes/*.vue] +[client/components/*.vue] +[common/**/*.*] - *.d.ts');
    .instructions('!> [client/index.ts] - *.d.ts');

	fuse.bundle("client/vendor").target('browser')
		.alias({
			'device.dependant': '~/client/device.desktop'
		})
		.plugin(VuePlugin())
		//.instructions(`+tslib +fuse-box-css ~client/index.ts ~[client/routes/*.vue] ~[common/**/*.*]`);
		.instructions(`+tslib +fuse-box-css ~client/index.ts`);

	
	fuse.bundle("mobile/app").target('browser')
		.watch("(client|common)/**")
		.alias({
			'device.dependant': '~/client/device.mobile'
		})
		.plugin(VuePlugin())
    .instructions('!> [client/index.ts] - *.d.ts');

	fuse.bundle("mobile/vendor").target('browser')
		.alias({
			'device.dependant': '~/client/device.mobile'
		})
		.plugin(VuePlugin())
		.instructions(`+tslib +fuse-box-css ~client/index.ts`);

	return fuse.run().then((fuseProducer)=> {
		producer = fuseProducer;
	});
});

// main task
Sparky.task("default", ["clean", "build", "make-html"], ()=> {});
Sparky.task("on", ["build", "make-html"], ()=> {});	//node fuse on

// wipe it all
Sparky.task("clean", ()=> {
	return Promise.all([
		Sparky.src(".fusebox/*").clean(".fusebox/").exec(),
		Sparky.src("dist/*").clean("dist/").exec()
	]);
});

// copy and replace HTML
Sparky.task("make-desktop-html", ()=> {
	return Sparky.src("src/index.html")
		.file("*", file=> {
			const vendor = producer.bundles.get("client/vendor"),
				app = producer.bundles.get("client/app");
			// get generated bundle names
			file.template({
				title: 'La Rôtisserie Française',
				desktop: true,
				//context.output.lastGeneratedFileName returns the .js.map file name
				production: production,
				development: !production,
				vendor: vendor.context.output.lastPrimaryOutput.filename,
				app: app.context.output.lastPrimaryOutput.filename
			});
		})
		.dest("dist/client/$name");
});
Sparky.task("make-mobile-html", ()=> {
	return Sparky.src("src/index.html")
		.file("*", file=> {
			const vendor = producer.bundles.get("mobile/vendor"),
				app = producer.bundles.get("mobile/app");
			// get generated bundle names
			file.template({
				title: 'La Rôtisserie Française',
				mobile: true,
				production: production,
				development: !production,
				vendor: vendor.context.output.lastPrimaryOutput.filename,
				app: app.context.output.lastPrimaryOutput.filename
			});
		})
		.dest("dist/mobile/$name");
});
Sparky.task("make-html", ["make-desktop-html", "make-mobile-html"], ()=> {})

Sparky.task("set-production-env", ()=> production = true);
Sparky.task("dist", ["clean", "set-production-env", "build", "make-html"], ()=> {})
