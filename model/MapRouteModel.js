const mongoose = require('mongoose');
const MapRouteSchema = new mongoose.Schema({
    AppUserId:{
        type: String,
        require: true,
    },
    AppUserType:{
        type: String,
        require: true,
    },
    PositionFrom:{
        type: Array,
        require: true,
    },
    PositionTo:{
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

const mapRouteModel = mongoose.model('MapRoute', MapRouteSchema);
module.exports = mapRouteModel;
