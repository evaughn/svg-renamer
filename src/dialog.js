import sketch from "sketch";
import { caseTypeMapping } from "./case-utils";

const suiteName = "com.sketchapp.plugins.svg-export-renamer.defaults";

let userDefaults;
let overrideArtboard;
let selectedCaseType;
let usePrefix;
let useDefaultPrefix;
let useCustomSuffix;
let customPrefixTextField;
let customSuffixTextField;

export function showDialog(context) {
  const settingsDialog = COSAlertWindow.new();
  userDefaults = NSUserDefaults.alloc().initWithSuiteName(suiteName);

  settingsDialog.setIcon(
    NSImage.alloc().initByReferencingFile(
      context.plugin.urlForResourceNamed("icon.png").path()
    )
  );
  settingsDialog.setMessageText("This plugin allows for renaming of SVG exports.");
  settingsDialog.setInformativeText(`You can change the settings for use of default prefix and suffix for this plugin.\n
By default, there is no suffix, and the prefix used is "icon".`);

  settingsDialog.addButtonWithTitle("Save Settings");
  settingsDialog.addButtonWithTitle("Reset Settings");
  settingsDialog.addButtonWithTitle("Cancel");

  const viewWidth = 350;
  const viewHeight = 290;

  const view = NSView.alloc().initWithFrame(NSMakeRect(0,0, viewWidth, viewHeight));
  settingsDialog.addAccessoryView(view);

  const caseLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 25, viewWidth - 100, 20));
  caseLabel.setStringValue("Case type:");
  caseLabel.setSelectable(false);
  caseLabel.setEditable(false);
  caseLabel.setBezeled(false);
  caseLabel.setDrawsBackground(false);

  const caseType = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 47, 300, 22));
  caseType.addItemWithTitle("Dash Case (icon-named.svg)");
  caseType.addItemWithTitle("Snake Case (icon_named.svg)");
  caseType.addItemWithTitle("Title Case (iconRenamed.svg)");
  caseType.selectItemAtIndex(getSelectedCaseIndex());
  selectedCaseType = getDefaults().selectedCaseType;
  caseType.setCOSJSTargetFunction(sender => {
    switch (sender.indexOfSelectedItem()) {
      case 0:
        selectedCaseType = "dash";
        break;
      case 1:
        selectedCaseType = "snake";
        break;
      case 2:
        selectedCaseType = "title";
        break;
      default:
        selectedCaseType = "dash";
        break;
    }
  });

  // Add checkbox for override
  const checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 78, viewWidth, 20));
  overrideArtboard = getDefaults().overrideArtboard; 
  // Setting the options for the checkbox
  checkbox.setButtonType(NSSwitchButton);
  checkbox.setBezelStyle(0);
  checkbox.setTitle("Override prefix/suffix settings on artboard");
  checkbox.setState(getDefaults().overrideArtboard ? NSOnState : NSOffState);
  checkbox.setCOSJSTargetFunction(sender => {
    overrideArtboard = !overrideArtboard;
  });
  //checkbox.enabled = false;

  // Adding the PopUpButton to the dialog
  const prefixSuffixDropdown = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 130, 300, 22));
  
  // Filling the PopUpButton with options
  prefixSuffixDropdown.addItemWithTitle("Prefix Settings");
  prefixSuffixDropdown.addItemWithTitle("Suffix Settings");

  const prefixView = createPrefixView(viewWidth, viewHeight);
  const suffixView = createSuffixView(viewWidth, viewHeight);
  suffixView.hidden = true;

  const switchView = sender => {
    if(sender.title().match(/Prefix/g)) {
      prefixView.hidden = false;
      suffixView.hidden = true;
    } else {
      prefixView.hidden = true;
      suffixView.hidden = false;
    }
  };

  prefixSuffixDropdown.setCOSJSTargetFunction(sender => switchView(sender));
  view.addSubview(caseLabel);
  view.addSubview(caseType);
  view.addSubview(checkbox);
  view.addSubview(prefixSuffixDropdown);
  view.addSubview(prefixView);
  view.addSubview(suffixView);

  return [settingsDialog];
}

const enableCustomField = (sender, customField, turnOn = false) => {
  customField.enabled = turnOn;
  log(sender.title() + " radio button was clicked");
};

const getSelectedCaseIndex = () => {
  const { selectedCaseType } = getDefaults();
  return caseTypeMapping[selectedCaseType];
};

