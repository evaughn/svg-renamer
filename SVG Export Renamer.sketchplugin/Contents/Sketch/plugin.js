var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/dialog/lib/index.js":
/*!************************************************!*\
  !*** ./node_modules/@skpm/dialog/lib/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* let's try to match the API from Electron's Dialog
(https://github.com/electron/electron/blob/master/docs/api/dialog.md) */

module.exports = {
  showOpenDialog: __webpack_require__(/*! ./open-dialog */ "./node_modules/@skpm/dialog/lib/open-dialog.js"),
  showSaveDialog: __webpack_require__(/*! ./save-dialog */ "./node_modules/@skpm/dialog/lib/save-dialog.js"),
  showMessageBox: __webpack_require__(/*! ./message-box */ "./node_modules/@skpm/dialog/lib/message-box.js"),
  // showErrorBox: require('./error-box'),
}


/***/ }),

/***/ "./node_modules/@skpm/dialog/lib/message-box.js":
/*!******************************************************!*\
  !*** ./node_modules/@skpm/dialog/lib/message-box.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
var RunDelegate = __webpack_require__(/*! ./run-delegate */ "./node_modules/@skpm/dialog/lib/run-delegate.js")

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowmessageboxbrowserwindow-options-callback
var typeMap = {
  none: 0,
  info: 1,
  error: 2,
  question: 1,
  warning: 2,
}
module.exports = function messageBox(document, options, callback) {
  if (!document ||
    (typeof document.class !== 'function' && !document.sketchObject)
  ) {
    callback = options
    options = document
    document = undefined
  } else if (document.sketchObject) {
    document = document.sketchObject
  }
  if (!options) {
    options = {}
  }

  var response

  var dialog = NSAlert.alloc().init()

  if (options.type) {
    dialog.alertStyle = typeMap[options.type] || 0
  }

  if (options.buttons && options.buttons.length) {
    options.buttons.forEach(function addButton(button) {
      dialog.addButtonWithTitle(
        options.normalizeAccessKeys ? button.replace(/&/g, '') : button
      )
      // TODO: add keyboard shortcut if options.normalizeAccessKeys
    })
  }

  if (typeof options.defaultId !== 'undefined') {
    var buttons = dialog.buttons()
    if (options.defaultId < buttons.length) {
      // Focus the button at defaultId if the user opted to do so.
      // The first button added gets set as the default selected.
      // So remove that default, and make the requested button the default.
      buttons[0].setKeyEquivalent('')
      buttons[options.defaultId].setKeyEquivalent('\r')
    }
  }

  if (options.title) {
    // not shown on macOS
  }

  if (options.message) {
    dialog.messageText = options.message
  }

  if (options.detail) {
    dialog.informativeText = options.detail
  }

  if (options.checkboxLabel) {
    dialog.showsSuppressionButton = true
    dialog.suppressionButton().title = options.checkboxLabel

    if (typeof options.checkboxChecked !== 'undefined') {
      dialog.suppressionButton().state = options.checkboxChecked ?
        NSOnState :
        NSOffState
    }
  }

  if (options.icon) {
    if (typeof options.icon === 'string') {
      options.icon = NSImage.alloc().initWithContentsOfFile(options.icon)
    }
    dialog.icon = options.icon
  } else if (
    typeof __command !== 'undefined' &&
    __command.pluginBundle() &&
    __command.pluginBundle().icon()
  ) {
    dialog.icon = __command.pluginBundle().icon()
  } else {
    var icon = NSImage.imageNamed('plugins')
    if (icon) {
      dialog.icon = icon
    }
  }

  if (!document) {
    response = Number(dialog.runModal()) - 1000
    if (callback) {
      var checkboxChecked = false
      if (options.checkboxLabel) {
        checkboxChecked = dialog.suppressionButton().state() == NSOnState
      }
      callback({
        response: response,
        checkboxChecked: checkboxChecked,
      })
      return undefined
    }
    return response
  }

  var delegate = RunDelegate.new()

  dialog.buttons().forEach(function hookButton(button, i) {
    button.setTarget(delegate)
    button.setAction(NSSelectorFromString('buttonClicked:'))
    button.setTag(i)
  })

  var fiber
  if (callback) {
    if (coscript.createFiber) {
      fiber = coscript.createFiber()
    } else {
      coscript.shouldKeepAround = true
    }
  }

  delegate.options = NSDictionary.dictionaryWithDictionary({
    onClicked: function handleEnd(returnCode) {
      if (callback) {
        callback({
          response: Number(returnCode),
          checkboxChecked: dialog.suppressionButton().state() == NSOnState,
        })
        NSApp.endSheet(dialog.window())
        if (fiber) {
          fiber.cleanup()
        } else {
          coscript.shouldKeepAround = false
        }
      } else {
        NSApp.stopModalWithCode(Number(returnCode))
      }
    },
  })

  var window = (document.sketchObject || document).documentWindow()
  dialog.beginSheetModalForWindow_modalDelegate_didEndSelector_contextInfo(
    window,
    null,
    null,
    null
  )

  if (!callback) {
    response = Number(NSApp.runModalForWindow(window))
    NSApp.endSheet(dialog.window())
    return response
  }

  return undefined
}


