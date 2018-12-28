import sketch from "sketch";
import dialog from "@skpm/dialog";
import { map } from "lodash";

const defaultPrefix = "icon-";
const suiteName = "com.sketchapp.plugins.svg-export-renamer.defaults";

function showDialog(context) {
  const settingsDialog = COSAlertWindow.new();

  settingsDialog.setMessageText("This plugin allows for renaming of SVG exports.");
  settingsDialog.informativeText = `You can change the settings for use of default prefix and suffix for this plugin\n
    By default, there is no suffix, and the prefix used is "icon-".`

  settingsDialog.addButtonWithTitle("Save");
  settingsDialog.addButtonWithTitle("Reset");
  settingsDialog.addButtonWithTitle("Cancel");

  const viewWidth = 300;
  const viewHeight = 400;

  const view = NSView.alloc().initWithFrame(NSMakeRect(0,0, viewWidth, viewHeight));
  settingsDialog.addAccessoryView(view);

  // Creating the input
  const dropdown = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 230, (viewWidth / 2), 22));

  // Filling the PopUpButton with options
  dropdown.addItemWithTitle("Prefix Settings");
  dropdown.addItemWithTitle("Suffix Settings");

  // Adding the PopUpButton to the dialog
  view.addSubview(dropdown);

  const prefixView = createPrefixView();
  //const suffixView = createSuffixOptions(view);

  view.addSubview(prefixView);

  return [settingsDialog];
}

const enableCustomField = (sender, customField, turnOn = false) => {
  customField.enabled = turnOn;
  log(sender.title() + " radio button was clicked");
};

function createPrefixView() {
  const view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 200, 150));
  const noPrefixBtn = NSButton.alloc().initWithFrame(NSMakeRect(0, 50, 400, 25));
  noPrefixBtn.setButtonType(NSRadioButton);
  noPrefixBtn.setTitle("No prefix");

  const defaultPrefixBtn = NSButton.alloc().initWithFrame(NSMakeRect(0, 75, 400, 25));
  defaultPrefixBtn.setButtonType(NSRadioButton);
  defaultPrefixBtn.setTitle("Use `icon` prefix");

  const customPrefixBtn = NSButton.alloc().initWithFrame(NSMakeRect(0, 100, 400, 25));
  customPrefixBtn.setButtonType(NSRadioButton);
  customPrefixBtn.setTitle("Custom prefix:");

  const customPrefixTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, 125, 130, 20));
  customPrefixTextField.enabled = false;

  noPrefixBtn.setCOSJSTargetFunction(sender =>
    enableCustomField(sender, customPrefixTextField)
  );
  defaultPrefixBtn.setCOSJSTargetFunction(sender =>
    enableCustomField(sender, customPrefixTextField)
  );
  customPrefixBtn.setCOSJSTargetFunction(sender =>
    enableCustomField(sender, customPrefixTextField, true)
  );

  view.addSubview(noPrefixBtn);
  view.addSubview(defaultPrefixBtn);
  view.addSubview(customPrefixBtn);
  view.addSubview(customPrefixTextField);

  return view;
}

function createSuffixView() {
  const view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 200, 150));
  const noSuffixBtn = NSButton.alloc().initWithFrame(
    NSMakeRect(0, 50, 400, 25)
  );
  noSuffixBtn.setButtonType(NSRadioButton);
  noSuffixBtn.setTitle("No suffix");

  const customSuffixBtn = NSButton.alloc().initWithFrame(
    NSMakeRect(0, 100, 400, 25)
  );
  customSuffixBtn.setButtonType(NSRadioButton);
  customSuffixBtn.setTitle("Custom suffix:");

  const customSuffixTextField = NSTextField.alloc().initWithFrame(
    NSMakeRect(0, 125, 130, 20)
  );
  customSuffixField.enabled = false;

  noSuffixBtn.setCOSJSTargetFunction(sender =>
    enableCustomField(sender, customSuffixTextField)
  );
  customSuffixBtn.setCOSJSTargetFunction(sender =>
    enableCustomField(sender, customSuffixTextField, true)
  );

  view.addSubview(noSuffixBtn);
  view.addSubview(customSuffixBtn);
  view.addSubview(customSuffixTextField);

  return view;
}

// Todo version 3: New UI for default prefix/suffix
/**
     _______________
    | Prefix    ^  |

     • No prefix
     • Use `icon-` prefix
     • Use custom prefix:  |____________|


    _______________
    | Suffix    ^  |

     • No suffix
     • Use custom suffix:  |____________|
 */
export function showSettings(context) {
  log("SHOWING OPTIONS");
  const window = showDialog(context);
  const alert = window[0];
  const response = alert.runModal();
  // const userDefaults = NSUserDefaults.alloc().initWithSuiteName(suiteName);
  // const response = dialog.showMessageBox({
  //   type: "info",
  //   title: "About SVG Export Renamer",
  //   message: "This plugin allows for renaming of SVG exports.",
  //   detail: "Artboard Name: Foo => foo.svg\nArtboard Name: Foo\\Bar => foo-bar.svg",
  //   checkboxLabel: "Use `icon-` prefix",
  //   buttons: ['Save', 'Reset', 'Cancel'],
  //   checkboxChecked: userDefaults.objectForKey("useDefaultPrefix") != nil
  //     ? userDefaults.objectForKey("useDefaultPrefix") == 1 
  //     : true,
  // }, ({ response, checkboxChecked}) => {

  //   if (response == 0) { // Clicked Save
  //     userDefaults.setObject_forKey(checkboxChecked, "useDefaultPrefix");
  //   } else if (response == 1) { // reset
  //     userDefaults.setObject_forKey(1, "useDefaultPrefix");
  //   }

  //   userDefaults.synchronize();
  // });
};

// Todo version 3: grab defaults from user preferences
function getUserDefaults() {
  const userDefaults = NSUserDefaults.alloc().initWithSuiteName(suiteName);
  const useDefaultPrefix = userDefaults.objectForKey("useDefaultPrefix") != nil 
    ? userDefaults.objectForKey("useDefaultPrefix") == 1 
    : true;
  const customPrefix = userDefaults.objectForKey("customPrefix");
  const customSuffix = userDefaults.objectForKey("customSuffix") != nil 
    ? useDefaults.objectForKey("customSuffix") 
    : false;
  return { useDefaultPrefix, customPrefix, customSuffix }
}

export function renameExport(context) {
  log("RUNNING EXPORT");
  const fileManager = NSFileManager.defaultManager();
  const { useDefaultPrefix, customSuffix } = getUserDefaults();
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
