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
        default:"/image/favicon.png",
        type: String,
        require: true,
    },
    UserType: {
        type: String,
        require: true,
    },
    CurrentPosition:{
        default:[],
        type: Array,
        require: true,
    },
    Phone:{
        type: String,
        require: true,
    },
    Money:{
        type: Number,
        default:0,
        require: true,
    },
    BikeLicensePlace:{
        type: String,
        require: true,
    },
    CreatedDate: {
        type: Date,
        default: new Date(),
    },
    CreatedBy: {
        default:"Admin",
        type: String,
        require: true,
    },
});

const appUserModel = mongoose.model('AppUser', AppUserSchema);
module.exports = appUserModel;
