createFeatures(certJSON);
function createFeatures(certJSON) {
  function onEachFeature(feature, layer) {
    for (key in feature[0]) {
      console.log(key + ": " + feature[0][key]);
    }
    var cTitle = "";
    var cAddress = feature.address + "<br />" + feature.city + ", " + feature.state + " " + feature.zip;
    var clink = ""
    var website, mSize;
    if (typeof feature["membership-size"] !== 'undefined') {
      mSize = '<strong>Subscribers: </strong>' + feature["membership-size"];
    }
    if (feature.url != null) {
      if (feature.url.includes('://') != true) {
        website = "http://" + feature.url;
      } else {
        website = feature.url;
      }


      if (!(feature.url.includes("@"))) {
        clink = '<a href="' + website + '" target="_blank">' + website + '</a>';
      } else {
        clink = '<a href="mailto:' + website + '" target="_blank">Email Us</a>';
      }
    }
    var cert = "";
    var certType, certVersion, certDetails;
    if (feature.status == "Active") {
      if (feature["certification-type"]) {
        certType = feature["certification-type"].split("|");
        certVersion = feature.version.split("|");
        certDetails = feature.details.split("|");
        var c;
        for (c = 0; c < certType.length; c++) {
          if (certType.includes(certType[c])) {
            cert += '<p><strong>Certification: </strong>' + certType[c] + '<br />';
            cert += '<strong>Version: </strong>' + certVersion[c] + '<br />';
            cert += "<strong>Resources Certified: </strong>" + certDetails[c] + '</p>';
          }
        }
      }
    }
    var popUpContent = '<strong style="font-size:15px;">' + feature.organization + "</strong>" + '<br />' + '<strong>Organization Unique Identifier (OUID): </strong>' + feature.ouid + '<br />' + mSize + "<br /><hr />" + cAddress + '<br />' + clink;
    if (cert) {
      popUpContent += "<hr />" + cert;
      popUpContent += '<p><strong>About: <a href="https://www.reso.org/reso-web-api/" target="_blank">Web  API</a> - <a href="https://www.reso.org/data-dictionary/" target="_blank">Data Dictionary</a></strong></p>';
      popUpContent += '<p><strong>Questions? Updates?  <a href="mailto:info@reso.org" target="_blank">Contact Us</a></strong></p>';
    }
    layer.bindPopup(popUpContent);
  }
  var allOrgs = L.geoJSON(certJSON, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      if (typeof feature["membership-size"] !== 'undefined') {
        var intMSize = feature["membership-size"].replace(/,/g, '');
        var markerRadius = 5;
        var markerColor = "#FFFFFF";
        if (isNaN(intMSize)) {
          markerRadius = 7.5;
        } else {
          if (intMSize > 1000 && intMSize < 5000) {
            markerRadius = 10;
          } else if (intMSize > 5000 && intMSize < 10000) {
            markerRadius = 12.5;
          } else if (intMSize > 10000 && intMSize < 20000) {
            markerRadius = 15;
          } else if (intMSize > 20000 && intMSize < 30000) {
            markerRadius = 17.5;
          } else if (intMSize > 30000 && intMSize < 40000) {
            markerRadius = 20;
          } else if (intMSize > 40000 && intMSize < 50000) {
            markerRadius = 25;
          } else if (intMSize > 50000) {
            markerRadius = 30;
          }
        }
      }
      if (feature["applicant-type"] == "MLS") {
        if (feature.status == "Active") {
          markerColor = "#2700f0";
        } else {
          markerColor = "#000000";
        }
      } else if (feature["applicant-type"] == "Tech") {
        markerColor = "#01802f";
      } else if (feature["org_type"] == "broker") {

      }

      return L.circleMarker(latlng, {
        radius: markerRadius,
        color: markerColor,
        fillColor: markerColor,
        weight: 1,
        opacity: .1,
        fillOpacity: 1
      });
    }
  });
  var certJSON_nonCertMLS = certJSON.filter(function (itm) {
    //    return (itm["applicant-type"] == "MLS" && itm["active"] != "1");
    return (itm["applicant-type"] == "MLS" && itm["status"] != "Active");
  });
  var nonCertMLS = L.geoJSON(certJSON_nonCertMLS, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      if (typeof feature["membership-size"] !== 'undefined') {
        var intMSize = feature["membership-size"].replace(/,/g, '');
        var markerRadius = 5;
        var markerColor = "#FFFFFF";
        if (isNaN(intMSize)) {
          markerRadius = 7.5;
        } else {
          if (intMSize > 1000 && intMSize < 5000) {
            markerRadius = 10;
          } else if (intMSize > 5000 && intMSize < 10000) {
            markerRadius = 12.5;
          } else if (intMSize > 10000 && intMSize < 20000) {
            markerRadius = 15;
          } else if (intMSize > 20000 && intMSize < 30000) {
            markerRadius = 17.5;
          } else if (intMSize > 30000 && intMSize < 40000) {
            markerRadius = 20;
          } else if (intMSize > 40000 && intMSize < 50000) {
            markerRadius = 25;
          } else if (intMSize > 50000) {
            markerRadius = 30;
          }
        }
      }
      if (feature["applicant-type"] == "MLS") {
        if (feature.status == "Active") {
          markerColor = "#2700f0";
        } else {
          markerColor = "#000000";
        }
      } else if (feature["applicant-type"] == "Tech") {
        markerColor = "#01802f";
      } else if (feature["org_type"] == "broker") {

      }

      return L.circleMarker(latlng, {
        radius: markerRadius,
        color: markerColor,
        fillColor: markerColor,
        weight: 1,
        opacity: .1,
        fillOpacity: 1
      });
    }
  });
  var certJSON_certTech = certJSON.filter(function (itm) {
    return (itm["applicant-type"] == "Tech");
  });
  var certTech = L.geoJSON(certJSON_certTech, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      if (typeof feature["membership-size"] !== 'undefined') {
        var intMSize = feature["membership-size"].replace(/,/g, '');
        var markerRadius = 5;
        var markerColor = "#FFFFFF";
        if (isNaN(intMSize)) {
          markerRadius = 7.5;
        } else {
          if (intMSize > 1000 && intMSize < 5000) {
            markerRadius = 10;
          } else if (intMSize > 5000 && intMSize < 10000) {
            markerRadius = 12.5;
          } else if (intMSize > 10000 && intMSize < 20000) {
            markerRadius = 15;
          } else if (intMSize > 20000 && intMSize < 30000) {
            markerRadius = 17.5;
          } else if (intMSize > 30000 && intMSize < 40000) {
            markerRadius = 20;
          } else if (intMSize > 40000 && intMSize < 50000) {
            markerRadius = 25;
          } else if (intMSize > 50000) {
            markerRadius = 30;
          }
        }
      }
      if (feature["applicant-type"] == "MLS") {
        if (feature.status == "Active") {
          markerColor = "#2700f0";
        } else {
          markerColor = "#000000";
        }
      } else if (feature["applicant-type"] == "Tech") {
        markerColor = "#01802f";
      } else if (feature["org_type"] == "broker") {

      }

      return L.circleMarker(latlng, {
        radius: markerRadius,
        color: markerColor,
        fillColor: markerColor,
        weight: 1,
        opacity: .1,
        fillOpacity: 1
      });
    }
  });
  var certJSON_certBroker = certJSON.filter(function (itm) {
    return (itm["org_type"] == "broker");
  });
  var certBroker = L.geoJSON(certJSON_certBroker, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      if (typeof feature["membership-size"] !== 'undefined') {
        var intMSize = feature["membership-size"].replace(/,/g, '');
        var markerRadius = 5;
        var markerColor = "#FFFFFF";
        if (isNaN(intMSize)) {
          markerRadius = 7.5;
        } else {
          if (intMSize > 1000 && intMSize < 5000) {
            markerRadius = 10;
          } else if (intMSize > 5000 && intMSize < 10000) {
            markerRadius = 12.5;
          } else if (intMSize > 10000 && intMSize < 20000) {
            markerRadius = 15;
          } else if (intMSize > 20000 && intMSize < 30000) {
            markerRadius = 17.5;
          } else if (intMSize > 30000 && intMSize < 40000) {
            markerRadius = 20;
          } else if (intMSize > 40000 && intMSize < 50000) {
            markerRadius = 25;
          } else if (intMSize > 50000) {
            markerRadius = 30;
          }
        }
      }
      if (feature["applicant-type"] == "MLS") {
        if (feature.status == "Active") {
          markerColor = "#2700f0";
        } else {
          markerColor = "#000000";
        }
      } else if (feature["applicant-type"] == "Tech") {
        markerColor = "#01802f";
      } else if (feature["org_type"] == "broker") {

      }

      return L.circleMarker(latlng, {
        radius: markerRadius,
        color: markerColor,
        fillColor: markerColor,
        weight: 1,
        opacity: .1,
        fillOpacity: 1
      });
    }
  });
  var certJSON_certMLS = certJSON.filter(function (itm) {
    //    return (itm["applicant-type"] == "MLS" && itm["active"] == "1");
    return (itm["applicant-type"] == "MLS" && itm["status"] == "Active");
  });
  var certMLS = L.geoJSON(certJSON_certMLS, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      if (typeof feature["membership-size"] !== 'undefined') {
        var intMSize = feature["membership-size"].replace(/,/g, '');
        var markerRadius = 5;
        var markerColor = "#FFFFFF";
        if (isNaN(intMSize)) {
          markerRadius = 7.5;
        } else {
          if (intMSize > 1000 && intMSize < 5000) {
            markerRadius = 10;
          } else if (intMSize > 5000 && intMSize < 10000) {
            markerRadius = 12.5;
          } else if (intMSize > 10000 && intMSize < 20000) {
            markerRadius = 15;
          } else if (intMSize > 20000 && intMSize < 30000) {
            markerRadius = 17.5;
          } else if (intMSize > 30000 && intMSize < 40000) {
            markerRadius = 20;
          } else if (intMSize > 40000 && intMSize < 50000) {
            markerRadius = 25;
          } else if (intMSize > 50000) {
            markerRadius = 30;
          }
        }
      }
      if (feature["applicant-type"] == "MLS") {
        if (feature["active"] == "1") {
          markerColor = "#2700f0";
        } else {
          markerColor = "#000000";
        }
      } else if (feature["applicant-type"] == "Tech") {
        markerColor = "#01802f";
      } else if (feature["org_type"] == "broker") {

      }

      return L.circleMarker(latlng, {
        radius: markerRadius,
        color: markerColor,
        fillColor: markerColor,
        weight: 1,
        opacity: .1,
        fillOpacity: 1
      });
    }
  });
  createMap(allOrgs, certMLS, nonCertMLS, certTech, certBroker);
}
function createMap(orgs, certMLS, nonCertMLS, certTech, certBroker) {
  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: 'pk.eyJ1Ijoiam9yZ2VwaXJlcyIsImEiOiJjanZvajBudGMwYmptNDRxbG95cWU0ZW0yIn0.x51Y6jI0l8i17yi1qdANpA'
  });
  var greyMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: 'pk.eyJ1Ijoiam9yZ2VwaXJlcyIsImEiOiJjanZvajBudGMwYmptNDRxbG95cWU0ZW0yIn0.x51Y6jI0l8i17yi1qdANpA'
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    //    "Greyscale": greyMap,
    //   "Streets": streetMap,
  };
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    //   "All ": orgs,
    "Certified MLS ": certMLS,
    "Noncertified MLS ": nonCertMLS,
    "Certified Technology Company ": certTech,
    //    "Certified Brokerage": certBroker,

  };
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4.5,
    layers: [streetMap, certMLS, nonCertMLS, certTech]
  });
  // Layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  var info = L.control({
    position: "bottomright"
  });
  info.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  info.addTo(myMap);
  function updateLegend() {
    document.querySelector(".legend").innerHTML = [
      "<ul>",
      '<li class="cMLS"><span></span>Certified MLS</li>',
      '<li class="ncMLS"><span></span>Noncertified MLS</li>',
      '<li class="cTech"><span></span>Certified Technology Company</li>',
      //   '<li class="cBroker"><span></span>Certified Brokerage</li>',
      "</ul>"
    ].join("");
  }
  updateLegend();
}
