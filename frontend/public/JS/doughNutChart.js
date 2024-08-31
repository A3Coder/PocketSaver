const doughChart = document.getElementById("doughChart").getContext("2d")
const listofLegends = document.querySelector(".listofLegends")

fetch(`${window.location.origin}/users/${avatar_emailid.innerText}`).then((res) => { return res.json() }).then((data) => {
    const userData = data
    console.log(userData)

    //Calculating Length of Each Transactions
    var lengthofEachCategory = 0
    userData.length != 0 ? Object.keys(userData[0].transactions).forEach((category) => {
        lengthofEachCategory = lengthofEachCategory + userData[0].transactions[category].length
    }) : lengthofEachCategory = 0

    if (lengthofEachCategory > 5) {
        //Logic for  Getting the Labels
        const LABELS = []
        const KEYS = Object.keys(userData[0].transactions)
        KEYS.forEach((item) => {
            if (userData[0].transactions[item].length != 0) {
                LABELS.push(item)
            }
        })
        console.log(LABELS)

        //Logic for Getting the Amount Spent on Each Labels
        const DATA = []
        LABELS.forEach((item) => {
            let totalAmount = 0
            userData[0].transactions[item].forEach((Object) => {
                totalAmount = totalAmount + Object.amountSpent
            })
            DATA.push(totalAmount)
        })
        console.log(DATA)

        //Logic for Random Colors
        const COLORS = []
        for (i = 1; i <= LABELS.length; i++) {
            var randomNumber = Math.floor(Math.random() * 16777215)
            var colorCode = "#" + randomNumber.toString(16).padStart(6, 0)
            COLORS.push(colorCode)
        }
        console.log(COLORS)

        //Logic for Total Wallet  Amount
        var initialAmount = userData[0].initialAmount
        var updatedAmount = 0
        userData[0].updatedAmount.length != 0 ? userData[0].updatedAmount.forEach((item) => {
            updatedAmount = updatedAmount + item.amount
        }) : updatedAmount = 0
        var totalAmount = initialAmount + updatedAmount
        //Logic for Amount Left
        var amountSpent = 0
        DATA.forEach((item) => {
            amountSpent = amountSpent + item
        })
        var amountLeft = totalAmount - amountSpent
        console.log(amountLeft)
        //This is for the Doughnut Chart
        const myDoughnut = new Chart(doughChart, {
            type: 'doughnut',
            data: {
                labels: [...LABELS, "Amount Left"],
                datasets: [{
                    label: 'Total Amount Spent',
                    data: [...DATA, amountLeft],
                    borderWidth: 5,
                    borderRadius: 10,
                    hoverBorderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 3000
                }
            }
        })

        //Logic for Populating the List of Legends
        const listItems = [...LABELS, "Amount Left"]
        const listItemsAmount = [...DATA, amountLeft]
        for (i = 0; i < listItems.length; i++) {
            populateList(i)
        }

        //Populating the List
        function populateList(index = 0) {
            const li = document.createElement("li")
            li.innerHTML = `${listItems[index]}: `

            const span = document.createElement("span")
            if (index === listItems.length - 1) {
                span.style.color = 'green'
            } else {
                span.style.color = 'red'
            }
            span.innerHTML = `Rs. ${listItemsAmount[index]}`

            li.appendChild(span)

            listofLegends.appendChild(li)
        }
    } else {
        const doughNut = document.querySelector(".doughNut")
        doughNut.innerHTML = `Not Enough Data to Show <img src="Assets/ReportPage/doughnutChart.gif">`
        // doughNut.style.justifyContent = 'center'
        // doughNut.style.fontSize = '30px'
        // doughNut.style.fontWeight = '500'
        // doughNut.style.letterSpacing = '0px'
    }
})
