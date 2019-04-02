# cldr-bakeoff

Comparisons of frontend libaries that provide i18n features using CLDR data.


## Requirements

Goal is to compare i18n libraries using some very basic requirements for a real-world application.

The theoretical application is designed to allow users to share files with one another, and possibly pay to purchase them. They need to see file sizes, date and times, currency amounts, etc. Download progress needs to show transferred file size and percent complete. Users can use one of 4 currencies to transact.

The i18n formatting requirements are:

 * Unit formatting (bit, byte, kilobyte, megabyte, etc), with a compact form.
 * Currency symbol and short compact formats.
 * Support 4 currencies: USD, EUR, GBP, and JPY.
 * Numbers in decimal and percent format.
 * Date and time formats, in Gregorian calendar only.
 * Support users speaking English, French, German, Italian, Japanese, Korean, Portuguese, and Spanish.
 * Users can be anywhere in the world, so we try to support all regions for each language.
 * Optional time zones.
   - We'll assume our users are all over the world, and time will be localized.
   - If necessary we can display all times in UTC, but showing wall time would be ideal.

### Globalize

[Globalize.js](https://github.com/globalizejs/globalize) example [code generator](./generate-globalize.js)

**Note: the sizes below do not include the runtime libraries** - this is just the generated code that patches selected data into the library and constructs formatter instances.

##### Output

| Languages&nbsp;(all&nbsp;regions) | Characters | UTF-8&nbsp;Bytes | `gzip --best`&nbsp;bytes |
| :--- | ---: | ---: | ---: |
| en  | 1,299,289 | 1,313,128 | 63,451 |
| en, es | 1,649,821 | 1,670,161 | 81,784 |
| en, es, fr | 2,225,410 | 2,262,680 | 108,481 |
| en, es, fr, de | 2,314,347 | 2,353,583 | 113,279 |
| en, es, fr, de, it | 2,364,240 | 2,404,448 | 116,312 |
| en, es, fr, de, it, pt | 2,515,656 | 2,559,308 | 123,755 |
| en + &lt;all timezones&gt; | 73,543,199 | 73,557,03 | 8,573,916 |
