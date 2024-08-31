//Fetching Budgets Details from LocalStorage
var userBudget = JSON.parse(window.localStorage.getItem("userBudgets"))
var lastInsertedBudget = userBudget == null ? "" : Object.keys(userBudget)[Object.keys(userBudget).length - 1]


fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
    const userData = data
    //Display Transaction Form
    const transactionBTN = document.getElementById("transactionBTN")
    transactionBTN.addEventListener('click', function () {

        //Display and Hide Transaction Form after Clicking Add Budget Button
        const transactionForm = document.querySelector(".transactionForm_container")
        const overlay2 = document.getElementById("overlay2")
        if (userData.length != 0) {
            transactionForm.style.display = "flex"
            overlay2.style.display = "block"
            transactionForm.style.zIndex = 999
            overlay2.style.zIndex = 998
            overlay2.addEventListener('click', () => {
                transactionForm.style.display = "none"
                overlay2.style.display = "none"
                transactionForm.style.zIndex = 'initial'
                overlay2.style.zIndex = 'initial'
            })
        } else {
            alert("Create Your Budget First!")
        }
    })

    //Display Transaction Form from Sidebar
    const sidebartransactionBTN = document.getElementById("sidebartransactionBTN")
    sidebartransactionBTN.addEventListener('click', function () {
        const transactionForm = document.querySelector(".transactionForm_container")
        const overlay2 = document.getElementById("overlay2")
        if (userData.length != 0) {
            transactionForm.style.display = "flex"
            overlay2.style.display = "block"
            transactionForm.style.zIndex = 999
            overlay2.style.zIndex = 998
            overlay2.addEventListener('click', () => {
                transactionForm.style.display = "none"
                overlay2.style.display = "none"
                transactionForm.style.zIndex = 'initial'
                overlay2.style.zIndex = 'initial'
            })
        } else {
            alert("Create Your Wallet First!")
        }
    })
})

//Transaction Form Category List Logic
const selector = document.querySelector(".selector")
const selectedCategory = document.getElementById("SelectedCategory")
const list = document.querySelector(".list")
const listOptions = document.querySelectorAll(".option")
selectedCategory.addEventListener('click', function (e) {
    list.style.display = 'block'

    const overlay2 = document.getElementById("overlay2")
    overlay2.addEventListener('click', (dets) => {
        list.style.display = 'none'
    })

    const transactionForm = document.querySelector(".transactionForm_container")
    transactionForm.addEventListener('click', (dets) => {
        if (dets.target.id != "SelectedCategory") {
            list.style.display = 'none'
        }
    })

    listOptions.forEach((option) => {
        option.addEventListener('click', (e) => {
            if (option.children[0].innerText === 'Cancel') {
                selectedCategory.innerText = 'Select Category'
                list.style.display = 'none'
                return
            }
            selectedCategory.innerText = option.children[0].innerText
            list.style.display = 'none'
        })
    })

    return
})

//Transaction Form Date input Logic
const date = document.getElementById("date")
date.valueAsDate = new Date()

//Transaction Form Amount input Logic
const amount = document.getElementById("transactionAmount")
console.log(amount)
amount.onkeyup = function () {
    const removeChar = this.value.replace(/[^0-9]/g, '')
    this.value = removeChar

    const formattedNumber = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    this.value = formattedNumber
}

//Transaction Form Notes
const note = document.getElementById("note")

//Transaction Form two Buttons
const cancelBTN = document.getElementById("cancel")
const addTransactionBTN = document.getElementById("addTransaction")

//Transaction Form Cancel Button Logic
cancelBTN.addEventListener('click', function () {
    const transactionForm = document.querySelector(".transactionForm_container")
    const overlay2 = document.getElementById("overlay2")
    transactionForm.style.display = "none"
    overlay2.style.display = "none"
    transactionForm.style.zIndex = 'initial'
    overlay2.style.zIndex = 'initial'
})

//Transaction Form Add Transaction Button Logic
addTransactionBTN.addEventListener('click', function () {
    const budgetHeading = document.getElementById("budgetHeading")
    budgetHeading.style.textTransform = 'initial'
    console.log(budgetHeading.innerText)

    fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
        const transactionForm = document.querySelector(".transactionForm_container")

        if (selectedCategory.innerText == "Select Category" || amount.value == '0') {
            alert("Please select any Category and Fill up the Form")
            return
        } else {

            const userData = data
            let count
            count = userData[0].transactions[selectedCategory.innerText].length == 0 ? 1 : userData[0].transactions[selectedCategory.innerText].length + 1


            newData = { tId: count, category: selectedCategory.innerText, amountSpent: amount.value.split(",").join(""), date: date.value, notes: note.value }
            // if (data == null) {
            //     const category = selectedCategory.innerText
            //     const userData = {}
            //     userData[category] = [newData]
            //     console.log(userData)
            //     window.localStorage.setItem(lastInsertedBudget, JSON.stringify(userData))
            //     alert("Transaction Added")
            //     transactionForm.style.display = "none"
            //     window.location.reload()
            //     return
            // } else if (data.hasOwnProperty(selectedCategory.innerText)) {
            //     data[selectedCategory.innerText].push(newData)
            // } else {
            //     data[selectedCategory.innerText] = [newData]
            // }
            fetch(`${window.location.origin}/users/${avatar_emailid.innerText}/${budgetHeading.innerText}`, {
                method: 'PATCH',
                body: JSON.stringify(newData),
                headers: { 'Content-type': 'application/json' }
            }).then(function (response) { return response.json() }).then(function (data) { console.log(data) })
        }
        alert("Transaction Added")
        const overlay2 = document.getElementById("overlay2")
        transactionForm.style.display = "none"
        overlay2.style.display = "none"
        transactionForm.style.zIndex = 'initial'
        overlay2.style.zIndex = 'initial'
        window.location.reload()
    })
})