function createPrefixView(parentViewWidth, parentViewHeight) {
  const { noPrefixSetting, defaultPrefixSetting, customPrefixSetting } = getPrefixSettings();
  const { usePrefix: userUsePrefix, useDefaultPrefix: userUseDefault } = getDefaults();
  const baseY = parentViewHeight - 210;
  const view = NSView.alloc().initWithFrame(NSMakeRect(0, (parentViewHeight - 240), parentViewWidth, 400));
  const noPrefixBtn = NSButton.alloc().initWithFrame(NSMakeRect(0, baseY, 400, 25));
  noPrefixBtn.setButtonType(NSRadioButton);
  noPrefixBtn.setTitle("No prefix");
  noPrefixBtn.setState(noPrefixSetting);
  usePrefix = userUsePrefix;

  const defaultPrefixBtn = NSButton.alloc().initWithFrame(NSMakeRect(0, (baseY - 25), 400, 25));
  defaultPrefixBtn.setButtonType(NSRadioButton);
  defaultPrefixBtn.setTitle("Use `icon` prefix");
  defaultPrefixBtn.setState(defaultPrefixSetting);
  useDefaultPrefix = userUseDefault;

  const customPrefixBtn = NSButton.alloc().initWithFrame(NSMakeRect(0, (baseY - 50), 400, 25));
  customPrefixBtn.setButtonType(NSRadioButton);
  customPrefixBtn.setTitle("Custom prefix:");
  customPrefixBtn.setState(customPrefixSetting);

  customPrefixTextField = NSTextField.alloc().initWithFrame(NSMakeRect(20, (baseY - 75), 250, 20));
  customPrefixTextField.bezeled = true;
  customPrefixTextField.bezelStyle = NSTextFieldRoundedBezel;
  customPrefixTextField.enabled = usePrefix && !useDefaultPrefix;
  
  if (userDefaults.objectForKey("customPrefix") != nil) {
    customPrefixTextField.setStringValue(userDefaults.objectForKey("customPrefix"));
  }

  noPrefixBtn.setCOSJSTargetFunction(sender => {
    usePrefix = false;
    useDefaultPrefix = false;
    enableCustomField(sender, customPrefixTextField)
  });
  defaultPrefixBtn.setCOSJSTargetFunction(sender => {
    usePrefix = true;
    useDefaultPrefix = true;
    enableCustomField(sender, customPrefixTextField)
  });
  customPrefixBtn.setCOSJSTargetFunction(sender => {
    usePrefix = true;
    useDefaultPrefix = false;
    enableCustomField(sender, customPrefixTextField, true)
  });

  view.addSubview(noPrefixBtn);
  view.addSubview(defaultPrefixBtn);
  view.addSubview(customPrefixBtn);
  view.addSubview(customPrefixTextField);

  return view;
}

function createSuffixView(parentViewWidth, parentViewHeight) {
  const { noSuffixSetting, customSuffixSetting } = getSuffixSettings();
  const { useCustomSuffix: userUseSuffix } = getDefaults();
  const baseY = parentViewHeight - 210;
  const view = NSView.alloc().initWithFrame(
    NSMakeRect(0, parentViewHeight - 240, parentViewWidth, 400)
  );
  const noSuffixBtn = NSButton.alloc().initWithFrame(
    NSMakeRect(0, baseY, 400, 25)
  );
  noSuffixBtn.setButtonType(NSRadioButton);
  noSuffixBtn.setTitle("No suffix");
  noSuffixBtn.setState(noSuffixSetting);
  useCustomSuffix = userUseSuffix;

  const customSuffixBtn = NSButton.alloc().initWithFrame(
    NSMakeRect(0, baseY - 25, 400, 25)
  );
  customSuffixBtn.setButtonType(NSRadioButton);
  customSuffixBtn.setTitle("Custom suffix:");
  customSuffixBtn.setState(customSuffixSetting);

  customSuffixTextField = NSTextField.alloc().initWithFrame(NSMakeRect(20, baseY - 50, 250, 20));
  customSuffixTextField.enabled = userUseSuffix;
  customSuffixTextField.bezeled = true;
  customSuffixTextField.bezelStyle = NSTextFieldRoundedBezel;
  if (userDefaults.objectForKey("customSuffix") != nil) {
    customSuffixTextField.setStringValue(userDefaults.objectForKey("customSuffix"));
  }

  noSuffixBtn.setCOSJSTargetFunction(sender => {
    useCustomSuffix = false;
    enableCustomField(sender, customSuffixTextField)
  });

  customSuffixBtn.setCOSJSTargetFunction(sender => {
    useCustomSuffix = true;
    enableCustomField(sender, customSuffixTextField, true)
  });

  view.addSubview(noSuffixBtn);
  view.addSubview(customSuffixBtn);
  view.addSubview(customSuffixTextField);

  return view;
}

