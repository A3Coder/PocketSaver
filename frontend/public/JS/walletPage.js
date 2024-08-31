const walletName = document.getElementById("walletName")
const walletTotalAmount = document.getElementById("walletTotalAmount")
const user_emailId = document.getElementById("user_emailId").innerText
console.log(user_emailId)

fetch(`${window.location.origin}/users/${user_emailId}`).then((res) => { return res.json() }).then((data) => {
    const userData = data

    console.log(userData)

    if (userData.length != 0) {
        var totalAmount = userData[0].initialAmount

        userData[0].updatedAmount.length != 0 ? userData[0].updatedAmount.forEach((obj) => {
            totalAmount = totalAmount + obj.amount
        }) : totalAmount = totalAmount + 0

        walletName.innerText = userData[0].walletName
        walletTotalAmount.innerHTML = `+&#8377 ${totalAmount}`
    } else {
        walletName.innerText = 'Create A Wallet First'
        walletTotalAmount.innerHTML = `null`
    }
})