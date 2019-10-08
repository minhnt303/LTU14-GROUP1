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
    LogContent:{
        type: String,
        require: true,
    },
    LogDescription:{
        type: String,
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

const historyRouteModel = mongoose.model('HistoryRoute', HistoryRouteSchema);
module.exports = historyRouteModel;