function getPrefixSettings() {
  return {
    noPrefixSetting: userDefaults.objectForKey("usePrefix") != nil && userDefaults.objectForKey("useDefaultPrefix") != nil
      ? (userDefaults.objectForKey("usePrefix") != 1 && userDefaults.objectForKey("useDefaultPrefix") != 1) ? NSOnState : NSOffState
      : NSOffState,
    defaultPrefixSetting: userDefaults.objectForKey("usePrefix") != nil && userDefaults.objectForKey("useDefaultPrefix") != nil
      ? (userDefaults.objectForKey("usePrefix") == 1 && userDefaults.objectForKey("useDefaultPrefix") == 1 )? NSOnState : NSOffState
      : NSOnState,
    customPrefixSetting: userDefaults.objectForKey("usePrefix") != nil && userDefaults.objectForKey("useDefaultPrefix") != nil
      ? (userDefaults.objectForKey("usePrefix") == 1 && userDefaults.objectForKey("useDefaultPrefix") != 1 )? NSOnState : NSOffState
      : NSOffState
  }
}

function getSuffixSettings() {
  return {
    noSuffixSetting: userDefaults.objectForKey("useCustomSuffix") != nil
      ? userDefaults.objectForKey("useCustomSuffix") == 1 ? NSOffState : NSOnState
      : NSOnState,
    customSuffixSetting: userDefaults.objectForKey("useCustomSuffix") != nil
      ? userDefaults.objectForKey("useCustomSuffix") == 1 ? NSOnState : NSOffState
      : NSOffState,
  }
}

export function getDefaults() {
  userDefaults = NSUserDefaults.alloc().initWithSuiteName(suiteName);
  return {
    overrideArtboard: userDefaults.objectForKey("overrideArtboard") != nil ? userDefaults.objectForKey("overrideArtboard") == 1 : true,
    selectedCaseType: userDefaults.objectForKey("selectedCaseType") != nil ? userDefaults.objectForKey("selectedCaseType") : "dash",
    usePrefix: userDefaults.objectForKey("usePrefix") != nil ? userDefaults.objectForKey("usePrefix") == 1 : true,
    useDefaultPrefix: userDefaults.objectForKey("useDefaultPrefix") != nil ? userDefaults.objectForKey("useDefaultPrefix") == 1 : true,
    customPrefix: userDefaults.objectForKey("customPrefix") != nil ? userDefaults.objectForKey("customPrefix") : null,
    useCustomSuffix: userDefaults.objectForKey("useCustomSuffix") != nil ? userDefaults.objectForKey("useCustomSuffix") == 1 : false,
    customSuffix: userDefaults.objectForKey("customSuffix") != nil ? userDefaults.objectForKey("customSuffix") : null,
  }
}

export function savePreferences() {
  userDefaults.setObject_forKey(overrideArtboard, "overrideArtboard");
  userDefaults.setObject_forKey(selectedCaseType, "selectedCaseType");
  userDefaults.setObject_forKey(usePrefix, "usePrefix");
  userDefaults.setObject_forKey(useDefaultPrefix, "useDefaultPrefix");
  userDefaults.setObject_forKey(customPrefixTextField.stringValue().replace(/\W/, ""), "customPrefix");
  userDefaults.setObject_forKey(useCustomSuffix, "useCustomSuffix");
  userDefaults.setObject_forKey(customSuffixTextField
      .stringValue()
      .replace(/\W/, ""), "customSuffix");
  userDefaults.synchronize();
}

export function resetPreferences() {
  userDefaults.setObject_forKey(true, "overrideArtboard");
  userDefaults.setObject_forKey("dash", "selectedCaseType");
  userDefaults.setObject_forKey(true, "usePrefix");
  userDefaults.setObject_forKey(true, "useDefaultPrefix");
  userDefaults.setObject_forKey(nil, "customPrefix");
  userDefaults.setObject_forKey(false, "useCustomSuffix");
  userDefaults.setObject_forKey(nil, "customSuffix");
  userDefaults.synchronize();
}