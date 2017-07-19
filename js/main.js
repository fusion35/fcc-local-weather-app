(function() {
  var unit;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      populateLocation(lat, long);
      var cors_url = "https://cors-anywhere.herokuapp.com/";
      var api_url = cors_url + "https://api.darksky.net/forecast/226042c4c5489e625b69ad1a24fb205d/";
      api_url += lat +','+long;
      var params = "?exclude=minutely,hourly,daily,alerts&units=auto";
      api_url += params;
      jQuery.getJSON(api_url, function(response) {
        var temp = response.currently.temperature;
        temp = round(temp);
        jQuery('#temperature').html(temp);
        unit = response.flags.units;
        jQuery('#unit').html(unit==="si"?"&#8451;":"&#8457;");
        jQuery('#unit').attr("data-unit", unit);
        jQuery("#summary").html(response.currently.summary);
        jQuery('body').attr("class","bg-"+response.currently.icon);
        jQuery('#summary-icon').attr("class",response.currently.icon);
      })
    });
  }

  jQuery("#unit").on("click", function(e) {
      e.preventDefault();
      var unit = jQuery(this).attr("data-unit");
      var temp = jQuery("#temperature").text();
      // si = deg C
      if (unit === "si") {
        temp = convertToFahrenheit(temp);
        refreshTemperature(temp, "us");
      } else {
        temp = convertToCelsius(temp);
        refreshTemperature(temp, "si");
      }
  });

  function populateLocation(lat,long) {
    var key = "AIzaSyCQBfgs-13QFjQAKyLivfHXlOlTEAU3C6g";
    // wanted to use something similar to String.format
    var api_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={0},{1}&key={2}&result_type=street_address";
    api_url = api_url.replace("{0}",lat).replace("{1}",long).replace("{2}",key);
    jQuery.getJSON(api_url, function(response) {
         var results = response.results[0].address_components;
         var location = results.filter(function(val) {
            if (val.types.find(function(e) {return e === "country" || e ===  "administrative_area_level_1"}) !== undefined) { return val.long_name;}
         });
         jQuery("#location").html(location[0].long_name+','+location[1].short_name);
    });
  }

  function refreshTemperature(temp, unit) {
    jQuery('#temperature').html(temp);
    jQuery('#unit').html(unit==="si"?"&#8451;":"&#8457;");
    jQuery('#unit').attr("data-unit", unit);
  }

  function convertToCelsius(temp) {
    temp = (temp - 32) * (5 / 9);
    return round(temp);
  }

  function convertToFahrenheit(temp) {
    temp = temp * (9 / 5) + 32;
    return round(temp);
  }

  function round(temp) {
    return Math.round(temp *10) / 10;
  }

}());
