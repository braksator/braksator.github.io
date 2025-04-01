#!/usr/bin/env node
'use strict';

/**
 * @file
 * HyperCrush - Crushes HTML or SVG code.
 */

/**
 * Processes HTML code.
 * @param {string} code - (optional) The raw input code.
 * @returns {string} - The crushed output code.
 */
function hypercrushCode(code, mode = 'all') {
  if (mode == 'whitespace' || mode == 'all') {
    code = code
      .replace(/\s+/g, ' ').trim(); // Remove redundant whitespace
  }
  if (mode == 'default' || mode == 'all') {
    code = code
      .replace(/\s*\/>/g, ' />') // Add a space before the end of self-closing tags (will be removed later)
      .replace(/(<\w+[^>]*\b\w+=['"]?)0\.(\d)/g, '$1.$2') // Remove leading zero for decimals in attribute values inside tags
      .replace(/>\s+</g, '><') // Remove spaces between tags - Gotcha: Can't rely on whitespace between tags for styling
      .replace(/(<[a-zA-Z][^>]*>)\s+/g, '$1') // Remove whitespace after opening tags
      .replace(/\s+(<\/[a-zA-Z]+>)/g, '$1') // Remove whitespace before closing tags
      .replace(/(\w+)="([^"\s]+)(?="(?!\/>))"/g, (m, k, v) => `${k}=${v}`) // Remove " around attrs where possible (but not if followed by self-close)
      .replace(/"\s+(?=\s*[\w-]+=|\s*\/?>)/g, '"') // Remove spaces **after** a closing quote (but not if followed by self-close)
      .replace(/(?<=\w=")\s+/g, '') // Remove spaces **after** an opening quote
      .replace(/\s*(["'])\s*\/>/g, '$1/>') // Remove space only between quote and />
      .replace(/(\S)\s*\/>/g, '$1 />') // Ensure space before /> if no quote
      .replace(/(?<=<[^>]+)\s+(?=>)/g, ''); // Remove space before > in tags

  }
  if (mode == 'svg') {
    let svgTagMatch = code.match(/<svg[^>]*>[\s\S]*<\/svg>/);
    if (svgTagMatch) {
      code = svgTagMatch[0]
        .replace(/\s*version="[^"]*"/gi, '') // Remove version attr
        .replace(/\s*baseProfile="[^"]*"/gi, '')  // Remove baseProfile attr
        .replace(/\s*id="[^"]*"/gi, '') // Remove id attr
        .replace(/\s*xmlns:xlink="[^"]*"/gi, '') // Remove xmlns:xlink attr
        .replace(/\s*xmlns="[^"]*"/gi, '') // Remove xmlns attr
        .replace(/\s*xml:space="preserve"/gi, '') // Remove xml:space attr
        .replace(/\s*enable-background="[^"]*"/gi, '') // Remove enable-background attr
      code = hypercrushCode(code, 'all'); // Run an 'all' pass.
    }
    else {
      console.warn('HyperCrush is in "svg" mode but did not find SVG content.');
    }
  }
  return code;
}

/**
 * Gulp-compatible transform stream.
 * @param {string} mode - (optional) The mode to operate in.
 * @returns {Transform} - A transform stream for Gulp.
 */
module.exports = (mode = 'default') => {
  let { Transform } = require('stream'), PluginError = require('plugin-error');
  const PLUGIN_NAME = 'gulp-hypercrush';
  return new Transform({
    objectMode: true,
    transform(file, _, cb) {
      if (file.isNull()) return cb(null, file);
      if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      try {
        file.contents = Buffer.from(hypercrushCode(file.contents.toString(), mode));
        cb(null, file);
      }
      catch (err) {
        cb(new PluginError(PLUGIN_NAME, err, { fileName: file.path }));
      }
    }
  })
};