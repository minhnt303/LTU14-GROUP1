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
            <div class="historyDriveRoute"><span class="glyphicon glyphicon-road"
                    style="font-size: 14px;"></span> Lịch sử chở khách</div>
            <div class="walletHistory"><span class="glyphicon glyphicon-usd"
                    style="font-size: 14px;"></span> Ví của bạn</div>
            <div class="settingDetail"><span class="glyphicon glyphicon-asterisk"
                    style="font-size: 14px;"></span> Cài đặt</div>
            <div class="logOutDetail" id="logOut" onclick="logOut()"><span class="glyphicon glyphicon-off" style="font-size: 14px;"></span>
                <b>Đăng xuất</b></div>
        `;
        document.getElementById("isLoginDriver").innerHTML = displayHtml;
    }else if(data.UserType == "Customer"){
        var displayHtml = `
            <img src="/image/favicon.png">
            <div class="userName">
                <h3><b>${ShowMessageIfEmpty(data.UserName)}</b></h3>
            </div>
            <div class="userDetail"><span class="glyphicon glyphicon-user" style="font-size: 14px;"></span>
                Thông tin tài khoản</div>
            <div class="historyRoute"><span class="glyphicon glyphicon-road"
                    style="font-size: 14px;"></span> Lịch sử chuyến đi</div>
            <div class="walletHistory"><span class="glyphicon glyphicon-usd"
                    style="font-size: 14px;"></span> Ví của bạn</div>
            <div class="walletHistory"><span class="glyphicon glyphicon-usd"
                    style="font-size: 14px;"></span> Nạp tiền</div>
            <div class="settingDetail"><span class="glyphicon glyphicon-asterisk"
                    style="font-size: 14px;"></span> Cài đặt</div>
            <div class="logOutDetail" id="logOut" onclick="logOut()"><span class="glyphicon glyphicon-off" style="font-size: 14px;"></span>
                <b>Đăng xuất</b></div>
        `;
        document.getElementById("isLogin").innerHTML = displayHtml;
    }
}