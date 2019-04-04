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

| Languages&nbsp;(all&nbsp;regions) | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes |
| :--- | ---: | ---: |
| en  | 1,313,128 | 63,451 |
| en + es | 1,670,161 | 81,784 |
| en + es + fr | 2,262,680 | 108,481 |
| en + es + fr + de | 2,353,583 | 113,279 |
| en + es + fr + de + it | 2,404,448 | 116,312 |
| en + es + fr + de + it + pt | 2,559,308 | 123,755 |
| en + es + fr + de + it + pt + ja | 2,570,455 | 124,870 |
| en + es + fr + de + it + pt + ja + ko | 2,592,982 | 126,646 |
| en + es + fr + de + it + pt + ja + ko + zh | 2,684,716 | 131,798 |
| en + &lt;all timezones&gt; | 73,557,038 | 8,573,916 |
| en + es + fr + de + it + pt + ja + ko + zh<br> + &lt; all timezones&gt; | 148,572,401 | 17,388,065 |

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

| Languages&nbsp;(all&nbsp;regions) | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes |
| :--- | ---: | ---: |
| en | 398,389 | 22,121 |
| en + es | 504,335 | 28,396 |
| en + es + fr | 679,555 | 37,451 |
| en + es + fr + de | 706,102 | 39,107 |
| en + es + fr + de + it | 721,357 | 40,260 |
| en + es + fr + de + it + pt | 767,507 | 42,835 |
| en + es + fr + de + it + pt + ja | 770,959 | 43,195 |
| en + es + fr + de + it + pt + ja + ko | 778,038 | 43,746 |
| en + es + fr + de + it + pt + ja + ko + zh | 806,628 | 45,595 |
| all locales | 1,421,762 | 94,458 |

### @phensley/cldr

[Github](https://github.com/phensley/cldr-engine) - [NPM](https://www.npmjs.com/package/@phensley/cldr)

This library has a somewhat different design. It consists of a single runtime library and a resource pack per language. English would be contained in `en.json.gz` for example. Resource packs are intended to be loaded into the browser separately at runtime, so I've indicated their sizes separately below.

The sizes below would be identical for any application.

**Note:** The runtime library includes all CLDR functionality that is implemented, and each resource pack contains all data required for all scripts and regions for a single language, including **all timezones, all units, names, multiple calendars, and more**. No build time data extraction or pre-compilation steps are required.

Sizes are generated using `@phensley/cldr 0.11.3-alpha.0` which uses `cldr v35` data.

| Entity  | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes |
| :--- | ---: | ---: |
| @phensley/cldr library | 338,524 | 114,262 |
| English resource pack | 199,507 | 44,058 |
| Spanish resource pack | 180,332 | 43,691 |
| French resource pack | 164,791 | 37,085 |
| German resource pack | 139,707 | 23,492 |
| Italian resource pack | 130,008 | 22,282 |
| Portuguese resource pack | 173,927 | 38,894 |
| Japanese resource pack | 138,765 | 20,628 |
| Korean resource pack | 132,312 | 23,768 |
| Chinese resource pack | 270,318 | 53,570 |
