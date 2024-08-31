
//Fetching Transactions Details From LocalStorage
// const userData = JSON.parse(window.localStorage.getItem(lastInsertedBudget))
// const categoriesArray = userData != null ? Object.keys(userData) : []

dltBTNs.forEach((BTN) => {
    BTN.addEventListener('click', function getData(){

        if(confirm("Are You Sure You want to Delete this Transaction?")){
            // const getCategory = BTN.parentElement.parentElement.children[0].children[0].childNodes[0].data
            // console.log(getCategory)
    
            const getId = BTN.parentElement.children[0].innerText
            
            // let index = -1
            // for(i=0;i<userData[getCategory].length; i++){
            //     console.log(userData[getCategory][i])
            //     if(userData[getCategory][i].id == getId){
            //         index = i
            //         if(userData[getCategory].length == 1){
            //             delete userData[getCategory]
            //             break
            //         } else{
            //             userData[getCategory].splice(index, 1)
            //             break
            //         }
            //     }
            // }
    
            // window.localStorage.setItem(lastInsertedBudget, JSON.stringify(userData))
            // window.location.reload()

            newData = {tId : getId,  category: selectedCategory.innerText}

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