// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

function search() {
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var requestOptions = {
            bounds: map.getBounds(),
            where: document.getElementById('search').value,
            callback: function (answer, userData) {
                map.setView({ bounds: answer.results[0].bestView });
                map.entities.get(0).setLocation(answer.results[0].location);
            }
        };
        searchManager.geocode(requestOptions);
    });
}

document.getElementById('search').addEventListener("keydown", () => { if(event.keyCode == 13) search(); })

document.ondragover = (ev) => {
  ev.preventDefault()
}

function convert(lat) {
    var result = [];
    var latDeg, latMin, latSec;

    lat = Math.abs(lat);

    latDeg = Math.floor(lat);
    result[0] = [latDeg, 1];

    latMin = Math.floor((lat - latDeg) * 60); // latMin
    result[1] = [latMin, 1];
    
    latSec = Math.round((lat - latDeg - (latMin/60)) * 3600 * 10000) / 10000; // latSec
    result[2] = [latSec, 1];

    // debug console.log(latDeg + "° " + latMin + "´" + latSec + "\"")

    return result;
}

var files;

document.ondrop = (ev) => {
    ev.preventDefault();

    files = ev.dataTransfer.files; // store the dropped files for the async altitude request
    
    var btnALT = document.getElementById('ALT');

    if(btnALT.classList.contains('slds-button_brand')) {
        var http = require("http");

        http.get({
                hostname: 'dev.virtualearth.net',
                port: 80,
                path: '/REST/v1/Elevation/List?points=' + map.entities.get(0).getLocation().latitude + ',' + map.entities.get(0).getLocation().longitude + '&key=sUBBAqgDlDMtGtF5YXbk~3QHYWpEeClDfRqygd5EKzg~Ao6pF7QJi2EigBi2ccCcOQWgNwxoyA7cMSPjtfI-rGdNAH09JWyJm_QdEwGKjAmE',
                agent: false  // create a new agent just for this one request
            }, (res) => {
                res.on('data', (chunk) => {
                    alt = JSON.parse(chunk.toString()).resourceSets[0].resources[0].elevations[0];
                    fillData(alt);
                })
            });
    } else {
        fillData(null);
    }
}

function fillData(alt) {
    var btnLAT = document.getElementById('LAT');
    var btnLON = document.getElementById('LON'); 

    var lat, latExif, lon, lonExif = null;

    if(btnLAT.classList.contains('slds-button_brand')) {
        lat = map.entities.get(0).getLocation().latitude;
        latExif = convert(lat);
    }
    
    if(btnLON.classList.contains('slds-button_brand')){
        lon = map.entities.get(0).getLocation().longitude;
        lonExif = convert(lon);
    }

    var piexif = require("piexifjs");
    var fs = require("fs");

    for(var i=0; i < files.length; ++i) {
        var path = files[i].path;

        var jpeg = fs.readFileSync(path);
        var data = jpeg.toString("binary");

        try {
            var exifObj = piexif.load(data); // load exif data from image
            var gpsIfd = exifObj["GPS"];
    
            if(lat != null) {
                gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
                gpsIfd[piexif.GPSIFD.GPSLatitude] = latExif;
            }
    
            if(lon != null) {
                gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lon < 0 ? 'W' : 'E';
                gpsIfd[piexif.GPSIFD.GPSLongitude] = lonExif;
            }
    
            if(alt != null) {
                gpsIfd[piexif.GPSIFD.GPSAltitudeRef] = 0; // Above sea level
                gpsIfd[piexif.GPSIFD.GPSAltitude] = [alt, 1];
            }
    
            //gpsIfd[piexif.GPSIFD.GPSTimeStamp] = 0;
            //gpsIfd[piexif.GPSIFD.GPSDateStamp] = "2017:01:01";
            //gpsIfd[piexif.GPSIFD.GPSSatellites] = 3;
            
            var exifbytes = piexif.dump(exifObj);
    
            var newData = piexif.insert(exifbytes, data);
            var newJpeg = new Buffer(newData, "binary");
    
            fs.writeFileSync(path, newJpeg);

            map.entities.get(0).setOptions({ color: 'green' });
            document.getElementById('notification-text').innerHTML = "Position set to " + map.entities.get(0).getLocation().latitude.toFixed(6) + "° LAT " + map.entities.get(0).getLocation().longitude.toFixed(6) + "° LON";
            document.getElementById("notification").classList.remove('slds-hide');
            setTimeout(() => { 
                document.getElementById("notification").classList.add('slds-hide');
                map.entities.get(0).setOptions({ color: '#1589EE' });
            }, 2000)

        } catch(err) {
            console.log("");
            document.getElementById('notificationError-text').innerHTML = "Invalid file type! (jpeg only)";
            document.getElementById("notificationError").classList.remove('slds-hide');
            setTimeout(() => { 
                document.getElementById("notificationError").classList.add('slds-hide');
            }, 2000)
        }

    }
    
    
}