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
    let defaults = { maxRes: 100, minLen: 4, maxLen: 30, minOcc: 3, omit: [], clean: true, wb: true, words: true };
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
    let res = Object.keys(strings)
      .filter(substr => strings[substr] >= opts.minOcc && (!opts.wb || !!txt.match(new RegExp(`[^a-zA-Z0-9\\s\n]${substr}|\\n${substr}`, 'g'))) && !opts.omit.includes(substr.toLowerCase()))
      .map(substr => ({substring: substr, count: strings[substr], score: Math.max(1, (substr.length - 3)) * Math.max(1, strings[substr] - 1)}));
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
  filesReport: (results, out = 0) => Object.entries(results).map(([filename, res]) => {
    let output = `\r\nAnalysis of repeated strings in "${filename}": ` + textReport(res).join(', ');
    out && console.log(output);
    return output;
  }).join(''),

  // Creates a text report for text analysis, with optional console output.
  textReport: (results, out = 0) => {
    let output = Array.from(new Set(results.map(result => `${result.substring} (${result.count}x)`))).join(', ');
    out && console.log(output);
    return output;
  }

};