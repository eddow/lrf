"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CSSplugin_1 = require("../stylesheet/CSSplugin");
const Utils_1 = require("../../Utils");
const VueTemplateFile_1 = require("./VueTemplateFile");
const VueStyleFile_1 = require("./VueStyleFile");
const VueScriptFile_1 = require("./VueScriptFile");
const path = require("path");
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
const DEFAULT_OPTIONS = {
    script: [],
    template: [],
    style: []
};
class VueComponentClass {
    constructor(options) {
        this.test = /\.vue$/;
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.options.script = Array.isArray(this.options.script) ? this.options.script : [this.options.script];
        this.options.template = Array.isArray(this.options.template) ? this.options.template : [this.options.template];
        this.options.style = Array.isArray(this.options.style) ? this.options.style : [this.options.style];
    }
    init(context) {
        context.allowExtension(".vue");
    }
    getDefaultExtension(block) {
        switch (block.type) {
            case 'template':
                return 'html';
            case 'script':
                return 'js';
            case 'style':
                return 'css';
        }
    }
    createVirtualFile(file, block, scopeId, pluginChain) {
        let extension = block.lang || this.getDefaultExtension(block);
        let src = `./${block.type}.${extension}`;
        if (block.src) {
            let srcExtension = path.extname(block.src) || '';
            if (srcExtension.indexOf('.') > -1) {
                srcExtension = srcExtension.substr(1);
                extension = srcExtension;
                src = block.src;
            }
            else {
                extension = (block.lang) ? `${block.lang}` : '' || this.getDefaultExtension(block);
                src = `${block.src}.${extension}`;
            }
        }
        file.context.allowExtension(`.${extension}`);
        const fileInfo = file.collection.pm.resolve(src, file.info.absDir);
        switch (block.type) {
            case 'script':
                return new VueScriptFile_1.VueScriptFile(file.context, fileInfo, block, scopeId, pluginChain);
            case 'template':
                return new VueTemplateFile_1.VueTemplateFile(file.context, fileInfo, block, scopeId, pluginChain);
            case 'style':
                return new VueStyleFile_1.VueStyleFile(file.context, fileInfo, block, scopeId, pluginChain);
        }
    }
    addToCacheObject(cacheItem, path, contents, sourceMap) {
        cacheItem[path] = {
            contents,
            sourceMap
        };
    }
    bundleEnd(context) {
        if (context.useCache) {
            context.source.addContent(`
        var process = FuseBox.import('process');

        if (process.env.NODE_ENV !== "production") {
          var api = FuseBox.import('vue-hot-reload-api');
          var Vue = FuseBox.import('vue');

          api.install(Vue);

          FuseBox.addPlugin({
            hmrUpdate: function (data) {
              var componentWildcardPath = '~/' + data.path.substr(0, data.path.lastIndexOf('/') + 1) + '*.vue';
              var isComponentStyling = (data.type === "css" && !!FuseBox.import(componentWildcardPath));

              if (data.type === "js" && /.vue$/.test(data.path) || isComponentStyling) {
                var fusePath = '~/' + data.path;

                FuseBox.flush();

                FuseBox.flush(function (file) {
                  return file === data.path;
                });

                FuseBox.dynamic(data.path, data.content);

                if (!isComponentStyling) {
                  var component = FuseBox.import(fusePath).default;
                  api.reload(component._scopeId, component);
                }

                return true;
              }
            }
          });
        }
        `);
        }
    }
    transform(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const vueCompiler = require("vue-template-compiler");
            const bundle = file.context.bundle;
            let cacheValid = false;
            if (file.context.useCache && file.loadFromCache()) {
                const data = file.cacheData;
                cacheValid = true;
                if (bundle && bundle.lastChangedFile) {
                    if (data.template[bundle.lastChangedFile] || data.script[bundle.lastChangedFile] || data.styles[bundle.lastChangedFile]) {
                        cacheValid = false;
                    }
                }
            }
            if (!cacheValid) {
                file.isLoaded = false;
                file.cached = false;
                file.analysis.skipAnalysis = false;
            }
            const concat = new Utils_1.Concat(true, "", "\n");
            concat.add(null, "var _options = {}");
            file.loadContents();
            const cache = {
                template: {},
                script: {},
                styles: {}
            };
            const component = vueCompiler.parseComponent(fs.readFileSync(file.info.absPath).toString());
            const hasScopedStyles = component.styles && component.styles.find((style) => style.scoped);
            const scopeId = hasScopedStyles ? `data-v-${Utils_1.hashString(file.info.absPath)}` : null;
            if (component.template) {
                const templateFile = this.createVirtualFile(file, component.template, scopeId, this.options.template);
                templateFile.setPluginChain(component.template, this.options.template);
                if (cacheValid) {
                    const templateCacheData = file.cacheData.template[templateFile.info.fuseBoxPath];
                    this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateCacheData.contents, templateCacheData.sourceMap);
                }
                else {
                    yield templateFile.process();
                    this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateFile.contents, templateFile.sourceMap);
                    concat.add(null, templateFile.contents);
                }
            }
            if (component.script) {
                const scriptFile = this.createVirtualFile(file, component.script, scopeId, this.options.script);
                scriptFile.setPluginChain(component.script, this.options.script);
                if (cacheValid) {
                    const scriptCacheData = file.cacheData.script[scriptFile.info.fuseBoxPath];
                    scriptFile.isLoaded = true;
                    scriptFile.contents = scriptCacheData.contents;
                    scriptFile.sourceMap = scriptCacheData.sourceMap;
                    this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptCacheData.contents, scriptCacheData.sourceMap);
                }
                else {
                    yield scriptFile.process();
                    this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptFile.contents, scriptFile.sourceMap);
                    concat.add(null, scriptFile.contents, scriptFile.sourceMap);
                    concat.add(null, "Object.assign(exports.default.options||exports.default, _options)");
                }
            }
            else {
                if (!cacheValid) {
                    concat.add(null, "exports.default = {}");
                    concat.add(null, "Object.assign(exports.default, _options)");
                }
            }
            if (component.styles && component.styles.length > 0) {
                file.addStringDependency("fuse-box-css");
                const styleFiles = yield realm_utils_1.each(component.styles, (styleBlock) => {
                    const styleFile = this.createVirtualFile(file, styleBlock, scopeId, this.options.style);
                    styleFile.setPluginChain(styleBlock, this.options.style);
                    if (cacheValid) {
                        const CSSPlugin = this.options.style.find((plugin) => plugin instanceof CSSplugin_1.CSSPluginClass);
                        styleFile.isLoaded = true;
                        styleFile.contents = file.cacheData.styles[styleFile.info.fuseBoxPath].contents;
                        styleFile.sourceMap = file.cacheData.styles[styleFile.info.fuseBoxPath].sourceMap;
                        cache.styles[styleFile.info.fuseBoxPath] = {
                            contents: styleFile.contents,
                            sourceMap: styleFile.sourceMap
                        };
                        styleFile.fixSourceMapName();
                        return (CSSPlugin.transform(styleFile) || Promise.resolve()).then(() => styleFile);
                    }
                    else {
                        return styleFile.process().then(() => styleFile).then(() => {
                            this.addToCacheObject(cache.styles, styleFile.info.fuseBoxPath, styleFile.contents, styleFile.sourceMap);
                            if (styleFile.cssDependencies) {
                                styleFile.cssDependencies.forEach((path) => {
                                    cache.styles[path] = 1;
                                });
                            }
                            return styleFile;
                        });
                    }
                });
                yield realm_utils_1.each(styleFiles, (styleFile) => {
                    if (styleFile.alternativeContent) {
                        concat.add(null, styleFile.alternativeContent);
                    }
                    else {
                        concat.add(null, `require('fuse-box-css')('${styleFile.info.fuseBoxPath}', ${JSON.stringify(styleFile.contents)})`, styleFile.sourceMap);
                    }
                });
            }
            if (file.context.useCache) {
                concat.add(null, `
        var process = FuseBox.import('process');

        if (process.env.NODE_ENV !== "production") {
          var api = require('vue-hot-reload-api');

          process.env.vueHMR = process.env.vueHMR || {};

          if (!process.env.vueHMR['${scopeId}']) {
            process.env.vueHMR['${scopeId}'] = true;
            api.createRecord('${scopeId}', module.exports.default);
          }
        }
      `);
            }
            file.addStringDependency('vue');
            if (!cacheValid) {
                file.contents = concat.content.toString();
                file.sourceMap = concat.sourceMap.toString();
                file.analysis.parseUsingAcorn();
                file.analysis.analyze();
            }
            if (file.context.useCache && !cacheValid) {
                file.setCacheData(cache);
                file.context.cache.writeStaticCache(file, file.sourceMap);
                file.context.emitJavascriptHotReload(file);
            }
        });
    }
}
exports.VueComponentClass = VueComponentClass;
exports.VueComponentPlugin = (options = {}) => {
    return new VueComponentClass(options);
};

//# sourceMappingURL=VuePlugin.js.map