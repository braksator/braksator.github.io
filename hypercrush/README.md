[![npm](https://img.shields.io/npm/dt/hypercrush.svg)](#)

HyperCrush
========================

Crushes HTML or SVG code.  Code can be raw markup, or it can be Javascript that happens to contain quoted markup within.
It should be used in conjunction with your html-minifier and your JS minifier/terser.  This module doesn't do everything, it just squeezes a bit more out.

> Why? Standard minifiers don't quite finesse like this!

Input:
```
<div id="myId" class="big blue" data-val="0.2"> Some <em> "text" here </em> </div>
```

Output:
```
<div id=myId class="big blue"data-val=.2>Some <em>"text" here</em></div>
```

👉 NOTE THE SAVINGS!!! ✔️

> Gotcha: Now you can't rely on *whitespace between tags* for styling.

(If you'd like to optimize and deduplicate multiple SVG files see [JCrush SVG](https://www.npmjs.com/package/jcrushsvg))

## Installation

This is a Node.JS module available from the Node Package Manager (NPM).

https://www.npmjs.com/package/hypercrush

Here's the command to download and install from NPM:

`npm install hypercrush -S`

or with Yarn:

`yarn add hypercrush`

## Usage

### Gulp Integration

In your `gulpfile.mjs`, use **HyperCrush** as a Gulp plugin:

#### Step 1: Import **HyperCrush**

```javascript
import hypercrush from 'hypercrush';
```

#### Step 2: Add HyperCrush to your minification tasks

For Javascript that contains HTML in strings, add the default pass BEFORE your
terser/minifier, and a 'whitespace' pass AFTER like so:
```javascript

    .pipe(hypercrush())
    .pipe(terser({ ecma: 7, mangle: { toplevel: true } }))
    .pipe(hypercrush('whitespace'))

```

For plain HTML, add an 'all' pass AFTER your minifier:

```javascript

    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(hypercrush('all'))

```

## `mode` Parameter

The `mode` parameter controls the optimizations applied to the input files. It can be set to `'default'`, `'whitespace'`, or `'all'`.

## Available Modes

### **`default` (or omitted)**
- Removes leading zero from decimal numbers in attributes (`0.5` → `.5`).
- Eliminates unnecessary spaces between tags (`> <` → `><`).  Gotcha: Can't rely on whitespace between tags for styling!
- Removes spaces before `>` in tags.
- Strips unnecessary quotes from attribute values when safe (`class="foo"` → `class=foo`).
- Removes unnecessary spaces between attributes.
- Removes extra spaces at the end of self-closing tags.

### **`whitespace`**
- Collapses multiple spaces into a single space.
- Trims leading and trailing spaces.

### **`all`**
- Includes all optimizations from `whitespace` and `default`.


---

## Note

For more Javascript code compression check out [JCrush](https://www.npmjs.com/package/jcrush).
For CSS compression check out [Gulp JCrush CSS](https://www.npmjs.com/package/gulp-jcrushcss).

---

## Contributing

https://github.com/braksator/hypercrush

In lieu of a formal style guide, take care to maintain the existing coding
style.
