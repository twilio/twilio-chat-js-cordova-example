'use strict';

const Log = {

  callback: null,

  initialize: function(callback) {
    Log.callback = callback;
  },

  onlyDefined: function(obj) {
    if (typeof obj !== 'undefined') {
      return JSON.stringify(obj);
    } else {
      return '';
    }
  },

  event: function(eventScope, eventName, obj) {
    console.log('[' + eventScope + '] [EVENT ' + eventName + ']', Log.onlyDefined(obj));
    Log.callback(new Date().toISOString() + ' [' + eventScope + '] [EVENT ' + eventName + '] ' + Log.onlyDefined(obj))
  },

  info: function(eventScope, text, obj) {
    console.log('[' + eventScope + '] [INFO] ' + text, Log.onlyDefined(obj));
    Log.callback(new Date().toISOString() + ' [' + eventScope + '] [INFO] ' + text + ' ' + Log.onlyDefined(obj))
  },

  error: function(eventScope, text, obj) {
    console.error('[' + eventScope + '] [ERROR] ' + text, Log.onlyDefined(obj));
    Log.callback(new Date().toISOString() + ' [' + eventScope + '] [ERROR] ' + text + ' ' + Log.onlyDefined(obj))
  },

  warn: function(eventScope, text, obj) {
    console.warn('[' + eventScope + '] [WARN] ' + text, Log.onlyDefined(obj));
    Log.callback(new Date().toISOString() + ' [' + eventScope + '] [WARN] ' + text + ' ' + Log.onlyDefined(obj))
  }
};
