const fs = require('fs');
const path = require('path');

const replacers = [
  { regex: /bg-\[#0a0d14\]/g, replacement: "bg-background" },
  { regex: /bg-\[#0f1117\]/g, replacement: "bg-card" },
  { regex: /text-white/g, replacement: "text-foreground" },
  { regex: /text-slate-200/g, replacement: "text-foreground" },
  { regex: /text-slate-300/g, replacement: "text-muted-foreground" },
  { regex: /text-slate-400/g, replacement: "text-muted-foreground" },
  { regex: /text-slate-500/g, replacement: "text-muted-foreground" },
  { regex: /border-white\/5/g, replacement: "border-border" },
  { regex: /border-white\/6/g, replacement: "border-border" },
  { regex: /border-white\/10/g, replacement: "border-border" },
  { regex: /border-white\/20/g, replacement: "border-border" },
  { regex: /bg-white\/5/g, replacement: "bg-muted" },
  { regex: /bg-white\/10/g, replacement: "bg-muted-hover" },
  { regex: /hover:bg-white\/5/g, replacement: "hover:bg-muted" },
  { regex: /hover:bg-white\/10/g, replacement: "hover:bg-muted-hover" },
  { regex: /bg-\[linear-gradient\(to_right,#ffffff08_1px,transparent_1px\),linear-gradient\(to_bottom,#ffffff08_1px,transparent_1px\)\]/g, replacement: "bg-grid-pattern" },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const r of replacers) {
        if (r.regex.test(content)) {
          content = content.replace(r.regex, r.replacement);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));

console.log("Done refactoring classes.");
