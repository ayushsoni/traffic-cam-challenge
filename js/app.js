// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {

    function createMap(center, zoom) {
    	//variables to retrieve map element and sets keys and values to center and zoom
        var mapElem = document.getElementById('map');

        var map = new google.maps.Map(mapElem, {
            center: center,
            zoom: zoom
        });

        var infoWindow = new google.maps.InfoWindow();
        //resizes the map and position of map
        $(window).resize(function() {
            $('#map').css('height', $(window).height() - $('#map').position().top - 20);
        });//createMap()

        //my markerImage
        var markerImage = 'img/camera_icon.png';

        //retrieve data from traffic cam website using json
        $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        	//assigns my key and values for lattitude and longitude
            .done(function(data) {
                data.forEach(function(locations) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: Number(locations.location.latitude),
                            lng: Number(locations.location.longitude)
                        },
                        //creates map, animation of zooming, and my marker image
                        map: map,
                        animation: google.maps.Animation.DROP,
                        icon: markerImage
                    });

                    //info window
                    google.maps.event.addListener(map, 'click', function() {
                        infoWindow.close();
                    });

                    //retrieves image of location and pans it to the center of the page
                    google.maps.event.addListener(marker, 'click', function() {
                        var html = '<p>' + locations.cameralabel +'</p>';
                        html += '<img src=\'' + locations.imageurl.url + '\'/>';
                        infoWindow.setContent(html);
                        infoWindow.open(map, this);
                        map.panTo(this.getPosition());
                    });

                    //.bind() method used to search through labels and certain street names
                    $('#search').bind('search keyup', function() {
                        var value = this.value.toLowerCase();
                        var label = locations.cameralabel.toLowerCase();
                        if (label.indexOf(value) == -1) {
                            marker.setMap(null);
                        }
                        else {
                        	//set up a marker if the value is not null
                            marker.setMap(map);
                        }
                    });
                });
			
			//alert message for error
            }).fail(function(err) {
                alert(err);
            });
    }
    //seattle coordinates
    var seattleCoords = {
        lat: 47.6,
        lng: -122.3
    };
    
    //creates the map using seattle coordinates
    createMap(seattleCoords, 12);
});