#!/usr/bin/env node
'use strict';

/**
 * @file
 * Longest Repeated Strings.
 */

let fs = require('fs');

let lrs = module.exports = {

  // Escapes regex input.
  escapeRegex: str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),

  // Finds repeated substrings in a piece of text.
  text: (txt, opts) => {
    opts = { ...{ maxRes: 50, minLen: 4, maxLen: 40, minOcc: 2, omit: [], trim: 1,
      clean: 0, words: 1, break: [], split: [' ', ',', '.', '\n'], escSafe: 1, penalty: 0 }, ...opts };
    opts.split = opts.split.map(lrs.escapeRegex);
    opts.break = opts.break.map(lrs.escapeRegex);
    txt = opts.clean ? txt.replace(/[^\w]/g, ' ') : txt;
    console.log(opts);
    let strings = {}, len, substr, segIndex, seg, segIdx, charIdx, i, j,
      segments = (opts.words || opts.break.length || opts.split.length) ?
        txt.split(new RegExp(
          '(' +
            (opts.words ? '\\s+' : '') +
            (opts.break.length ? `(?=${opts.break.join('|')})` + opts.break.join('|') : '') +
          ')' +
          (opts.split.length ? `|(?<=${opts.split.join('|')})(\\s*)` : '')
        ))
        .filter(segment => segment && !opts.break.includes(segment))
      : [txt];
    console.log(segments);
    if (opts.escSafe) {
      segments = segments.map((segment, index, array) => {
        if (index < array.length - 1 && segment.endsWith('\\') && segment.length > 1 && segment[segment.length - 2] != '\\') {
          array[index + 1] = '\\' + segment.slice(0, -1) + array[index + 1];
          return segment.slice(0, -1);
        }
        return segment;
      }).filter(segment => segment);
    }
    if (opts.words) {
      strings = segments.reduce((acc, word) => {
        if ((!opts.minLen || word.length >= opts.minLen) && (!opts.maxLen || word.length <= opts.maxLen))
          acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
    }
    else {
      for (segIndex = 0; segIndex < segments.length; segIndex++) {
        seg = segments[segIndex];
        if (opts.break.includes(seg)) continue;
        len = seg.length;
        for (i = 0; i < len; i++) {
          substr = "";
          for (j = 0, segIdx = segIndex, charIdx = i; j < opts.maxLen; j++) {
            while (charIdx >= segments[segIdx].length) {
              segIdx++;
              if (segIdx >= segments.length) break;
              charIdx = 0;
            }
            if (segIdx >= segments.length) break;
            substr += segments[segIdx][charIdx];
            if (segIdx < segments.length - 1 && opts.break.includes(segments[segIdx + 1])) break;
            if (substr.length >= opts.minLen) {
              if (opts.escSafe && substr.endsWith('\\') && substr.length > 1 && substr[substr.length - 2] != '\\') continue;
              if (!strings[substr]) strings[substr] = 0;
              strings[substr]++;
            }
            charIdx++;
          }
        }
      }
    }
    let res = Object.keys(strings)
      .filter(substr => substr && strings[substr] >= opts.minOcc && !opts.omit.includes(substr.toLowerCase()))
      .map(substr => ({ substring: substr, count: strings[substr], score: (substr.length - opts.penalty) * strings[substr] }));
    if (opts.trim) res = res.map(obj => ({ ...obj, substring: obj.substring.trim() })).filter(obj => obj.substring !== "");
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
    files.forEach(f => ret[f] = lrs.text(fs.readFileSync(f, { encoding: 'utf8', flag: 'r' }), opts));
    return ret;
  },

  // Creates a text report for files analysis, with optional console output.
  filesReport: (results, out = 0, chars = {}) => Object.entries(results).map(([filename, res]) => {
    let ret = lrs.textReport(res, 0, chars),
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