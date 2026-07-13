const fs = require('fs');
let code = fs.readFileSync('src/components/PokerScreen.tsx', 'utf-8');

// The original sed was `sed -i "s/\$//g"` followed by `sed -i "s/{/\${/g"`.
// So all `{` became `${`.
// I need to reverse this.
// `code = code.replace(/\$\{/g, '{')` will undo the second sed.
code = code.replace(/\$\{/g, '{');
// Now all variables inside backticks need the $ back.
// I will use a regex to find all `{...}` inside backticks.
let inBacktick = false;
let out = '';
for (let i = 0; i < code.length; i++) {
  if (code[i] === '`') inBacktick = !inBacktick;
  if (code[i] === '{' && inBacktick) {
    out += '${';
  } else {
    out += code[i];
  }
}

fs.writeFileSync('src/components/PokerScreen.tsx', out);
