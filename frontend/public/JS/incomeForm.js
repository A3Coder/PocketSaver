//Fetching Budgets Details from LocalStorage
var userBudget = JSON.parse(window.localStorage.getItem("userBudgets"))
var lastInsertedBudget = userBudget == null ? "" : Object.keys(userBudget)[Object.keys(userBudget).length - 1]

fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
    const userData = data
    //Display Income Form
    const moneyBTN = document.getElementById("moneyBTN")
    moneyBTN.addEventListener('click', function () {
        const incomeForm = document.querySelector(".incomeForm_container")
        const overlay2 = document.getElementById("overlay2")
        if (userData.length != 0) {
            incomeForm.style.display = "flex"
            overlay2.style.display = "block"
            incomeForm.style.zIndex = 999
            overlay2.style.zIndex = 998
            overlay2.addEventListener('click', () => {
                incomeForm.style.display = "none"
                overlay2.style.display = "none"
                incomeForm.style.zIndex = 'initial'
                overlay2.style.zIndex = 'initial'
            })
        } else {
            alert("Create Your Budget First!")
        }
    })

    //Display Income Form from Sidebar
    const sidebarmoneyBTN = document.querySelector("#sidebarmoneyBTN")
    sidebarmoneyBTN.addEventListener('click', function () {
        const incomeForm = document.querySelector(".incomeForm_container")
        const overlay2 = document.getElementById("overlay2")
        if (userData.length != 0) {
            incomeForm.style.display = "flex"
            overlay2.style.display = "block"
            incomeForm.style.zIndex = 999
            overlay2.style.zIndex = 998
            overlay2.addEventListener('click', () => {
                incomeForm.style.display = "none"
                overlay2.style.display = "none"
                incomeForm.style.zIndex = 'initial'
                overlay2.style.zIndex = 'initial'
            })
        } else {
            alert("Create Your Budget First!")
        }
    })
})

//Income Form Date input Logic
const incomeDate = document.getElementById("incomeDate")
incomeDate.valueAsDate = new Date()

//Income Form Amount input Logic
const incomeAmount = document.getElementById("incomeAmount")
incomeAmount.onkeyup = function () {
    const removeChar = this.value.replace(/[^0-9]/g, '')
    this.value = removeChar

    const formattedNumber = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    this.value = formattedNumber
}

//Income Form Notes
const incomeNote = document.getElementById("incomeNote")

//Income Form two Buttons
const incomeCancel = document.getElementById("incomeCancel")
const addMoney = document.getElementById("addMoney")

//Income Form Cancel Button Logic
incomeCancel.addEventListener('click', function () {
    const incomeForm = document.querySelector(".incomeForm_container")
    const overlay2 = document.getElementById("overlay2")
    incomeForm.style.display = "none"
    overlay2.style.display = "none"
    incomeForm.style.zIndex = 'initial'
    overlay2.style.zIndex = 'initial'
})

//Income Form Add Money Button Logic
addMoney.addEventListener('click', function () {
    const budgetHeading = document.getElementById("budgetHeading")
    budgetHeading.style.textTransform = 'initial'
    const incomeForm = document.querySelector(".incomeForm_container")
    newData = { updatingAmount: true, amount: incomeAmount.value.split(",").join(""), date: incomeDate.value, notes: incomeNote.value }

    if (incomeAmount.value == "") {
        alert("Please Enter the Amount")
        return
    } else {
        // if (data == null) {
        //     const updatedBudgets = {}
        //     updatedBudgets[lastInsertedBudget] = [newData]
        //     console.log(updatedBudgets)
        //     window.localStorage.setItem("updatedBudgets", JSON.stringify(updatedBudgets))
        //     alert("Money Added")
        //     incomeForm.style.display = "none"
        //     window.location.reload()
        //     return
        // } else if (data.hasOwnProperty(lastInsertedBudget)) {
        //     data[lastInsertedBudget].push(newData)
        // }

        fetch(`${window.location.origin}/users/${avatar_emailid.innerText}/${budgetHeading.innerText}`, {
            method: 'PATCH',
            body: JSON.stringify(newData),
            headers: { 'Content-type': 'application/json' }
        }).then(function (response) { return response.json() }).then(function (data) { console.log(data) })
    }

    alert("Money Added")
    incomeForm.style.display = "none"
    window.location.reload()
})