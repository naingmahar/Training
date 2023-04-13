const Expense = require("../modal/expense.modal")
var User = require("../modal/user.modal");


class TExpense{
    constructor(label = "",description ="",amount = "",category = ""){
        return {label: this.label,amount:this.amount,description: this.description,category: this.category}
    }
} 

/**
 * @param {TExpense} param 
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function addExpense(param) {
    try {
        const expense = new Expense(param)
        const res = await expense.save()
        User.findById(res.user,(error,userData)=>{
            User.updateOne({_id:res.user},{amount:userData.amount-param.amount},(error,data)=>{
                console.warn(error,data)
            })
        })
        return {data:res}
    } catch (error) {
        return {error}
    }
}

/**
 * @param {String} _id 
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function deleteExpenseByID(_id) {
    return new Promise((res,rej)=>{
        Expense.deleteOne({_id},(error,data)=>{
            if(data) return res({data})
            return res({error})
        })
    })
}


/**
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function getExpense() {
    return new Promise((res,rej)=>{
        Expense.find((error,data)=>{
            if(data) return res({data})
            return res({error})
        })
    })
}


module.exports = {TExpense,deleteExpenseByID,addExpense,getExpense}