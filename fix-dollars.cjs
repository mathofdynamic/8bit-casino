const fs = require('fs');
let code = fs.readFileSync('src/components/PokerScreen.tsx', 'utf-8');

// Replace "$${" with "${"
code = code.replace(/\$\$\{/g, '${');

fs.writeFileSync('src/components/PokerScreen.tsx', code);
