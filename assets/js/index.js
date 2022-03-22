$(document).ready(() => {

    $("body").css("background-image", "url(https://img.locationscout.net/images/2019-09/tree-in-the-sunset-germany_l.jpeg)");
    getVietnamProvinces();
    getAllCapitalCities();
    getCoordintes();
    $('#btn_2').click((e) => {
        getDailyWeather(hanoi);
    });
    $("#select-capital").change((e) => {
        let ob = $(e.target).val();
        if (ob === 'Capital Cities') {
            getCoordintes();
        } else {
            console.log(ob);
            getCurrentWeather(JSON.parse(ob));
        }
    });

});

let getVietnamProvinces = () => {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: URL_GET_PROVINCE,
        dataType: "json",
        cache: false,
        success: (data) => {
            data.map(p => {
                let option = '<li><a class="dropdown-item" id="opt_'
                    + p.id + '" value="' + p
                    + '">' + p.name + '</a></li>';
                return $("#options").append(option);
            });
        },
        error: (e) => {
            console.log(e);
        },
    });
}

let getAllCapitalCities = () => {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: URL_GET_CAPITAL_CITIES,
        dataType: "json",
        cache: false,
        success: (data) => {
            data.map(p => {
                let idCap = p.id;
                let nameCap = p.name;
                p = deleteProJson(p);
                let cap = '<option value=' + JSON.stringify(p) + ' id="capital_' + idCap + '">' + nameCap + '</option>'
                return $("#select-capital").append(cap);
            });

        },
        error: (e) => {
            console.log(e);
        },
    });
}

let getDailyWeather = (infor) => {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: URL_GET_DAILY_WEATHER,
        data: JSON.stringify(infor),
        dataType: 'json',
        cache: false,
        success: (data) => {
            data.map(p => {
                p.dt = convertDate(p);
            });
            $("#txt-result").append(JSON.stringify(data));
        },
        error: (e) => {
            console.log(e);
        }
    });
};

let getCurrentWeather = (infor) => {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: URL_GET_CURRENT_WEATHER,
        data: JSON.stringify(infor),
        dataType: 'json',
        cache: false,
        success: (data) => {
            console.log(infor);
            data.dt = convertDate(data);
            $("body").css("background-image", "url(" + data.image + ")");
            $("#temperature").html(Number(data.temp).toFixed(0)+"&#176;");
            $("#address").html(infor.name);
            $("#curr-date").html(data.dt);
            $("#icon-weather").attr("src",data.icon);
        },
        error: (e) => {
            console.log(e);
        }
    });
};

let deleteProJson = (obj) => {
    delete obj.id;
    delete obj.listResult;
    return obj;
}

let convertDate = (data) => {
    return new Date(data.dt * 1000 - (data.timezone_offset * 1000)).toUTCString()
}

// Step 1: Get user coordinates
function getCoordintes() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = { lat: lat, lon: lng, name:"Vietnam" };
        getCurrentWeather(coordinates);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}