/***/ }),

/***/ "./node_modules/@skpm/dialog/lib/open-dialog.js":
/*!******************************************************!*\
  !*** ./node_modules/@skpm/dialog/lib/open-dialog.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
var RunDelegate = __webpack_require__(/*! ./run-delegate */ "./node_modules/@skpm/dialog/lib/run-delegate.js")
var utils = __webpack_require__(/*! ./utils */ "./node_modules/@skpm/dialog/lib/utils.js")

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowopendialogbrowserwindow-options-callback
module.exports = function openDialog(document, options, callback) {
  if (!document || typeof document.class !== 'function') {
    callback = options
    options = document
    document = undefined
  }
  if (!options) {
    options = {}
  }

  var dialog = NSOpenPanel.openPanel()

  if (options.title) {
    dialog.title = options.title
  }

  if (options.defaultPath) {
    dialog.setDirectoryURL(utils.getURL(options.defaultPath))
  }

  if (options.buttonLabel) {
    dialog.prompt = options.buttonLabel
  }

  if (options.filters && options.filters.length) {
    var exts = []
    options.filters.forEach(function setFilter(filter) {
      filter.extensions.forEach(function setExtension(ext) {
        exts.push(ext)
      })
    })

    dialog.allowedFileTypes = exts
  }

  if (options.properties && options.properties.length) {
    options.properties.forEach(function setProperty(p) {
      if (p === 'openFile') {
        dialog.canChooseFiles = true
      } else if (p === 'openDirectory') {
        dialog.canChooseDirectories = true
      } else if (p === 'multiSelections') {
        dialog.allowsMultipleSelection = true
      } else if (p === 'showHiddenFiles') {
        dialog.showsHiddenFiles = true
      } else if (p === 'createDirectory') {
        dialog.createDirectory = true
      } else if (p === 'noResolveAliases') {
        dialog.resolvesAliases = false
      } else if (p === 'treatPackageAsDirectory') {
        dialog.treatsFilePackagesAsDirectories = true
      }
    })
  }

  if (options.message) {
    dialog.message = options.message
  }

  var buttonClicked

  function getURLs() {
    var result = []
    var urls = dialog.URLs()
    for (var k = 0; k < urls.length; k += 1) {
      result.push(String(urls[k].path()))
    }

    return result
  }

  if (!document) {
    buttonClicked = dialog.runModal()
    if (buttonClicked == NSOKButton) {
      if (callback) {
        callback(getURLs())
        return undefined
      }
      return getURLs()
    }

    return []
  }

  var nsButtonClass = NSButton.class()

  function findButtonWithTitleInView(title, view) {
    if (!view || !view.subviews || !view.subviews()) {
      return undefined
    }
    var subviews = view.subviews()
    for (var i = 0; i < subviews.length; i += 1) {
      var subview = subviews[i]
      if (
        subview.isKindOfClass(nsButtonClass) &&
        String(subview.title()) == title
      ) {
        return subview
      }
      var foundButton = findButtonWithTitleInView(title, subview)
      if (foundButton) {
        return foundButton
      }
    }
    return undefined
  }

  var cancelButton = findButtonWithTitleInView('Cancel', dialog.contentView())
  var okButton = findButtonWithTitleInView(
    options.buttonLabel || 'Open',
    dialog.contentView()
  )

  var delegate = RunDelegate.new()

  cancelButton.setTarget(delegate)
  cancelButton.setAction(NSSelectorFromString('button1Clicked:'))
  okButton.setTarget(delegate)
  okButton.setAction(NSSelectorFromString('button0Clicked:'))

  var fiber
  if (callback) {
    if (coscript.createFiber) {
      fiber = coscript.createFiber()
    } else {
      coscript.shouldKeepAround = true
    }
  }

  delegate.options = NSDictionary.dictionaryWithDictionary({
    onClicked: function handleEnd(returnCode) {
      if (callback) {
        callback(returnCode == 0 ? getURLs() : undefined)
        NSApp.endSheet(dialog)
        if (fiber) {
          fiber.cleanup()
        } else {
          coscript.shouldKeepAround = false
        }
      } else {
        NSApp.stopModalWithCode(returnCode)
      }
    },
  })

  var window = (document.sketchObject || document).documentWindow()
  dialog.beginSheetForDirectory_file_modalForWindow_modalDelegate_didEndSelector_contextInfo(
    null,
    null,
    window,
    null,
    null,
    null
  )

  if (!callback) {
    buttonClicked = NSApp.runModalForWindow(window)
    NSApp.endSheet(dialog)
    if (buttonClicked == 0) {
      return getURLs()
    }
    return undefined
  }

  return undefined
}


