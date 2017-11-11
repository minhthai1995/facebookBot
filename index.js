const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const crypto = require('crypto');
const fetch = require('node-fetch');
var stemmer = require('stemmer');

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
  var myMessage = classify(messageText);
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: myMessage
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




var training_data = [];
training_data.push({"class":"greeting", "sentence":"how are you"})
training_data.push({"class":"greeting", "sentence":"how is your day"})
training_data.push({"class":"greeting", "sentence":"good day"})
training_data.push({"class":"greeting", "sentence":"how is it going today"})
training_data.push({"class":"greeting", "sentence":"hello"})
training_data.push({"class":"greeting", "sentence":"hi"})
training_data.push({"class":"greeting", "sentence":"is anyone there"})
training_data.push({"class":"greeting", "sentence":"good morning"})
training_data.push({"class":"greeting", "sentence":"good afternoon"})
training_data.push({"class":"greeting", "sentence":"good evenening"})

training_data.push({"class":"sandwich", "sentence":"make me a sandwich"})
training_data.push({"class":"sandwich", "sentence":"I wish I have something to eat"})
training_data.push({"class":"sandwich", "sentence":"how much does a sandwich cost"})
training_data.push({"class":"sandwich", "sentence":"I am hungry, is there anything to eat"})
training_data.push({"class":"sandwich", "sentence":"can you make a sandwich?"})
training_data.push({"class":"sandwich", "sentence":"having a sandwich today?"})
training_data.push({"class":"sandwich", "sentence":"what's for lunch?"})
training_data.push({"class":"sandwich", "sentence":"I want a sandwich"})

training_data.push({"class":"PROGRAM LEARNING OUTCOMES ", "sentence":"what will student receive after studying at this university?"})
training_data.push({"class":"PROGRAM LEARNING OUTCOMES ", "sentence":"what will student achieve?"})
training_data.push({"class":"PROGRAM LEARNING OUTCOMES ", "sentence":"benefits when study at this center"})
training_data.push({"class":"PROGRAM LEARNING OUTCOMES ", "sentence":"advantages of studying this program"})
training_data.push({"class":"PROGRAM LEARNING OUTCOMES ", "sentence":"what will graduates achieve"})
training_data.push({"class":"PROGRAM LEARNING OUTCOMES ", "sentence":"what is the learning outcomes"})

training_data.push({"class":"TUITION FEE", "sentence":"tuition fee"})
training_data.push({"class":"TUITION FEE", "sentence":"how about the tuition fee for 1 year of studying"})
training_data.push({"class":"TUITION FEE", "sentence":"what is the tuition fee"})
training_data.push({"class":"TUITION FEE", "sentence":"How much I have to pay for 1 semester"})
training_data.push({"class":"TUITION FEE", "sentence":"the annual tuition fee"})

var corpus_words = {}
var class_words = {}
var mySet = new Set();
for (var i = 0; i <training_data.length; i++){
	mySet.add(training_data[i].class)
}

mySet.forEach(function(current_value){
	class_words[current_value]=[];
})


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--)
       if (this[i] == obj)
       return true;
    return false;
}


for (var i = 0; i <training_data.length; i++){
	var sentence = training_data[i].sentence.split(" ");
	var word;
	for (word in sentence){
		var stemmed_word = stemmer(sentence[word])
		if (stemmed_word in corpus_words) {
			corpus_words[stemmed_word] += 1
		}
		else{
			corpus_words[stemmed_word] = 1
		}
		if (class_words[training_data[i].class].contains(stemmed_word) == false){
		class_words[training_data[i].class].push(stemmed_word);
		}
	}
}

function calculate_class_score_commonality(sentence, className){
	var score = 0;
	var mySentence = sentence.split(" ");
	var word;
	for (word in mySentence){
		var stemmed_word = stemmer(mySentence[word])
		if (class_words[className].contains(stemmed_word)){
			 score += (1 / corpus_words[stemmed_word])
		}
	}
	return score;
}

function classify(sentence){
	var highClass = "none";
    var highscore = 0;
    var score;
    mySet.forEach(function(current_value){
		score = calculate_class_score_commonality(sentence, current_value);
		if (score > highscore) {
			highClass = current_value;
			highscore = score;
		}
	})
	console.log("sentence:",sentence)
	console.log("class:", highClass);
	console.log("score:", highscore, "\n");
    return (highClass);
}


classify("who are you")

classify("make me some lunch");

classify("I am fucking hungry")

classify("What will I receive at the university if I choose this program")
