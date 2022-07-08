//Imports
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Model
const schematic = mongoose.Schema({
    email : { type : String, required : true, unique : true, },
    password : { type : String, required : true},
});

//Unique email validator
schematic.plugin(uniqueValidator);

//Exports
module.exports = mongoose.model('User', schematic);