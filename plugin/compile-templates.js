/**
 * Created by ryan on 27/10/15.
 */

const jade = Npm.require('react-jade');

Plugin.registerCompiler({
    extensions: ['jade'],
    //archMatching: 'web'
    //isTemplate: true
}, ()=> new ReactJadeCompiler());

class ReactJadeCompiler extends CachingCompiler {
    constructor() {
        super({
            compilerName: 'jade',
            defaultCacheSize: 1024 * 1024 * 10
        });
    }

    _getCompileOptions(inputFile) {
        return {
            bare: true,
            filename: inputFile.getPathInPackage(),
            literate: inputFile.getExtension() !== 'coffee'
            //TODO: Add sourcemaps
            // Return a source map.
            // sourceMap: true,
            // Include the original source in the source map (sourcesContent field).
            // inline: true,
            // This becomes the "file" field of the source map.
            // generatedFile: "/" + this._outputFilePath(inputFile),
            // This becomes the "sources" field of the source map.
            // sourceFiles: [inputFile.getDisplayPath()],
        };
    }

    _outputFilePath(inputFile) {
        return inputFile.getPathInPackage() + ".js";
    }

    getCacheKey(inputFile) {
        return [
            inputFile.getSourceHash(),
            inputFile.getDeclaredExports(),
            this._getCompileOptions(inputFile),
        ];
    }

    compileOneFile(inputFile) {

        const source = inputFile.getContentsAsString();
        const compileOptions = this._getCompileOptions(inputFile);

        let output;
        try {
            output = jade.compileClient(source, compileOptions);
        } catch (e) {
            inputFile.error({
                message: e.message,
                line: e.location && (e.location.first_line + 1),
                column: e.location && (e.location.first_column + 1)
            });
            return null;
        }

        /*const stripped = stripExportedVars(
            output.js,
            inputFile.getDeclaredExports().map(e => e.name));
        const sourceWithMap = addSharedHeader(
            stripped, JSON.parse(output.v3SourceMap));*/
        //TODO: improve this - possibly parse for name in first line or the like?
        return inputFile.getBasename().split('.')[0] + ' = ' + output;
    }

    addCompileResult(inputFile, sourceWithMap) {
        inputFile.addJavaScript({
            path: this._outputFilePath(inputFile),
            sourcePath: inputFile.getPathInPackage(),
            data: sourceWithMap,
            //sourceMap: sourceWithMap.sourceMap,
            bare: inputFile.getFileOptions().bare
        });
    }

    compileResultSize(sourceWithMap) {
        return sourceWithMap.length //+
            //this.sourceMapSize(sourceWithMap.sourceMap);
    }
}