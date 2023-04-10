const Income = require("../modal/income.modal")
var User = require("../modal/user.modal");


class TIncome{
    constructor(label = "",description ="",amount = ""){
        return {label: this.label,amount:this.amount,description: this.description}
    }
} 

/**
 * @param {TIncome} param 
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function addIncome(param) {
    try {
        const income = new Income(param)
        const res = await income.save()
        User.findById(res.user,(error,userData)=>{
            User.updateOne({_id:res.user},{amount:userData.amount+param.amount},(error,data)=>{
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
async function deleteIncomeByID(_id) {
    return new Promise((res,rej)=>{
        Income.deleteOne({_id},(error,data)=>{
            if(data) return res({data})
            return res({error})
        })
    })
}


/**
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function getIncomes() {
    return new Promise((res,rej)=>{
        Income.find((error,data)=>{
            if(data) return res({data})
            return res({error})
        })
    })
}


module.exports = {TIncome,deleteIncomeByID,addIncome,getIncomes}