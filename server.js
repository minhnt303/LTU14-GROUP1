const express = require('express');
const path = require('path');
var http = require('http').Server(express);
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const appUserModel = require('./model/AppUserModel');
const appUserModelWalletModel = require('./model/AppUserWalletModel');
const historyWalletModel = require('./model/HistoryWalletModel');
// const historyRouteModel = require('./model/HistoryRouteModel');
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

    server.get("/api/appuser", async (req, res) => {
        appUserModel.find({}, function (err, appuser) {
            if (err) {
                res.send('Không tìm thấy người dùng nào !')
                next();
            }
            console.log(appuser);
            res.json(appuser)
        });
    });
    server.post("/api/appuser", async (req, res) => {
        try {
          const username = req.body.username;
          const email = req.body.email;
          const newUser = await appUserModel.create({
            UserName: username,
            Email: email,
          });
    
          res.status(201).json(newUser);
        } catch (error) {
          res.status(error.status || 500).end(error.message || 'Internal server error');
        }
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

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('Server đang chạy trên cổng 3000...')
    });
});