/*
 * Draw map etheir online with Tiles or Offline with saved images
 */

/*var satellite = new ol.layer.Tile({
source: new ol.source.MapQuest({layer: 'sat'})
});*/

var osm = new ol.layer.Tile({
source: new ol.source.TileJSON({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure=1',
        crossOrigin: '',
      }),
opacity: 0.5
});


/*var hyb = new ol.layer.Group({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'sat'})
      }),
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'hyb'})
      })
    ]
});*/

var osmbis = new ol.layer.Tile({
source: new ol.source.OSM(),
opacity: 0.66
});


var stamenLayer = new ol.layer.Tile({
	source: new ol.source.Stamen({
	  layer: 'watercolor' //toner, terrain, burning, mars,watercolor
	})
});

var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
});

/* Store trip points and lines */
var tripVectorSource = new ol.source.Vector({});
var tripVectorLayer = new ol.layer.Vector({
  source: tripVectorSource,
});


var map;

/*
control also defined in vue/draw-position
*/

loadPoints(function(){
  map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
              collapsible: false
            })
          }).extend([mousePositionControl]),
    layers: [ osmbis, tripVectorLayer ],
    overlays: [],
    view: new ol.View({
      center: ol.proj.transform([-70.5591,-4.2758], 'EPSG:4326', 'EPSG:3857'),
      zoom: 5,
      maxZoom: 8,
      minZoom: 2,
    }),
  });
});


 //###########################################################
 //OFFLINE
/*
var southAmerica = new ol.layer.Image({
	opacity: 0.75,
	source: new ol.source.ImagesStatic({
	attributions: [
		new ol.Attribution({
		html: '',
		})
		],
		url: 'test2',
		imageSize: [3740,3399],
		projection: map.getView().getProjection(),
		imageExtent: ol.extent.appluTransform([-100.7227, 20.8793, -21.6211, -45.027]),
		ol.proj.getTransform("EPSG:4326"; "EPSG:3857"))
	})
});
*/
// Create an image layer
 var gf = new ol.layer.Image({
 opacity: 0.75,
 source: new ol.source.ImageStatic({
 attributions: [
			 new ol.Attribution({
			 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test6',
		 imageSize: [6442, 6226],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-65.5225, -3.4915, -48.4937,12.8546], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 var br1 = new ol.layer.Image({
	 opacity: 0.75,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test7',
		 imageSize: [7281, 7098],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-52.8223, -21.5757, -33.5742,-3.338], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 
 var chilArg = new ol.layer.Image({
	 opacity: 0.75,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test9',
		 imageSize: [3042, 9143],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-74.1202, -41.5677, -66.1044,-21.6166], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 var perou = new ol.layer.Image({
	 opacity: 0.75,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
			 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test10',
		 imageSize: [6101, 6500],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-79.1016, -21.5757, -62.9736,-4.9158], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 var eqCol = new ol.layer.Image({
	 opacity: 0.75,
	 source: new ol.source.ImageStatic({
		 attributions: [
		 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test11',
		 imageSize: [5153, 6068],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-80.9473, -5.1785, -67.3242,10.7901], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 var br2rio = new ol.layer.Image({
	 opacity: 0.75,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test12',
		 imageSize: [4937, 4837],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-49.6582, -24.1066, -36.6064,-11.9748], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 
 var br2igu = new ol.layer.Image({
	 opacity: 0.75,
	 source: new ol.source.ImageStatic({
		 attributions: [
		 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test14',
		 imageSize: [6824, 2364],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-66.6431, -29.7644, -48.6035,-24.1969], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 
 var guy2br = new ol.layer.Image({
	 opacity: 0.75,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: 'test15',
		 imageSize: [6284, 4247],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-48.6035, -11.8889, -31.9922,-0.747], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 //~ map.addLayer(br2igu) //br to iguassu
 //~ map.addLayer(br2rio) //br rio
 // map.addLayer(guy2br) //guyane to br
//  map.addLayer(gf)
 //~ map.addLayer(chilArg)
 //~ map.addLayer(perou)
 //~ map.addLayer(eqCol)
 

 //ENDOFFLINE
 //###########################################################
