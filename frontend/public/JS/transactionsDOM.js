const expContent = document.getElementById("expContent")

//Loading CategoryDOM
function categoryDOM(categoryID = "", length = 1, sum = 0) {
    const category = document.createElement("div")
    category.classList.add("category")
    category.setAttribute("id", categoryID)
    const categoryContent = document.createElement("div")
    categoryContent.classList.add("category_content")
    category.appendChild(categoryContent)
    const h3 = document.createElement("h3")
    h3.innerText = categoryID
    const span = document.createElement("span")
    span.innerHTML = `-&#8377 ${sum}`

    const dltBTN = document.createElement("div")
    dltBTN.innerHTML = `<i class="fa-solid fa-trash"></i>`
    dltBTN.classList.add("dltCategory")

    h3.appendChild(span)
    h3.appendChild(dltBTN)

    const p = document.createElement("p")
    p.innerText = `No. of Transactions : ${length}`
    categoryContent.appendChild(h3)
    categoryContent.appendChild(p)

    expContent.appendChild(category)
}

fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
    console.log(data[0].walletName)
    if (data.length != 0) {
        fetch(`${window.location.origin}/users/${avatar_emailid.innerText}/${data[0].walletName}`).then((res) => { return res.json() }).then((responsedata) => {
            const userData = responsedata
            console.log(userData)
            const categoriesArray = userData != null ? Object.keys(userData.transactions) : []
            categoriesArray.forEach((categoryID) => {
                const length = userData.transactions[categoryID].length
                console.log(length)
                if (length > 0) {
                    const sum = caltotalExp(categoryID)
                    categoryDOM(categoryID, length, sum)
                    userData.transactions[categoryID].forEach((items) => {
                        const index = (userData.transactions[categoryID].indexOf(items)) + 1
                        addTransaction(categoryID, index)
                    })
                }

            })
            //Logic For Deleting Any Transaction Detail
            const dltBTNs = document.querySelectorAll(".dltBTN")
            console.log(dltBTNs)

            dltBTNs.forEach((BTN) => {
                BTN.addEventListener('click', function getData(){
                    const getId = BTN.parentElement.children[0].innerText
                    console.log(getId)
            
                    if(confirm("Are You Sure You want to Delete this Transaction?")){
                        const budgetHeading = document.getElementById("budgetHeading")
                        budgetHeading.style.textTransform = 'initial'
                        console.log(budgetHeading.innerText)
                
                        const getCategory = BTN.parentElement.parentElement.children[0].children[0].childNodes[0].data
                        const getId = BTN.parentElement.children[0].innerText
                                    
                        newData = {tId : getId,  category: getCategory}
            
                        fetch(`${window.location.origin}/users/${avatar_emailid.innerText}/${budgetHeading.innerText}`, {
                            method: 'DELETE',
                            body: JSON.stringify(newData),
                            headers: { 'Content-type': 'application/json' }
                        }).then(function (response) { return response.json() }).then(function (data) { console.log(data) })
            
                        window.location.reload()
                    } else{
                        return
                    }
            
                })
            })
            //Logic For Deleting Any Transaction Ends Here

            //Logic For Deleting All Transactions of a Category
            const dltCategory = document.querySelectorAll(".dltCategory")
            console.log(dltCategory)

            dltCategory.forEach((BTN) => {
                BTN.addEventListener('click', 
                function getData(){
            
                    if(confirm("Are You Sure You want to Delete this Transaction?")){
                        const budgetHeading = document.getElementById("budgetHeading")
                        budgetHeading.style.textTransform = 'initial'
                        console.log(budgetHeading.innerText)
                
                        const getCategory = BTN.parentElement.childNodes[0].data
                        console.log(getCategory)
                                    
                        dltData = {allTransactions: true, category: getCategory}
                        console.log(dltData)
            
                        fetch(`${window.location.origin}/users/${avatar_emailid.innerText}/${budgetHeading.innerText}`, {
                            method: 'DELETE',
                            body: JSON.stringify(dltData),
                            headers: { 'Content-type': 'application/json' }
                        }).then(function (response) { return response.json() }).then(function (data) { console.log(data) })
            
                        window.location.reload()
                    } else{
                        return
                    }
                })
            })
            
            function caltotalExp(categoryID = "") {
                var sum = BigInt(0)
                userData.transactions[categoryID].forEach((items) => {
                    sum = sum + BigInt(items.amountSpent)
                })
                return sum
            }

            function addTransaction(category = "", index = 1) {
                const findCategory = document.getElementById(category)
                console.log(findCategory)
                console.log(category)
                if (findCategory == null) {
                    categoryDOM()
                } else {
                    transactionDOM(category, index)
                }
            }

            function transactionDOM(id = "", index = 1) {
                const category = document.getElementById(id)
                const transaction = document.createElement("div")
                transaction.classList.add("transactions")

                const tId = document.createElement("h3")
                tId.classList.add("tId")
                tId.setAttribute("onclick", "getData(e)")
                tId.innerText = userData.transactions[id][index - 1].tId
                tId.style.display = 'none'

                const h3 = document.createElement("h3")
                h3.innerText = index

                const content = document.createElement("div")
                content.classList.add("content")
                const h4 = document.createElement("h4")
                h4.innerText = userData.transactions[id][index - 1].date
                const p = document.createElement("p")
                p.innerText = userData.transactions[id][index - 1].notes

                content.appendChild(h4)
                content.appendChild(p)

                const span = document.createElement("span")
                span.innerHTML = `-&#8377 ${userData.transactions[id][index - 1].amountSpent}`

                const dltBTN = document.createElement("div")
                dltBTN.innerHTML = `<i class="fa-solid fa-trash"></i>`
                dltBTN.classList.add("dltBTN")

                transaction.appendChild(tId)
                transaction.appendChild(h3)
                transaction.appendChild(content)
                transaction.appendChild(span)
                transaction.appendChild(dltBTN)

                category.appendChild(transaction)
            }

            const budget = document.getElementById("budget")
            const expense = document.getElementById("expense")
            const balance = document.getElementById("balance")
            var totalExpense = BigInt(0)

            //Calculating Total Expenses for a all Categories
            categoriesArray.forEach((categoryID) => {
                var sum = caltotalExp(categoryID)
                totalExpense = BigInt(totalExpense) + BigInt(sum)
            })

            //Updating Values
            console.log(userData.walletName)
            var totalBudget = calcTotalBudget()
            budget.innerHTML = `+&#8377 ${totalBudget}`
            expense.innerHTML = `-&#8377 ${totalExpense}`
            balance.innerHTML = `&#8377 ${calcBalance()}`

            function calcTotalBudget() {
                var initialBudget = userData.initialAmount
                var updatedBudget = BigInt(0)
                userData == null ? updatedBudget + BigInt(0) : userData.updatedAmount.forEach((item) => { updatedBudget = updatedBudget + BigInt(item.amount) })
                var totalBudget = BigInt(initialBudget) + BigInt(updatedBudget)
                return totalBudget
            }

            function calcBalance() {
                return totalBudget - totalExpense
            }
        })
    }
})