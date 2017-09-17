'use strict';

var app = {
  registeredPushChannel: 'none',

  // Application Constructor
  initialize: function() {
    this.bindEvents();
    var loginElement = document.getElementById('login');
    loginElement.setAttribute('style', 'display:none');
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady);
  },

  onDeviceReady: function() {
    Log.initialize(app.displayLogLine);
    Log.event('app', 'deviceready');
    var loginElement = document.getElementById('login');
    loginElement.setAttribute('style', 'display:block');
  },

  processLogin: function() {
    var username = document.getElementById('username').value;
    var tokenProviderHost = document.getElementById('tokenProviderHost').value;
    var pushChannel = document.getElementById('pushChannel').value;
    if (username && tokenProviderHost) {
      var loginElement = document.getElementById('login');
      loginElement.setAttribute('style', 'display:none');

      var logElement = document.getElementById('log');
      logElement.setAttribute('style', 'display:block;');

      app.initializeChatClient(username, tokenProviderHost, pushChannel);
    } else {
      alert('Please provide username and token provider host');
    }
  },

  displayLogLine: function(logLine) {
    var logElement = document.getElementById('log');
    logElement.prepend(document.createElement('br'));
    logElement.prepend(document.createTextNode(logLine));
  },

  initializeChatClient: function(identity, host, pushChannel) {
    ChatClientHelper.initialize(host, Log);
    if (pushChannel === 'none') {
      return ChatClientHelper.login(identity);
    } else {
      app.registeredPushChannel = pushChannel;
      return ChatClientHelper.login(identity, pushChannel, app.registerForPushCallback, app.showPushCallback);
    }
  },


  registerForPushCallback: function(log, client) {
    log.info('app.registerForPushCallback', 'calling push init');
    var push = PushNotification.init({
      'android': {
        'senderID': '797205716702'
      },
      'ios': {
        'sound': true,
        'vibration': true,
        'badge': true
      }
    });

    push.on('registration', function(data) {
      log.info('app.registerForPushCallback', 'got device token', data.registrationId);
      var oldRegId = localStorage.getItem('registrationId');
      if (oldRegId !== data.registrationId) {
        // Save new registration ID
        localStorage.setItem('registrationId', data.registrationId);
        // Post registrationId to your app server as the value has changed
      }
      log.info('app.registerForPushCallback', 'setting push registration id', data.registrationId);
      client.setPushRegistrationId(app.registeredPushChannel, data.registrationId);
    });

    push.on('error', function(e) {
      log.error('app.registerForPushCallback', 'push error', e.message);
    });


    push.on('notification', function(data) {
      log.info('app.notification', 'new push', JSON.stringify(data));
      var result = null;
      var rawData = null;
      if (app.registeredPushChannel !== 'none') {
        if (app.registeredPushChannel === 'fcm') {
          rawData = PhoneGapPushReParser.getRawPushForFCM(data);
        } else if (app.registeredPushChannel === 'apn') {
          rawData = PhoneGapPushReParser.getRawPushForAPN(data);
        }
        log.info('app.notification', 're-parsed raw push', JSON.stringify(rawData));
        result = ChatClientHelper.handlePushNotification(rawData);
      }
      if (result !== null) {
        app.showPushCallback(result);
      }
    });
  },

  showPushCallback: function(log, push) {
    log.info('app.showPushCallback', 'parsed push', push);
    alert(push.body);
  }
};
