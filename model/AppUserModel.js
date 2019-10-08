// import * as AppUserConstant from'../source_code/constant/AppUserConstant';
// var a = AppUserConstant.Customer;
const mongoose = require('mongoose');
const AppUserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        require: true,
    },
    Email: {
        type: String,
        require: true,
    },
    Password: {
        type: String,
        require: true,
    },
    Avatar: {
        type: String,
        require: true,
    },
    UserType: {
        type: String,
        require: true,
    },
    CurrentPosition:{
        type: Array,
        require: true,
    },
    CreatedDate: {
        type: Date,
        default: new Date(),
    },
    CreatedBy: {
        type: String,
        require: true,
    },
});

const appUserModel = mongoose.model('AppUser', AppUserSchema);
module.exports = appUserModel;
