<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      html, body, #map-canvas { height: 100%; margin: 0; padding: 0;}
    </style>
    
    <style>
	#header, #footer{
    background-color: #3E75A6;
    color:white;
    text-align:left;
    padding:5px;
	}
	#map-canvas {
    padding:10px;	 	 
	}
	a {
    color:white;
	}

	</style>
    
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCtGKY6V-0PBUobXIG63JvdgGrldlC109Q">
    </script>
    <script type="text/javascript">
      function initialize() {
        var mapOptions = {
          center: { lat: 45.899566, lng: -72.894373},
          zoom: 8
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);
    </script>
  </head>
  <body>
  <div id="header">
	<div id="logo">
		<img src="images/mesto.png" alt="Mesto" style="width:250px;height:70px">
	</div>
  </div>
  <div id="menu">
	<?php include 'menu.php';?>
	</div> 
	<div id="map-canvas"></div>
	<div id="footer">
	</div>
  </body>
</html>
