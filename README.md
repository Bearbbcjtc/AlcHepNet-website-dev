# alchepnet-website
AlcHepNet.org website

## Website Search Functionality

This website implements full-site text search functionality, allowing users to search titles, summaries and content across all pages.

### Search Index Generation

The search functionality relies on an automatically generated search index file `src/searchIndex.json`. When website content is updated, the search index needs to be regenerated:

#### Prerequisites
Ensure Node.js and required dependencies are installed:
```
node build-search-index.js
```
