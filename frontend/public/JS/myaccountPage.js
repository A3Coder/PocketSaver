// DOM Manipulation
const formContainer = document.getElementById("formContainer")
const chUsernameform = document.getElementById("chUsernameform")
const chMobileNo = document.getElementById("chMobileNo")
const chPhoto = document.getElementById("chPhoto")

//Change Username Form DOM
function changeUsernameDOM() {
    if (chUsernameform.style.display == "flex") {
        chUsernameform.style.display = "none"
    } else {
        chUsernameform.style.display = "flex"
        chMobileNo.style.display = "none"
        chPhoto.style.display = "none"
    }
}

//Change Mobile No. Form DOM
function changeMobileNoDOM() {
    if (chMobileNo.style.display == "flex") {
        chMobileNo.style.display = "none"
    } else {
        chUsernameform.style.display = "none"
        chMobileNo.style.display = "flex"
        chPhoto.style.display = "none"
    }
}

//Update Photo Form DOM
function changePhotoDOM() {
    if (chPhoto.style.display == "flex") {
        chPhoto.style.display = "none"
    } else {
        // chEmail.style.display = "none"
        chUsernameform.style.display = "none"
        chPhoto.style.display = "flex"
        chMobileNo.style.display = "none"
    }
}
