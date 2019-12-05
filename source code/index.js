const express = require('express');
const path = require('path');
var http = require('http').Server(express);
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const appUserModel = require('./model/AppUserModel');
// const Socketio = require("socket.io")(http);
const appUserModelWalletModel = require('./model/AppUserWalletModel');
const historyWalletModel = require('./model/HistoryWalletModel');
const historyRouteModel = require('./model/HistoryRouteModel');
const mapPositionModel = require('./model/MapPositionModel');
const mapRouteModel = require('./model/MapRouteModel');
var Message = mongoose.model('Message', {
    name: String,
    message: String
})
var UserId = "";
var UserName = "Anonymous";
mongoose.connect('mongodb://mongo:27017/grabbike', (err) => {
    if (err) {
        throw err;
    }
    console.log('Kết nối với mongodb thành công!')
    const server = express();

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
        console.log(1)
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
            await appUserModel.findOne({ Email: Email }).then(function (user) {
                if (user) {
                    var err = new Error('A user with that email has already registered. Please use a different email..')
                    err.status = 400;
                    return next(err);
                } else {
                    const newUser = appUserModel.create({
                        UserName: UserName,
                        Email: Email,
                        UserType: UserType,
                        Password: Password,
                        Phone: Phone,
                        BikeLicensePlace: BikeLicensePlace
                    });
                    res.json(newUser);
                    console.log(newUser)
                }
            });
        } catch (error) {
            res.status(error.status || 500).end(error.message || 'Internal server error');
        }
    });
    server.get("/api/checkemailexist/:Email", async (req, res) => {
        const { Email } = req.params;
        appUserModel.find({ "Email": Email }, function (err, appuser) {
            res.json(appuser[0])
        });
    });
    server.get("/api/appuser/:Email/:Password", async (req, res) => {
        const { Email, Password } = req.params;
        appUserModel.find({ "Email": Email, "Password": Password }, function (err, appuser) {
            if (err) {
                res.send('Không tìm thấy người dùng nào !')
                next();
            }
            res.json(appuser[0])
            UserId = appuser[0]._id;
            UserName = appuser[0].UserName;
        });
    });

	  // io.on('connection', function(socket){
  //     socket.on('chat message', function(msg){
  //       io.emit('chat message', msg);
  //     });
  //   });

  // server.get("/api/product", async (req, res) => {
  //     // productModel.find({}, function (err, product) {
  //     //     if (err) {
  //     //         res.send('something aSSADASD')
  //     //         next();
  //     //     }
  //     //     res.json(product)
  //     // })

  //     try {
  //         const { pageNumber, pageSize } = req.query;
  //         const totalRecord = await productModel.find().countDocuments();
  //         const data = await productModel.find({})
  //             .skip(pageSize * (pageNumber - 1))
  //             .limit(Number(pageSize))
  //             .exec();
  //         res.status(200).json(data)
  //     } catch (err) {
  //         res.status(500).end(err.message)
  //     }
  // });

  // server.post("/api/product", async (req, res) => {
  //     var product = new productModel(req.body);
  //     product.save(function (err, product) {
  //         res.json(product)
  //     })
  // });

  // server.get("/search/:searchname", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/search/search.html"));
  // });

  // server.get("/detail/:productid", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/detail/detail.html"));
  // });

  // server.get("/api/user", async (req, res) => {
  //     userModel.find({}, function (err, user) {
  //         if (err) {
  //             res.send('something aSSADASD')
  //             next();
  //         }
  //         res.json(user)
  //     })
  // });

  // server.get("/api/seller", async (req, res) => {
  //     sellerModel.find({}, function (err, seller) {
  //         if (err) {
  //             res.send('something aSSADASD')
  //             next();
  //         }
  //         res.json(seller)
  //     })
  // });

  // server.get("/api/order", async (req, res) => {
  //     orderModel.find({}, function (err, order) {
  //         if (err) {
  //             res.send('something aSSADASD')
  //             next();
  //         }
  //         res.json(order)
  //     })
  // });

  // server.get("/api/sellerregister", async (req, res) => {
  //     sellerRegisterModel.find({}, function (err, order) {
  //         if (err) {
  //             res.send('something aSSADASD')
  //             next();
  //         }
  //         res.json(order)
  //     })
  // });

  // server.get("/register", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/register/register.html"));
  // });

  // server.get("/login", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/login/login.html"));
  // });

  // server.get("/sellerregister", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/seller/register/register.html"));
  // });

  // server.get("/sellerlogin", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/seller/login/login.html"));
  // });

  // server.get("/cart", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/cart/cart.html"));
  // });

  // server.get("/saveproduct", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/saveproduct/saveproduct.html"));
  // });

  // server.get("/mainpage", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/seller/mainpage/mainpage.html"));
  // });

  // server.get("/cart/:userId/:productId", async (req, res) => {
  //     const { userId, productId } = req.params;
  //     console.log(userId,productId);
  //     const existedUser = await userModel.findById(userId).exec();
  //     if (!existedUser) {
  //         console.log(1)
  //         res.status(404).end('User not found');
  //     } else {
  //         await userModel.findByIdAndUpdate(userId, { $push: { cart: productId } }).exec();
  //         res.redirect('http://localhost:3000/cart')
  //     }
  // })

  // server.get("/removecart/:userId/:productId", async (req, res) => {
  //     const { userId, productId } = req.params;
  //     console.log(userId,productId);
  //     const existedUser = await userModel.findById(userId).exec();
  //     if (!existedUser) {
  //         console.log(1)
  //         res.status(404).end('User not found');
  //     } else {
  //         await userModel.findByIdAndUpdate(userId, { $pull: { cart: productId } }).exec();
  //         res.redirect('http://localhost:3000/cart')
  //     }
  // })

  // server.get("/decreaeProductQuantity/:productId/:quantity", async (req, res) => {
  //     const { productId, quantity } = req.params;
  //     console.log(productId,quantity);
  //     const existedUser = await productModel.findById(productId).exec();
  //     if (!existedUser) {
  //         console.log(1)
  //         res.status(404).end('User not found');
  //     } else {
  //         await productModel.findByIdAndUpdate(productId, { $inc: { quantity: -quantity }}).exec();
  //         res.redirect('http://localhost:3000/adminOrder')
  //     }
  // })

  // server.get("/removeOrder/:orderId", async (req, res) => {
  //     const { orderId } = req.params;
  //     console.log(orderId);
  //     const existedUser = await orderModel.findById(orderId).exec();
  //     if (!existedUser) {
  //         console.log(1)
  //         res.status(404).end('User not found');
  //     } else {
  //         await orderModel.findById(orderId).remove().exec();;
  //         res.redirect('http://localhost:3000/adminOrder')
  //     }
  // })

  // server.get("/removeSellerRequest/:requestId", async (req, res) => {
  //     const { requestId } = req.params;
  //     console.log(requestId);
  //     const existedUser = await sellerRegisterModel.findById(requestId).exec();
  //     if (!existedUser) {
  //         console.log(1)
  //         res.status(404).end('User not found');
  //     } else {
  //         await sellerRegisterModel.findById(requestId).remove().exec();;
  //         res.redirect('http://localhost:3000/adminSellerRegister')
  //     }
  // })

  // server.get("/saveproduct/:userId/:productId", async (req, res) => {
  //     const { userId, productId } = req.params;
  //     console.log(userId,productId);
  //     const existedUser = await userModel.findById(userId).exec();
  //     if (!existedUser) {
  //         console.log(1)
  //         res.status(404).end('User not found');
  //     } else {
  //         await userModel.findByIdAndUpdate(userId, { $push: { saveproduct: productId } }).exec();
  //         res.redirect('http://localhost:3000/saveproduct')
  //     }
  // })

  // server.get("/removesaveproduct/:userId/:productId", async (req, res) => {
  //     const { userId, productId } = req.params;
  //     console.log(userId,productId);
  //     const existedUser = await userModel.findById(userId).exec();
  //     if (!existedUser) {
  //         console.log(1)
  //         res.status(404).end('User not found');
  //     } else {
  //         await userModel.findByIdAndUpdate(userId, { $pull: { saveproduct: productId } }).exec();
  //         res.redirect('http://localhost:3000/saveproduct')
  //     }
  // })

  // server.post("/register", async (req, res) => {
  //     console.log(req.body);
  //     var user = new userModel(req.body);
  //     user.save(function (err, user) {
  //         res.json(user)
  //     })
  // });

  // server.post("/sellerregister", async (req, res) => {
  //     console.log(req.body);
  //     var seller = new sellerModel(req.body);
  //     seller.save(function (err, seller) {
  //         res.json(seller)
  //     })
  // });

  // server.post("/sellerRegisterAdminPage", async (req, res) => {
  //     console.log(req.body);
  //     var seller = new sellerRegisterModel(req.body);
  //     seller.save(function (err, seller) {
  //         res.json(seller)
  //     })
  // });

  // server.post("/order", async (req, res) => {
  //     console.log(req.body);
  //     var order = new orderModel(req.body);
  //     order.save(function (err, user) {
  //         res.json(order)
  //     })
  // });

  // //Admin page
  // server.get("/adminLogin", async(req,res)=>{
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/admin/adminLogin/adminLogin.html"));
  // })

  // server.get("/adminOrder", async(req,res)=>{
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/admin/adminOrder/adminOrder.html"));
  // })

  // server.get("/adminOrderDetail/:orderid", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/admin/adminOrder/adminOrderDetail/adminOrderDetail.html"));
  // });

  // server.get("/adminSellerRegister", (req, res) => {
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/admin/adminSellerRegister/adminSellerRegister.html"));
  // });

  // server.get("/admin", async(req,res)=>{
  //     res.status(200).sendFile(path.resolve(__dirname + "/public/admin/adminMainPage/adminMainPage.html"));
  // })
  
    var app =  server.listen(3000, (err) => {
        if (err) throw err;
        console.log('Server đang chạy trên cổng 3000...')
    });
    var io = require('socket.io').listen(app);
    console.log(UserId)
    io.on('connection', (socket) => {
        console.log('New user connected')
    
        //default username
        socket.username = UserName
        //listen on change_username
        socket.on('change_username', (data) => {
            socket.username = data.username
        })
    
        //listen on new_message
        socket.on('new_message', (data) => {
            //broadcast the new message
            io.sockets.emit('new_message', {message : data.message, username : socket.username});
        })
    
        //listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {username : socket.username})
        })
    })
});