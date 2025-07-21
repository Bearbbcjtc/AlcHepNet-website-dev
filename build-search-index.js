const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const SRC_DIR = path.join(__dirname, 'src');
const OUTPUT = path.join(SRC_DIR, 'searchIndex.json');

// Define files to exclude (component files)
const EXCLUDED_FILES = [
    'footer.html',
    'navbar.html', 
    'search-modal.html',
    'template-page.html',
    'page-template.html',
    'index-backup.html',
    'index-maintenance.html',
    'quickstart.html'
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.html')) {
      // Exclude component files
      const fileName = path.basename(file);
      if (!EXCLUDED_FILES.includes(fileName) && !fileName.includes('.backup')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

function extractInfo(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  let title = $('title').text() || path.basename(filePath);
  
  // Special handling for homepage
  if (path.basename(filePath) === 'index.html') {
    title = 'Home';
  }
  
  // If title is still filename, try to get title from h1 or h2 tags
  if (title === path.basename(filePath)) {
    const h1Title = $('h1').first().text().trim();
    const h2Title = $('h2').first().text().trim();
    if (h1Title) {
      title = h1Title;
    } else if (h2Title) {
      title = h2Title;
    }
  }
  
  // Full content text
  let content = $('body').text().replace(/\s+/g, ' ').trim();
  // First 300 characters for snippet
  let snippet = content.slice(0, 300);
  const relPath = path.relative(SRC_DIR, filePath).replace(/\\/g, '/');
  
  return { title, url: relPath, snippet, content };
}

function main() {
  const files = walk(SRC_DIR);
  const index = files.map(extractInfo);
  fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Indexed ${index.length} html files. Output: ${OUTPUT}`);
  console.log('Excluded files:', EXCLUDED_FILES);
}

main(); 