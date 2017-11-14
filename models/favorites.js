const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const favoriteSchema = new Schema({
  dishes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish'
    }
  ],
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{
  timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
