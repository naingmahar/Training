var { storage } = require("./server");
const fs = require("fs");
var User = require("./src/modal/user.modal");
var multer = require("multer");
const path = require("path");
var { generateAccessToken } = require("./src/middleware/jwt");
const mongoose = require("mongoose");
const { addCategory, Category, getCategories, deleteCategoryByID } = require("./src/Category/Categories.service");
const { addIncome, getIncomes, deleteIncomeByID } = require("./src/Income/Income.service");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let routes = (app) => {
  app.get("/", async (req, res) => {
    res.send("Successful response." + (await mongoose.connection.readyState));
  });

  app.get("/users", async (req, res) => {
    const lock = req.body.auth;
    User.find(function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(data);
    });
  });

  app.delete("/users", async (req, res) => {
    User.deleteOne({_id:req.query.id},function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(data);
    });
  });



  app.post("/permission", async (req, res) => {
    User.updateOne(
      { _id: req.body._id },
      { role: req.body.role },
      function (err, data) {
        if (err) return res.status("500").send(err.message);
        return res.status("200").send(req.body.username + " is locked!");
      }
    );
  });

  app.post("/login", async (req, res) => {
    User.findOne(
      { username: req.body.username, password: req.body.password },
      function (err, data) {
        if (err) return res.status("500").send(err.message);
        if (!data) return res.status("400").send({error:"Invalid Security Code",message:"Fail"});
        return res.status("200").send({
          status: "Success",
          token: generateAccessToken({ username: req.body.username,_id: data._id }),
        });
      }
    );
  });

  app.post("/register", async (req, res) => {
    User.findOne({ username: req.body.username }, function (err, data) {
      if (err) return res.status("500").send(err.message);
      if (data && data._id)
        return res.status("400").send({error:"Username is already exist!"});

      const user = new User({ ...req.body });
      user.save(function (err) {
        if (err) return res.status("500").send(err.message);
        return res.status("200").send({
          message: "Success",
          data: {
            "role": user.role,
            "_id": user._id,
            "username": user.username,
            "name": user.name,
            "age": user.age,
            "phone": user.phone,
            "gender": user.gender,
            "image": user.image,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt
          },
        });
      });
    });
  });

  app.post("/category",async (req,res)=>{
    let user = req.user 
    const servRes = await addCategory({ ...req.body,...{user:user._id} })
    return ReponseService(res,servRes.data,servRes.error)
  })

  app.get("/category",async (req,res)=>{
    const servRes = await getCategories()
    return ReponseService(res,servRes.data,servRes.error)
  })

  app.delete("/category",async (req,res)=>{
    const servRes = await deleteCategoryByID(req.query.id)
    return ReponseService(res,servRes.data,servRes.error)
  })

  app.post("/income",async (req,res)=>{
    let user = req.user 
    const servRes = await addIncome({ ...req.body,...{user:user._id} })
    return ReponseService(res,servRes.data,servRes.error)
  })

  app.get("/income",async (req,res)=>{
    const servRes = await getIncomes()
    return ReponseService(res,servRes.data,servRes.error)
  })

  app.delete("/income",async (req,res)=>{
    const servRes = await deleteIncomeByID(req.query.id)
    return ReponseService(res,servRes.data,servRes.error)
  })

};


const ReponseService = (res,data,error) =>{
  if(data) res.status("200").send(data);
  else res.status("400").send(error)
}

module.exports = { routes };
