'use strict';

var Client = require('chat-client')
  , classes = require('classes')
  , conversationTemplate = require('./conversation-template')
  , client
;

function connect() {
  classes(client.el).remove('chat-disconnected');
}

function disconnect() {
  classes(client.el).add('chat-disconnected');
}

function reconnect() {
  classes(client.el).add('chat-reconnecting');
}

function reconnect_failed() {
  classes(client.el).remove('chat-reconnecting');
  disconnect();
}

function createConversation(conversation) {
  var el = conversation.el = document.createElement('div')
  ;

  classes(el).add('chat-conversation');

  el.innerHTML = conversationTemplate;

  client.el.appendChild(el);
}

function removeConversation(conversation) {
  conversation.el.parentNode.removeChild(conversation.el);
}

function setup(host) {
  
  if (client) {
    return;
  }

  client = new Client(host);

  client.el = document.createElement('div');
  classes(client.el).add('chat-client');

  client.socket.io
    .on('reconnect', reconnect)
    .on('reconnect_failed', reconnect_failed)
  ;

  client.socket
    .on('connect', connect)
    .on('disconnect', disconnect)
  ;

  client
    .on('conversation-created', createConversation)
    .on('conversation-removed', removeConversation)
  ;

}
