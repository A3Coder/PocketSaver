const walletName = document.getElementById("walletName")
const initialAmount = document.getElementById("initialAmount")

const emailId = document.getElementById("emailId").innerText //Email ID of the USER

const table = document.getElementById("table")

const footerInitialAmount = document.getElementById("footerInitialAmount")
const totalIncome = document.getElementById("totalIncome")
const footerGrossAmount = document.getElementById("footerGrossAmount")
const totalExpenses = document.getElementById("totalExpenses")
const footerBalance = document.getElementById("footerBalance")

console.log(emailId)

async function gettingData() {
    const data = await fetch(`${window.location.origin}/users/${emailId}/Wallet`).then((res) => { return res.json() })
    console.log(data)

    walletName.innerHTML = data.walletName
    initialAmount.innerHTML = `Initial Amount: Rs. ${data.initialAmount}`
    footerInitialAmount.innerHTML = `Rs. ${data.initialAmount}`

    var wallet = []
    var categoriesArray = Object.keys(data.transactions)

    //Getting Array of Expenses with Date and Notes
    var ExwithDate = []
    categoriesArray.forEach((category) => {
        if (data.transactions[category].length != 0) {
            data.transactions[category].forEach((obj) => {
                var temp = { date: obj.date, expenses: obj.amountSpent, notes: obj.notes, category: category }
                ExwithDate.push(temp)
            })
        }
    })
    console.log("Expenses and Date", ExwithDate)

    //Getting Array of Income With Date and Notes
    var InwithDate = []
    data.updatedAmount.forEach((obj) => {
        var temp = { date: obj.date, income: obj.amount, notes: obj.notes }
        InwithDate.push(temp)
    })
    console.log("Income and Date", InwithDate)

    //Getting Array of both Income and Expenses with Date and Notes
    var In_Ex = [...ExwithDate]
    InwithDate.forEach((obj) => {
        In_Ex.push(obj)
    })

    //For Sorting the Income&Expenses Array Based on Date
    In_Ex.sort((a, b) => {
        if (a.date < b.date) return -1
        if (a.date > b.date) return 1
        return 0
    })
    console.log("income and Expenses", In_Ex)

    //Getting Balance
    var balance = []
    var tempBalance = data.initialAmount
    In_Ex.forEach((obj) => {
        if (obj.hasOwnProperty('expenses')) {
            tempBalance = tempBalance - obj.expenses
        }
        if (obj.hasOwnProperty('income')) {
            tempBalance = tempBalance + obj.income
        }
        balance.push(tempBalance)
    })
    console.log("Balance", balance)

    //Arranging Data in Wallet Array
    for (i = 0; i < In_Ex.length; i++) {
        var tempData = {
            key: i + 1,
            date: new Date(In_Ex[i].date).toLocaleDateString('en-GB'),
            notes: In_Ex[i].notes,
            expenses: In_Ex[i].hasOwnProperty('expenses') ? `Rs. ${In_Ex[i].expenses}` : '-',
            category: In_Ex[i].hasOwnProperty('expenses') ? In_Ex[i].category : '-',
            income: In_Ex[i].hasOwnProperty('income') ? `Rs. ${In_Ex[i].income}` : '-',
            balance: balance[i]
        }
        wallet.push(tempData)
    }

    //DOM for Table Rows
    var clutter = `<tr>
    <th class="slno">SI. No.</th>
    <th class="date">Date</th>
    <th class="description">Description</th>
    <th>Expense</th>
    <th>Income</th>
    <th>Balance</th>
</tr>`
    for (i = 0; i < wallet.length; i++) {
        clutter = clutter + `
            <tr>
                <td class="slno">${wallet[i].key}</td>
                <td class="date">${wallet[i].date}</td>
                <td class="description"><h4>${wallet[i].category !== '-' ? wallet[i].category : ""}</h4>${wallet[i].notes}</td>
                <td style="color: red">${wallet[i].expenses}</td>
                <td style="color: green">${wallet[i].income}</td>
                <td>Rs. ${wallet[i].balance}</td>
            </tr>
        `
    }
    table.innerHTML = clutter

    //Populating Footer Data
    let sum = parseInt(0)
    wallet.forEach((obj) => {
        if (obj.income != '-') {
            sum = sum + parseInt(obj.income.substring(4))
        }
    })
    totalIncome.innerHTML = `+Rs. ${sum}`

    footerGrossAmount.innerHTML = `Rs. ${parseInt(footerInitialAmount.innerText.substring(4)) + parseInt(totalIncome.innerText.substring(5))}`

    sum = parseInt(0)
    wallet.forEach((obj) => {
        if (obj.expenses != '-') {
            sum = sum + parseInt(obj.expenses.substring(4))
        }
    })
    totalExpenses.innerHTML = `-Rs. ${sum}`

    footerBalance.innerHTML = `Rs. ${parseInt(footerGrossAmount.innerText.substring(4)) - parseInt(totalExpenses.innerText.substring(5))}`
}

// setTimeout(()=>{
//     gettingData()
// }, 3000)

//InitialCall
gettingData()