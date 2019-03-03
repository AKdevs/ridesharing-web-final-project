//var form_body_page = 

const Users = []
let numberOfUsers = 0; // total number of Users

class user {
	constructor(email, phone, password) {
		this.email = email;
		this.phone = phone;
		this.password = password;
		numberOfUsers++;
	}   
}

Users.push(new user('kartikay@gmail.com', '647-801-4618', 'kartikay'));
Users.push(new user('parth@gmail.com', '647-801-4619', 'parth'));
Users.push(new user('atharva@gmail.com', '647-801-2022', 'atharva'));
Users.push(new user('imran@gmail.com', '647-801-2992', 'imran'));
           
           
if (document.querySelector('.form_body_login')!=null){
    document.querySelector('.form_body_login').addEventListener('submit', login_page);
}

if (document.querySelector('.form_body_register')!=null){
    document.querySelector('.form_body_register').addEventListener('submit', registration_page);
}


function login_page(e) {
    e.preventDefault();
    let email_input = document.querySelector('.form_email').value;
    console.log(email_input);
    let password_input = document.querySelector('.form_password').value;
    console.log(password_input);
    
    for (let i = 0; i < Users.length; i++){
        if ((Users[i].email) == email_input && (Users[i].password) == password_input){
            window.open('logged.html',"_self")       
        }
    }
    if (i == Users.length)
    {
        alert("Please enter correct username and password")
    }
}

function registration_page(e) {
    e.preventDefault();
    let email_input = document.querySelector('.form_email').value;
    console.log(email_input);
    let phone_input = document.querySelector('.form_phone').value;
    console.log(phone_input);
    let password_input = document.querySelector('.form_password').value;
    console.log(password_input);
    let password_input_repeat = document.querySelector('.form_password_repeat').value;
    console.log(password_input_repeat);
    if(password_input === password_input_repeat)
    {
        Users.push(new user(email_input, phone_input, password_input));
        console.log("Reach here")
        //window.open('logged.html',"_self")
    }
    else
    {
        alert("Please make sure the passowrds match")
    }
}


