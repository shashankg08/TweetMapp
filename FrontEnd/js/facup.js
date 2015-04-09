
$("document").ready(function(){
	
	initialize();
		//-------------------------------------------------------------
	// initialize map 
	function initialize() {
		
		var myLatlng = new google.maps.LatLng(34.0000, 9.0000);		//40.5200, 34.3400 - Center of World; NY:40.7127, -74.0059
																		// 47.0000, 2.0000 - France
		
		var home = new google.maps.LatLng(21.0000, 78.0000);
		
		var mapOptions = {
			zoom: 5,
			center: home
		}
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// all current markers		
		var markcluster = [];
		var clusterhub = [];
		
		function resetMap(){
			map.setZoom(5);
			map.setCenter(home);			
		}
		
		// sets all markers.
		function setMarkers(map, locations){	
			
			clearMap();
			resetMap();
			
			//plots multiple markers.
			$.each(locations, function(i, tweet){
			
				var lat = tweet['lat'];
				var longi = tweet['longi'];
				var username = tweet['username'];
				var tweet_message = tweet['tweet'];
				var tdate = tweet['tweet_date'];
				
				var contentString = "<p><h5>@"+ username + "  :  " + tweet_message + "<br/> <h6>Tweeted on:  " + tdate + "</p>"
				
				// set latlong location for marker;
				marker_location = new google.maps.LatLng(lat, longi);
				
				// set marker
				var marker = new google.maps.Marker({
					map : map,
					title : username,
					position: marker_location
				});
				
				markcluster.push(marker);
				
				// set InfoWindow on click
				var infowindow = new google.maps.InfoWindow({
					
					content: contentString
					
				});
				
				// add eventlistener for click
				google.maps.event.addListener(marker, 'click', function(){
					infowindow.open(map,marker);
					
				});
				
			});		// end of foreach;
			
			// adding cluster
			var cluster = new MarkerClusterer(map, markcluster);
			
			clusterhub.push(cluster);
			//alert(clusterhub.length);
			
			function clearMap(){
				
				// removes all markers.
				if (markcluster.length > 0){
					//alert("Clearing Markers");
				
					for (var i = 0; i < markcluster.length; i++){
						markcluster[i].setMap(null);				// removes all from map.	
					} 
					markcluster = [];							// deletes all markers.
				}
				
				// removes all clusters
				if(clusterhub.length > 0){
					//alert("Clearing Clusters");
					
					$.each(clusterhub, function(i, clust){	
						clust.clearMarkers();
					});
					clusterhub = [];
				}
		
			}	// end of clear map
			
		}// end of setMarkers.
		
		// loads map when page is loaded.
		
		google.maps.event.addDomListener(window, 'load', initialize);
		
		// END OF GOOGLE MAPS JAVASCRIPT.
	
	//---------------------------------------------------------------------------------------------------------------------------------
	
	
	//$("body").html("JQuery is working");	
	//$("#topic").click(function(){	
	
	$(".dropdown-menu li a").unbind("click").click(function(e){					//dropdown selected value;
		
		e.preventDefault();
		e.stopPropagation;
		
		var topic = $(this).text();
		//console.log("selected value: "+ topic);
		
		var data1 = {
			'tag': topic,
			'method' : 'facup'
			};
			
		// this is important while sending multiple data.
		//data = $(this).serialize() + "&" + $.param(data);
		
		$.ajax({			
			url: 'tweetserver.php',
			type: 'POST',
			isLocal: true,
			dataType: 'json',	
			data: data1,
			
			// hashtag ajax
			success: function(data){
				
				setMarkers(map, data);	
				/*
				
				$.each(data, function(i, tweet){
						
						//alert(tweet.username);
						// tweet.lat, tweet.long to be passed to google maps.
						
						$("#return").append(
						"<br/>Username: " + tweet.username + "<br/>" + tweet.tweet + "<br/>"
						);
					
				});*/
					
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert("Ooops! Something went bad!");
			
			}	// end of error
			
			//return false;
		});	// end of ajax
		
		return false;
		
	});		// end of click
	
	
	$("#mapbutton").unbind("click").click(function(e){
	
		e.preventDefault();
		e.stopPropagation;
	
		var search = $("#input_keyword").val();
			
		if (!search){
			alert("Please enter a keyword or select a hashtag!");
			
		}
		
		else{				// send ajax call and retrieve tweets
			//alert("You entered:  "+search);
			
			var data2 = {
				'tag': search,
				'method': 'facup'
			};
			
			// word search ajax
			$.ajax({
				url: 'tweetserver.php',
				isLocal: true,
				data: data2,
				dataType: 'json',
				type: 'post',
				
				success : function (data){
					if (data){
						setMarkers(map,data);
					}					
					else{
						alert("No relevant tweet could be found. Try the #hashtag");
					}

				},
				
				error: function (xhr, ajaxOptions, thrownError) {
					alert("Ooops! Something went bad!");
				},
			
			});
		};
		
		return false;
	});	// end of click
	
	}// end of function initialize.
	
	$(function(){
            $('[data-toggle="info"]').tooltip();
	})
	
});	// end of ready
