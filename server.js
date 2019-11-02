const express = require('express');
const path = require('path');
var http = require('http').Server(express);
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const appUserModel = require('./model/AppUserModel');
const appUserModelWalletModel = require('./model/AppUserWalletModel');
const historyWalletModel = require('./model/HistoryWalletModel');
const historyRouteModel = require('./model/HistoryRouteModel');
const mapPositionModel = require('./model/MapPositionModel');
const mapRouteModel = require('./model/MapRouteModel');
mongoose.connect('mongodb://localhost:27017/grabbike', (err) => {
    if (err) {
        throw err;
    }
    console.log('Kết nối với mongodb thành công!')

    const server = express();
    // const io = require('socket.io')(http)
    server.use(express.static('public'));
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.get("/", (req, res) => {
        res.status(200).sendFile(path.resolve(__dirname + "/public/HomeArea/home.html"));
    });
    server.get("/map", (req, res) => {
        res.status(200).sendFile(path.resolve(__dirname + "/source_code/mapboxtest.html"));
    });

    server.get("/api/finddriver/:lat/:long", async (req, res) => {
        var appUser = new Array();
        const { lat, long } = req.params;
        appUserModel.find({ "UserType": "Driver", "CurrentPosition": { $exists: true } }, function (err, driver) {
            if (err) {
                res.send('Không tìm thấy người dùng nào !')
                next();
            }
            driver.forEach(element => {
                if (element.CurrentPosition != [] && element.CurrentPosition.length != 0) {
                    if (element.CurrentPosition[0].LatitudePosition != 0 && element.CurrentPosition[0].LongitudePosition != 0) {
                        var distantCal = Math.sqrt((parseFloat(element.CurrentPosition[0].LatitudePosition) - parseFloat(lat)) * (parseFloat(element.CurrentPosition[0].LatitudePosition) - parseFloat(lat)) + (parseFloat(element.CurrentPosition[0].LongitudePosition) - parseFloat(long)) * (parseFloat(element.CurrentPosition[0].LongitudePosition) - parseFloat(long)));
                        // console.log(distantCal);
                        // console.log(element);
                        if (parseFloat(distantCal) <= 0.01 && parseFloat(distantCal) >= 0) {
                            appUser.push(element);
                        }
                    }
                }
            });
            res.json(appUser)
        });
    });
    server.get("/api/chosedriver/:id", async (req, res) => {
        const { id } = req.params;
        appUserModel.findById(id).find({ "UserType": "Driver", "CurrentPosition": { $exists: true } }, function (err, driver) {
            if (err) {
                res.send('Không tìm thấy người dùng nào !')
                next();
            }
            res.json(driver)
        });
    });
    server.get("/api/getmoney/:id", async (req, res) => {
        const { id } = req.params;
        appUserModel.findById(id).find({}, function (err, appuser) {
            if (err) {
                res.send('Không tìm thấy người dùng nào !')
                next();
            }
            res.json(appuser)
        });
    });

    server.post("/api/paymentdriver/", async (req, res) => {
        try {
            const LoginId = req.body.LoginId;
            const DriverId = req.body.DriverId;
            const Money = req.body.Money;
            const LocationFrom = req.body.LocationFrom;
            const LocationTo = req.body.LocationTo;
            const newHistoryMapRoute = await historyRouteModel.create({
                AppUserId: LoginId,
                AppUserType: "Customer",
                DriverId: DriverId,
                LogContent: "Số tiền trả " + Money,
                LogDescription: "Quãng đường đi từ " + LocationFrom + " đến " + LocationTo,
                CreatedBy: LoginId
            });
            res.status(201).json(newHistoryMapRoute);
            appUserModel.findByIdAndUpdate(LoginId, { $inc: { Money: -Money } }).exec();
            appUserModel.findByIdAndUpdate(DriverId, { $inc: { Money: Money } }).exec();
        } catch (error) {
            res.status(error.status || 500).end(error.message || 'Internal server error');
        }
    });

    server.post("/api/appuser", async (req, res) => {
        try {
            const UserName = req.body.UserName;
            const Email = req.body.Email;
            const UserType = req.body.UserType;
            const Password = req.body.Password;
            const Phone = req.body.Phone;
            const BikeLicensePlace = req.body.BikeLicensePlace;
            const newUser = await appUserModel.create({
                UserName: UserName,
                Email: Email,
                UserType: UserType,
                Password: Password,
                Phone: Phone,
                BikeLicensePlace: BikeLicensePlace
            });

            res.status(201).json(newUser);
        } catch (error) {
            res.status(error.status || 500).end(error.message || 'Internal server error');
        }
    });
    server.get("/api/appuser/:Email/:Password", async (req, res) => {
        const { Email, Password } = req.params;
        console.log(Email, Password)
        appUserModel.find({ "Email": Email, "Password": Password }, function (err, appuser) {
            if (err) {
                res.send('Không tìm thấy người dùng nào !')
                next();
            }
            res.json(appuser[0])
        });
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('Server đang chạy trên cổng 3000...')
    });
});