/***/ }),

/***/ "./node_modules/@skpm/dialog/lib/run-delegate.js":
/*!*******************************************************!*\
  !*** ./node_modules/@skpm/dialog/lib/run-delegate.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ObjCClass = __webpack_require__(/*! cocoascript-class */ "./node_modules/cocoascript-class/lib/index.js").default

module.exports = new ObjCClass({
  options: null,

  'buttonClicked:': function handleButtonClicked(sender) {
    if (this.options.onClicked) {
      this.options.onClicked(sender.tag())
    }
    this.release()
  },

  'button0Clicked:': function handleButtonClicked() {
    if (this.options.onClicked) {
      this.options.onClicked(0)
    }
    this.release()
  },

  'button1Clicked:': function handleButtonClicked() {
    if (this.options.onClicked) {
      this.options.onClicked(1)
    }
    this.release()
  },
})


/***/ }),

/***/ "./node_modules/@skpm/dialog/lib/save-dialog.js":
/*!******************************************************!*\
  !*** ./node_modules/@skpm/dialog/lib/save-dialog.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
var RunDelegate = __webpack_require__(/*! ./run-delegate */ "./node_modules/@skpm/dialog/lib/run-delegate.js")
var utils = __webpack_require__(/*! ./utils */ "./node_modules/@skpm/dialog/lib/utils.js")

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowsavedialogbrowserwindow-options-callback
module.exports = function saveDialog(document, options, callback) {
  if (!document || typeof document.class !== 'function') {
    callback = options
    options = document
    document = undefined
  }
  if (!options) {
    options = {}
  }

  var buttonClicked
  var url

  var dialog = NSSavePanel.savePanel()

  if (options.title) {
    dialog.title = options.title
  }

  if (options.defaultPath) {
    // that's a path
    dialog.setDirectoryURL(utils.getURL(options.defaultPath))

    if (
      options.defaultPath[0] === '.' ||
      options.defaultPath[0] === '~' ||
      options.defaultPath[0] === '/'
    ) {
      var parts = options.defaultPath.split('/')
      if (parts.length > 1 && parts[parts.length - 1]) {
        dialog.setNameFieldStringValue(parts[parts.length - 1])
      }
    } else {
      dialog.setNameFieldStringValue(options.defaultPath)
    }
  }

  if (options.buttonLabel) {
    dialog.prompt = options.buttonLabel
  }

  if (options.filters && options.filters.length) {
    var exts = []
    options.filters.forEach(function setFilter(filter) {
      filter.extensions.forEach(function setExtension(ext) {
        exts.push(ext)
      })
    })

    dialog.allowedFileTypes = exts
  }

  if (options.message) {
    dialog.message = options.message
  }

  if (options.nameFieldLabel) {
    dialog.nameFieldLabel = options.nameFieldLabel
  }

  if (options.showsTagField) {
    dialog.showsTagField = options.showsTagField
  }

  if (!document) {
    buttonClicked = dialog.runModal()
    if (buttonClicked == NSOKButton) {
      url = String(dialog.URL().path())

      if (callback) {
        callback(url)
        return undefined
      }
      return url
    }
    return undefined
  }

  var nsButtonClass = NSButton.class()

  function findButtonWithTitleInView(title, view) {
    if (!view || !view.subviews || !view.subviews()) {
      return undefined
    }
    var subviews = view.subviews()
    for (var i = 0; i < subviews.length; i += 1) {
      var subview = subviews[i]
      if (
        subview.isKindOfClass(nsButtonClass) &&
        String(subview.title()) == title
      ) {
        return subview
      }
      var foundButton = findButtonWithTitleInView(title, subview)
      if (foundButton) {
        return foundButton
      }
    }
    return undefined
  }

  var cancelButton = findButtonWithTitleInView('Cancel', dialog.contentView())
  var okButton = findButtonWithTitleInView(
    options.buttonLabel || 'Save',
    dialog.contentView()
  )

  var delegate = RunDelegate.new()

  cancelButton.setTarget(delegate)
  cancelButton.setAction(NSSelectorFromString('button1Clicked:'))
  okButton.setTarget(delegate)
  okButton.setAction(NSSelectorFromString('button0Clicked:'))

  var fiber
  if (callback) {
    if (coscript.createFiber) {
      fiber = coscript.createFiber()
    } else {
      coscript.shouldKeepAround = true
    }
  }

  delegate.options = NSDictionary.dictionaryWithDictionary({
    onClicked: function handleEnd(returnCode) {
      if (callback) {
        callback(returnCode == 0 ? String(dialog.URL().path()) : undefined)
        NSApp.endSheet(dialog)
        if (fiber) {
          fiber.cleanup()
        } else {
          coscript.shouldKeepAround = false
        }
      } else {
        NSApp.stopModalWithCode(returnCode)
      }
    },
  })

  var window = (document.sketchObject || document).documentWindow()
  dialog.beginSheetForDirectory_file_modalForWindow_modalDelegate_didEndSelector_contextInfo(
    null,
    null,
    window,
    null,
    null,
    null
  )

  if (!callback) {
    buttonClicked = NSApp.runModalForWindow(window)
    NSApp.endSheet(dialog)
    if (buttonClicked == 0) {
      return String(dialog.URL().path())
    }
    return undefined
  }

  return undefined
}


