const UNIVERSITY_API_URL = "http://universities.hipolabs.com/search?country=thailand"

/**
 * @param {String} URL 
 * @param {(data=[],error="")=>{}} Cb 
 */
function CommonApi(URL,Cb) {
    fetch(URL)
    .then((data)=>{
        return data.json();
    })
    .then((data)=>{
        Cb(data)
    })
    .catch(error=>Cb(null,error))
}




