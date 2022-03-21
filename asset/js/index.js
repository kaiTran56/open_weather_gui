$(document).ready( () =>{
    $("#menu-opt").click((e)=> { 
        console.log("check");
        $("#current-weather").addClass("visually-hidden");
    });
});