/***/ }),

/***/ "./node_modules/@skpm/dialog/lib/utils.js":
/*!************************************************!*\
  !*** ./node_modules/@skpm/dialog/lib/utils.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports.getURL = function getURL(path) {
  return NSURL.URLWithString(
    String(
      NSString.stringWithString(path).stringByExpandingTildeInPath()
    ).replace(/ /g, '%20')
  )
}


/***/ }),

/***/ "./node_modules/@skpm/timers/immediate.js":
/*!************************************************!*\
  !*** ./node_modules/@skpm/timers/immediate.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var timeout = __webpack_require__(/*! ./timeout */ "./node_modules/@skpm/timers/timeout.js")

function setImmediate(func, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  return timeout.setTimeout(func, 0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
}

function clearImmediate(id) {
  return timeout.clearTimeout(id)
}

module.exports = {
  setImmediate: setImmediate,
  clearImmediate: clearImmediate
}


/***/ }),

/***/ "./node_modules/@skpm/timers/test-if-fiber.js":
/*!****************************************************!*\
  !*** ./node_modules/@skpm/timers/test-if-fiber.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function () {
  return typeof coscript !== 'undefined' && coscript.createFiber
}


/***/ }),

/***/ "./node_modules/@skpm/timers/timeout.js":
/*!**********************************************!*\
  !*** ./node_modules/@skpm/timers/timeout.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var fiberAvailable = __webpack_require__(/*! ./test-if-fiber */ "./node_modules/@skpm/timers/test-if-fiber.js")

