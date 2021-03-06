//var form_body_page = 
'use strict';
const log = console.log;

//const express = require('express')
//const bodyParser = require('body-parser')
//const { ObjectID } = require('mongodb')

// Mongoose
//const { mongoose } = require('./db/mongoose');
//const { User } = require('./models/user')

// Express
//const port = process.env.PORT || 3000
//const app = express();
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());


//Script for loggin in and registering users
const Users = []
let numberOfUsers = 0; // total number of Users

class user {
	constructor(username, phone, password) {
		this.username = username;
		this.phone = phone;
		this.password = password;
		numberOfUsers++;
	}   
}


//Push users from database for Phase2
Users.push(new user('admin', '647-801-2022', 'admin'));
Users.push(new user('user', '647-801-4618', 'user'));
Users.push(new user('user2', '647-801-4619', 'user2'));

           
           
if (document.querySelector('.form_body_login')!=null){
    document.querySelector('.form_body_login').addEventListener('submit', login_page);
}

//if (document.querySelector('.form_body_register')!=null){
//    document.querySelector('.form_body_register').addEventListener('submit', registration_page);
//}


function login_page(e) {
    var flag_bool = false;
    e.preventDefault();
    let username_input = document.querySelector('.form_username').value;
    let password_input = document.querySelector('.form_password').value;
    
    if (username_input === "admin" && password_input === "admin"){
        flag_bool = true;
         window.open('logged_admin.html',"_self")  
    }
    
    // Check if login credentials match any of the user in our Users array.
    for (var i = 1; i < Users.length; i++){
 
        if ((Users[i].username) == username_input && (Users[i].password) == password_input){
              window.open('main_page.html',"_self") 
              flag_bool = true;
        }
        
    }
    
    if (i >= Users.length && flag_bool === false)
    {
            window.alert("Please enter correct username and password")
    }

}

function registration_page(e) {
    
    //Save these values to database for Phase 2
    e.preventDefault();
    let username_input = document.querySelector('.form_username').value;
    let email_input = document.querySelector('.form_email').value;
    let first_name = document.querySelector('.form_firstname').value;
    let last_name = document.querySelector('.form_lastname').value;
    let phone_input = document.querySelector('.form_phone').value;
    let password_input = document.querySelector('.form_password').value;
    let password_input_repeat = document.querySelector('.form_password_repeat').value;
    
    if(username_input == "admin")
    {
        alert("You can't register as admin");
    }
    else if(password_input === password_input_repeat)
    {
        window.open('logged.html',"_self");
    }
    else
    {
        window.alert("Please make sure the passowrds match");
    }
}


