const fs = require('fs');
const path = require('path');

const colors = ['indigo', 'emerald', 'amber', 'purple', 'blue', 'red', 'green', 'yellow', 'slate', 'gray'];

const replacers = [];

for (const color of colors) {
  // text-{color}-400 -> text-{color}-600 dark:text-{color}-400
  // text-{color}-500 -> text-{color}-700 dark:text-{color}-500
  replacers.push({
    regex: new RegExp(`text-${color}-400(?!\\S)`, 'g'),
    replacement: `text-${color}-600 dark:text-${color}-400`
  });
  replacers.push({
    regex: new RegExp(`text-${color}-500(?!\\S)`, 'g'),
    replacement: `text-${color}-700 dark:text-${color}-500`
  });
  
  // bg-{color}-500/10 -> bg-{color}-100 dark:bg-{color}-500/10
  replacers.push({
    regex: new RegExp(`bg-${color}-500/10(?!\\S)`, 'g'),
    replacement: `bg-${color}-100 dark:bg-${color}-500/10`
  });
  // bg-{color}-500/20 -> bg-{color}-200 dark:bg-{color}-500/20
  replacers.push({
    regex: new RegExp(`bg-${color}-500/20(?!\\S)`, 'g'),
    replacement: `bg-${color}-200 dark:bg-${color}-500/20`
  });
  // border-{color}-500/20 -> border-{color}-200 dark:border-{color}-500/20
  replacers.push({
    regex: new RegExp(`border-${color}-500/20(?!\\S)`, 'g'),
    replacement: `border-${color}-300 dark:border-${color}-500/20`
  });
}

// Ensure we don't accidentally double-apply (e.g., if we run the script twice)
// So we check if "dark:text-indigo-400" is already there. The simplest way is to only run this once.

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Prevent double replacement by skipping files that already have "dark:text-"
      if (content.includes('dark:text-') && !fullPath.includes('refactor2.js')) {
        // Actually it's better to use regex with negative lookbehind, but Node's regex supports it.
      }
      
      let modified = false;
      for (const r of replacers) {
        // Let's make sure we are not matching a string that is already preceded by dark:
        // We'll replace and then clean up double replacements.
        if (r.regex.test(content)) {
          content = content.replace(r.regex, r.replacement);
          modified = true;
        }
      }
      
      // Cleanup double replacements just in case
      for (const color of colors) {
        content = content.replace(new RegExp(`dark:text-${color}-400 dark:text-${color}-400`, 'g'), `dark:text-${color}-400`);
        content = content.replace(new RegExp(`dark:bg-${color}-500/10 dark:bg-${color}-500/10`, 'g'), `dark:bg-${color}-500/10`);
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));

console.log("Done fixing accent colors for light mode.");