var setTimeout
var clearTimeout

var fibers = []

if (fiberAvailable()) {
  var fibers = []

  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    // fibers takes care of keeping coscript around
    var id = fibers.length
    fibers.push(coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
      }
    ))
    return id
  }

  clearTimeout = function (id) {
    var timeout = fibers[id]
    if (timeout) {
      timeout.cancel() // fibers takes care of keeping coscript around
      fibers[id] = undefined // garbage collect the fiber
    }
  }
} else {
  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    coscript.shouldKeepAround = true
    var id = fibers.length
    fibers.push(true)
    coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        if (fibers[id]) { // if not cleared
          func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
        }
        clearTimeout(id)
        if (fibers.every(function (_id) { return !_id })) { // if everything is cleared
          coscript.shouldKeepAround = false
        }
      }
    )
    return id
  }

  clearTimeout = function (id) {
    fibers[id] = false
  }
}

module.exports = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
}


/***/ }),

/***/ "./node_modules/cocoascript-class/lib/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/cocoascript-class/lib/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = undefined;
exports.default = ObjCClass;

var _runtime = __webpack_require__(/*! ./runtime.js */ "./node_modules/cocoascript-class/lib/runtime.js");

exports.SuperCall = _runtime.SuperCall;

// super when returnType is id and args are void
// id objc_msgSendSuper(struct objc_super *super, SEL op, void)

const SuperInit = (0, _runtime.SuperCall)(NSStringFromSelector("init"), [], { type: "@" });

// Returns a real ObjC class. No need to use new.
function ObjCClass(defn) {
  const superclass = defn.superclass || NSObject;
  const className = (defn.className || defn.classname || "ObjCClass") + NSUUID.UUID().UUIDString();
  const reserved = new Set(['className', 'classname', 'superclass']);
  var cls = MOClassDescription.allocateDescriptionForClassWithName_superclass_(className, superclass);
  // Add each handler to the class description
  const ivars = [];
  for (var key in defn) {
    const v = defn[key];
    if (typeof v == 'function' && key !== 'init') {
      var selector = NSSelectorFromString(key);
      cls.addInstanceMethodWithSelector_function_(selector, v);
    } else if (!reserved.has(key)) {
      ivars.push(key);
      cls.addInstanceVariableWithName_typeEncoding(key, "@");
    }
  }

  cls.addInstanceMethodWithSelector_function_(NSSelectorFromString('init'), function () {
    const self = SuperInit.call(this);
    ivars.map(name => {
      Object.defineProperty(self, name, {
        get() {
          return getIvar(self, name);
        },
        set(v) {
          (0, _runtime.object_setInstanceVariable)(self, name, v);
        }
      });
      self[name] = defn[name];
    });
    // If there is a passsed-in init funciton, call it now.
    if (typeof defn.init == 'function') defn.init.call(this);
    return self;
  });

  return cls.registerClass();
};

function getIvar(obj, name) {
  const retPtr = MOPointer.new();
  (0, _runtime.object_getInstanceVariable)(obj, name, retPtr);
  return retPtr.value().retain().autorelease();
}

/***/ }),

