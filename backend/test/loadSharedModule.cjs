// Load the exact browser/server engine in Jest's CommonJS VM. These two shared
// modules have only named declaration exports and no imports. The adapter
// removes export keywords; it does not copy, mock or replace their logic.
const fs = require('node:fs');
module.exports = filename => {
  const source = fs.readFileSync(filename, 'utf8');
  const names = [...source.matchAll(/^export\s+(?:function|class|const)\s+(\w+)/gm)].map(match => match[1]);
  const output = {};
  new Function('exports', `${source.replace(/^export\s+/gm, '')}\nObject.assign(exports, { ${names.join(', ')} });`)(output);
  return output;
};
