// import * as AppUserConstant from '../HomeArea/AppUserConstant';
// var appUserType = AppUserConstant;
// var a = appUserType.Customer;
var QuangDuong = "";
var ThoiGian = "";
var Money = "";
var LoactionFrom = "";
var LocationTo = "";
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 2
});

if (sessionStorage.getItem("userType") == "Customer") {
    $("#isLoginDriver").hide();
    $("#isLogin").show();
    $("#isNotLogin").hide();
}
else if (sessionStorage.getItem("userType") == "Driver") {
    $("#isLoginDriver").show();
    $("#isLogin").hide();
    $("#isNotLogin").hide();
}else{
    $("#isLoginDriver").hide();
    $("#isLogin").hide();
    $("#isNotLogin").show();
}
function getMeters(i) {
    return i * 1609;
}
function getKiloMeters(i) {
    return i / 1000;
}
function ConvertToMinute(time) {
    var hourPosition = time.search("h");
    var minutePosition = time.search("min");
    if (hourPosition == -1) {
        return time = time.slice(0, minutePosition);
    } else {
        var hour = time.slice(0, hourPosition);
        var minute = time.slice(hourPosition + 2, minutePosition);
        return time = parseInt(minute, 10) + parseInt(hour, 10) * 60;
    }
}
function calculateMoney(long, time) {
    /*Công thức tính cước phí grab
    Giá tối thiểu 2 km đầu tiên là 12.000đ
    Giá cước mỗi km tiếp theo là 3.500đ
    Giá tính theo thời gian di chuyển (sau 2km đầu tiên) 350đ/phút
    */
    long = getKiloMeters(getMeters(long));
    if (long <= 2) {
        return long * 12000;
    } else {
        return 2 * 12000 + (long - 2) * 3500 + (parseInt(time) - 2) * 350;
    }
}
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function getLocationDirectionGuest() {
    // var LoTrinhChuyenDi = map._controls[3].container.innerText;
    var LoTrinhChuyenDiMile = $(".mapbox-directions-route-summary h1").text();
    LoTrinhChuyenDiMile = LoTrinhChuyenDiMile.replace("mi", "");
    QuangDuong = LoTrinhChuyenDiMile;
    if (getMeters(LoTrinhChuyenDiMile) > 1000) {
        LoTrinhChuyenDiMile = getKiloMeters(getMeters(LoTrinhChuyenDiMile)).toLocaleString(undefined, { minimumFractionDigits: 0 }) + "km"
    } else {
        LoTrinhChuyenDiMile = getMeters(LoTrinhChuyenDiMile).toLocaleString(undefined, { minimumFractionDigits: 0 }) + "m"
    }
    var LoTrinhChuyenDiTime = $(".mapbox-directions-route-summary span").text();
    ThoiGian = ConvertToMinute(LoTrinhChuyenDiTime);
    Money = calculateMoney(QuangDuong, ThoiGian);
    document.getElementById("LoTrinhChuyenDi").innerHTML = "<span style='font-size: 25px;'>" + LoTrinhChuyenDiMile + " " + LoTrinhChuyenDiTime + "</span>";
    document.getElementById("TienDi").innerHTML = "<span style='font-size: 25px;'>" + formatter.format(Money) + "</span>";
    LoactionFrom = $('#mapbox-directions-origin-input input').val();
    LocationTo = $('#mapbox-directions-destination-input input').val();
    console.log(LoactionFrom, LocationTo);
}
function findDriver() {
    // $.ajax({
    //     url: '/api/appuser',
    //     type: 'POST',
    //     data: {UserName: "ajsajs",Email: "asdhsa", UserType:"Driver"}
    // }).done(function (data) {
    //     console.log(data);
    // });
    $.ajax({
        url: '/api/finddriver/10/20',
        type: 'GET'
    }).done(function (data) {
        var driverBox = ``;
        data.forEach(element => {
            driverBox += `<div class="col-sm-6">
            <div class="col-sm-12 driverImage">
                <div class="imgAvatar">
                    <img src="${element.Avatar}">
                </div>
                    <div class="col-sm-12 driverInfo">
                        <span>Lái xe: <b>${ShowMessageIfEmpty(element.UserName)}</b></span>
                        <span>Biển số xe: <b>${ShowMessageIfEmpty(element.BikeLicensePlace)}</b></span>
                        <span>Điện thoại: <b>${ShowMessageIfEmpty(element.Phone)}</b></span>
                        <div class="col-sm-12">
                            <button class="btn btn-sm" onclick="ChoseDriver('${element._id}')">Chọn lái xe</button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        document.getElementById("driverGenerator").innerHTML = driverBox;
    });
}
function ChoseDriver(id) {
    console.log(id);
    $("#mapCurrentPosition2").hide();
    $("#InputLocation").hide();
    $("#LocationDirectionGuest").hide();
    $("#CallDriver").hide();
    $("#driverGenerator").hide();
    $("#driverPickerAreaInfo").show();
    $.ajax({
        url: '/api/chosedriver/' + id,
        type: 'GET'
    }).done(function (data) {
        console.log(data);
        var driverBoxInfo = `<div class="col-sm-12 driverImage">
        <div class="imgAvatar">
            <img src="${data[0].Avatar}">
        </div>
            <div class="col-sm-12 driverInfoPickup">
                <span>Lái xe: <b>${ShowMessageIfEmpty(data[0].UserName)}</b></span>
                <span>Biển số xe: <b>${ShowMessageIfEmpty(data[0].BikeLicensePlace)}</b></span>
                <span>Điện thoại: <b>${ShowMessageIfEmpty(data[0].Phone)}</b></span>
                <div class="col-sm-12" id="CloseChoseDriver">
                    <button class="btn btn-sm" onclick="PaymentDriver('${data[0]._id}')">Thanh toán</button>
                    <button class="btn btn-sm" onclick="CloseChoseDriver()">Hủy chuyến</button>
                </div>
            </div>
        </div>`;
        document.getElementById("driverPickerAreaInfo").innerHTML = driverBoxInfo;
    });
}
function CloseChoseDriver() {
    $("#mapCurrentPosition2").show();
    $("#InputLocation").show();
    $("#LocationDirectionGuest").show();
    $("#CallDriver").show();
    $("#driverGenerator").show();
    $("#driverPickerAreaInfo").hide();
}
function PaymentDriver(id) {
    // document.getElementById("driverPickerAreaInfo").innerHTML = document.getElementById("driverPickerAreaInfo").innerHTML + `
    //             <div class="col-sm-12" style="padding:0px">
    //                 <div class="alert alert-success alert-dismissible fade in">
    //                     <a href="#" class="close" data-dismiss="alert" aria-label="close" style="top: -8px;">&times;</a>
    //                     <strong>Thanh toán thành công!</strong> Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
    //                 </div>
    //             </div>`;
    //             document.getElementById("CloseChoseDriver").innerHTML = `
    //                 <button class="btn btn-sm" onclick="CloseChoseDriver()"style="width: 95%;">Đóng</button>
    //             `;
    if (sessionStorage.getItem("LoginId") != null && sessionStorage.getItem("LoginId") != "") {
        $.ajax({
            url: '/api/paymentdriver/',
            type: 'POST',
            data: { LoginId: sessionStorage.getItem("LoginId"), DriverId: id, "Money": Money, "LocationFrom": LoactionFrom, "LocationTo": LocationTo },
            success: (data) => {
                console.log("Thanh toán thành công!")
                document.getElementById("driverPickerAreaInfo").innerHTML = document.getElementById("driverPickerAreaInfo").innerHTML + `
                <div class="col-sm-12" style="padding:0px">
                    <div class="alert alert-success alert-dismissible fade in">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close" style="top: -8px;">&times;</a>
                        <strong>Thanh toán thành công!</strong> Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                    </div>
                </div>`;
                document.getElementById("CloseChoseDriver").innerHTML = `
                    <button class="btn btn-sm" onclick="CloseChoseDriver()"style="width: 95%;">Đóng</button>
                `;
            },
        });
        $.ajax({
            url: '/api/getmoney/' + sessionStorage.getItem("LoginId"),
            type: 'GET'
        }).done(function (data) {
            document.getElementById("moneyArea").innerHTML = data.Money;
        });
    }
}

$("#BikeLicensePlaceRegister").hide();
$("#BikeLicensePlaceText").hide();
function ChoseUserType() {
    if (document.getElementById("UserTypeRegister").value == "Driver") {
        $("#BikeLicensePlaceRegister").show();
        $("#BikeLicensePlaceText").show();
    }
    else {
        $("#BikeLicensePlaceRegister").hide();
        $("#BikeLicensePlaceText").hide();
    }
}
document.getElementById('register-button').addEventListener('click', (e) => {
    let Email = document.getElementById("EmailRegister").value;
    let Password = document.getElementById("PasswordREgister").value;
    let UserName = document.getElementById("UserNameRegister").value;
    let Phone = document.getElementById("PhoneRegister").value;
    let UserType = document.getElementById("UserTypeRegister").value;
    let BikeLicensePlace = document.getElementById("BikeLicensePlaceRegister").value;
    if (UserType != "-1") {
        $.ajax({
            url: '/api/appuser',
            type: 'POST',
            data: { Email: Email, Password: Password, UserName: UserName, Phone: Phone, UserType: UserType, BikeLicensePlace: BikeLicensePlace },
            success: (data) => {
                console.log("Đăng ký tài khoản thành công!");
                sessionStorage.setItem("userType",UserType);
                sessionStorage.setItem("LoginId",data._id);
                $('.close').click();
                if (UserType == "Customer") {
                    $("#isLoginDriver").hide();
                    $("#isLogin").show();
                    $("#isNotLogin").hide();
                }
                else if (UserType == "Driver") {
                    $("#isLoginDriver").show();
                    $("#isLogin").hide();
                    $("#isNotLogin").hide();
                }
            },
        });
    }
});
document.getElementById('login-button').addEventListener('click', (e) => {
    let Email = document.getElementById("EmailLogin").value;
    let Password = document.getElementById("PasswordLogin").value;
    if(Email == "" || Password == "" || Email == null|| Password == null){
        PopupError("Bạn chưa nhập Email và mật khẩu đăng nhập!");
    }else{
        $.ajax({
            url: '/api/appuser/'+Email+'/'+Password,
            type: 'GET',
            success: (data) => {
                console.log("Đăng nhập tài khoản thành công!");
                console.log(data);
                sessionStorage.setItem("userType",data.UserType);
                sessionStorage.setItem("LoginId",data._id);
                $('.close').click();
                if (data.UserType == "Customer") {
                    $("#isLoginDriver").hide();
                    $("#isLogin").show();
                    $("#isNotLogin").hide();
                }
                else if (data.UserType == "Driver") {
                    $("#isLoginDriver").show();
                    $("#isLogin").hide();
                    $("#isNotLogin").hide();
                }
                PopupError("Đăng nhập tài khoản thành công!");
            },
            error: (error) => { console.log(error) 
                PopupError("Sai Email hoặc mật khẩu đăng nhập!");
            }
        });
    }
});
function Direction() {
    if ($(".mapbox-directions-instructions")[0]) {
        $(".mapbox-directions-instructions").hide();
    } else if (!$(".mapbox-directions-instructions")[0]) {
        $(".mapbox-directions-instructions").show();
    }
}
function openNavBar() {
    $("#closeNavBar").show();
    $("#openNavBar").hide();
}
function closeNavBar() {
    $("#closeNavBar").hide();
    $("#openNavBar").show();
}
function openSettingLayerButton() {
    $("#closeSetting").show();
    $("#openSetting").hide();
    $("#menu").show();
    layer = sessionStorage.getItem("mapLayer");
    $("#" + layer).prop("checked", true);
}
function closeSettingLayerButton() {
    $("#closeSetting").hide();
    $("#openSetting").show();
    $("#menu").hide();
}
var layer = "streets-v11";
if (sessionStorage.getItem("mapLayer") != null && sessionStorage.getItem("mapLayer") != "") {
    layer = sessionStorage.getItem("mapLayer");
    $("#" + layer).prop("checked", true);
} else {
    $("#streets-v11").prop("checked", true);
}
var windowHeight = $(window).height() - 30;
var windowWidth = $(window).width() - 15;
var windowMinWidth = $(window).width() / 2 - 15;
function zoomMap() {
    $("#mapCurrentPosition").show();
    $("#zoomInMap").show();
    $("#zoomMap").hide();
    $(".mapItem").hide();
    $(".navBarArea").hide();
    $("#map").css("width", windowWidth);
    map.resize();
}
function zoomInMap() {
    $("#mapCurrentPosition").hide();
    $("#zoomInMap").hide();
    $("#zoomMap").show();
    $(".mapItem").show();
    $(".navBarArea").show();
    $("#map").css("width", windowMinWidth);
    map.resize();
}
$(document).ready(function () {
    $("#zoomInMap").hide();
    $("#mapCurrentPosition").hide();
    $("#map").css("height", windowHeight);
    $(".mapItem").css("height", windowHeight + 30);
    $("#closeSetting").hide();
    $("#closeNavBar").hide();
    $("#menu").hide();
});
mapboxgl.accessToken = 'pk.eyJ1IjoibWluaG50dXllbiIsImEiOiJjazEwNWkyMWcwMjRhM2hwYmVybWlmenN4In0.w81DZILIiJNnmQV4Dg6JYA';
function getInputLocation() {
    if (!$(".mapboxgl-ctrl-directions")[0]) {
        map.addControl(new MapboxDirections({
            accessToken: mapboxgl.accessToken
        }), 'top-left');
    }
    var visibility = map.getLayoutProperty('points', 'visibility');
    console.log(visibility);
    if (visibility === 'visible') {
        map.setLayoutProperty('points', 'visibility', 'none');
    } else {
        map.setLayoutProperty('points', 'visibility', 'visible');
    }

    if (sessionStorage.getItem("Latitude") != null && sessionStorage.getItem("Latitude") != "" && sessionStorage.getItem("Longitude") != null && sessionStorage.getItem("Longitude") != "") {
        $('#mapbox-directions-origin-input input').val(sessionStorage.getItem("Longitude") + ',' + sessionStorage.getItem("Latitude"));

    }
    $('#mapbox-directions-origin-input input').focus();
}

// var x = document.getElementById("demo");
function getLocation() {
    var visibility = map.getLayoutProperty('points', 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty('points', 'visibility', 'none');
    } else {
        map.setLayoutProperty('points', 'visibility', 'visible');
    }
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        // x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
// var n =1000;
// var value = n.toLocaleString(
//     undefined,{ minimumFractionDigits: 2 }
//   );
//   console.log(value);
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/' + layer,
    center: [105.8444083, 21.004097599999998],
    zoom: 15
});
if (sessionStorage.getItem("Latitude") != null && sessionStorage.getItem("Latitude") != "" && sessionStorage.getItem("Longitude") != null && sessionStorage.getItem("Longitude") != "") {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/' + layer,
        center: [sessionStorage.getItem("Longitude"), sessionStorage.getItem("Latitude")],
        zoom: 15
    });
}

$(function () {
    // Getter
    var minWidth = $(".selector").resizable("option", "minWidth");
    // Setter
    $(".selector").resizable("option", "minWidth", windowMinWidth);
    // Getter
    var maxWidth = $(".selector").resizable("option", "maxWidth");
    // Setter
    $(".selector").resizable("option", "maxWidth", windowWidth);
    // Getter
    var maxHeight = $(".selector").resizable("option", "maxHeight");
    // Setter
    $(".selector").resizable("option", "maxHeight", windowHeight);
    $("#map").resizable({
        maxHeight: windowHeight,
        maxWidth: windowWidth,
        minWidth: windowMinWidth
    });
    map.resize();
});

$("#map").resize(function (e) {
    console.log($("#map").width(), windowWidth);
    if ($("#map").width() > (windowMinWidth + 15)) {
        $("#map").css("z-index", 10);
    }
    else {
        $("#map").css("z-index", "unset");
    }
    if ($("#map").width() > (windowWidth - 10)) {
        $("#mapCurrentPosition").show();
        $("#zoomInMap").show();
        $("#zoomMap").hide();
        $(".mapItem").hide();
        $("#map").css("z-index", "unset");
    } else {
        $("#mapCurrentPosition").hide();
        $("#zoomInMap").hide();
        $("#zoomMap").show();
        $(".mapItem").show();
        $("#map").css("z-index", 20);
    }
    map.resize();
});

map.addControl(new mapboxgl.NavigationControl());

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
    var layerId = layer.target.id;
    layer = layerId;
    sessionStorage.setItem("mapLayer", layer);
    map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}
