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




var training_data = [];training_data.push({"class":"greeting", "sentence":"how are you"})
training_data.push({"class":"greeting", "sentence":"how is your day"})
training_data.push({"class":"greeting", "sentence":"good day"})
training_data.push({"class":"greeting", "sentence":"how is it going today"})
training_data.push({"class":"greeting", "sentence":"hello"})
training_data.push({"class":"greeting", "sentence":"hi"})
training_data.push({"class":"greeting", "sentence":"is anyone there"})
training_data.push({"class":"greeting", "sentence":"good morning"})
training_data.push({"class":"greeting", "sentence":"good afternoon"})
training_data.push({"class":"greeting", "sentence":"good evenening"})

training_data.push({"class":" Chào hỏi ", "sentence":"Alo"})
training_data.push({"class":" Chào hỏi ", "sentence":"Ê"})
training_data.push({"class":" Chào hỏi ", "sentence":"Ad ơi"})
training_data.push({"class":" Chào hỏi ", "sentence":"Admin ơi"})
training_data.push({"class":" Chào hỏi ", "sentence":"Thầy ơi"})
training_data.push({"class":" Chào hỏi ", "sentence":"Anh ơi"})
training_data.push({"class":" Chào hỏi ", "sentence":"Chị ơi"})
training_data.push({"class":" Chào hỏi ", "sentence":"hello"})
training_data.push({"class":" Chào hỏi ", "sentence":"Hi"})
training_data.push({"class":" Chào hỏi ", "sentence":"nè nè"})


training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"cần bao nhiêu điểm tiếng anh?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"chuẩn tiếng anh đầu vào là bao nhiêu?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"mấy điểm TOEFL hay IELTS là vào được?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"đạt mấy điểm anh văn là qua?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"cần bao nhiêu điểm tiếng anh?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"Tiếng anh đầu vào là gì?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"Chuẩn tiếng anh đầu vào là mấy?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"Tiếng anh cần bao nhiêu?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"English đầu vào là sao ạ?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"Mấy điểm tiếng anh đầu vào ạ?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"Có cần học TOEFL hay IELTs không ạ?"})
training_data.push({"class":"Chuẩn tiếng anh đầu vào", "sentence":"Tiếng anh cần bao nhiêu để vào học chương trình ạ?"})


training_data.push({"class":"ENGLISH STANDARD", "sentence":"English requirements "})
training_data.push({"class":"ENGLISH STANDARD", "sentence":"IELTS certificate to be get out"})
training_data.push({"class":"ENGLISH STANDARD", "sentence":"TOEFL certificate to be get out"})
training_data.push({"class":"ENGLISH STANDARD", "sentence":"What is needed for English? "})
training_data.push({"class":"ENGLISH STANDARD", "sentence":"English score that I must pass to be enter the program"})

training_data.push({"class":"curriculum structure", "sentence":"curriculum structure "})
training_data.push({"class":"curriculum structure", "sentence":"contents of the program "})
training_data.push({"class":"curriculum structure", "sentence":"what is the contents for the program? "})
training_data.push({"class":"curriculum structure", "sentence":"what will i learn in the program? "})

training_data.push({"class":"Cấu trúc chương trình", "sentence":"Nội dung đào tạo là gì?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Cho em hỏi cấu trúc chương trình là gì ạ?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Chương trình đào tạo những kĩ năng gì ạ?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Em sẽ được học gì trong chương trình ạ?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Hệ đào tạo của mình sẽ như thế nào ạ?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Chương trình đào tạo của mình như thế nào?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Cấu trúc chương trình của mình ra sao ạ?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Cho hỏi về cấu trúc chương trình của mình sao ạ?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Hệ mình đào tạo ra sao ạ?"})
training_data.push({"class":"Cấu trúc chương trình", "sentence":"Em sẽ được đào tạo gì trong chương trình ạ?"})


training_data.push({"class":"FACILITIES", "sentence":"Tell me about the facilities in the center "})
training_data.push({"class":"FACILITIES", "sentence":"Is the center better than other program "})
training_data.push({"class":"FACILITIES", "sentence":"Compare the facilities with other center or program "})

