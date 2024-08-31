const barChart = document.getElementById("barChart").getContext("2d")
const bar = document.createElement("div")
const barContainer = document.getElementById("barContainer")
console.log(barContainer)

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

        //This is for the Bar Chart
        const myBar = new Chart(barChart, {
            type: 'bar',
            data: {
                //Name of the Categories
                labels: LABELS,
                datasets: [{
                    label: 'Total Amount Spent',
                    //Below will be the amount Spent
                    data: DATA,
                    borderWidth: 7,
                    borderRadius: 5,
                    backgroundColor: 'black',
                    hoverBorderWidth: 2,
                    hoverBorderRadius: 10,
                    hoverBorderColor: 'gray'
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 4000
                }
            }
        })
    } else {
        barContainer.removeChild(barContainer.lastElementChild)
        barContainer.appendChild(bar)
        bar.classList.add("bar")
        // bar.style.width = '40%'
        // bar.style.height = '60%'
        // bar.style.backgroundColor = 'white'
        // bar.style.borderRadius = '10px'
        // bar.style.boxShadow = '0 0 15px 10px rgba(0,0,0,0.2)'
        bar.innerHTML = `Not Enough Data to Show <img src="Assets/ReportPage/barChart.gif">`
        // bar.style.display = 'flex'
        // bar.style.alignItems = 'center'
        // bar.style.justifyContent = 'center'
        // bar.style.fontSize = '30px'
        // bar.style.fontWeight = '500'
        // bar.style.letterSpacing = '0px'
    }
})
