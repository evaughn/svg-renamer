import sketch from "sketch";

var savedPrefix;
var defaultPrefix = "icon";
var useDefaultPrefix = false;

var onRun = function(context) {
  const response = sketch.dialog.showMessageBox({
    message: "About Export-SVG",
    detail:
      "This plugin allows for renaming of SVG exports.\n\n Assets will be renamed as [artboard].svg, or [category]-[artboard].svg if artboards are grouped by naming the artboard with [Category]/.\n You can also set a custom prefix, with the default being 'icon-'.",
    checkboxLabel: "Use `icon-` prefix",
    checkboxChecked: false,
    callback: (response, checkboxChecked) => {
      useDefaultPrefix = checkboxChecked;
    }
  });
};

var renameExport = function(context) {
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
    Promise.all(
      filesToRename.map(fileDict => {
        var artboardName = fileDict.request.name();
        var name = artboardName.toLowerCase();
        name = name.replace(/\W(!\s|\&)/g, "");
        name = name.replace(/\&/g, "and");
        name = name.replace(/\s/g, "-");

        var nameArray = name.split("/");
        var categoryName = nameArray[0];
        var typeName = nameArray[nameArray.length - 1];
        var isDirectory = nameArray.length > 1;

        if (
          nameArray.length === 1 ||
          typeName === "default" ||
          !!parseInt(typeName)
        ) {
          exportName = useDefaultPrefix
            ? `${prefix}-${categoryName}`
            : categoryName;
        } else {
          exportName = useDefaultPrefix
            ? `${prefix}-${categoryName}-${typeName}`
            : `${categoryName}-${typeName}`;
        }

        var newOutputPath = fileDict.path.replace(
          artboardName,
          `${exportName}`
        );

        var svgFile = NSString.stringWithContentsOfFile_encoding_error(
          fileDict.path,
          NSUTF8StringEncoding,
          "Error in reading icon"
        );
        fileManager.removeItemAtPath_error(
          fileDict.path,
          "Error in deleting source icon"
        );

        if (isDirectory) {
          var pathArray = fileDict.path.split("/");
          var directoryPath = pathArray
            .splice(0, pathArray.length - 1)
            .join("/");
          var fileContents = fileManager.directoryContentsAtPath(directoryPath);

          if (fileContents.length === 0) {
            fileManager.removeItemAtPath_error(
              directoryPath,
              `There was an error in deleting the ${typeName} icon directory`
            );
          }
        }

        Promise.resolve(svgFile.writeToFile_atomically(newOutputPath, false));
      })
    )
      .then(() => {
        UI.message("All svgs were successfully renamed");
        log("All svgs were successfully renamed");
      })
      .catch(error => {
        UI.message(`${error}`);
        log(`${error}`);
      });
  }
};
