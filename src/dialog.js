import sketch from "sketch"

export const suiteName = "com.sketchapp.plugins.svg-export-renamer.defaults";

let userDefaults;
let overrideArtboard;
let usePrefix;
let useDefaultPrefix;
let useCustomSuffix;
let customPrefixTextField;
let customSuffixTextField;

export function showDialog(context) {
  userDefaults = NSUserDefaults.alloc().initWithSuiteName(suiteName);
  const settingsDialog = COSAlertWindow.new();

  settingsDialog.setIcon(
    NSImage.alloc().initByReferencingFile(
      context.plugin.urlForResourceNamed("icon.png").path()
    )
  );
  settingsDialog.setMessageText("This plugin allows for renaming of SVG exports.");
  settingsDialog.setInformativeText(`You can change the settings for use of default prefix and suffix for this plugin.\n
By default, there is no suffix, and the prefix used is "icon-".`);

  settingsDialog.addButtonWithTitle("Save");
  settingsDialog.addButtonWithTitle("Reset");
  settingsDialog.addButtonWithTitle("Cancel");

  const viewWidth = 300;
  const viewHeight = 210;

  const view = NSView.alloc().initWithFrame(NSMakeRect(0,0, viewWidth, viewHeight));
  settingsDialog.addAccessoryView(view);

  // Add checkbox for override
  const checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 25, viewWidth, 20));
  overrideArtboard = getDefaults().overrideArtboard; 
  // Setting the options for the checkbox
  checkbox.setButtonType(NSSwitchButton);
  checkbox.setBezelStyle(0);
  checkbox.setTitle("Override prefix/suffix settings on artboard");
  checkbox.setState(getDefaults().overrideArtboard ? NSOnState : NSOffState);
  checkbox.setCOSJSTargetFunction(sender => {
    overrideArtboard = !overrideArtboard;
  });

  // Adding the PopUpButton to the dialog
  const dropdown = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 65, viewWidth / 2, 22));
  
  // Filling the PopUpButton with options
  dropdown.addItemWithTitle("Prefix Settings");
  dropdown.addItemWithTitle("Suffix Settings");

  const prefixView = createPrefixView(viewWidth, viewHeight);
  const suffixView = createSuffixView(viewWidth, viewHeight);
  suffixView.hidden = true;

  const switchView = sender => {
    const subviews = view.subviews;
    if(sender.title().match(/Prefix/g)) {
      prefixView.hidden = false;
      suffixView.hidden = true;
    } else {
      prefixView.hidden = true;
      suffixView.hidden = false;
    }
  };

  dropdown.setCOSJSTargetFunction(sender => switchView(sender));
  view.addSubview(checkbox);
  view.addSubview(dropdown);
  view.addSubview(prefixView);
  view.addSubview(suffixView);

  return [settingsDialog];
}

const enableCustomField = (sender, customField, turnOn = false) => {
  customField.enabled = turnOn;
  log(sender.title() + " radio button was clicked");
};

function createPrefixView(parentViewWidth, parentViewHeight) {
  const { noPrefixSetting, defaultPrefixSetting, customPrefixSetting } = getPrefixSettings();
  const { usePrefix: userUsePrefix, useDefaultPrefix: userUseDefault } = getDefaults();
  const baseY = parentViewHeight - 120;
  const view = NSView.alloc().initWithFrame(NSMakeRect(0, (parentViewHeight - 185), parentViewWidth, 200));
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

  customPrefixTextField = NSTextField.alloc().initWithFrame(NSMakeRect(20, (baseY - 75), 130, 20));
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
  const baseY = parentViewHeight - 120;
  const view = NSView.alloc().initWithFrame(
    NSMakeRect(0, parentViewHeight - 185, parentViewWidth, 200)
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

  customSuffixTextField = NSTextField.alloc().initWithFrame(
    NSMakeRect(20, baseY - 50, 130, 20)
  );
  customSuffixTextField.enabled = userUseSuffix;
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
    usePrefix: userDefaults.objectForKey("usePrefix") != nil ? userDefaults.objectForKey("usePrefix") == 1 : true,
    useDefaultPrefix: userDefaults.objectForKey("useDefaultPrefix") != nil ? userDefaults.objectForKey("useDefaultPrefix") == 1 : true,
    customPrefix: userDefaults.objectForKey("customPrefix") != nil ? userDefaults.objectForKey("customPrefix") : null,
    useCustomSuffix: userDefaults.objectForKey("useCustomSuffix") != nil ? userDefaults.objectForKey("useCustomSuffix") == 1 : false,
    customSuffix: userDefaults.objectForKey("customSuffix") != nil ? userDefaults.objectForKey("customSuffix") : null,
  }
}

export function savePreferences() {
  userDefaults.setObject_forKey(overrideArtboard, "overrideArtboard");
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
  userDefaults.setObject_forKey(true, "usePrefix");
  userDefaults.setObject_forKey(true, "useDefaultPrefix");
  userDefaults.setObject_forKey(nil, "customPrefix");
  userDefaults.setObject_forKey(false, "useCustomSuffix");
  userDefaults.setObject_forKey(nil, "customSuffix");
  userDefaults.synchronize();
}