const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

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

app.listen(app.get('port'), function(){
    console.log('running on port', app.get('port'));
})
