var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://keithcao:323907907k@cluster0.sdbga.mongodb.net/WEB322?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
var userSchema = new Schema({
  "userName":  {"type": String, "unique" : true},
  "password": String,
  "email": String,
  "loginHistory": [
    {
        "dateTime": Date,
        "userAgent":String
    }
  ]
});

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://keithcao:323907907k@cluster0.sdbga.mongodb.net/WEB322?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Passwords do not match"); return;
        }
        bcrypt.genSalt(10) 
        .then(salt=>bcrypt.hash(userData.password,salt)) 
        .then(hash=>{
            userData.password = hash;
            let newUser = new User(userData);
            newUser.save()
            .then(()=>resolve())
            .catch((err) => {
                if(err.code == 11000) {
                    reject("User name already taken."); return;
                }
                else {
                    reject("There was an error creating the user: " + err); return;
                }
            });
        })
        .catch(err=>{
            reject("There was an error encrypting the password"); return; 
        });
        });

};

module.exports.checkUser = function(userData) {
    return new Promise((resolve, reject) => {
        User.find({userName: userData.userName}).exec()
        .then((user) => {
            if (user.length == 0) {
                reject("Unable to find user: " + userData.userName); return;
            }
            bcrypt.compare(userData.password, user[0].password).then((result) => {
                if (!result) {
                    reject("Incorrect Password for user: " + userData.userName); return;
                }
            });
            user[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
            User.updateOne(
                {userName : userData.userName},
                {$set: {loginHistory: user[0].loginHistory}}
            ).exec()
            .then(() => resolve(user))
            .catch((err) => reject("There was an error verifying the user: " + err));
        })
        .catch(() => reject("Unable to find user: " + userData.userName));
    });
};