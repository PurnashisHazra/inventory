const router = require('express').Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const mongoose = require('mongoose')
const Inventory = require('../models/Inventory')
const { arrayBuffer } = require('stream/consumers')

router.get('/', ensureGuest ,async(req, res) => {
  
    res.render('login')
  })

router.get("/log",ensureAuth, async(req,res)=>{
  const inv = await Inventory.find()
    console.log(inv)
    res.render('index',{userinfo:{user: req.user, data: inv}})
})
router.get("/add",ensureAuth, async(req,res)=>{

    res.render('add',{userinfo:{user: req.user}})
})
router.post("/add",ensureAuth, async(req,res)=>{

  res.send({})
})
router.get("/dash",ensureAuth, async(req,res)=>{
  const inv = await Inventory.aggregate(
    [
      {
        $group:
          {
            _id: { sport: "$sport" },
            totalAmount: { $sum:  "$quantity" },
            totalExp: { $sum: { $multiply: [ "$price", "$quantity" ] } },
            count: { $sum: 1 }
          }
      }
    ]
 )
 
    var  arr= []
    for(let i = 0; i<inv.length;i++){
      arr.push({sport:inv[i]._id.sport, quantity: inv[i].totalAmount, expenditure: inv[i].totalExp})
    }
    console.log(arr)
    res.render('dashboard',{userinfo:{user: req.user, data: arr}})
})
module.exports=router;