document.querySelector('.form_body_register').addEventListener('submit', registration_page);

function registration_page(e) {
    e.preventDefault();
    let email_input = document.querySelector('.form_email').value;
    console.log(email_input);
    let phone_input = document.querySelector('.form_phone').value;
    console.log(email_input);
    let password_input = document.querySelector('.form_password').value;
    console.log(password_input);
    let password_input_repeat = document.querySelector('.form_password_repeat').value;
    console.log(password_input_repeat);
    if(password_input === password_input_repeat)
    {
    window.open('logged.html',"_self")
    }
    else
    {
        alert("Please make sure the passowrds match")
    }
}
