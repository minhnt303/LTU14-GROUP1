// import * as AppUserConstant from '../HomeArea/AppUserConstant';
// var appUserType = AppUserConstant;
// var a = appUserType.Customer;
if (sessionStorage.getItem("userType") == null) {
    $("#isLoginDriver").hide();
    $("#isLogin").hide();
    $("#isNotLogin").show();
}
else if (sessionStorage.getItem("userType") == "Customer") {
    $("#isLoginDriver").hide();
    $("#isLogin").show();
    $("#isNotLogin").hide();
}
else if (sessionStorage.getItem("userType") == "Driver") {
    $("#isLoginDriver").show();
    $("#isLogin").hide();
    $("#isNotLogin").hide();
}
function Direction() {
    if ($(".mapbox-directions-instructions")[0]) {
        $(".mapbox-directions-instructions").hide();
    } else if(!$(".mapbox-directions-instructions")[0]) {
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
    // var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
    // mapboxClient.geocoding.forwardGeocode({
    //     query: 'Wellington, New Zealand',
    //     autocomplete: false,
    //     limit: 1
    // })
    //     .send()
    //     .then(function (response) {
    //         if (response && response.body && response.body.features && response.body.features.length) {
    //             var feature = response.body.features[0];

    //             var map = new mapboxgl.Map({
    //                 container: 'map',
    //                 style: 'mapbox://styles/mapbox/'+layer,
    //                 center: feature.center,
    //                 zoom: 10
    //             });
    //             new mapboxgl.Marker()
    //                 .setLngLat(feature.center)
    //                 .addTo(map);
    //         }
    //     });
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
        $('#mapbox-directions-origin-input input').val(sessionStorage.getItem("Longitude")+','+sessionStorage.getItem("Latitude"));
        
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

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/' + layer,
    center: [105.8444083, 21.004097599999998],
    zoom: 15
});

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

