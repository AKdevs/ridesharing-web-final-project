const firstnameelement = document.querySelector('#firstnameelement').getElementsByClassName('edit')[0];
firstnameelement.addEventListener('click', myFunctionedit, false);

const lastnamelement = document.querySelector('#lastnameelement').getElementsByClassName('edit')[0];
lastnamelement.addEventListener('click', myFunctionedit)

const passwordelement = document.querySelector('#passwordelement').getElementsByClassName('save')[0];
passwordelement.addEventListener('click', myFunctionedit)

const emailelement = document.querySelector('#emailelement').getElementsByClassName('edit')[0];
emailelement.addEventListener('click', myFunctionedit)

const phoneelement = document.querySelector('#phoneelement').getElementsByClassName('edit')[0];
phoneelement.addEventListener('click', myFunctionedit)


//document.querySelector('#firstnameelement').getElementsByClassName('edit')[0].parentElement.getElementsByTagName('a')[0].innerText


function myFunctionedit(e) {
    
         if (e.target.style.visibility === "hidden") {
                    e.target.style.visibility = "visible";
                 } else {
                     e.target.style.visibility = "hidden";
                 }



    
        //e.disabled = true; 
    
        e.target.parentElement.getElementsByTagName('a')[0].contentEditable = true;
    
        //e.target.removeEventListener('click', myFunctionedit);
    
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

         if (e.target.parentElement.getElementsByClassName('edit')[0].style.visibility === "hidden") {
            e.target.parentElement.getElementsByClassName('edit')[0].style.visibility = "visible";
         } else {
             e.target.parentElement.getElementsByClassName('edit')[0].style.visibility = "hidden";
         }
    
    
    
    
        const delete_edit = e.target.parentElement.getElementsByClassName('edit')[0];
        e.target.parentElement.getElementsByTagName('a')[0].contentEditable = false;
        //e.target.parentElement.removeChild(delete_edit);
    
        var newButton = document.createElement('button')
        newButton.className = "edit";
        newButton.textContent = "Edit";
    
        //e.target.parentElement.appendChild(newButton);
    
        //console.log("HEere1")
        const delete_save = e.target.parentElement.getElementsByClassName('save')[0];
    
        //console.log(e.target.parentElement);
    
        //e.target.addEventListener('click', myFunctionedit);
    

    
        e.target.parentElement.removeChild(delete_save);
    
        //
    
        //console.log("HEere2")
    

       // console.log(e.target.parentElement);
    
       // .appendChild(newButton);
        //e.target.parentElement.[0].innerHTML = ""
    
    //<button class='save'>Save</button>
       // .children[0].innerHTML="<input id='updateValue' type='text' name='Name' placeholder='new name'><input type='submit' value='Save'>"

}

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
ar canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');

function handleImage(e) {


  var reader = new FileReader();
  reader.onload = function(event) {
    onReaderLoad(event);
  }

  reader.readAsDataURL(e.target.files[0]);
}

var onReaderLoad = function(event) {
  var image = new Image();
	
  image.onload = function() {
    onImageLoad(image);
  }

  image.src = event.target.result;
}

var onImageLoad = function(img) {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
}





//document.querySelector('#myP').getElementsByClassName('edit')[0].parentElement.parentElement.children[0].contentEditable = false;