training_data.push({"class":"cơ sở vật chất", "sentence":"cơ sở vật chất như thế nào"})
training_data.push({"class":"cơ sở vật chất", "sentence":"điều kiện học tập trung tâm"})
training_data.push({"class":"cơ sở vật chất", "sentence":"Học trung tâm khác như thế nào với chương trình thường"})
training_data.push({"class":"cơ sở vật chất", "sentence":"So sánh điều kiện trung tâm với chương trình khác"})

// training_data.push({"class":"sandwich", "sentence":"make me a sandwich"})
// training_data.push({"class":"sandwich", "sentence":"I wish I have something to eat"})
// training_data.push({"class":"sandwich", "sentence":"how much does a sandwich cost"})
// training_data.push({"class":"sandwich", "sentence":"I am hungry, is there anything to eat"})
// training_data.push({"class":"sandwich", "sentence":"can you make a sandwich?"})
// training_data.push({"class":"sandwich", "sentence":"having a sandwich today?"})
// training_data.push({"class":"sandwich", "sentence":"what's for lunch?"})
// training_data.push({"class":"sandwich", "sentence":"I want a sandwich"})

// training_data.push({"class":"PROGRAM LEARNING OUTCOMES", "sentence":"what will student receive after studying at this university?"})
// training_data.push({"class":"PROGRAM LEARNING OUTCOMES", "sentence":"what will student achieve?"})
// training_data.push({"class":"PROGRAM LEARNING OUTCOMES", "sentence":"benefits when study at this center"})
// training_data.push({"class":"PROGRAM LEARNING OUTCOMES", "sentence":"advantages of studying this program"})
// training_data.push({"class":"PROGRAM LEARNING OUTCOMES", "sentence":"what will graduates achieve?"})
// training_data.push({"class":"PROGRAM LEARNING OUTCOMES", "sentence":"what is the learning outcomes?"})

training_data.push({"class":"TUITION FEE", "sentence":"tuition fee"})
training_data.push({"class":"TUITION FEE", "sentence":"how about the tuition fee for 1 year of studying"})
training_data.push({"class":"TUITION FEE", "sentence":"what is the tuition fee"})
training_data.push({"class":"TUITION FEE", "sentence":"How much I have to pay for 1 semester?"})
training_data.push({"class":"TUITION FEE", "sentence":"the annual tuition fee"})
training_data.push({"class":"TUITION FEE", "sentence":"the money require for a year"})
training_data.push({"class":"TUITION FEE", "sentence":"1 semester cost"})

