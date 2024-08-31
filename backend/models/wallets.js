//Schema for Wallet
const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema(
    {
        walletName: { type: String, required: true, unique: true },
        initialAmount: { type: Number, required: true },
        updatedAmount: [{ amount: Number, date: String, notes: String }],
        transactions:
        {
            [`Food & Beverage`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Transportation: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Rentals: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Water Bill`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Phone Bill`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Electricity Bill`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Gas Bill`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Television Bill`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Internet Bill`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Home Maintenance`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Vehicle Maintenance`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Medical Check Up`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Insurances: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Education: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Houseware: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Personal Items`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Pets: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Home Services`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Fitness: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Makeup: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Gifts & Donations`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Streaming Services`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            Investment: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Loan Repayment`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Pay Interest`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }],
            [`Other Expenses`]: [
                {tId: {type : Number, unique: true}, amountSpent: Number, date: String, notes: String }]
        }
    }
)

// module.exports = mongoose.model("wallets", walletSchema)
module.exports = { walletSchema }
