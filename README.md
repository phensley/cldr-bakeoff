# cldr-bakeoff

Comparisons of frontend libaries that provide i18n features using CLDR data.


## Requirements

Goal is to compare i18n libraries using some very basic requirements for a real-world application.

The theoretical example application is designed to allow users to share files with one another, and possibly pay to purchase them. They need to see file sizes, date and times, currency amounts, etc. Download progress needs to show transferred file size and percent complete. Users can use one of 4 currencies to transact.

The i18n formatting requirements are:

 * Unit formatting (bit, byte, kilobyte, megabyte, etc), with a compact form.
 * Currency symbol and short compact formats.
 * Support 4 currencies: USD, EUR, GBP, and JPY.
 * Numbers in decimal and percent format.
 * Date and time formats, in Gregorian calendar only.
 * Support users speaking English, French, German, Italian, Japanese, Korean, Chinese, Portuguese, and Spanish.
 * Users can be anywhere in the world, so we try to support all regions for each language.
 * Optional time zones.
   - We'll assume our users are all over the world, and time will be localized.
   - If necessary we can display all times in UTC, but showing wall time would be ideal.

### Globalize

[Github](https://github.com/globalizejs/globalize) - [NPM](https://www.npmjs.com/package/globalize)

Sizes are generated using `globalize 1.4.2`, `globalize-compiler 1.0.0` and `cldr v34` data.

Example [code generator](./generate-globalize.js) strictly includes only the code and data required to support the above requirements. When any requirements are added or removed this code must be regenerated.

I've also bundled all locales into a single JavaScript file. Applications that require languages or locales to be loaded individually would have to implement more logic to ensure the common code is shared among all locales, to minimize the overhead.

**Note:** the sizes below *do not* include the runtime libraries - this is just the generated code that patches selected data into the library and constructs formatter instances.

Adding all timezone identifiers massively increases the generated data to the point that a developer should probably switch to a different strategy of using Globalize, or find an alternative way of including timezone data.

The generated code compresses well (20x) due to the high amount of duplication.

#### Sizes of generated code for example application

Source code (minus timezones):
```javascript
Globalize.unitFormatter('bit', {form: "short", compact: "short"});
Globalize.unitFormatter('bit', {form: "long"});
Globalize.unitFormatter('byte', {form: "short", compact: "short"});
Globalize.unitFormatter('byte', {form: "long"});
Globalize.unitFormatter('gigabit', {form: "short", compact: "short"});
Globalize.unitFormatter('gigabit', {form: "long"});
Globalize.unitFormatter('gigabyte', {form: "short", compact: "short"});
Globalize.unitFormatter('gigabyte', {form: "long"});
Globalize.unitFormatter('kilobit', {form: "short", compact: "short"});
Globalize.unitFormatter('kilobit', {form: "long"});
Globalize.unitFormatter('kilobyte', {form: "short", compact: "short"});
Globalize.unitFormatter('kilobyte', {form: "long"});
Globalize.unitFormatter('megabit', {form: "short", compact: "short"});
Globalize.unitFormatter('megabit', {form: "long"});
Globalize.unitFormatter('megabyte', {form: "short", compact: "short"});
Globalize.unitFormatter('megabyte', {form: "long"});
Globalize.unitFormatter('terabit', {form: "short", compact: "short"});
Globalize.unitFormatter('terabit', {form: "long"});
Globalize.unitFormatter('terabyte', {form: "short", compact: "short"});
Globalize.unitFormatter('terabyte', {form: "long"});
Globalize.dateFormatter({datetime: "full"});
Globalize.dateFormatter({date: "long"});
Globalize.dateFormatter({time: "full"});
Globalize.currencyFormatter('USD', {style: "symbol"});
Globalize.currencyFormatter('USD', {compact: "short"});
Globalize.currencyFormatter('EUR', {style: "symbol"});
Globalize.currencyFormatter('EUR', {compact: "short"});
Globalize.currencyFormatter('GBP', {style: "symbol"});
Globalize.currencyFormatter('GBP', {compact: "short"});
Globalize.currencyFormatter('JPY', {style: "symbol"});
Globalize.currencyFormatter('JPY', {compact: "short"});
Globalize.numberFormatter({style: "decimal"});
Globalize.numberFormatter({style: "percent"});
```

| Languages&nbsp;(all&nbsp;regions) | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes | `brotli -q 11`&nbsp;bytes |
| :--- | ---: | ---: | ---: |
| en  | 1,313,128 | 63,451 | 42,587 |
| en + es | 1,670,161 | 81,784 | 54,616 |
| en + es + fr | 2,262,680 | 108,481 | 72,991 |
| en + es + fr + de | 2,353,583 | 113,279 | 76,243 |
| en + es + fr + de + it | 2,404,448 | 116,312 | 78,300 |
| en + es + fr + de + it + pt | 2,559,308 | 123,755 | 83,422 |
| en + es + fr + de + it + pt + ja | 2,570,455 | 124,870 | 84,066 |
| en + es + fr + de + it + pt + ja + ko | 2,592,982 | 126,646 | 85,412 |
| en + es + fr + de + it + pt + ja + ko + zh | 2,684,716 | 131,798 | 88,985 |
| en + &lt;all timezones&gt; | 73,557,038 | 8,573,916 | 684,541 |
| en + es + fr + de + it + pt + ja + ko + zh<br> + &lt; all timezones&gt; | 148,572,401 | 17,388,065 | 1,368,767 |

#### Sizes for stripped down "lite" example application

Reducing the example application requirements drastically, to a point where there may not be an advantage to using a dedicated i18n library:

 * One date, time, unit (megabyte) and number formatter
 * One formatter per currency
 * No timezones.

Source code:
```javascript
Globalize.dateFormatter({date: "long"});
Globalize.dateFormatter({time: "long"});
Globalize.numberFormatter({});
Globalize.currencyFormatter('USD', {});
Globalize.currencyFormatter('EUR', {});
Globalize.currencyFormatter('GBP', {});
Globalize.currencyFormatter('JPY', {});
Globalize.unitFormatter('megabyte', {});
```

| Languages&nbsp;(all&nbsp;regions) | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes | `brotli -q 11`&nbsp;bytes |
| :--- | ---: | ---: | ---: |
| en | 398,389 | 22,121 | 15,172 |
| en + es | 504,335 | 28,396 | 19,447 |
| en + es + fr | 679,555 | 37,451 | 25,664 |
| en + es + fr + de | 706,102 | 39,107 | 26,769 |
| en + es + fr + de + it | 721,357 | 40,260 | 27,501 |
| en + es + fr + de + it + pt | 767,507 | 42,835 | 29,313 |
| en + es + fr + de + it + pt + ja | 770,959 | 43,195 | 29,482 |
| en + es + fr + de + it + pt + ja + ko | 778,038 | 43,746 | 29,861 |
| en + es + fr + de + it + pt + ja + ko + zh | 806,628 | 45,595 | 31,121 |
| all locales | 1,421,762 | 94,458 | 63,083 |

### @phensley/cldr

[Github](https://github.com/phensley/cldr-engine) - [NPM](https://www.npmjs.com/package/@phensley/cldr)

This library has a somewhat different design. It consists of a single runtime library and a resource pack per language. English would be contained in `en.json.gz` for example. Resource packs are intended to be loaded into the browser separately at runtime, so I've indicated their sizes separately below.

The sizes below would be identical for any application.

**Note:** The runtime library includes all CLDR functionality that is implemented, and each resource pack contains all data required for all scripts and regions for a single language, including **all timezones, all units, names, multiple calendars, and more**. No build time data extraction or pre-compilation steps are required.

Sizes are generated using version `0.13.3-alpha.0` which uses `cldr v35` data.

#### Sizes for full functionality

This includes the full functionality of the library, importing the `@phensley/cldr` package which uses the [default configuration](https://raw.githubusercontent.com/phensley/cldr-engine/master/packages/cldr/src/config.json).


| Entity  | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes | `brotli -q 11`&nbsp;bytes |
| :--- | ---: | ---: | ---: |
| @phensley/cldr library | 350,174 | 117,478 | 94,930 |
| English resource pack | 197,481 | 45,129 | 37,271 |
| Spanish resource pack | 178,596 | 43,720 | 37,409 |
| French resource pack | 163,210 | 36,945 | 30,450 |
| German resource pack | 138,281 | 23,470 | 18,917 |
| Italian resource pack | 128,587 | 22,292 | 18,120 |
| Portuguese resource pack | 172,461 | 38,881 | 30,854 |
| Japanese resource pack | 137,344 | 20,658 | 17,042 |
| Korean resource pack | 130,891 | 23,778 | 19,044 |
| Chinese resource pack | 276,426 | 53,524 | 37,757 |

#### Sizes for customized

This uses a [custom configuration](./cldr-engine-config.json) and the `@phensley/cldr-core` package to reduce the size of the library and resource packs. Where possible, only the data required by the application is included.

| Entity  | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes | `brotli -q 11`&nbsp;bytes |
| :--- | ---: | ---: | ---: |
| @phensley/cldr-core library | 324,292 | 109,280 | 89,776 |
| English resource pack | 54,269 | 15,079 | 12,978 |
| Spanish resource pack | 53,641 | 16,831 | 14,691 |
| French resource pack | 42,876 | 11,371 | 9,708 |
| German resource pack | 31,368 | 7,063 | 6,216 |
| Italian resource pack | 31,298 | 6,566 | 5,771 |
| Portuguese resource pack | 50,410 | 12,985 | 11,041 |
| Japanese resource pack | 33,930 | 6,457 | 5,526 |
| Korean resource pack | 32,163 | 6,602 | 5,829 |
| Chinese resource pack | 68,111 | 15,766 | 12,883 |
