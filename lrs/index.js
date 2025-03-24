#!/usr/bin/env node
'use strict';

/**
 * @file
 * Longest Repeated Strings.
 */

let fs = require('fs');

let lrs = module.exports = {

  // Finds repeated substrings in a piece of text.
  text: (txt, opts) => {
    let defaults = { maxRes: 50, minLen: 4, maxLen: 120, minOcc: 3, omit: [], trim: 0, clean: 0, wb: 0, words: 0 };
    opts = { ...defaults, ...opts };
    let cleanedText = opts.clean ? txt.replace(/[^\w]/g, ' ') : txt,
      strings = {},
      text = opts.words ? cleanedText.split(/\s+/) : [cleanedText];
    for (let seg of text) {
      let len = seg.length;
      for (let i = 0; i <= len - opts.minLen; i++) {
        for (let j = opts.minLen; j <= opts.maxLen && i + j <= len; j++) {
          let substr = seg.substring(i, i + j);
          if (!strings[substr]) strings[substr] = 0;
          strings[substr]++;
        }
      }
    }
    let esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), res = Object.keys(strings)
      .filter(substr => strings[substr] >= opts.minOcc && (!opts.wb || !!txt.match(new RegExp(`[^a-zA-Z0-9\\s\n]${esc(substr)}|\\n${esc(substr)}`, 'g'))) && !opts.omit.includes(substr.toLowerCase()))
      .map(substr => ({substring: substr, count: strings[substr], score: Math.max(1, (substr.length - 3)) * Math.max(1, strings[substr] - 1)}));
    if (opts.trim) res = res.map(obj => ({...obj, substring: obj.substring.trim()})).filter(obj => obj.substring !== "");
    res.sort((a, b) => b.score - a.score);
    let ret = [], seen = new Set();
    for (let r of res) {
      if (![...seen].some(s => s.includes(r.substring))) {
        ret.push(r);
        seen.add(r.substring);
      }
    }
    return ret.slice(0, opts.maxRes);
  },

  // Finds results in files.
  files: (files, opts) => {
    let ret = {};
    files.forEach(f => ret[f] = text(fs.readFileSync(f, { encoding: 'utf8', flag: 'r' }), opts));
    return ret;
  },

  // Creates a text report for files analysis, with optional console output.
  filesReport: (results, out = 0, chars = {}) => Object.entries(results).map(([filename, res]) => {
    let ret = textReport(res).join(', '),
      output = `📄 Analysis of repeated strings in "${filename}": ${ret ? ret : 'No results.'}\r\n`;
    out && console.log(output);
    return output;
  }).join(''),

  // Creates a text report for text analysis, with optional console output.
  textReport: (results, out = 0, chars = {}) => {
    chars = { ...{ delim: '★', open: '⦅', close: '×⦆' }, ...chars };
    let output = Array.from(new Set(results.map(result => `${result.substring}${chars.open}${result.count}${chars.close}`))).join(chars.delim) || '📄 No results.';
    out && console.log(output);
    return output;
  }

};