/*
 * Draw map etheir online with Tiles or Offline with saved images
 */

var osm = new ol.layer.Tile({
source: new ol.source.TileJSON({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure=1',
        crossOrigin: '',
      }),
opacity: 0.5
});

var osmbis = new ol.layer.Tile({
source: new ol.source.OSM(),
opacity: 0.66
});

var stamenWater = new ol.layer.Tile({
	source: new ol.source.Stamen({
	  layer: 'watercolor' //toner, terrain, burning, mars,watercolor
	})
});

var stamenToner = new ol.layer.Tile({
	source: new ol.source.Stamen({
		layer: 'toner' //toner, terrain, burning, mars,watercolor
	})
});

var stamenTerrain = new ol.layer.Tile({
        source: new ol.source.Stamen({
                layer: 'terrain' //toner, terrain, burning, mars,watercolor 
        })
}); 

var mapList = {'osmbis':osmbis, 'stamenWater':stamenWater, 'osm':osm, 'stamenTerrain':stamenTerrain, 'stamenToner':stamenToner};

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

	//ADAPT SIZE AUTOMATICALLY
	var extent = map.getLayers().getArray()[1].getSource().getExtent(); 
	map.getView().fit(extent, map.getSize());
}
else{
	alert('Cette carte n\'est pas disponible');
}
}
