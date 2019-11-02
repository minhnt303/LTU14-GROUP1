function ShowMessageIfEmpty(message){
    if(message == null || message == ""){
        return "Chưa cập nhật!";
    }
    else {
        return message;
    }
}

function PopupError(message){
    console.log(message)
    var textmessage = message;
    document.getElementById("waringAlert").innerHTML=`
        <div class="waringAlertArea">
            <h4><b>Lỗi!</b></h4>
            <span>`+textmessage+`</span>
        </div>
    `;
    $("#waringAlert").show();
    setTimeout(function() {
        $("#waringAlert").hide('blind', {}, 500)
    }, 3000);
}

function PopupSuccess(message){
    console.log(message)
    var textmessage = message;
    document.getElementById("successAlert").innerHTML=`
        <div class="successAlertArea">
            <h4><b>Thành công!</b></h4>
            <span>`+textmessage+`</span>
        </div>
    `;
    $("#successAlert").show();
    setTimeout(function() {
        $("#successAlert").hide('blind', {}, 500)
    }, 3000);
}