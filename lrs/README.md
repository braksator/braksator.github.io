[![npm](https://img.shields.io/npm/dt/longestrepeatedstrings.svg)](#)

Longest Repeated Strings
========================

Generates a report about the longest repeated substrings in supplied text, weighted by how much space the string takes up overall (length * occurences).

> You input text or filenames.  It returns raw data or a text report.

🧵 [Try an online demo](http://braksator.github.io/lrs)

(This module was designed to analyze javascript code for refactoring opportunities)

## Stand-alone usage

See online demo link above, or download project files and open index.html to use the GUI.

## Installation

This is a Node.JS module available from the Node Package Manager (NPM).

https://www.npmjs.com/package/longestrepeatedstrings

Here's the command to download and install from NPM:

`npm install longestrepeatedstrings -S`

or with Yarn:

`yarn add longestrepeatedstrings`

It is recommend to use a package locking system like Yarn in case a change is
introduced into this project that makes it incompatible with your encoded data.

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
  - `maxRes` (Number, default: 100): The maximum number of results to return.
  - `minLen` (Number, default: 4): The minimum length of substrings to consider.
  - `maxLen` (Number, default: 30): The maximum length of substrings to consider.
  - `minOcc` (Number, default: 3): The minimum number of occurrences a substring must have to be included.
  - `omit` (Array, default: `[]`): An array of substrings to omit from the results.
  - `clean` (Boolean, default: `true`): If `true`, Break word on and ignore symbols.
  - `words` (Boolean, default: `true`): If `true`, Find only whole words.
  - `wb` (Boolean, default: `true`): If `true`, Restricts matches to word boundaries.


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
- `out` (Number, optional, default: `0`): If set to `1`, the report will be logged to the console instead of being returned as a string.

**Returns**: A text report summarizing the repeated substrings found in each file.

#### Text Analysis Report

```javascript
const report = LRS.textReport(results, 1); // Pass `1` to log to console
console.log(report);
```

**Parameters**:
- `results` (Array): The results returned by the `text` function.
- `out` (Number, optional, default: `0`): If set to `1`, the report will be logged to the console instead of being returned as an array.

**Returns**: A list of repeated substrings with their occurrence counts.

### Example Workflow

1. First, analyze a single text:
   ```javascript
   const text = 'This is an example text with repeated substrings';
   const results = LRS.text(text);
   ```
2. Then, analyze multiple files:
   ```javascript
   const files = ['file1.txt', 'file2.txt'];
   const results = LRS.files(files);
   ```
3. Afterward, generate a report:
   ```javascript
   const report = LRS.filesReport(results, 1); // Logs the report to console
   ```

### Notes

- The `text` and `files` functions clean the text by removing non-alphanumeric characters and splitting it into words, can be optionally disabled.
- Results are sorted by a score, which is calculated based on the length of the substring and the number of occurrences.
- You can omit specific substrings by passing them in the `omit` array.
- The `wb` option can be set to `true` to restrict substring matches to word boundaries.


## Contributing

https://github.com/braksator/LongestRepeatedStrings

In lieu of a formal style guide, take care to maintain the existing coding
style. Add tests for coverage and explicitly test bugs and features.
