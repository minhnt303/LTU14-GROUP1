function ShowMessageIfEmpty(message) {
    if (message == null || message == "") {
        return "Chưa cập nhật!";
    }
    else {
        return message;
    }
}

function PopupError(message) {
    var textmessage = message;
    document.getElementById("waringAlert").innerHTML = `
        <div class="waringAlertArea">
            <h4><b>Lỗi!</b></h4>
            <span>`+ textmessage + `</span>
        </div>
    `;
    $("#waringAlert").show();
    setTimeout(function () {
        $("#waringAlert").hide('blind', {}, 500)
    }, 3000);
}

function PopupSuccess(message) {
    var textmessage = message;
    document.getElementById("successAlert").innerHTML = `
        <div class="successAlertArea">
            <h4><b>Thành công!</b></h4>
            <span>`+ textmessage + `</span>
        </div>
    `;
    $("#successAlert").show();
    setTimeout(function () {
        $("#successAlert").hide('blind', {}, 500)
    }, 3000);
}

function DisplayUserInfo(data) {
    if (data.UserType == "Driver") {
        var displayHtml = `
            <img src="/image/favicon.png">
            <div class="userName">
                <h3><b>${ShowMessageIfEmpty(data.UserName)}</b></h3>
            </div>
            <div class="userDetail"><span class="glyphicon glyphicon-user" style="font-size: 14px;"></span>
                Thông tin tài khoản</div>
            <div class="historyDriveRoute">
                <a data-toggle="modal" data-target="#myModalHistoryRoute"  onclick="OpenHistoryRoute()">
                        <span class="glyphicon glyphicon-road" style="font-size: 14px;"></span>
                        Lịch sử chở khách
                    </a>
            </div>
            <div class="walletHistory">
                <a data-toggle="modal" data-target="#myModalWallet" onclick="OpenWallet()">
                    <span class="glyphicon glyphicon-usd" style="font-size: 14px;"></span>
                    Ví của bạn
                </a>
            </div>
            <div class="settingDetail"><span class="glyphicon glyphicon-asterisk"
                    style="font-size: 14px;"></span> Cài đặt</div>
            <div class="logOutDetail" id="logOut" onclick="logOut()"><span class="glyphicon glyphicon-off" style="font-size: 14px;"></span>
                <b>Đăng xuất</b></div>
        `;
        document.getElementById("isLoginDriver").innerHTML = displayHtml;
        $("#InputLocation").hide();
        $("#LocationDirectionGuest").hide();
        $("#CallDriver").hide();
        document.getElementById('mapItemtab1MoneyName').innerHTML = 'SỐ TIỀN NHẬN ĐƯỢC:';
        document.getElementById("moneyArea").innerHTML = data.Money + ' VNĐ';
    } else if (data.UserType == "Customer") {
        var displayHtml = `
            <img src="/image/favicon.png">
            <div class="userName">
                <h3><b>${ShowMessageIfEmpty(data.UserName)}</b></h3>
            </div>
            <div class="userDetail"><span class="glyphicon glyphicon-user" style="font-size: 14px;"></span>
                Thông tin tài khoản</div>
            <div class="historyRoute">
                <a data-toggle="modal" data-target="#myModalHistoryRoute" onclick="OpenHistoryRoute()">
                        <span class="glyphicon glyphicon-road" style="font-size: 14px;"></span>
                        Lịch sử chuyến đi
                    </a>
            </div>
            <div class="walletHistory">
                <a data-toggle="modal" data-target="#myModalWallet" onclick="OpenWallet()">
                    <span class="glyphicon glyphicon-usd" style="font-size: 14px;"></span>
                    Ví của bạn
                </a>
            </div>
            <div class="settingDetail"><span class="glyphicon glyphicon-asterisk"
                    style="font-size: 14px;"></span> Cài đặt</div>
            <div class="logOutDetail" id="logOut" onclick="logOut()"><span class="glyphicon glyphicon-off" style="font-size: 14px;"></span>
                <b>Đăng xuất</b></div>
        `;
        console.log(data)
        document.getElementById("isLogin").innerHTML = displayHtml;
        document.getElementById("moneyArea").innerHTML = data.Money + ' VNĐ';
    }
}
function ToDate(obj) {
    if (obj == null) {
        return "";
    } else {

        if (obj.indexOf('Date') >= 0) {
            var dateint = parseInt(obj.match(/\d+/)[0]);

            obj = new Date(dateint);
        } else {
            obj = new Date(obj);
        }
        var mon = '';
        if ((obj.getMonth() + 1) < 10) {
            mon = "0" + (obj.getMonth() + 1);
        } else {
            mon = (obj.getMonth() + 1);
        }
        var day = "";
        if (obj.getDate() < 10) {
            day = '0' + obj.getDate();
        } else {
            day = obj.getDate();
        }
        var date_string = day + "/" + mon + "/" + obj.getFullYear();
        return date_string;

    }
}