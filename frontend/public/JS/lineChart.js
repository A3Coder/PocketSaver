const lineChart = document.getElementById("lineChart").getContext("2d")
const line = document.createElement("div")
const lineContainer = document.getElementById("lineContainer")

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

        //logic for Acquiring Dates and Amount in the form of JSON
        var newData = []

        LABELS.forEach((item) => {
            userData[0].transactions[item].forEach((object) => {
                const date_amount = {
                    date: object.date,
                    amount: object.amountSpent
                }
                newData.push(date_amount)
            })
        })
        console.log(newData)

        //logic for Acquiring Dates and Amount in Individual Array
        var dates = []
        var amounts = []
        newData.forEach((item) => {
            if (!(dates.includes(item.date))) {
                dates.push(item.date)
            }
        })
        dates.sort() //Sorting The Dates
        console.log(dates) //Got The Dates in Sorted Manner

        dates.forEach((date) => {
            var calcAmount = 0
            newData.forEach((object) => {
                if (object.date === date) {
                    calcAmount = calcAmount + object.amount
                }
            })
            amounts.push(calcAmount)
        })
        console.log(amounts)//Got the Amount according to Sorted Dates

        //This is for the Line Chart
        const myLine = new Chart(lineChart, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Total Spent: ',
                    data: amounts,
                    fill: true,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderColor: 'black',
                    tension: 0.3,
                    pointBackgroundColor: 'white',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: 'black'
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 5000
                }
            }
        })
    } else {
        lineContainer.removeChild(lineContainer.firstElementChild)
        lineContainer.prepend(line)
        line.classList.add("line")
        // line.style.width = '40%'
        // line.style.height = '60%'
        // line.style.backgroundColor = 'white'
        // line.style.borderRadius = '10px'
        // line.style.boxShadow = '0 0 15px 10px rgba(0,0,0,0.2)'
        line.innerHTML = `Not Enough Data To Show <img src="Assets/ReportPage/lineChart.gif">`
        // line.style.display = 'flex'
        // line.style.alignItems = 'center'
        // line.style.justifyContent = 'center'
        // line.style.fontSize = '30px'
        // line.style.fontWeight = '500'
        // line.style.letterSpacing = '0px'
    }
})
