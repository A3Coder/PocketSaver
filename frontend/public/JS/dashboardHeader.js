console.log(window.location.origin) //${window.location.origin}
var URL = window.location.origin //${window.location.origin}

//Fetching All Wallets from API
// fetch(`${URL}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
//     const userData = data

//     const headerbudgetName = document.getElementById("headerbudgetName")
//     const headerbudgetAmount = document.getElementById("headerbudgetAmount")

//     if (userData.length != 0) {
//         var totalBudget = calcTotalBudget()
//         function calcTotalBudget() {
//             var initialBudget = userData[0].initialAmount
//             var updatedBudget = BigInt(0)
//             userData[0].updatedAmount.forEach((item) => { updatedBudget = updatedBudget + BigInt(item.amount) })
//             var totalBudget = BigInt(initialBudget) + BigInt(updatedBudget)
//             return totalBudget
//         }
//     }

//     console.log(userData[0])

//     headerbudgetName.innerHTML = userData.length == 0 ? "Create a Wallet" : "Wallet"
//     headerbudgetAmount.innerHTML = userData.length == 0 ? "null" : `Total Amount:  +&#8377 ${totalBudget}`
// })
//Edit Wallet Amount
const editWallet = document.getElementById("editWallet")
editWallet.addEventListener('click', function () {
    console.log("Edit")
    //Display and Hide Budget Form after Clicking Add Budget Button
    const budgetForm = document.getElementById("budgetForm")
    const overlay2 = document.getElementById("overlay2")
    budgetForm.style.display = "block"
    budgetForm.children[0].children[0].innerHTML = `<h3>Edit Your Wallet Initial Amount</h3>`
    overlay2.style.display = "block"
    budgetForm.style.zIndex = 999
    overlay2.style.zIndex = 998
    overlay2.addEventListener('click', () => {
        budgetForm.style.display = "none"
        budgetForm.children[0].children[0].innerHTML = `<h3>Create Your First Wallet</h3>`
        overlay2.style.display = "none"
        budgetForm.style.zIndex = 'initial'
        overlay2.style.zIndex = 'initial'
    })

    //Budget Form Amount Input with Commas Logic
    const budgetAmountInput = document.getElementById("budgetAmount")
    const headerbudgetAmount = document.getElementById("headerbudgetAmount")
    budgetAmountInput.value = headerbudgetAmount.innerText.substring(17)
})

//Delete Wallet Amount
const dltWallet = document.getElementById("dltWallet")

dltWallet.addEventListener('click', function () {
    console.log("Delete")
    if(headerbudgetAmount.innerHTML != 'null'){
        if(confirm("Are you sure you want to Delete this Wallet?")){
            fetch(`${URL}/users/${avatar_emailid.innerText}`, {
                method : 'DELETE'
            }).then((res) => { return res.json() })
        
            window.location.reload()
        } else{
            return
        }
    } else{
        alert("No Wallet to Delete")
    }
})

const populatingUI = async () => {
    const userData = await fetch(`${URL}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() })

    const headerbudgetName = document.getElementById("headerbudgetName")
    const headerbudgetAmount = document.getElementById("headerbudgetAmount")

    if (userData.length != 0) {
        var totalBudget = calcTotalBudget()
        function calcTotalBudget() {
            var initialBudget = userData[0].initialAmount
            var updatedBudget = BigInt(0)
            userData[0].updatedAmount.forEach((item) => { updatedBudget = updatedBudget + BigInt(item.amount) })
            var totalBudget = BigInt(initialBudget) + BigInt(updatedBudget)
            return totalBudget
        }
    }

    headerbudgetName.innerHTML = userData.length == 0 ? "Create a Wallet" : "Wallet"
    headerbudgetAmount.innerHTML = userData.length == 0 ? "null" : `Total Amount:  +&#8377 ${totalBudget}`
    editWallet.style.display = userData.length == 0 ? 'none' : 'block'
    // editWallet.style.display = userData[0].updatedAmount.length == 0 ? 'block' : 'none'
    dltWallet.style.display = userData.length == 0 ? 'none' : 'block'
}

//Initial Call
populatingUI()
