const mongoose = require('mongoose');
const HistoryRouteSchema = new mongoose.Schema({
    AppUserId:{
        type: String,
        require: true,
    },
    AppUserType:{
        type: String,
        require: true,
    },
    WalletNumber:{
        type: Number,
        default: 0,
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

const historyRouteModel = mongoose.model('AppUserWallet', HistoryRouteSchema);
module.exports = historyRouteModel;
