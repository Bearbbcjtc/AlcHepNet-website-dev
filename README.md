# alchepnet-website
AlcHepNet.org website

## Website Search Functionality

This website implements full-site text search functionality, allowing users to search titles, summaries and content across all pages.

### Search Index Generation

The search functionality relies on an automatically generated search index file `src/searchIndex.json`. When website content is updated, the search index needs to be regenerated:

’‘’
node build-search-index.js
‘’‘

#### Prerequisites
Ensure Node.js and required dependencies are installed

#### In Jetstream2 instance for preview
- git pull from main
- 'sudo cp -r /home/exouser/alchepnet-website/src/* /var/www/html/'
- wait for serchindex load; check instance address
