const mongoose = require('mongoose');
const MapPositionSchema = new mongoose.Schema({
    AppUserId:{
        type: String,
        require: true,
    },
    AppUserType:{
        type: String,
        require: true,
    },
    LatitudePosition:{
        type: String,
        require: true,
    },
    LongitudePosition:{
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

const mapPositionModel = mongoose.model('MapPosition', MapPositionSchema);
module.exports = mapPositionModel;
