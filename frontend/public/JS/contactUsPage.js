// function message() {
//   var Name = document.getElementById("name");
//   var email = document.getElementById("email");
//   var msg = document.getElementById("msg");
//   const success = document.getElementById("success");
//   const danger = document.getElementById("danger");

//   if (Name.value === "" || email.value === "" || msg.value === "") {
//     danger.style.display = "block";
//   } else {
//     setTimeout(() => {
//       Name.value = "";
//       email.value = "";
//       msg.value = "";
//     }, 2000);
//     success.style.display = "block";
//   }
//   setTimeout(() => {
//     danger.style.display = "none";
//     success.style.display = "none";
//   }, 4000);
// }

const contactform = document.querySelector(".contact-form");
const submitBTN = document.getElementById("send")
var Name = document.getElementById("name");
var email = document.getElementById("email");
var msg = document.getElementById("msg");

contactform.addEventListener("submit", (e) => {
  e.preventDefault();
  submitBTN.innerText = "Sending..."
  let formdata = {
    name: Name.value,
    email: email.value,
    msg: msg.value,
  };
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/sendMail");
  xhr.setRequestHeader("content-type", "application/json");
  
  xhr.onload = function () {
    console.log(xhr.responseText);
    if (xhr.responseText == "success") {
      submitBTN.innerText = "Submit"
      alert("Email sent!");
      Name.value = "";
      email.value = "";
      msg.value = "";
    } else {
      alert("something went wrong!");
    }
  };
  xhr.send(JSON.stringify(formdata));
});
