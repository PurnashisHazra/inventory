const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  consumable: {
    type: String,
    required: true,
  },
  captain: {
    type: String,
  },
  sport:{
    type:String,
    required: true,
  }
})

module.exports = mongoose.model('inventory', InventorySchema)