training_data.push({"class":" Học phí ", "sentence":"Học phí bên mình là bao nhiêu?"})
training_data.push({"class":" Học phí ", "sentence":"Học phí tại trung tâm xuất sắc là bao nhiêu?"})
training_data.push({"class":" Học phí ", "sentence":"Tiền học tại trung tâm là mấy?"})
training_data.push({"class":" Học phí ", "sentence":"Học phí du học là sao?"})
training_data.push({"class":" Học phí ", "sentence":"Học phí bên mình là bao nhiêu?"})
training_data.push({"class":" Học phí ", "sentence":"Một năm học phí là mấy ạ?"})

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
    var response_sentence;
	switch (highClass) {
    case "greeting":
        response_sentence = "this is COE chatbot, may I help you?";
        break;
     case " Chào hỏi ":
        response_sentence = "chào bạn, mình là chatbot COE, bạn muốn biết gì về tuyển sinh COE( yêu cầu đầu vào, yêu cầu xét tốt nghiệp, chuẩn tiếng anh, cấu trúc chương trình, cơ sở vật chất, học phí thường niên ...)";
        break;

    case "Chuẩn tiếng anh đầu vào":
        response_sentence = "Sau năm thứ nhất sinh viên được yêu cầu đạt chứng chỉ tiếng Anh TOEFL iBT 52 trở lên hoặc các chứng chỉ tiếng Anh tương đương. Về ngoại ngữ đầu ra phải đạt năng lực từ bậc 4 trở lên theo thang năng lực ngoại ngữ 6 bậc của Việt Nam, hoặc đạt chứng chỉ tiếng Anh quốc tế tương đương là TOEFL iBT 71, TOEFL PBT 530, IELTS 6.0.";
        break;
    case "ENGLISH STANDARD":
        response_sentence = "After the first year students are required to take the TOEFL iBT 52 or above certificate or equivalent English certificate. The curriculum is designed on a roadmap to help students improve their English proficiency. In foreign languages, they must have ability of level 4 or higher in accordance with the level of foreign language ability of Vietnam, or equivalent international certificate of TOEFL iBT 71, TOEFL PBT 530, IELTS 6.0.";
        break;

    case "curriculum structure":
        response_sentence = "1. Compulsory mathematics and basic sciences. 2. General education, soft skills. 3. Compulsory disciplines. 4. Optional specialty design. 5. Compulsory basic disciplines. 6. Compulsory disciplines. support freedom";
        break;
     case "Cấu trúc chương trình":
        response_sentence = "Cấu trúc chương trình 1. Toán và khoa học cơ bản bắt buộc 2.Giáo dục đại cương,kỹ năng mềm 	3.Kiến thức chuyên ngành bắt buộc 	4.Thiết kế chuyên ngành tự chọn 	5.Kiến thức cơ sở ngành bắt buộc 	6.Kiến thức bổ trợ tự do";
        break;

    case "FACILITIES":
        response_sentence = "Labs: Many basic and specialized labs - General Electronics Lab, Microelectronics Fluke - Intel Computer Room and Cadence Chip Design - Tektronix Measurement Laboratory - Texas Instrument Integrated Circuit and Instrumentation Laboratory and Research - Laboratory, research and development of intelligent robot technology - Laboratory of 3G and 4G National Instrument, R & S, AWR Library: - Academic and reference books in English for the entire curriculum - The Resource Center of DHDN (http://www.lirc.udn.vn/) Open Educational Resources in the world - Source of online magazine IEEE Xplorer (http://ieeexplore.ieee.org/) Internet: - High-speed fiber optic transmission line, wifi covering the entire learning area - Website: Provides information on teaching schedules, curriculum, news, job information";
        break;
    case "cơ sở vật chất":
        response_sentence = "Phòng Lab: Nhiều phòng Lab cơ bản và chuyên ngành hiện đại – Phòng thí nghiệm điện tử đại cương, vi điện tử Fluke – Phòng máy tính Intel và Thiết kế chip Cadence – Phòng thí nghiệm đo lường Tektronix – Phòng thí nghiệm và nghiên cứu mạch tích hợp và hệ thống nhúng Texas Instrument – Phòng thí nghiệm, nghiên cứu & phát triển kỹ thuật Robot thông minh – Phòng thí nghiệm hệ thống viễn thông 3G và 4G National Instrument, R&S, AWR Thư viện: – Sách học và sách tham khảo chuyên ngành bằng tiếng Anh cho toàn bộ chương trình đào tạo – Trung tâm Thông Tin Tư Liệu của ĐHĐN (http://www.lirc.udn.vn/‎) – Nguồn học liệu mở Open Educational Resources trên thế giới – Nguồn tạp chí online chuyên ngành IEEE Xplorer (http://ieeexplore.ieee.org/) Mạng Internet: – Đường truyền cáp quang tốc độ cao, wifi phủ sóng toàn bộ khu vực học tập – Website: cung cấp thông tin về lịch giảng dạy, chương trình học, tin tức mới, thông tin việc làm, học bổng, tài liệu học tập, giáo trình, sách điện tử.";
        break;


    case "TUITION FEE":
        response_sentence = "Tuition fee: VND 10 million / student / semester. Each school year has 3 semesters. Students pay tuition fees by semester;";
        break;
    case " Học phí ":
        response_sentence = "Học phí: 10 triệu đồng/sinh viên/ 1 học kỳ. Mỗi năm học có 3 học kỳ. Sinh viên đóng học phí theo học kỳ;";
        break;

    default:
    	 response_sentence = "Tính năng này sẽ được cập nhật sớm hơn. Bạn có thể hỏi các câu hỏi khác về tuyển sinh ( yêu cầu đầu vào, yêu cầu xét tốt nghiệp, chuẩn tiếng anh, cấu trúc chương trình, cơ sở vật chất, học bổng khuyến khích học tập,  học phí thường niên ...)";
}
	// console.log("sentence:",sentence)
	// console.log("class:", highClass);
	// console.log("score:", highscore, "\n");
    return (response_sentence);
}


// classify("who are you")
//
// classify("make me some lunch");
//
// classify("I am fucking hungry")
//
// classify("What will I receive at the university if I choose this program")
