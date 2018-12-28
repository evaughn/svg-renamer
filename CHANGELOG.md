# Changelog
Documents all notable changes made to the SVG Export Renamer plugin

## 3.1.0
### Changed
 - Fixed bug with export name being the same without prefix/suffix 🎉

## 3.0.1
### Changed
 - Fixed bug with pressing save but making no changes in About dialog

## 3.0.0
### Added
 - Ability to use global suffix
 - Ability to use default or custom prefix
### Changed
 - Refactored core dialog code for prefix/suffix update
 - New dropdown in UI to toggle betweem prefix/suffix settings

## 2.0.1
### Changed
 - Refactored core code for deletion of singular files and group files
 - Added `Cancel` option for prefix settings

## 2.0.0
### Changed
 - Major refactor of core code to address Sketch crash when exporting a large number of files
 - Added .CHANGELOG

## 1.1.0
### Changed
 - Refactor of core code
 - Add dialog to toggle `icon-` prefix. Is on by default (ex. Foo.svg => icon-foo.svg)

## 1.0.0
### Added
 - First version
 - Renames exported icons from Icon.svg to icon.svg
 - If an icon is in a category grouping, it renames the Category/Icon.svg to category-icon.svg