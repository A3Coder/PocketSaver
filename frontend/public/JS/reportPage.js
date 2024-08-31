console.log(window.location.origin) //${window.location.origin}
var URL = window.location.origin //${window.location.origin}

//Fetching All Wallets from API
fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
    const userData = data
    const categoriesArray = userData.length != 0 ? Object.keys(userData[0].transactions) : []

    const reportWalletName = document.getElementById("reportWalletName")
    const reportWalletAmount = document.getElementById("reportWalletAmount")

    const reportTotalExpense = document.getElementById("reportTotalExpense")
    const reportTotalIncome = document.getElementById("reportTotalIncome")

    const reportBTN = document.getElementById("reportBTN")

    if (userData.length != 0) {
        //On Click function on Report BTN
        reportBTN.addEventListener('click', function () {
            //Calculating Length of Each Transactions
            var lengthofTransactions = 0
            Object.keys(userData[0].transactions).forEach((category) => {
                lengthofTransactions = lengthofTransactions + userData[0].transactions[category].length
            })

            lengthofTransactions = lengthofTransactions + userData[0].updatedAmount.length

            console.log(lengthofTransactions)
            
            if (lengthofTransactions < 7){
                alert("Not Enough Transactions for a Report to Be Generated")
                return
            } else{
                window.open(`${window.location.origin}/generate_report`, '_blank')
            }
        })

        //Populating Report Wallet Name
        reportWalletName.childNodes[1].data = userData[0].walletName

        //Populating Report Wallet Amount
        var totalBudget = calcTotalBudget()
        function calcTotalBudget() {
            var initialBudget = userData[0].initialAmount
            var updatedBudget = BigInt(0)
            userData[0].updatedAmount.forEach((item) => { updatedBudget = updatedBudget + BigInt(item.amount) })
            var totalBudget = BigInt(initialBudget) + BigInt(updatedBudget)
            return totalBudget
        }

        reportWalletAmount.innerHTML = ` +&#8377 ${totalBudget}`

        //Populating Report Total Expense and Report Total Income
        //Calculating Total Expenses for a all Categories
        var totalExpense = BigInt(0)
        categoriesArray.forEach((categoryID) => {
            var sum = caltotalExp(categoryID)
            totalExpense = BigInt(totalExpense) + BigInt(sum)
        })

        function caltotalExp(categoryID = "") {
            var sum = BigInt(0)
            userData[0].transactions[categoryID].forEach((items) => {
                sum = sum + BigInt(items.amountSpent)
            })
            return sum
        }

        function calcTotalIncome() {
            var updatedBudget = BigInt(0)
            userData[0].updatedAmount.length == 0 ? updatedBudget + BigInt(0) : userData[0].updatedAmount.forEach((item) => { updatedBudget = updatedBudget + BigInt(item.amount) })
            return updatedBudget
        }

        //Updating Values
        var totalIncome = calcTotalIncome()
        reportTotalIncome.innerHTML = `+&#8377 ${totalIncome}`
        reportTotalExpense.innerHTML = `-&#8377 ${totalExpense}`
    } else {
        reportWalletName.childNodes[1].data = `No Wallets Created`
        reportWalletName.style.fontSize = '16px'
        reportWalletAmount.innerHTML = `null`
        reportTotalExpense.innerHTML = 'null'
        reportTotalIncome.innerHTML = 'null'

        reportBTN.style.display = 'none'
    }
})