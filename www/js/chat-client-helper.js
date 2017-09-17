'use strict';

const ChatClientHelper = {
  host: null,
  log: null,
  client: null,
  accessManager: null,

  initialize: function(tokenAndConfigurationProviderHost, log) {
    ChatClientHelper.host = tokenAndConfigurationProviderHost;
    ChatClientHelper.log = log;
    ChatClientHelper.client = null;
    ChatClientHelper.accessManager = null;
  },

  login: function(identity, pushChannel, registerForPushCallback, showPushCallback) {
    return ChatClientHelper.getToken(identity, pushChannel)
      .then(function(token) {
        ChatClientHelper.log.info('ChatClientHelper', 'got chat token', token);
        return TwilioChat.Client.create(token, { 'logLevel': 'info' }).then(function(chatClient) {
          ChatClientHelper.client = chatClient;
          ChatClientHelper.accessManager = new TwilioCommon.AccessManager(token);
          ChatClientHelper.accessManager.on('tokenUpdated', function(am) {
            return ChatClientHelper.client.updateToken(am.token);
          });
          ChatClientHelper.accessManager.on('tokenExpired', function() {
            return ChatClientHelper.getToken(identity, pushChannel)
              .then(function(newData) {
                  return ChatClientHelper.accessManager.updateToken(newData)
                }
              )
          });
          ChatClientHelper.client.on('pushNotification', function(obj) {
            if (obj && showPushCallback) {
              showPushCallback(ChatClientHelper.log, obj);
            }
          });
          ChatClientHelper.subscribeToAllAccessManagerEvents();
          ChatClientHelper.subscribeToAllChatClientEvents();
          if (registerForPushCallback) {
            registerForPushCallback(ChatClientHelper.log, ChatClientHelper.client);
          }
        });
      })
      .catch(function(err) {
        ChatClientHelper.log.error('login', 'can\'t get token', err);
      })
  },

  getToken: function(identity, pushChannel) {
    if (!pushChannel) {
      pushChannel = 'none';
    }
    return fetch(ChatClientHelper.host + '/token?identity=' + identity + '&pushChannel=' + pushChannel)
      .then(function(response) {
        return response.text();
      });
  },

  subscribeToAllAccessManagerEvents: function() {
    ChatClientHelper.accessManager.on('tokenUpdated', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.accessManager', 'tokenUpdated', obj)
      }
    );
    ChatClientHelper.accessManager.on('tokenExpired', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.accessManager', 'tokenExpired', obj)
      }
    );
  },

  subscribeToAllChatClientEvents: function() {
    ChatClientHelper.client.on('userSubscribed', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'userSubscribed', obj)
      }
    );
    ChatClientHelper.client.on('userUpdated', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'userUpdated', obj)
      }
    );
    ChatClientHelper.client.on('userUnsubscribed', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'userUnsubscribed', obj)
      }
    );
    ChatClientHelper.client.on('channelAdded', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'channelAdded', obj)
      }
    );
    ChatClientHelper.client.on('channelRemoved', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'channelRemoved', obj)
      }
    );
    ChatClientHelper.client.on('channelInvited', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'channelInvited', obj)
      }
    );
    ChatClientHelper.client.on('channelJoined', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'channelJoined', obj)
      }
    );
    ChatClientHelper.client.on('channelLeft', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'channelLeft', obj)
      }
    );
    ChatClientHelper.client.on('channelUpdated', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'channelUpdated', obj)
      }
    );
    ChatClientHelper.client.on('memberJoined', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'memberJoined', obj)
      }
    );
    ChatClientHelper.client.on('memberLeft', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'memberLeft', obj)
      }
    );
    ChatClientHelper.client.on('memberUpdated', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'memberUpdated', obj)
      }
    );
    ChatClientHelper.client.on('messageAdded', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'messageAdded', obj)
      }
    );
    ChatClientHelper.client.on('messageUpdated', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'messageUpdated', obj)
      }
    );
    ChatClientHelper.client.on('messageRemoved', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'messageRemoved', obj)
      }
    );
    ChatClientHelper.client.on('typingStarted', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'typingStarted', obj)
      }
    );
    ChatClientHelper.client.on('typingEnded', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'typingEnded', obj)
      }
    );
    ChatClientHelper.client.on('connectionStateChanged', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'connectionStateChanged', obj)
      }
    );
    ChatClientHelper.client.on('pushNotification', function(obj) {
        ChatClientHelper.log.event('ChatClientHelper.client', 'onPushNotification', obj)
      }
    );
  },

  handlePushNotification: function(data) {
    if (ChatClientHelper.client !== null) {
      ChatClientHelper.client.handlePushNotification(data);
      return null;
    } else {
      return TwilioChat.Client.parsePushNotification(data);
    }
  }

};
