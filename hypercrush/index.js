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
      .replace(/(<\w+[^>]*\b\w+=['"]?)0\.(\d)/g, '$1.$2') // Remove leading zero for decimals in attribute values inside tags
      .replace(/>\s+</g, '><') // Remove spaces between tags - Gotcha: Can't rely on whitespace between tags for styling
      .replace(/(?<=<[^>]+)\s+(?=>)/g, '') // Remove space before > in tags
      .replace(/(<[a-zA-Z][^>]*>)\s+/g, '$1') // Remove whitespace after opening tags
      .replace(/\s+(<\/[a-zA-Z]+>)/g, '$1') // Remove whitespace before closing tags
      .replace(/(\w+)="([^"\s]+)(?="(?!\/>))"/g, (m, k, v) => `${k}=${v}`) // Remove " around attrs where possible (but not if followed by self-close)
      .replace(/"\s+(?=\s*[\w-]+=|\s*\/?>)/g, '"') // Remove spaces **after** a closing quote (but not if followed by self-close)
      .replace(/(?<=\w=")\s+/g, '') // Remove spaces **after** an opening quote
      .replace(/\s*(["']?)\s*\/>/g, '$1/>'); // Remove extra space at end of self-closing tags
  }
  if (mode == 'svg') {
    let svgTagMatch = code.match(/<svg[^>]*>[\s\S]*<\/svg>/);
    if (svgTagMatch) {
      code = svgTagMatch[0]
        .replace(/\s+version="[^"]*"/, '') // Remove version attr
        .replace(/\s*baseProfile="[^"]*"/i, '')  // Remove baseProfile attr
        .replace(/\s+id="[^"]*"/, '') // Remove id attr
        .replace(/\s*xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"\s*|\s*x="0px"\s*|\s*y="0px"*/g, '') // Remove xmlns attr
        .replace(/\s*xml:space="preserve"*/g, '') // Remove xml:space attr
        .replace(/\s*enable-background="[^"]*"/g, '') // Remove enable-background attr
        .replace(/\b0\./g, '.'); // Remove ALL leading zeros for decimal numbers
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