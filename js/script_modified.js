//var form_body_page = 

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


Users.push(new user('admin', '647-801-2022', 'admin'));
Users.push(new user('user', '647-801-4618', 'user'));
Users.push(new user('user2', '647-801-4619', 'user2'));

           
           
if (document.querySelector('.form_body_login')!=null){
    document.querySelector('.form_body_login').addEventListener('submit', login_page);
}

if (document.querySelector('.form_body_register')!=null){
    document.querySelector('.form_body_register').addEventListener('submit', registration_page);
}


function login_page(e) {
    var flag_bool = false;
    e.preventDefault();
    let email_input = document.querySelector('.form_email').value;
    let password_input = document.querySelector('.form_password').value;
    
    if (email_input === "admin" && password_input === "admin"){
        flag_bool = true;
         window.open('logged_admin.html',"_self")  
    }
    
    for (var i = 1; i < Users.length; i++){
 
        if ((Users[i].username) == email_input && (Users[i].password) == password_input){
              window.open('main_page.html',"_self") 
              flag_bool = true;
        }
        
    }
    
    if (i >= Users.length && flag_bool === false)
    {
            alert("Please enter correct username and password")
    }

}

function registration_page(e) {
    e.preventDefault();
    let username_input = document.querySelector('.form_username').value;
    let email_input = document.querySelector('.form_email').value;
    
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
        alert("Please make sure the passowrds match");
    }
}


