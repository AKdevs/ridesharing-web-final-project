const new_var = document.querySelectorAll('.deleteUser');
console.log(new_var);
var i;
for (i=0; i<new_var.length; i++)
{ new_var[i].addEventListener('click',delUser); }

function delUser(e) {
	e.target.parentElement.parentElement.remove();
}