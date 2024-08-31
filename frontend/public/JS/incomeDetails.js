//Fetching Budgets Details from LocalStorage
var userBudget = JSON.parse(window.localStorage.getItem("userBudgets"))
var lastInsertedBudget = userBudget == null ? "" : Object.keys(userBudget)[Object.keys(userBudget).length - 1]
//Fetching Updated Budgets from Local Storage
var updatedBudgets = JSON.parse(window.localStorage.getItem("updatedBudgets"))

//Display or Hide Income Details
const showIncome = document.getElementById("showIncome")
const incomeDetails = document.querySelector(".income_details")
const incomeContent = document.querySelector(".income_content")

fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
    const userData = data
    console.log(userData)

    showIncome.addEventListener('click', function () {
        var updatedBudgetsArray = userData == null ? [] : userData[0].updatedAmount
        if (incomeDetails.style.display == "flex") {
            incomeDetails.style.display = "none"
            incomeContent.innerHTML = ""
        } else {
            incomeDetails.style.display = "flex"
            initialAmountDOM()
            if (updatedBudgetsArray.length == 0) {
                const p = document.createElement("p")
                p.innerText = "No Extra Incomes Yet"
                p.style.marginTop = "3px"
                p.style.fontWeight = "400"
                p.style.color = "black"
                incomeContent.appendChild(p)
            } else {
                // for (i = 1; i <= updatedBudgetsArray.length; i++) {
                //     loadingIncomeContents(i)
                // }

                updatedBudgetsArray.forEach((obj, key) => {
                    loadingIncomeContents(key)
                })

                //Logic For Deleting Any Income Detail
                const dltIncome = document.querySelectorAll(".dltIncome")
                console.log(dltIncome)

                dltIncome.forEach((BTN) => {
                    BTN.addEventListener('click', function getData() {
                        if (confirm("Are You Sure You want to Delete this Transaction?")) {
                            const budgetHeading = document.getElementById("budgetHeading")
                            budgetHeading.style.textTransform = 'initial'
                            console.log(budgetHeading.innerText)
                    
                            const getIdx = BTN.parentElement.parentElement.children[0].innerText  - 1
                                        
                            newData = {dltIncome: true, details : updatedBudgetsArray[getIdx]}
                
                            fetch(`${window.location.origin}/users/${avatar_emailid.innerText}/${budgetHeading.innerText}`, {
                                method: 'DELETE',
                                body: JSON.stringify(newData),
                                headers: { 'Content-type': 'application/json' }
                            }).then(function (response) { return response.json() })
                
                            window.location.reload()
                        } else {
                            return
                        }

                    })
                })
                //Logic For Deleting Any Transaction Ends Here
            }
        }
    })

    //loading Income Content DOM
    function loadingIncomeContents(key) {
        const transactions = document.createElement("div")
        transactions.classList.add("transactions")

        const h3 = document.createElement("h3")
        h3.innerText = key + 1

        const content = document.createElement("div")
        content.classList.add("content")

        const h4 = document.createElement("h4")
        h4.innerText = userData[0].updatedAmount[key].date

        const p = document.createElement("p")
        p.innerText = userData[0].updatedAmount[key].notes

        content.appendChild(h4)
        content.appendChild(p)

        const span = document.createElement("span")
        span.innerHTML = `+&#8377 ${userData[0].updatedAmount[key].amount}`

        const dltBTN = document.createElement("div")
        dltBTN.innerHTML = `<i class="fa-solid fa-trash"></i>`
        dltBTN.classList.add("dltIncome")

        span.prepend(dltBTN)

        transactions.appendChild(h3)
        transactions.appendChild(content)
        transactions.appendChild(span)

        incomeContent.appendChild(transactions)
    }

    //loading Initial Amount Contect DOM
    function initialAmountDOM() {
        const transactions = document.createElement("div")
        transactions.classList.add("transactions")

        const content = document.createElement("div")
        content.classList.add("content")

        const h4 = document.createElement("h4")
        h4.innerText = "Initial Amount"

        const p = document.createElement("p")
        p.innerText = "Extra Incomes are Below:"

        content.appendChild(h4)
        content.appendChild(p)

        const span = document.createElement("span")
        span.innerHTML = `+&#8377 ${userData[0].initialAmount}`

        transactions.appendChild(content)
        transactions.appendChild(span)

        incomeContent.appendChild(transactions)
    }
})


