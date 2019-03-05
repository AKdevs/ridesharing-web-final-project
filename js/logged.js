const firstnameelement = document.querySelector('#firstnameelement').getElementsByClassName('edit')[0];
firstnameelement.addEventListener('click', myFunctionedit)

const lastnamelement = document.querySelector('#lastnameelement').getElementsByClassName('edit')[0];
lastnamelement.addEventListener('click', myFunctionedit)

const passwordelement = document.querySelector('#passwordelement').getElementsByClassName('edit')[0];
passwordelement.addEventListener('click', myFunctionedit)

const emailelement = document.querySelector('#emailelement').getElementsByClassName('edit')[0];
emailelement.addEventListener('click', myFunctionedit)

const phoneelement = document.querySelector('#phoneelement').getElementsByClassName('edit')[0];
phoneelement.addEventListener('click', myFunctionedit)

function myFunctionedit(e) {
    
        e.target.parentElement.contentEditable = true;
    
        var newButton = document.createElement('button')
        newButton.className = "save";
        newButton.textContent = "Save";
        e.target.parentElement.appendChild(newButton);
    


        const delete_edit = e.target.parentElement.getElementsByClassName('edit')[0];
    

        e.target.parentElement.getElementsByClassName('save')[0].addEventListener('click', myFunctionsave);
    
        //e.target.style.display = "";
        //e.target.parentElement.removeChild(delete_edit);
        //console.log(e.target.parentElement)
        //document.querySelector('#myP').getElementsByClassName('save')[0].addEventListener('click', myFunctionsave)
    
        //e.target.parentElement.[0].innerHTML = ""
    
    //<button class='save'>Save</button>
       // .children[0].innerHTML="<input id='updateValue' type='text' name='Name' placeholder='new name'><input type='submit' value='Save'>"

}


function myFunctionsave(e) {
    
        const delete_edit = e.target.parentElement.getElementsByClassName('edit')[0];
        e.target.parentElement.contentEditable = false;
        //e.target.parentElement.removeChild(delete_edit);
    
        var newButton = document.createElement('button')
        newButton.className = "edit";
        newButton.textContent = "Edit";
    
        //e.target.parentElement.appendChild(newButton);
    
        //console.log("HEere1")
        const delete_save = e.target.parentElement.getElementsByClassName('save')[0];
    
        //console.log(e.target.parentElement);
        e.target.parentElement.removeChild(delete_save);
    
        //console.log("HEere2")
    

       // console.log(e.target.parentElement);
    
       // .appendChild(newButton);
        //e.target.parentElement.[0].innerHTML = ""
    
    //<button class='save'>Save</button>
       // .children[0].innerHTML="<input id='updateValue' type='text' name='Name' placeholder='new name'><input type='submit' value='Save'>"

}




//document.querySelector('#myP').getElementsByClassName('edit')[0].parentElement.parentElement.children[0].contentEditable = false;