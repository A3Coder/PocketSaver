const {walletSchema} = require('../models/wallets.js')
const { default: mongoose } = require('mongoose')

//For Getting All Wallets By Username
const getAllWalletsbyUsername = async (req, res) => {
    const newUser = req.params.username
    const userCollection = mongoose.model(newUser, walletSchema, newUser)
    const budgets = await userCollection.find({})
    var DATA = []
    budgets.forEach((items) => { //This is the logic for Getting only WalletName and Amount
        var Object = {
            walletName : items.walletName,
            initialAmount : items.initialAmount
        }
        DATA.push(Object)
    })
    res.send(budgets)
}

//For Getting a Single Wallet Using Wallet Name
const getwalletbyWalletName = async (req, res) => {
    const newUser = req.params.username
    const walletname = req.params.walletname
    const userCollection = mongoose.model(newUser, walletSchema, newUser)
    const budgets = await userCollection.find({ walletName: walletname}).exec()
    const {transactions, walletName} = budgets[0] //This is the Logic for Getting Only the Transactions by WalletName
    var DATA = [ //This is the Logic for Getting Transactions, Updated Amount and Wallet Name by Wallet Name
        {walletName : budgets[0].walletName,
        transactions : budgets[0].transactions,
        updatedAmount : budgets[0].updatedAmount}]
    
    res.send(budgets[0])
}


//For Creating a Wallet
const createWallet = async (req, res) => {
    // res.send("Creating a Wallet")
    const newUser = req.params.username
    const userCollection = mongoose.model(newUser, walletSchema, newUser)
    const walletname = await userCollection.find({walletName : req.body.walletName}).exec()
    if(walletname.length == 0){ //Creating Wallet
        const newWallet2 = await userCollection.create({walletName : req.body.walletName, initialAmount : req.body.initialAmount})
        res.send(newWallet2)
    } else{ //Only Updating Initial Amount
        const updatingIntialAmount = await userCollection.updateOne({ walletName: req.body.walletName }, {$set : {initialAmount : req.body.initialAmount}}).exec()
        res.send(updatingIntialAmount)
    }
}

//For Deleting a Wallet By Id
const deleteWallets = async (req, res) => {
   const newUser = req.params.username
   const userCollection = mongoose.model(newUser, walletSchema, newUser)

   const response = await userCollection.deleteMany({})

   res.send(response)
}

//For Deleting a Transaction Details by ID
const deleteTransactionById = async (req, res) => {
    const newUser = req.params.username
    const category = req.body.category

    if(req.body.allTransactions == true){
        const userCollection = mongoose.model(newUser, walletSchema, newUser)
        const budgets = await userCollection.updateOne({walletName : req.params.walletname}, {$set : {[`transactions.${category}`] : []}}, {new : true})
        res.send(budgets)
    } else if(req.body.dltIncome == true){
        const userCollection = mongoose.model(newUser, walletSchema, newUser)
        const budgets = await userCollection.updateOne({walletName : req.params.walletname}, {$pull : {updatedAmount : req.body.details}})
        res.send(budgets)
    } else{
        const userCollection = mongoose.model(newUser, walletSchema, newUser)
        const budgets = await userCollection.updateOne({walletName : req.params.walletname}, {$pull : {[`transactions.${category}`] : {tId : req.body.tId}}})
        res.send(budgets)
    }
}

//For Updating Transactions or Wallet Amount by Wallet Name
const addTransactionsByWallet = async (req, res) => {
    //Logic for Updating Wallet Amount Only
    if(req.body.updatingAmount == true){
        const newUser = req.params.username
        const walletname = req.params.walletname
        const userCollection = mongoose.model(newUser, walletSchema, newUser)
        const budgets = await userCollection.updateOne({ walletName: walletname }, {$push : {updatedAmount: {amount : req.body.amount, date : req.body.date, notes : req.body.notes}}}).exec()
        res.send(budgets)
        return
    } else{ //Logic For Updating Only Transactions
        const category = req.body.category
        const newUser = req.params.username
        const walletname = req.params.walletname
        const userCollection = mongoose.model(newUser, walletSchema, newUser)
        const budgets = await userCollection.updateOne({ walletName: walletname }, {$push : {[`transactions.${category}`] : {tId : req.body.tId, amountSpent : req.body.amountSpent, date : req.body.date, notes : req.body.notes}}}).exec()
        res.send(budgets)
    }
}

module.exports = {
    getAllWalletsbyUsername,
    getwalletbyWalletName,
    createWallet,
    addTransactionsByWallet,
    deleteTransactionById,
    deleteWallets
}