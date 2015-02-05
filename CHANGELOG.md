# Changelog

### 0.0.7 (Feb 5,2015)
* ios8 upload issue resolved
* 504 gateway timeout error while uploading large zip files handled

### 0.0.6 (Aug 26, 2014)
* Added search
* Refactor existing functions
* Re-indexing of ElasticSearch indexes using GET `/reindex`
* Add OpenGraph tags
* Fix issues

### 0.0.5 (Jun 19, 2014)
* Added QR code as image for releases
* Exposed `/upload` API for external clients

### 0.0.4 (Jun 5, 2014)
* Fixed a bug where a deleted item would still appear
* Added Google Analytics
* Added Detectify module
* Refactor and improved remaining disk space calculation
* Smoother IPA deployments, no need to add bundle identifer
* Populates the filename on file selection before upload

### 0.0.3 (Mar 21, 2014)
* Names get truncated only if they are long
* Changed URL scheme of clips
* Every clip now has a detail page
* Maintains rep count for every time. Shown in details page
* Added SSL support
* Fixed a bug with installing IPAs in iOS 7.1
* Changelog is now public, visit at `/changelog`
* Added pagination at bottom
* Pagination arrows now stick to their position
* Showing free disk space at bottom

### 0.0.2 (Mar 3, 2014)
* Fixed issues with installing IPAs
* Detects if database is up before starting
* Revamped look
* Items can now be deleted
* Showing timeago messages
* Names can now be edited
* First tile is for uploading
* Added pagination
* Changed name of the app to `Clipboard`

### 0.0.1 (Feb 17, 2014)
* Upload single file
* Supports over the air installation of iOS apps
* Supports uploading files from a mobile browser
