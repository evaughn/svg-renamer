import sketch from "sketch";
import { map } from "lodash";
import {
  getDefaults,
  showDialog,
  suiteName,
  savePreferences,
  resetPreferences
} from "./dialog";

// export { showSettings } from "./dialog";

const defaultPrefix = "icon-";

export function showSettings(context) {
  log("SHOWING OPTIONS");
  const window = showDialog(context);
  const alert = window[0];
  const response = alert.runModal();

  if (response == "1000") {
    savePreferences();
  } else if (response == "1001") {
    resetPreferences();
  }
}

export function renameExport(context) {
  log("RUNNING EXPORT");
  const fileManager = NSFileManager.defaultManager();
  const { noPrefixSetting, defaultPrefixSetting } = getDefaults();
  const { exports } = context.actionContext;

  const useDefaultPrefix = !noPrefixSetting && defaultPrefixSetting;

  let filesToRename = [];

  for (let i = 0; i < exports.length; i++) {
    const currentExport = exports[i];
    if (currentExport.request.format() == "svg") {
      filesToRename.push(currentExport);
    }
  }

  if (filesToRename.length > 0) {
    let oldFiles = {};
    const oldFilePaths = filesToRename.reduce((dictionary, fileDict) => {
      const artboardName = fileDict.request.name();
      let exportName = "";
      let name = artboardName.toLowerCase();

      name = name.replace(/\s/g, "-");
      name = name.replace(/\&/g, "and");
      name = name.replace(/(?!-)(?!\/)([0-9]|\W|\_)/g, "");

      const nameArray = name.split("/");
      const categoryName = nameArray[0];
      const typeName = nameArray[nameArray.length - 1];
      const isDirectory = nameArray.length > 1;

      if (nameArray.length === 1 || typeName === "default" || !!parseInt(typeName)) {
        exportName = useDefaultPrefix ? `${defaultPrefix}${categoryName}` : categoryName;
      } else {
        exportName = useDefaultPrefix ? `${defaultPrefix}${categoryName}-${typeName}` : `${categoryName}-${typeName}`;
      }

      const newOutputPath = fileDict.path.replace(`${artboardName}.svg`, `${exportName}.svg`);

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
        }
      } else if (dictionary[groupName]) {
        if (isDirectory && !dictionary[groupName].isDirectory) {
          // if the first item in the group doesn't have a backslash, it gets assigned as a regular path
          // here, we're defining the group path
          dictionary[`${groupName}-group`] = {
            path: filePath
          }
        }

        if (!isDirectory && dictionary[groupName].isDirectory) {
          // if the first item in the group doesn't have a backslash, it gets assigned as a regular path
          // here, we're defining the group path
          dictionary[`${groupName}-single`] = {
            path: filePath
          }
        }
      }

      if (fileManager.fileExistsAtPath(fileDict.path)) {
        const svgFile = NSString.stringWithContentsOfFile_encoding_error(fileDict.path, NSUTF8StringEncoding, "Error in reading icon");
        svgFile.writeToFile_atomically(newOutputPath, false)
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
