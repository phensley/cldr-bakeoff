const fs = require('fs');
const { join } = require('path');
const zlib = require('zlib');
const compiler = require('globalize-compiler');

const { decimal } = require('./framework');
const { TIMEZONES } = require('./timezones');

const ALL_LOCALES = fs.readdirSync('./node_modules/cldr-data/main');

const LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];

const UNITS = [
  'bit',
  'byte',
  'gigabit',
  'gigabyte',
  'kilobit',
  'kilobyte',
  'megabit',
  'megabyte',
  'terabit',
  'terabyte'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

const CURRENCY_OPTIONS = [
  { style: 'symbol' },
  { compact: 'short' }
];

const NUMBER_OPTIONS = [
  { style: 'decimal' },
  { style: 'percent' }
];

const DATETIME_OPTIONS = [
  { datetime: 'full' },
  { date: 'long' },
  { time: 'full' }
];

const UNIT_OPTIONS = [
  { form: 'short', compact: 'short' },
  { form: 'long' }
];

const options = (o) =>
  '{' + Object.keys(o).map(k => `${k}: ${JSON.stringify(o[k])}`).join(', ') + '}';

const makeDateFormatter = (o) =>
  `Globalize.dateFormatter(${options(o)});\n`;

const makeCurrencyFormatter = (code, o) =>
  `Globalize.currencyFormatter('${code}', ${options(o)});\n`;

const makeNumberFormatter = (o) =>
  `Globalize.numberFormatter(${options(o)});\n`;

const makeUnitFormatter = (unit, o) =>
  `Globalize.unitFormatter('${unit}', ${options(o)});\n`;

const makeTimezoneFormatter = (tz) =>
  `Globalize.dateFormatter(${options({ timeZone: tz })});\n`;

const build = (withtz) => {
  let s = '';

  UNITS.forEach(u => {
    UNIT_OPTIONS.forEach(o => {
      s += makeUnitFormatter(u, o);
    });
  });

  DATETIME_OPTIONS.forEach(o => {
    s += makeDateFormatter(o);
  });

  if (withtz) {
    TIMEZONES.forEach(tz => {
      s += makeTimezoneFormatter(tz);
    });
  }

  CURRENCIES.forEach(code => {
    CURRENCY_OPTIONS.forEach(o => {
      s += makeCurrencyFormatter(code, o);
    });
  })

  NUMBER_OPTIONS.forEach(o => {
    s += makeNumberFormatter(o);
  });

  return s;
};

const buildLite = () => {
  let s = '';
  s += makeDateFormatter({ date: 'long' });
  s += makeDateFormatter({ time: 'long' });
  s += makeNumberFormatter({});
  CURRENCIES.forEach(code => {
    s += makeCurrencyFormatter(code, {});
  });
  s += makeUnitFormatter('megabyte', {});
  return s;
};


const HEADER = `
import Globalize from 'globalize/dist/globalize-runtime';
`;

const FOOTER = `
export default Globalize;
`;


const compile = (name, langs, source) => {
  const outdir = join(__dirname, 'globalize-output');
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir);
  }

  let path = join(outdir, `source-${source.name}.js`);
  fs.writeFileSync(path, source.code, { encoding: 'utf-8' });

  const start = process.hrtime();
  const extracts = compiler.extract(source.code);
  const locales = getlocales(new Set(langs));

  let res = HEADER;
  for (const locale of locales) {
    res += compiler.compileExtracts({
      extracts,
      defaultLocale: locale,
      template: props => `\n${props.code}\n`
    });
  }

  res += FOOTER;
  const buf = Buffer.from(res, 'utf-8');
  const elapsed = process.hrtime(start);

  const secs = elapsed[0] + (elapsed[1] / 1e9);

  path = join(outdir, `compiled-${source.name}-${name}.js`);
  fs.writeFileSync(path, res, { encoding: 'utf-8' });

  console.log(`languages: ${langs.join(', ')} ${source.name}`);
  console.log(` compile ${secs} secs`);
  console.log(`    size ${decimal(res.length)} characters  ${decimal(buf.length)} bytes`);

  const data = zlib.gzipSync(buf, { level: zlib.constants.Z_BEST_COMPRESSION });
  console.log(`    gzip ${decimal(data.length)} bytes\n`);

  path = join(outdir, `compiled-${source.name}-${name}.js.gz`);
  fs.writeFileSync(path, data, { encoding: 'binary' });
};

const getlocales = (langs) =>
  ALL_LOCALES.filter(l => langs.has(l.split('-')[0]));

const LITE = true;

if (LITE) {
  const code = buildLite();
  const source = { name: 'lite', code };
  for (let i = 0; i < LANGS.length; i++) {
    const langs = LANGS.slice(0, i + 1);
    const name = langs.join('_')
    compile(name, langs, source);
  }

  const allset = new Set(ALL_LOCALES.filter(l => l !== 'root').map(l => l.split('-')[0]));
  let alllangs = [];
  allset.forEach(l => alllangs.push(l));
  compile('all', alllangs, source);

} else {
  let source = { name: 'example-app', code: build(false) };
  for (let i = 0; i < LANGS.length; i++) {
    const langs = LANGS.slice(0, i + 1);
    const name = langs.join('_')
    compile(name, langs, source);
  }

  source = { name: 'example-app-tz', code: build(true) };
  // one with timezones
  compile('en', ['en'], source);

  // all locales + timezones
  compile(LANGS.join('_'), LANGS, source);
}