function showPosition(position) {
    // x.innerHTML = "Latitude: " + position.coords.latitude +
    //     "<br>Longitude: " + position.coords.longitude;
    if (sessionStorage.getItem("mapLayer") != null && sessionStorage.getItem("mapLayer") != "") {
        layer = sessionStorage.getItem("mapLayer");
    }
    if (sessionStorage.getItem("Latitude") != null && sessionStorage.getItem("Latitude") != "" && sessionStorage.getItem("Longitude") != null && sessionStorage.getItem("Longitude") != "") {
        map.flyTo({
            center: [sessionStorage.getItem("Longitude"), sessionStorage.getItem("Latitude")]
        });
    }
    else {
        sessionStorage.setItem("Latitude", position.coords.latitude);
        sessionStorage.setItem("Longitude", position.coords.longitude);
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/' + layer,
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 15
        });
        map.addControl(new mapboxgl.NavigationControl());
        var size = 200;
        var pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd: function () {
                var canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            render: function () {
                var duration = 1000;
                var t = (performance.now() % duration) / duration;

                var radius = size / 2 * 0.3;
                var outerRadius = size / 2 * 0.7 * t + radius;
                var context = this.context;

                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                context.fill();

                // draw inner circle
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(255, 100, 100, 1)';
                context.strokeStyle = 'white';
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();

                // update this image's data with data from the canvas
                this.data = context.getImageData(0, 0, this.width, this.height).data;

                // keep the map repainting
                map.triggerRepaint();

                // return `true` to let the map know that the image was updated
                return true;
            }
        };

        function switchLayer(layer) {
            var layerId = layer.target.id;
            layer = layerId;
            sessionStorage.setItem("mapLayer", layer);
            map.setStyle('mapbox://styles/mapbox/' + layerId);
            showPosition(position);
        }

        for (var i = 0; i < inputs.length; i++) {
            inputs[i].onclick = switchLayer;
        }
        map.on('load', function () {
            map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

            map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [position.coords.longitude, position.coords.latitude]
                            }
                        }]
                    }
                },
                "layout": {
                    "icon-image": "pulsing-dot"
                }
            });
        });
    }
}

