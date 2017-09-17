'use strict';

const Log = {

  callback: null,

  initialize: function(callback) {
    Log.callback = callback;
  },

  event: function(eventScope, eventName, obj) {
    console.log(new Date() + ' [' + eventScope + '] [EVENT ' + eventName + ']', obj);
    Log.callback('[' + eventScope + ' ] [EVENT ' + eventName + ']')
  },

  info: function(eventScope, text, obj) {
    console.log(new Date() + ' [' + eventScope + '] [INFO] ' + text, obj);
    Log.callback('[' + eventScope + '] [INFO] ' + text)
  },

  error: function(eventScope, text, obj) {
    console.error(new Date() + ' [' + eventScope + '] [ERROR] ' + text, obj);
    Log.callback('[' + eventScope + '] [ERROR] ' + text)
  },

  warn: function(eventScope, text, obj) {
    console.warn(new Date() + ' [' + eventScope + '] [WARN] ' + text, obj);
    Log.callback('[' + eventScope + '] [WARN] ' + text)
  }
};
