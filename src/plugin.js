import sketch from "sketch";
import dialog from "@skpm/dialog";

var savedPrefix;
var defaultPrefix = "icon";
var useDefaultPrefix = false;

export function showSettings() {
  log("SHOWING OPTIONS");
  const response = dialog.showMessageBox({
    message: "About SVG Export Renamer",
    detail:
      "This plugin allows for renaming of SVG exports.\n\n Artboard Name: Foo => foo.svg \n\n Artboard Name: Foo\\Bar => foo-bar.svg",
    checkboxLabel: "Use icon prefix (Artboard Name: Foo => icon-foo.svg",
    checkboxChecked: false,
    callback: (response, checkboxChecked) => {
      log(checkboxChecked);
      useDefaultPrefix = checkboxChecked;
    }
  });
};

export function renameExport(context) {
  log("RUNNING EXPORT");
  var fileManager = NSFileManager.defaultManager();
  var exports = context.actionContext.exports;
  var filesToRename = [];

  for (var i = 0; i < exports.length; i++) {
    var currentExport = exports[i];
    if (currentExport.request.format() == "svg") {
      filesToRename.push(currentExport);
    }
  }

  if (filesToRename.length > 0) {
    Promise.all(filesToRename.map(fileDict => {
      var artboardName = fileDict.request.name();
      var name = artboardName.toLowerCase();
      name = name.replace(/\W(!\s|\&)/g, "");
      name = name.replace(/\&/g, "and");
      name = name.replace(/\s/g, "-");

      var nameArray = name.split("/");
      var categoryName = nameArray[0];
      var typeName = nameArray[nameArray.length - 1];
      var isDirectory = nameArray.length > 1;
      var exportName = "";

      if (nameArray.length === 1 || typeName === "default" || !!parseInt(typeName)) {
        exportName = useDefaultPrefix ? `${prefix}-${categoryName}` : categoryName;
      } else {
        exportName = useDefaultPrefix ? `${prefix}-${categoryName}-${typeName}` : `${categoryName}-${typeName}`;
      }

      var newOutputPath = fileDict.path.replace(artboardName, exportName);
      var svgFile = NSString.stringWithContentsOfFile_encoding_error(fileDict.path, NSUTF8StringEncoding, "Error in reading icon");
      
      try {
        fileManager.removeItemAtPath_error(fileDict.path, "Error in deleting source icon"); 
      } catch(e) {
        return Promise.reject("Error in deleting source icon");
      }

      if (isDirectory) {
        var pathArray = fileDict.path.split("/");
        var directoryPath = pathArray
          .splice(0, pathArray.length - 1)
          .join("/");
        var fileContents = fileManager.directoryContentsAtPath(directoryPath);

        if (fileContents.length === 0) {
          try {
           fileManager.removeItemAtPath_error(directoryPath, `There was an error in deleting the ${typeName} icon directory`);
          } catch(e) {
            return Promise.reject(`There was an error in deleting the ${typeName} icon directory`);
          }
        }
      }

      try {
        return Promise.resolve(svgFile.writeToFile_atomically(newOutputPath, true));
      } catch(e) {
        return Promise.reject(`There was an error in rewriting file to the ${newOutputPath}`);
      }

      svgFile.writeToFile_atomically(newOutputPath, true);
    }))
    .then(() => {
      sketch.UI.message("All svgs were successfully renamed");
    }).catch((error) => {
      sketch.UI.message(error);
    });
  }
};