/***/ "./node_modules/cocoascript-class/lib/runtime.js":
/*!*******************************************************!*\
  !*** ./node_modules/cocoascript-class/lib/runtime.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = SuperCall;
exports.CFunc = CFunc;
const objc_super_typeEncoding = '{objc_super="receiver"@"super_class"#}';

// You can store this to call your function. this must be bound to the current instance.
function SuperCall(selector, argTypes, returnType) {
  const func = CFunc("objc_msgSendSuper", [{ type: '^' + objc_super_typeEncoding }, { type: ":" }, ...argTypes], returnType);
  return function (...args) {
    const struct = make_objc_super(this, this.superclass());
    const structPtr = MOPointer.alloc().initWithValue_(struct);
    return func(structPtr, selector, ...args);
  };
}

// Recursively create a MOStruct
function makeStruct(def) {
  if (typeof def !== 'object' || Object.keys(def).length == 0) {
    return def;
  }
  const name = Object.keys(def)[0];
  const values = def[name];

  const structure = MOStruct.structureWithName_memberNames_runtime(name, Object.keys(values), Mocha.sharedRuntime());

  Object.keys(values).map(member => {
    structure[member] = makeStruct(values[member]);
  });

  return structure;
}

function make_objc_super(self, cls) {
  return makeStruct({
    objc_super: {
      receiver: self,
      super_class: cls
    }
  });
}

// Due to particularities of the JS bridge, we can't call into MOBridgeSupport objects directly
// But, we can ask key value coding to do the dirty work for us ;)
function setKeys(o, d) {
  const funcDict = NSMutableDictionary.dictionary();
  funcDict.o = o;
  Object.keys(d).map(k => funcDict.setValue_forKeyPath(d[k], "o." + k));
}

// Use any C function, not just ones with BridgeSupport
function CFunc(name, args, retVal) {
  function makeArgument(a) {
    if (!a) return null;
    const arg = MOBridgeSupportArgument.alloc().init();
    setKeys(arg, {
      type64: a.type
    });
    return arg;
  }
  const func = MOBridgeSupportFunction.alloc().init();
  setKeys(func, {
    name: name,
    arguments: args.map(makeArgument),
    returnValue: makeArgument(retVal)
  });
  return func;
}

/*
@encode(char*) = "*"
@encode(id) = "@"
@encode(Class) = "#"
@encode(void*) = "^v"
@encode(CGRect) = "{CGRect={CGPoint=dd}{CGSize=dd}}"
@encode(SEL) = ":"
*/

function addStructToBridgeSupport(key, structDef) {
  // OK, so this is probably the nastiest hack in this file.
  // We go modify MOBridgeSupportController behind its back and use kvc to add our own definition
  // There isn't another API for this though. So the only other way would be to make a real bridgesupport file.
  const symbols = MOBridgeSupportController.sharedController().valueForKey('symbols');
  if (!symbols) throw Error("Something has changed within bridge support so we can't add our definitions");
  // If someone already added this definition, don't re-register it.
  if (symbols[key] !== null) return;
  const def = MOBridgeSupportStruct.alloc().init();
  setKeys(def, {
    name: key,
    type: structDef.type
  });
  symbols[key] = def;
};

// This assumes the ivar is an object type. Return value is pretty useless.
const object_getInstanceVariable = exports.object_getInstanceVariable = CFunc("object_getInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "^@" }], { type: "^{objc_ivar=}" });
// Again, ivar is of object type
const object_setInstanceVariable = exports.object_setInstanceVariable = CFunc("object_setInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "@" }], { type: "^{objc_ivar=}" });

// We need Mocha to understand what an objc_super is so we can use it as a function argument
addStructToBridgeSupport('objc_super', { type: objc_super_typeEncoding });

/***/ }),

/***/ "./node_modules/promise-polyfill/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/promise-polyfill/lib/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setTimeout, setImmediate) {

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

module.exports = Promise;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/timers/timeout.js */ "./node_modules/@skpm/timers/timeout.js")["setTimeout"], __webpack_require__(/*! ./node_modules/@skpm/timers/immediate.js */ "./node_modules/@skpm/timers/immediate.js")["setImmediate"]))

/***/ }),

/***/ "./src/plugin.js":
/*!***********************!*\
  !*** ./src/plugin.js ***!
  \***********************/
/*! exports provided: showSettings, renameExport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showSettings", function() { return showSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renameExport", function() { return renameExport; });
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _skpm_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @skpm/dialog */ "./node_modules/@skpm/dialog/lib/index.js");
/* harmony import */ var _skpm_dialog__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_skpm_dialog__WEBPACK_IMPORTED_MODULE_1__);


