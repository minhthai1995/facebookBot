var express = require("express");
var app = express();
var stemmer = require('stemmer');
app.listen(3000);

app.get("/", function(req,res){
	res.send("Hello")
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
}


classify("who are you")

classify("make me some lunch");

classify("I am fucking hungry")

classify("What will I receive at the university if I choose this program")
