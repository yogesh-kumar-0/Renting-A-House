const { set } = require('mongoose');
const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    rating:{type:Number,min:1,max:5,required:true},
    createAt:{
        type:Date,
        dafault: Date.now(),
        set: (v) => v === "" ? Date.now() : v
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        
    }



});

module.exports = mongoose.model('Review', reviewSchema);