var defaultPrefix = "icon-";
function showSettings() {
  log("SHOWING OPTIONS");
  var userDefaults = NSUserDefaults.alloc().initWithSuiteName("com.sketchapp.plugins.svg-export-renamer.defaults");
  var response = _skpm_dialog__WEBPACK_IMPORTED_MODULE_1___default.a.showMessageBox({
    type: "info",
    title: "About SVG Export Renamer",
    message: "This plugin allows for renaming of SVG exports.",
    detail: "Artboard Name: Foo => foo.svg\nArtboard Name: Foo\\Bar => foo-bar.svg",
    checkboxLabel: "Use `icon-` prefix",
    buttons: ['Save', 'Reset'],
    checkboxChecked: userDefaults.objectForKey("useDefaultPrefix") != nil ? userDefaults.objectForKey("useDefaultPrefix") == 1 : true
  }, function (_ref) {
    var response = _ref.response,
        checkboxChecked = _ref.checkboxChecked;

    if (response == 0) {
      // Clicked Save
      userDefaults.setObject_forKey(checkboxChecked, "useDefaultPrefix");
    } else {
      // reset
      userDefaults.setObject_forKey(1, "useDefaultPrefix");
    }

    userDefaults.synchronize();
  });
}
;
function renameExport(context) {
  log("RUNNING EXPORT");
  var fileManager = NSFileManager.defaultManager();
  var userDefaults = NSUserDefaults.alloc().initWithSuiteName("com.sketchapp.plugins.svg-export-renamer.defaults");
  var useDefaultPrefix = userDefaults.objectForKey("useDefaultPrefix") != nil ? userDefaults.objectForKey("useDefaultPrefix") == 1 : true;
  var exports = context.actionContext.exports;
  var filesToRename = [];

  for (var i = 0; i < exports.length; i++) {
    var currentExport = exports[i];

    if (currentExport.request.format() == "svg") {
      filesToRename.push(currentExport);
    }
  }

  if (filesToRename.length > 0) {
    Promise.all(filesToRename.map(function (fileDict) {
      var artboardName = fileDict.request.name();
      var name = artboardName.toLowerCase();
      name = name.replace(/\s/g, "-");
      name = name.replace(/\&/g, "and");
      name = name.replace(/(?!-)([0-9]|\W|\_)/g, "");
      var nameArray = name.split("/");
      var categoryName = nameArray[0];
      var typeName = nameArray[nameArray.length - 1];
      var isDirectory = nameArray.length > 1;
      var exportName = "";

      if (nameArray.length === 1 || typeName === "default" || !!parseInt(typeName)) {
        exportName = useDefaultPrefix ? "".concat(defaultPrefix).concat(categoryName) : categoryName;
      } else {
        exportName = useDefaultPrefix ? "".concat(defaultPrefix).concat(categoryName, "-").concat(typeName) : "".concat(categoryName, "-").concat(typeName);
      }

      var newOutputPath = fileDict.path.replace(artboardName, exportName);
      var svgFile = NSString.stringWithContentsOfFile_encoding_error(fileDict.path, NSUTF8StringEncoding, "Error in reading icon");

      try {
        fileManager.removeItemAtPath_error(fileDict.path, "Error in deleting source icon");
      } catch (e) {
        return Promise.reject("Error in deleting source icon");
      }

      if (isDirectory) {
        var pathArray = fileDict.path.split("/");
        var directoryPath = pathArray.splice(0, pathArray.length - 1).join("/");
        var fileContents = fileManager.directoryContentsAtPath(directoryPath);

        if (fileContents.length === 0) {
          try {
            fileManager.removeItemAtPath_error(directoryPath, "There was an error in deleting the ".concat(typeName, " icon directory"));
          } catch (e) {
            return Promise.reject("There was an error in deleting the ".concat(typeName, " icon directory"));
          }
        }
      }

      try {
        return Promise.resolve(svgFile.writeToFile_atomically(newOutputPath, true));
      } catch (e) {
        return Promise.reject("There was an error in rewriting file to the ".concat(newOutputPath));
      }

      svgFile.writeToFile_atomically(newOutputPath, true);
    })).then(function () {
      log("All svgs were successfully renamed");
      sketch__WEBPACK_IMPORTED_MODULE_0___default.a.UI.message("All svgs were successfully renamed");
    }).catch(function (error) {
      log(error);
      sketch__WEBPACK_IMPORTED_MODULE_0___default.a.UI.message(error);
    });
  }
}
;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js")))

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['showSettings'] = __skpm_run.bind(this, 'showSettings');
that['renameExport'] = __skpm_run.bind(this, 'renameExport');
that['renameExport'] = __skpm_run.bind(this, 'renameExport');
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=plugin.js.map