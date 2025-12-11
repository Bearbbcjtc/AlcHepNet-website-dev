const fs = require('fs');
const path = require('path');

// Read the McClain publications HTML
const htmlContent = fs.readFileSync('/tmp/mcclain_publications.txt', 'utf-8');

// Extract all publication list items
const listItemRegex = /<li>(.*?)<\/li>/gs;
const publications = [];
let match;

while ((match = listItemRegex.exec(htmlContent)) !== null) {
  const content = match[1];
  
  // Extract year from the content
  // Look for patterns like "2025", "2024", etc. in the citation
  // Only accept reasonable years (2008-2030)
  const yearMatch = content.match(/\b(20\d{2})\b/g);
  let year = 'Unknown';
  
  if (yearMatch && yearMatch.length > 0) {
    // Filter for reasonable years and take the last one
    const validYears = yearMatch.filter(y => {
      const yearNum = parseInt(y);
      return yearNum >= 2008 && yearNum <= 2030;
    });
    if (validYears.length > 0) {
      year = validYears[validYears.length - 1];
    }
  }
  
  // Clean up the content (remove extra spaces and normalize)
  const cleanContent = content
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
    .replace(/<em>/g, '')
    .replace(/<\/em>/g, '')
    .replace(/<span class="pmid">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Extract PMID if present
  const pmidMatch = content.match(/PMID:\s*<a href="([^"]+)"[^>]*>(\d+)<\/a>/);
  const pmid = pmidMatch ? pmidMatch[2] : null;
  const pmidLink = pmidMatch ? pmidMatch[1] : null;
  
  publications.push({
    year: year,
    content: content,
    cleanText: cleanContent,
    pmid: pmid,
    pmidLink: pmidLink
  });
}

// Group by year and sort
const publicationsByYear = {};
publications.forEach(pub => {
  if (!publicationsByYear[pub.year]) {
    publicationsByYear[pub.year] = [];
  }
  publicationsByYear[pub.year].push(pub);
});

// Sort years in descending order
const sortedYears = Object.keys(publicationsByYear).sort((a, b) => {
  if (a === 'Unknown') return 1;
  if (b === 'Unknown') return -1;
  return parseInt(b) - parseInt(a);
});

// Create sorted object
const sortedPublications = {};
sortedYears.forEach(year => {
  sortedPublications[year] = publicationsByYear[year];
});

// Generate statistics
const stats = {
  totalPublications: publications.length,
  yearRange: sortedYears.filter(y => y !== 'Unknown'),
  publicationsPerYear: {}
};

sortedYears.forEach(year => {
  stats.publicationsPerYear[year] = publicationsByYear[year].length;
});

// Save to JSON file
const outputData = {
  grantInfo: {
    pi: "McClain",
    grantNumber: "U01AA026980",
    totalPublications: publications.length
  },
  statistics: stats,
  publicationsByYear: sortedPublications
};

const outputPath = path.join(__dirname, 'src', 'Publishing', 'doc', 'mcclain_publications.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log(`✓ Parsed ${publications.length} publications`);
console.log(`✓ Found ${sortedYears.length} different years`);
console.log(`✓ Year range: ${stats.yearRange[stats.yearRange.length - 1]} - ${stats.yearRange[0]}`);
console.log(`✓ Output saved to: ${outputPath}`);
console.log('\nPublications per year:');
sortedYears.forEach(year => {
  console.log(`  ${year}: ${stats.publicationsPerYear[year]} publications`);
});
