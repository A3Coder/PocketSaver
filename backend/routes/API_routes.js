const express = require('express')
const router = express.Router()
const {getAllWalletsbyUsername, getwalletbyWalletName, createWallet, addTransactionsByWallet, deleteTransactionById, deleteWallets} = require('../controllers/functions.js')


//For Getting, Creating and Deleting Wallet by Username
router.route('/:username').get(getAllWalletsbyUsername).post(createWallet).delete(deleteWallets)

//For Getting Wallet, Creating and Deleting Transactions by Wallet Name
router.route('/:username/:walletname').get(getwalletbyWalletName).patch(addTransactionsByWallet).delete(deleteTransactionById)

module.exports = router
