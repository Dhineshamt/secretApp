//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const encrypt = require('mongoose-encryption');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true, useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, (err, foundUser) => {
        if(err) {
            console.log(err);
        }
        else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }     
    })
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    user.save((err) => {
        if(err)
            console.log(err);
        else
            console.log("Data saved");         
    });
    res.render('secrets');
})

app.listen(3000, () => {
    console.log('Server is running in port: 3000');
});