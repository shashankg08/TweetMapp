//-----GOOGLE HEAT MAP JAVASCRIPT----------------------------------------------------------------------------------------------------------------------------------------
	
	
	/* Data points defined as an array of LatLng objects */
	var locations = [
		{"username":"AlphaCommander","tweet":"Everything in control #God I love Mumbai!","lat":"37.782","long":"-122.4477"},
		{"username":"jubimoraes","tweet":null,"lat":"37.782","long":"-122.445"},
		{"username":"annabelletam_","tweet":"I'm at Baskin Robbins in Kuala Lumpur","lat":"37.782","long":"-122.443"}
		];

		
	// prepare heat map data;
	var mydata = [];		
		
	var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
	var newYork = new google.maps.LatLng(40.7127, -74.0059);			// NYC
	var mycenter = new google.maps.LatLng(34.0000, 9.0000);

	function initialize() {
	
		$(function(){
            $('[data-toggle="info"]').tooltip();
		})

		var mapOptions = {
			zoom: 3,
			center: mycenter,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		var loaded = false;
		
		function setHeat(locations){
			
			mydata = [];
			
			$.each(locations, function(i,loc){
				var l = loc['lat'];
				var lo = loc['longi'];
				console.log ("Lat: "+l + "Long: "+lo);
				mydata.push(new google.maps.LatLng(l, lo));
			});

			var pointArray = new google.maps.MVCArray(mydata);

			clearHeatMap();
			resetMap();
			
			heatmap = new google.maps.visualization.HeatmapLayer({
				data: pointArray,
				radius: 20
			});

			heatmap.setMap(map);
			loaded = true;
				
			// clear any existing map is any
			function clearHeatMap(){
				if (loaded){
					heatmap.setMap(null);
				}
			}		// end of clear Map
			
			function resetMap(){
				map.setCenter(mycenter);
				map.setZoom(3);			
			}
		
		}	// end of set heat
		
		
	
	
	
	//-------------------------MY JS----------------------------
	
	$(".dropdown-menu li a").unbind("click").click(function(e){					//dropdown selected value;
		
		e.preventDefault();
		e.stopPropagation;
		
		var topic = $(this).text();
		
		var data1 = {
			'tag': topic
			};
		
		$.ajax({			
			url: 'tweetserver.php',
			type: 'post',
			isLocal: true,
			dataType: 'json',	
			data: data1,
			
			// hashtag ajax
			success: function(data){
				setHeat(data);	
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
				'tag': search
			};
			
			// word search ajax
			$.ajax({
				url: 'tweetserver.php',
				data: data2,
				isLocal: true,
				dataType: 'json',
				type: 'post',
				
				success : function (data){
					if (data){
						setHeat(data);
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
	
	
	//---------------- END OF MY JS-----------------
	
	}	// end of initialize
	
	

	function toggleHeatmap() {
		heatmap.setMap(heatmap.getMap() ? null : map);
	}

	function changeGradient() {
		var gradient = [
		'rgba(0, 255, 255, 0)',
		'rgba(0, 255, 255, 1)',
		'rgba(0, 191, 255, 1)',
		'rgba(0, 127, 255, 1)',
		'rgba(0, 63, 255, 1)',
		'rgba(0, 0, 255, 1)',
		'rgba(0, 0, 223, 1)',
		'rgba(0, 0, 191, 1)',
		'rgba(0, 0, 159, 1)',
		'rgba(0, 0, 127, 1)',
		'rgba(63, 0, 91, 1)',
		'rgba(127, 0, 63, 1)',
		'rgba(191, 0, 31, 1)',
		'rgba(255, 0, 0, 1)'
	]
	heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
	}

	function changeRadius() {
		heatmap.set('radius', heatmap.get('radius') ? null : 20);
	}

	function changeOpacity() {
		heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);	
	}

	
	google.maps.event.addDomListener(window, 'load', initialize);
//-----------END OF GOOGLE HEAT MAP JAVASCRIPT----------------------------------------------------------------------------------------------------------------------------