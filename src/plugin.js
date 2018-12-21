import sketch from "sketch";
import dialog from "@skpm/dialog";
import { map } from "lodash";

var defaultPrefix = "icon-";

export function showSettings() {
  log("SHOWING OPTIONS");
  var userDefaults = NSUserDefaults.alloc().initWithSuiteName("com.sketchapp.plugins.svg-export-renamer.defaults");
  var response = dialog.showMessageBox({
    type: "info",
    title: "About SVG Export Renamer",
    message: "This plugin allows for renaming of SVG exports.",
    detail: "Artboard Name: Foo => foo.svg\nArtboard Name: Foo\\Bar => foo-bar.svg",
    checkboxLabel: "Use `icon-` prefix",
    buttons: ['Save', 'Reset'],
    checkboxChecked: userDefaults.objectForKey("useDefaultPrefix") != nil
      ? userDefaults.objectForKey("useDefaultPrefix") == 1 
      : true,
  }, ({ response, checkboxChecked}) => {

    if (response == 0) { // Clicked Save
      userDefaults.setObject_forKey(checkboxChecked, "useDefaultPrefix");
    } else { // reset
      userDefaults.setObject_forKey(1, "useDefaultPrefix");
    }

    userDefaults.synchronize();
  });
};

export function renameExport(context) {
  log("RUNNING EXPORT");
  var fileManager = NSFileManager.defaultManager();
  var userDefaults = NSUserDefaults.alloc().initWithSuiteName("com.sketchapp.plugins.svg-export-renamer.defaults");
  var useDefaultPrefix = userDefaults.objectForKey("useDefaultPrefix") != nil 
    ? userDefaults.objectForKey("useDefaultPrefix") == 1 
    : true;
  var exports = context.actionContext.exports;
  var filesToRename = [];

  for (var i = 0; i < exports.length; i++) {
    var currentExport = exports[i];
    if (currentExport.request.format() == "svg") {
      filesToRename.push(currentExport);
    }
  }

  if (filesToRename.length > 0) {
    const oldFiles = {};
    const oldFilePaths = filesToRename.reduce((dictionary, fileDict) => {
      var artboardName = fileDict.request.name();
      var name = artboardName.toLowerCase();
      name = name.replace(/\s/g, "-");
      name = name.replace(/\&/g, "and");
      name = name.replace(/(?!-)(?!\/)([0-9]|\W|\_)/g, "");

      var nameArray = name.split("/");
      var categoryName = nameArray[0];
      var typeName = nameArray[nameArray.length - 1];
      var isDirectory = nameArray.length > 1;
      var exportName = "";

      if (nameArray.length === 1 || typeName === "default" || !!parseInt(typeName)) {
        exportName = useDefaultPrefix ? `${defaultPrefix}${categoryName}` : categoryName;
      } else {
        exportName = useDefaultPrefix ? `${defaultPrefix}${categoryName}-${typeName}` : `${categoryName}-${typeName}`;
      }

      var newOutputPath = fileDict.path.replace(`${artboardName}.svg`, `${exportName}.svg`);

      if (isDirectory) {
        var pathArray = fileDict.path.split("/");
        var directoryPath = pathArray
          .splice(0, pathArray.length - 1)
          .join("/");
        if (!dictionary[categoryName]) {
          dictionary[categoryName] = {
            path: directoryPath
          }
        }
       } else {
        dictionary[typeName] = {
          path: fileDict.path
        };
      }

      if (fileManager.fileExistsAtPath(fileDict.path)) {
        var svgFile = NSString.stringWithContentsOfFile_encoding_error(fileDict.path, NSUTF8StringEncoding, "Error in reading icon");
        svgFile.writeToFile_atomically(newOutputPath, true)
      }

      return dictionary;
    }, {});

    Promise.all(map(oldFilePaths, (oldFilePath) => {
      if(fileManager.fileExistsAtPath(oldFilePath.path)) {
        try {
          fileManager.removeItemAtPath_error(oldFilePath.path, "Error in deleting source icon");
        } catch(e) {
          return Promise.reject(`Error in deleting source icon: ${e}`);
        }
      };
    }))
    .then(() => {
      log("All svgs were successfully renamed");
      sketch.UI.message("All svgs were successfully renamed");
    }).catch((error) => {
      log(error);
      sketch.UI.message(error);
    });
  }
};
