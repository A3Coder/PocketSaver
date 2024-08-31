let avatar_username = document.getElementById("avatar_username")
let avatar_emailid = document.getElementById("avatar_emailid")
console.log(avatar_emailid.innerText)
//Budget Form Amount Input with Commas Logic
const budgetAmountInput = document.getElementById("budgetAmount")
budgetAmountInput.onkeyup = function () {
    const removeChar = this.value.replace(/[^0-9]/g, '')
    this.value = removeChar

    const formattedNumber = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    this.value = formattedNumber
}

//Display and Hide Budget Form after Clicking Add Budget Button
const budgetformBTN = document.getElementById("budgetformBTN")
const budgetForm = document.getElementById("budgetForm")
const overlay2 = document.getElementById("overlay2")
function showBudgetForm() {
    budgetformBTN.style.display = "none"
    budgetForm.style.display = "block"
    overlay2.style.display = "block"
    overlay2.addEventListener('click', () => {
        budgetformBTN.style.display = "block"
        budgetForm.style.display = "none"
        overlay2.style.display = "none"
    })
}

//Display and Hide Budget Button
// const userBudgets = JSON.parse(window.localStorage.getItem("userBudgets"))
fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => {return res.json()}).then((data) => {
    console.log(data.length)
    if (data.length != 0){
        const transactionDisplay = document.getElementById("transactionDisplay")
        transactionDisplay.style.display = 'flex'
        budgetformBTN.style.display = 'none'
    } else{
        transactionDisplay.style.display = 'none'
        budgetformBTN.style.display = 'block'
    }
})

// if (userBudgets.length != 0){
//     const transactionDisplay = document.getElementById("transactionDisplay")
//     transactionDisplay.style.display = 'flex'
//     budgetformBTN.style.display = 'none'
// } else{
//     transactionDisplay.style.display = 'none'
//     budgetformBTN.style.display = 'block'
// }

//Budget Form Submission Logic
const budgetAmount = document.getElementById("budgetAmount")
const addbudgetBTN = document.getElementById("addBudget")

// addbudgetBTN.addEventListener('click', function(e){
//     var userBudgets = JSON.parse(window.localStorage.getItem("userBudgets"))
//     var budgetNameValue = budgetName.value
//     var budgetAmountValue = budgetAmount.value.split(",").join("")
//     if(budgetName.value != "" || budgetAmount.value != ""){
//         if (userBudgets == null){
//             userBudgets = {}
//             userBudgets[budgetNameValue] = {"amount": budgetAmountValue}
//             window.localStorage.setItem("userBudgets", JSON.stringify(userBudgets))
//             window.location.reload()
//         } else{
//             if(userBudgets.hasOwnProperty(budgetNameValue)){
//                 alert("Budget Name Already Exists")
//                 e.preventDefault()
//             } else{
//                 userBudgets[budgetNameValue] = {"amount" : budgetAmountValue}
//                 window.localStorage.setItem("userBudgets", JSON.stringify(userBudgets))
//                 window.location.reload()
//             }
//         }
//     } else{
//         alert("Please Fill Up the Details First")
//         return
//     }
// })

addbudgetBTN.addEventListener('click', function(e){
    var userBudgets = JSON.parse(window.localStorage.getItem("userBudgets"))
    var budgetAmountValue = budgetAmount.value.split(",").join("")
    if( budgetAmount.value != ""){
        const body = {walletName : "Wallet", initialAmount : budgetAmountValue}
        fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`, {
            method: "POST",
            body : JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
        }).then((res) => {return res.json()}).then((data) => console.log(data))
        window.location.reload()
    } else{
        alert("Please Fill Up the Details First")
        return
    }
})
