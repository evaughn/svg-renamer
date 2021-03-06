# Changelog
Documents all notable changes made to the SVG Export Renamer plugin

## 3.3.2 - 24/01/19
### Changed
  - Fix naming for more than one forward slash (ex. Action/Item/Default/Small)

## 3.3.1 - 09/01/19
### Changed
  - Update option names (Snake case (snake_case), Kebab case (kebab-case), Camel case (camelCase))

## 3.3.0 - 07/01/19
### Changed
  - Remove removal of "default" from export name

## 3.2.2 - 01/01/19
### Changed
  - Increase width of dialog and update text field styling

## 3.2.1 - 30/12/18
### Added
  - Surfaced checkbox for override prefix/suffix (overrides prefix/suffix on artboard by default)
  - New ability to change how names are saved out (titleCase, dash-case, or snake_case)

## 3.2.0 - 28/12/18
### Added
 - Make plugin useful with other plugins - replaces old export path with new
   export path in context array 🥳 🎉

## 3.1.0 - 28/12/18
### Added
 - Plugin icon in About dialog

### Changed
 - Fixed bug with export name being the same without prefix/suffix 🎉

## 3.0.1 - 27/12/18
### Changed
 - Fixed bug with pressing save but making no changes in About dialog

## 3.0.0 - 27/12/18
### Added
 - Ability to use global suffix
 - Ability to use default or custom prefix

### Changed
 - Refactored core dialog code for prefix/suffix update
 - New dropdown in UI to toggle betweem prefix/suffix settings

## 2.0.1 - 21/12/18
### Changed
 - Refactored core code for deletion of singular files and group files
 - Added `Cancel` option for prefix settings

## 2.0.0 - 21/12/18
### Changed
 - Major refactor of core code to address Sketch crash when exporting a large number of files
 - Added .CHANGELOG

## 1.1.0 - 20/12/18
### Changed
 - Refactor of core code
 - Add dialog to toggle `icon-` prefix. Is on by default (ex. Foo.svg => icon-foo.svg)

## 1.0.0 - 19/12/18
### Added
 - First version
 - Renames exported icons from Icon.svg to icon.svg
 - If an icon is in a category grouping, it renames the Category/Icon.svg to category-icon.svg