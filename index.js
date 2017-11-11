const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const crypto = require('crypto');
const fetch = require('node-fetch');

//const access = EAAFM8bGZAZA0wBAHhYIyfgAb2ZBLlBNvdnrNkiSldZAis3Ung67RZBr4leQ99ZB6XPFliyn78FTYQbMu9BHZCtogL4oWHFqmX5gTwtKC5HlTdrOspsw7oTqGmTSGZA1sJcBSk7FPpVX18fg37NNaaBdjojY8C3xsWqTK3yysM6pxd6vM9qp58cHT;
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/', function(req,res){
    res.send("hello");
})

app.get('/webhook/', function(req,res){
    if(req.query['hub.verify_token']===
    'my_voice_is_my_password_verify_me'){
        res.send(req.query['hub.challenge'])
    }
    res.send('no entry');
})

app.post('/webhook/', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAREebZAGfwUBAE6Fdk92NwkEQyv1H7U6ICLQFjlMkAuOk0rzbZCxx5ZA8QbtqxZBFWMZBb1qUtcUGrSY9aXrHNjriTbndueePIZB9t13jYMKukZC00DC1t9PBbjywDQcxcDiAwYgUpZBdGf6JpxnJwm2skCxmumsTLaUj8kTQYjqhmZCxSvZB2uKZB' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}


app.listen(app.get('port'), function(){
    console.log('running on port', app.get('port'));
})
