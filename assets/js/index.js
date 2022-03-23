$(document).ready(() => {
    $("body").css("background-image", "url(https://img.locationscout.net/images/2019-09/tree-in-the-sunset-germany_l.jpeg)");
    getVietnamProvinces();
    getAllCapitalCities();
    getCoordintes();
    $("#select-capital").change((e) => {
        let ob = $(e.target).val();
        if (ob === 'Capital Cities') {

            getCoordintes();
        } else {
            getCurrentWeather(JSON.parse(ob));
            getDailyWeather(JSON.parse(ob));
        }
        $('#select-province').val('hanoi');
    });
    $("#select-province").change((e) => {

        let ob = $(e.target).val();
        if (ob === 'Provinces') {
            getCoordintes();
        } else {
            getCurrentWeather(JSON.parse(ob));
            getDailyWeather(JSON.parse(ob));
        }
        $('#select-capital').val('hanoi');
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
                p = deleteProJson(p);
                let option = '<option id="opt_'
                    + p.id + '" value=' +  JSON.stringify(p)
                    + '>' + p.name + '</option>';
                return $("#select-province").append(option);
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
            let sortData = sortAsc(data);
            let com_1 = '';
            let com_2 = '';
            sortData.map((p, index) => {
                p.dt = convertDate(p);
                (index > 1 && index <= 4) ? com_1 = dailyComponent(p) + com_1 : '';
                index > 4 ? com_2 = dailyComponent(p) + com_2 : '' ;
            });
            $('#item-1').html(com_1);
            $('#item-2').html(com_2);            
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
            data.dt = convertDate(data);
            $("body").css("background-image", "url(" + data.image + ")");
            $("#temperature").html(Number(data.temp).toFixed(0) + "&#176;");
            $("#address").html(infor.name);
            $("#curr-date").html(data.dt);
            $("#icon-weather").attr("src", data.icon);
            $('#pressure').html(data.pressure+'kPa');
            $('#humidity').html(data.humidity+'%');
            $('#wind_speed').html(data.wind_speed+' km/h');
            $('#uvi').html(data.uvi);
            $('#clouds').html(data.clouds);
            $('#visibility').html(data.visibility+'m');
            $('#description').html(data.weather[0].main);
            $('#pressure').html(data.pressure);
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
        var coordinates = { lat: lat, lon: lng, name: "Vietnam" };
        getCurrentWeather(coordinates);
        getDailyWeather(coordinates);
    }
    function error(err) {
        getCurrentWeather(hanoi);
        getDailyWeather(hanoi);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

let dailyComponent = (data) => {
    let min = data.temp.min;
    let max = data.temp.max;
    let tempDay = data.temp.day;
    return '<div class="col-4">' 
        +'<h4>' + new Date(data.dt).toDateString() + '</h4>'
        + '<div class="icon">'
        + ' <img src="' + data.icon + '" alt="icon" />'
        + '</div>'
        + '<h4>Day:' + tempDay + '&#176;C</h4>'
        + '<h6>' + min+'&#176;C' + ' : ' + max + '&#176;C</h6>'
        + '</div>'
}
