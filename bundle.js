const fs = require('fs');
const path = require('path');
const { gzipSync } = require("zlib");
const brotli = require('iltorb');
const MemoryFS = require("memory-fs")
const webpack = require('webpack');
const makeWebpackConfig = require('package-build-stats/src/webpack.config');
const { decimal } = require('./framework');

// function createEntryPoint(name, installPath, customImports) {
//   const entryPath = path.join(installPath, 'index.js')

//   let importStatement;

//   if (customImports) {
//     importStatement = `
//     import { ${customImports.join(', ')} } from '${name}';
//     console.log(${customImports.join(', ')})
//      `
//   } else {
//     importStatement = `const p = require('${name}'); console.log(p)`
//   }

//   try {
//     fs.writeFileSync(
//       entryPath,
//       importStatement,
//       "utf-8"
//     )
//     return entryPath
//   } catch (err) {
//     throw new CustomError("EntryPointError", err)
//   }

const LANGS = [
  ['English', 'en'],
  ['Spanish', 'es'],
  ['French', 'fr'],
  ['German', 'de'],
  ['Italian', 'it'],
  ['Portiguese', 'pt'],
  ['Japanese', 'ja'],
  ['Korean', 'ko'],
  ['Chinese', 'zh']
];

const ENTRIES = {
  '@phensley/cldr': {
    entry: './cldr-engine/cldr.js',
    resources: './node_modules/@phensley/cldr/packs'
  },
  '@phensley/cldr-core': {
    entry: './cldr-engine/cldr-core.js',
    resources: './packs'
  }
};

const resources = root => {
  for (const [name, lang] of LANGS) {
    const p = path.join(root, `${lang}.json`);
    const raw = fs.readFileSync(p);
    const gz = gzipSync(raw);
    const br = brotli.compressSync(raw);
    console.log(`| ${name} resource pack | ${decimal(raw.length)} | ${decimal(gz.length)} | ${decimal(br.length)} |`);
  }
};

Object.keys(ENTRIES).forEach(key => {
  const compiler = webpack(makeWebpackConfig({
    entryPoint: ENTRIES[key].entry,
    externals: []
  }));
  const memoryFileSystem = new MemoryFS()
  compiler.outputFileSystem = memoryFileSystem
  compiler.run((err, stats) => {
    const jsonStats = stats ? stats.toJson({
      assets: true,
      children: false,
      chunks: false,
      chunkGroups: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: true,
      errorDetails: false,
      entrypoints: false,
      reasons: false,
      maxModules: 500,
      performance: false,
      source: true,
      depth: true,
      providedExports: true,
      warnings: false,
      modulesSort: "depth",
    }) : {}
    const bundleName = 'main.bundle.js';
    const bundle = path.join(process.cwd(), 'dist', bundleName);
    const bundleContents = memoryFileSystem.readFileSync(bundle);

    const size = jsonStats.assets
      .filter(x => x.name === bundleName)
      .pop()
      .size

    const gz = gzipSync(bundleContents);
    const br = brotli.compressSync(bundleContents);

    console.log(`| ${key} library | ${decimal(size)} | ${decimal(gz.length)} | ${decimal(br.length)} |`);
    resources(ENTRIES[key].resources);
    console.log('\n\n');
  });

});
