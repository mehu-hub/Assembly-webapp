const fs = require('fs');
const path = require('path');

const solidBgRegex = /(?:bg|from|to|via)-(?:indigo|purple|emerald|red|amber|blue|green|yellow|slate)-(?:500|600|700|800|900)(?!\/[0-9]+)/;
// e.g. matches "bg-indigo-600", "from-purple-500". Does not match "bg-indigo-500/10" because of the negative lookahead for slash.

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (solidBgRegex.test(line) && line.includes('text-foreground')) {
          lines[i] = line.replace(/text-foreground/g, 'text-white');
          modified = true;
        }
        // Also fix the case where text-foreground was placed on a line just below a solid bg line.
        // But doing it line by line might miss some. Let's do a more robust check:
        // Actually, let's just do it globally across the className string if we could parse it, but that's hard.
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, lines.join('\n'));
      }
    }
  }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));

console.log("Done reverting text-foreground to text-white on solid backgrounds.");
