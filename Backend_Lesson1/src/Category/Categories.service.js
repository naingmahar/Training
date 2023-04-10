const Categories = require("../modal/categories.modal")

class Category{
    constructor(label = "",description ="",user=""){
        return this
    }
} 

/**
 * @param {Category} param 
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function addCategory(param) {
    try {
        const categoy = new Categories(param)
        const res = await categoy.save()
        return {data:res}
    } catch (error) {
        return {error}
    }
}

/**
 * @param {String} _id 
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function deleteCategoryByID(_id) {
    return new Promise((res,rej)=>{
        Categories.deleteOne({_id},(error,data)=>{
            if(data) return res({data})
            return res({error})
        })
    })
}


/**
 * @returns {Promise<{data:any}|{error:any}>}
 */
async function getCategories() {
    return new Promise((res,rej)=>{
        Categories.find((error,data)=>{
            if(data) return res({data})
            return res({error})
        })
    })
}


module.exports = {Category,addCategory,getCategories,deleteCategoryByID}