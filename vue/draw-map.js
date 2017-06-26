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


var mapList = {'osmbis':osmbis, 'stamenLayer':stamenLayer, 'osm':osm};

/******* END OF MAPS DEFINITION ********/

/* Store trip points and lines */
var tripVectorSource = new ol.source.Vector({});
var tripVectorLayer = new ol.layer.Vector({
  source: tripVectorSource,
});

var map; 

/********* Prepare drawing POPUP for developement purpose || creation of new trip with automatic coordinate creation*********/
var container = document.getElementById('popup');
var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({ element: container, autoPan: true, autoPanAnimation: { duration: 250 } }));


/* control also defined in vue/draw-position */ 
map = new ol.Map({ target: 'map',
    controls: ol.control.defaults({ attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
              collapsible: true 
})
}),
layers: [ osmbis ],
    overlays: [overlay], 
view: new ol.View({
      center: ol.proj.transform([-70.5591,-4.2758], 'EPSG:4326', 'EPSG:3857'),
      zoom: 2,
maxZoom: 8,
 minZoom: 2,
}),
 });

/*****INIT TRIP POINTS*****/
initPoints();

/******Draw any changes on MAP******/
function changeLayer() {
//alert('map');
/*UPDATE SOURCE BEFORE DRAWING*/
//map.getLayers().getArray()[1].setSource(tripVectorSource);

var tt = document.getElementById("layerSelect"); 
var i = 0;
if(undefined !== mapList[tt.value]){
	map.removeLayer(tripVectorLayer);
	map.getLayers().forEach(function (layer){
		map.removeLayer(layer);
	});
	map.addLayer(mapList[tt.value]);
	map.addLayer(tripVectorLayer);
	map.updateSize();
}
else{
	alert('Cette carte n\'est pas disponible');
}
}
