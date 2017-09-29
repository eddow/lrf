import * as dot from 'dot'

export class dav {
	master: string = `
<!DOCTYPE html>
<html>
	<head>
		{{~it.css: style}}
			<style type="text/css">{{= style}}</style>
		{{~}}
	</head>
	<body>
		{{= it.content}}
	</body>
</html>
`
	css: string[] = []
	wrapper: (data: any)=> string
	constructor(options: any = {}) {
		__assign(this, options);
		this.wrapper = dot.template(this.master);
	}
	sandbox(tpl, data) {
		try { return this.generate(tpl, data); }
		catch(x) { return x; }
	}
	generate(tpl, data) {
		var content = dot.template(tpl.dot)(data),
			css = [tpl.css].concat(this.css),
			doc = this.wrapper({content, css});
		return doc;
	}
}