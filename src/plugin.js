import sketch from "sketch";
import { map, reduce } from "lodash";
import {
  getDefaults,
  showDialog,
  savePreferences,
  resetPreferences
} from "./dialog";
import { selectedCaseMapping } from "./case-utils";

const defaultPrefix = "icon";
const responses = {
  SAVE: "1000",
  RESET: "1001"
};

export function showSettings(context) {
  log("SHOWING OPTIONS");
  const window = showDialog(context);
  const alert = window[0];
  const response = alert.runModal();

  if (response == responses.SAVE) {
    savePreferences();
  } else if (response == responses.RESET) {
    resetPreferences();
  }
}

function configureName(name, predefinedPrefixSuffix = false) {
  const {
    overrideArtboard,
    selectedCaseType,
    usePrefix,
    useDefaultPrefix,
    customPrefix,
    useCustomSuffix,
    customSuffix
  } = getDefaults();

  const caseConnector = selectedCaseMapping[selectedCaseType];

  const pluginUseDefaultPrefix = usePrefix && useDefaultPrefix;
  const pluginUseCustomPrefix = usePrefix && !useDefaultPrefix;

  name = name.replace(/\s/g, caseConnector);

  if (!overrideArtboard && predefinedPrefixSuffix) {
    return name;
  }

  if (usePrefix) {
    if (pluginUseDefaultPrefix) {
      name = `${defaultPrefix}${caseConnector}${name}`;
    }

    if (pluginUseCustomPrefix) {
      name = `${customPrefix}${caseConnector}${name}`;
    }
  }

  if (useCustomSuffix) {
    name += `${caseConnector}${customSuffix}`;
  }

  if (selectedCaseType == "title") {
    const nameArray = name.split(caseConnector);
    name = map(nameArray, (split, index) => {
      if (index === 0) {
        return split;
      }
      return split.charAt(0).toUpperCase() + split.substr(1).toLowerCase();
    }).join("");
  }

  return name;
}

function getOverrideName(fileName, artboardName) {
  const { overrideArtboard } = getDefaults();
  const overrideName = overrideArtboard ? artboardName : fileName;
  return overrideName.toLowerCase();
}

export function renameExport(context) {
  log("RUNNING EXPORT");
  const fileManager = NSFileManager.defaultManager();
  const { exports } = context.actionContext;

  let filesToRename = [];

  for (let i = 0; i < exports.length; i++) {
    const currentExport = exports[i];
    if (currentExport.request.format() == "svg") {
      filesToRename.push(currentExport);
    }
  }

  if (filesToRename.length > 0) {
    let oldFiles = {};
    const oldFilePaths = reduce(
      filesToRename,
      (dictionary, fileDict) => {
        const fileName = fileDict.request.name();
        const artboardName = fileDict.request.rootLayer().name();
        const hasPredefinedPrefixSuffix =
          fileName.toLowerCase() === artboardName.toLowerCase() ? false : true;

        let name = getOverrideName(fileName, artboardName);
        let exportName = "";

        name = name.replace(/\&/g, "and");
        name = name.replace(/(?!-)(?!\s)(?!\/)([0-9]|\W|\_)/g, "");

        const nameArray = name.split("/");
        const categoryName = nameArray[0];
        const typeName = nameArray[nameArray.length - 1];
        const isDirectory = nameArray.length > 1;

        if (nameArray.length === 1 || !!parseInt(typeName)) {
          exportName = configureName(categoryName, hasPredefinedPrefixSuffix);
        } else {
          exportName = configureName(
            nameArray.join(" "),
            hasPredefinedPrefixSuffix
          );
        }

        const newOutputPath = fileDict.path.replace(
          `${fileName}.svg`,
          `${exportName}.svg`
        );

        // creates new NSMutableDictionary to reassign the export path
        const newExportDictionary = NSMutableDictionary.alloc().init();
        const oldFileIndex = exports.indexOfObjectIdenticalTo(fileDict);
        newExportDictionary.setValue_forKey(newOutputPath, "path");
        newExportDictionary.setValue_forKey(fileDict.request, "request");
        context.actionContext.exports.replaceObjectAtIndex_withObject(
          oldFileIndex,
          newExportDictionary
        );

        if (fileManager.fileExistsAtPath(fileDict.path)) {
          const svgFile = NSString.stringWithContentsOfFile_encoding_error(
            fileDict.path,
            NSUTF8StringEncoding,
            "Error in reading icon"
          );
          if (name === exportName) {
            // This is a case where the icon and artboard name wind up being the same:
            // we need to remove the old file before writing the new file to disk
            try {
              fileManager.removeItemAtPath_error(
                fileDict.path,
                "Error in deleting source icon"
              );
              svgFile.writeToFile_atomically(newOutputPath, true);
              return dictionary;
            } catch (e) {
              return Promise.reject(`Error in deleting source icon: ${e}`);
            }
          } else {
            const svgFile = NSString.stringWithContentsOfFile_encoding_error(
              fileDict.path,
              NSUTF8StringEncoding,
              "Error in reading icon"
            );
            svgFile.writeToFile_atomically(newOutputPath, true);
          }
        }

        let groupName;
        let filePath;

        if (isDirectory) {
          const pathArray = fileDict.path.split(artboardName);
          const parentGroupName = artboardName.split("/")[0];
          groupName = categoryName;
          filePath = `${pathArray[0]}${parentGroupName}`;
        } else {
          groupName = typeName;
          filePath = fileDict.path;
        }

        if (!dictionary[groupName]) {
          dictionary[groupName] = {
            path: filePath,
            isDirectory: isDirectory
          };
        } else if (dictionary[groupName]) {
          if (isDirectory && !dictionary[groupName].isDirectory) {
            // if the first item in the group doesn't have a backslash, it gets assigned as a regular path
            // here, we're defining the group path
            dictionary[`${groupName}-group`] = {
              path: filePath
            };
          }

          if (!isDirectory && dictionary[groupName].isDirectory) {
            // if the first item in the group doesn't have a backslash, it gets assigned as a regular path
            // here, we're defining the group path
            dictionary[`${groupName}-single`] = {
              path: filePath
            };
          }
        }

        return dictionary;
      },
      {}
    );

    Promise.all(
      map(oldFilePaths, oldFilePath => {
        if (fileManager.fileExistsAtPath(oldFilePath.path)) {
          try {
            fileManager.removeItemAtPath_error(
              oldFilePath.path,
              "Error in deleting source icon"
            );
          } catch (e) {
            return Promise.reject(`Error in deleting source icon: ${e}`);
          }
        }
      })
    )
      .then(() => {
        log("All svgs were successfully renamed");
        sketch.UI.message("All svgs were successfully renamed");
        return context;
      })
      .catch(error => {
        log(error);
        sketch.UI.message(error);
      });
  }
}
