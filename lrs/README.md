[![npm](https://img.shields.io/npm/dt/longestrepeatedstrings.svg)](#)

Longest Repeated Strings
========================

Finds ***duplicated text*** and generates a report about the ***longest substrings*** or
***most frequent words*** in supplied text, weighted by how much space the string
takes up overall (length * occurences).

> You supply input text or files.  It returns raw data or a text report.

🧵 [Try an online demo](http://braksator.github.io/lrs)

(This module was designed to analyze javascript code for refactoring opportunities in a Gulp task)

## Stand-alone usage

See online demo link above, or [download project zip file](https://github.com/braksator/LongestRepeatedStrings/releases/) and open index.html to use the GUI.

## Installation

This is a Node.JS module available from the Node Package Manager (NPM).

https://www.npmjs.com/package/longestrepeatedstrings

Here's the command to download and install from NPM:

`npm install longestrepeatedstrings -S`

or with Yarn:

`yarn add longestrepeatedstrings`

## Usage

Include Longest Repeated Strings in your project:

```javascript
var LRS = require('longestrepeatedstrings');
```

### Finding Repeated Substrings in Text

You can analyze a single text by using the `text` function to find the longest repeated substrings:

```javascript
const text = 'Your text content goes here';
const results = LRS.text(text, { maxRes: 20, minLen: 8 });
console.log(results);
```

**Parameters**:
- `text` (String): The input text to analyze.
- `opts` (Object, optional): A configuration object with the following properties:
  - `maxRes` (Number, default: 50): The maximum number of results to return.
  Restricts the final list to highest scoring results and does not speed up processing.
  - `minLen` (Number, default: 4): The minimum length of substrings to consider.
  - `maxLen` (Number, default: 40): The maximum length of substrings to consider.
  - `minOcc` (Number, default: 2): The minimum number of occurrences a substring must have to be included.
  - `penalty` (Number, default: 0): Per-occurence score penalty, helps order results for deduplication.  Setting to the same
  - `split` (Array, default: `[' ', ',', '.', '\n']`): Splits input after specified strings.  If not using the `words` and `clean`
  options, settings THIS up properly for expected input will be key to making this module effective.
  - `break` (Array, default: `[]`): Splits input ON these strings and won't include them in matches.
  Can be used to concatenate an array of texts with a special char.
  - `escSafe` (Boolean, default: `true`): Will take extra care around escaped characters.  May as well leave this on.
  - `clean` (Boolean, default: `false`): If `true`, strips all symbols from input.
  - `words` (Boolean, default: `true`): If `true`, matches only whole words (fastest method).
  - `trim` (Boolean, default: `true`): If `true`, trims white space from results.
  - `omit` (Array, default: `[]`): An array of substrings to omit from the results. Can be used to ignore accepted long/frequent words.
  as `minLen`, for example, will cause longer substrings to appear earlier in the results.  Negative penalty will favor more frequent substrings.

**Returns**: An array of objects containing the repeated substrings, their count, and a score for each.

### Analyzing Files

You can analyze multiple files by using the `files` function. This will read the contents of the files and find repeated substrings in each one.

```javascript
const fs = require('fs');
const files = ['file1.txt', 'file2.txt'];
const results = LRS.files(files, opts);
console.log(results);
```

**Parameters**:
- `files` (Array): An array of file paths to analyze.
- `opts` (Object, optional): Same options as in the `text` function.

**Returns**: An object where the keys are file names and the values are the repeated substrings found in each file.

### Creating Reports

#### File Analysis Report

```javascript
const report = LRS.filesReport(results, 1); // Pass `1` to log to console
console.log(report);
```

**Parameters**:
- `results` (Object): The results returned by the `files` function.
- `out` (Number, optional, default: `0`): If set to `1`, the report will be logged to the console too.
- `chars` (Object, optional): A configuration object with the following properties:
  - `delim` (String, default: '★'): Character/s to insert between each result.
  - `open` (String, default: '⦅'): Character/s to insert before the repeat count.
  - `close` (String, default: '×⦆'): Character/s to insert after the repeat count.

**Returns**: A text report summarizing the repeated substrings found in each file.

#### Text Analysis Report

```javascript
const report = LRS.textReport(results, 1); // Pass `1` to log to console
console.log(report);
```

**Parameters**:
- `results` (Array): The results returned by the `text` function.
- `out` (Number, optional, default: `0`): If set to `1`, the report will be logged to the console too.
- `chars` (Object, optional): Same options as in the `filesReport` function.

**Returns**: A list of repeated substrings with their occurrence counts.

### Example Workflow

1. Either, analyze a single text or multiple files:
   ```javascript
   const text = 'This is an example text with repeated substrings';
   const results = LRS.text(text);
   ```
   or
   ```javascript
   const files = ['file1.txt', 'file2.txt'];
   const results = LRS.files(files);
   ```
2. Afterward, generate a report:
   ```javascript
   const report = LRS.filesReport(results, 1); // Logs the report to console
   ```

### Notes

- Results are sorted by a score, which is calculated based on the length of the substring and the number of occurrences.
- This package is used in [JCrush](https://www.npmjs.com/package/jcrush); a Javascript code deduplicator.

## Gulp usage


In your `gulpfile.mjs`, use **Longest Repeated Strings** as a Gulp plugin:

#### Step 1: Import **Longest Repeated Strings**

```javascript
import LRS from 'longestrepeatedstrings';
```

#### Step 2: Create a Gulp Task for Longest Repeated Strings

```javascript
var analyzeStrings = true;
gulp.task('analyze', function (done) {
  if (analyzeStrings) {
    LRS.filesReport(LRS.files(['./script.min.js', './styles.min.css', './index.html'], {
      clean: 1, words: 1,
      omit: [
        // This is a list of words that we just accept we've used a lot in the
        // content, and we don't need to see them appear in repeated-strings
        // reports. (supply all with lower-case)
        'consciousness', 'enlightenment', 'ephemeral', 'watching', 'observing',
        'communication', 'inspiring', 'realizing', 'uplifting', 'illusion',
      ],
    }), 1, {delim: ", "});
    analyzeStrings = false;
  }
  setTimeout(() => {analyzeStrings = true}, 1000 * 60 * 60); // Only run once an hour.
  done(); // Signal completion
});
```

#### Step 3: Run **Longest Repeated Strings** After Minification

To run **Longest Repeated Strings** after your minification tasks, add Longest Repeated Strings in series after other tasks, such as in this example:

```javascript
gulp.task('default', gulp.series(
  gulp.parallel('minify-css', 'minify-js', 'minify-html'), // Run your minification tasks first
  'analyze' // Then run LRS
));
```


## Contributing

https://github.com/braksator/LongestRepeatedStrings

In lieu of a formal style guide, take care to maintain the existing coding
style.