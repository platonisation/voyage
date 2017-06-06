/*
 * Draw map etheir online with Tiles or Offline with saved images
 */

 //################ MOUSE COORDINATES
var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
});
 
 
var satellite = new ol.layer.Tile({
source: new ol.source.MapQuest({layer: 'sat'})
});

var osm = new ol.layer.Tile({
source: new ol.source.MapQuest({layer: 'osm'}),
opacity: 0.5
});


var osmbis = new ol.layer.Tile({
source: new ol.source.OSM(),
opacity: 0.66
});




var stamenLayer = new ol.layer.Tile({
source: new ol.source.Stamen({
  layer: 'watercolor' //toner, terrain, burning, mars,watercolor
})
});

/* Store trip points and lines */
var tripVectorSource = new ol.source.Vector({});
var tripVectorLayer = new ol.layer.Vector({
  source: tripVectorSource,
});

///// Ville, Pays, Y, X, Transport, Yboucle,Xboucle,Yboucle2,Xbucle2,PhotoVille(yesorno),Note,KM
var tt = "St Laurent du Maroni,Guyane,5.4000,-54.03030,voiture,5.3932,-54.0816,5.2441,-54.2120,1,2\n\
Apatou, Guyane,5.1552,-54.3411,voiture,5.1452,-54.2411,5.1352,-54.1411,1,3\n\
Les chutes Voltaire,Guyane,5.1292,-54.1722,voiture,5.6918,-53.5347,5.3590,-52.9926,1,4,0\n\
Kourou, Guyane,5.1621,-52.6630,bateau,5.2093,-52.6156,5.2653,-52.6060,1,3\n\
Les îles du salut, Guyane,5.2893,-52.5833,bateau,5.2618,-52.4467,5.0273,-52.2832,1,5\n\
Cayenne,Guyane,4.9333,-52.340545,voiture,4.8056,-52.2454,4.7093,-52.1211,1,2\n\
Kaw,Guyane,4.5925,-52.0989,voiture,4.6148,-52.3100,4.4724,-52.2565,1,3\n\
Cacao,Guyane,4.5733,-52.4693,voiture,4.1843,-52.2675,4.4614,-52.4432,1,3\n\
St Georges de l'Oiapoque,Guyane,3.8588,-51.8610,bus,1.5000,-50.9161,0.6976,-51.3995,0,1\n\
Macapa,Brésil,0.0467,-51.0616,bus,0.0906,-51.1331,0.0082,-51.1771,0,1\n\
Santana,Brésil,-0.0580,-51.1760,bateau,0.0000,-50.5862,-1.8650,-50.5814,1,1\n\
Belem,Brésil,-1.4610,-48.4772,bus,-1.2414,-46.5820,-2.8992,-45.3406,0,3,850\n\
Sao Luis,Brésil,-2.5274,-44.3058,bus,-3.0100,-44.3161,-2.8690,-43.1570,0,3,0\n\
Barreirinhas,Brésil,-2.7764,-42.8137,voiture,-2.7039,-42.8382,-2.6659,-42.9335,0,3\n\
Parque nacionale de Lençois,Brésil,-2.5953,-42.9607,bus,-2.9211,-41.7632,-2.9540,-40.8582,0,5\n\
Jericoacoara,Brésil,-2.8018,-40.5052,voiture,-3.0255,-39.8090,-3.5354,-39.0729,1,5,300\n\
Fortaleza,Brésil,-3.7245,-38.5277,bus,-5.1894,-37.3425,-5.5285,-35.8209,0,3,600\n\
Natal,Brésil,-5.8034,-35.2046,bus,-6.6319,-35.1013,-7.6892,-34.9255,0,4,300\n\
Recife,Brésil,-8.0619,-34.8637,bus,-9.2973,-35.6396,-11.8996,-37.7710,0,3,800\n\
Salvador de Bahia,Brésil,-13.0019,-38.4837,avion,-16.0010,-40.0010,-20.5031,-41.0503,1,3,0\n\
Rio de Janeiro,Brésil,-22.9027,-43.1831,avion,-23.8456,-48.2739,-24.3671,-52.2510,1,5,0\n\
Chutes de Iguaçu,Argentine,-25.5127,-54.6185,avion,-35.0100,-50.0500,-33.2111,-65.0391,2,5,0\n\
Mendoza,Argentine,-32.6551,-68.8239,bus,-26.8499,-65.1914,-29.2637,-66.8713,2,1,0\n\
Salta,Argentine,-24.7892,-65.4044,bus,-22.0100,-66.0100,-24.7976,-65.4100,0,3,0\n\
San Pedro de Atacama,Chili,-22.8926,-68.1866,bus,-22.6229,-67.5055,-19.8494,-68.0164,2,4,0\n\
Uyuni,Bolivie,-20.4064,-66.8898,bus,-19.3008,-66.8408,-17.8840,-67.1155,2,5,0\n\
La  Paz,Bolivie,-16.5064,-68.1398,bus,-16.5849,-68.5519,-16.5730,-68.7373,2,4,0\n\
Copacabana,Bolivie,-16.4267,-68.7576,bus,-16.5888,-69.3732,-14.2804,-71.2299,2,4,0\n\
Cusco,Pérou,-13.5272,-71.9646,bus,-14.8386,-74.9323,-13.7047,-76.1792,2,4,0\n\
Lima,Pérou,-12.0722,-77.0224,bus,-12.0783,-76.9288,-12.0863,-76.8398,2,2,0\n\
Pachacamac,Pérou,-12.1145,-76.8082,bus,-12.0783,-76.9288,-12.0863,-76.8398,2,2,0\n\
Huaraz,Pérou,-9.529851,-77.528998,pied,-9.539851,-77.518998,-9.519851,-77.538998,2,2,0\n\
Vallunaraju,Pérou,-9.422222,-77.456389,pied,-9.422222,-77.456389,-9.422222,-77.456389,2,2,0\n\
Laguna 69,Pérou,-9.010431,-77.612,bus,-9.010431,-77.612,-9.010431,-77.612,2,2,0\n\
Trujillo,Pérou,-8.111763,-79.02867,bus,-8.111763,-79.02867,-8.111763,-79.02867,2,2,0\n\
Piura,Pérou,-5.194902,-80.6323,bus,-5.194902,-80.6323,-5.194902,-80.6323,2,2,0\n\
Guayaquil,Equateur,-2.247865,-79.903534,bus,-2.247865,-79.903534,-2.247865,-79.903534,2,2,0\n\
Banos,Equateur,-1.396389,-78.424722,bus,-1.396389,-78.424722,-1.396389,-78.424722,2,2,0\n\
Laguna Quilotoa,Equateur,-0.861193,-78.897285,voiture,-0.861193,-78.897285,-0.861193,-78.897285,2,2,0\n\
Quito,Equateur,-0.220169,-78.512091,bus,-0.220169,-78.512091,-0.220169,-78.512091,2,2,0\n\
Tulcan,Equateur,0.811976,-77.717126,bus,0.811976,-77.717126,0.811976,-77.717126,2,2,0\n\
Pasto,Colombie,1.214629,-77.278252,bus,1.214629,-77.278252,1.214629,-77.278252,2,2,0\n\
Popoyan,Colombie,2.454167,-76.609167,bus,2.454167,-76.609167,2.454167,-76.609167,2,2,0\n\
Cali,Colombie,2.454167,-76.609167,avion,2.454167,-76.609167,2.454167,-76.609167,2,2,0\n\
Cartagena,Colombie,10.4837,-75.4578,moto,10.4837,-75.4578,10.4837,-75.4578,2,2,0\n\
Playa Blanca,Colombie,10.227682,-75.606592,bus,10.227682,-75.606592,10.227682,-75.606592,2,2,0\n\
Parque Tayrona,Colombie,11.328957,-73.964412,avion,11.328957,-73.964412,11.328957,-73.964412,2,2,0\n\
Medellin,Colombie,6.248220,-75.571178,bus,6.248220,-75.571178,6.248220,-75.571178,2,2,0"
/*Bogota,Colombie,2.454167,-76.609167,bus,2.454167,-76.609167,2.454167,-76.609167,2,2,0*/

/*

APT-54.3411,5.1552
CHT -54.1722,5.1292
KAW -52.0989,4.5925*/


add_data_to_map(tt,edit_mode);

var map;

var hyb = new ol.layer.Group({
    visible: false,  //hide sponsor
    layers: [
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'sat'})
      }),
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'hyb'})
      })
    ]
});


map = new ol.Map({
  target: 'map',
  controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }).extend([mousePositionControl]),
  layers: [ hyb,tripVectorLayer ],
  overlays: [],
  view: new ol.View({
    center: ol.proj.transform([-55.5591,-26.2758], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5,
    maxZoom: 18,
    minZoom: 2,
  }),
});



 //###########################################################
 //OFFLINE

var southAmerica = new ol.layer.Image({
	opacity: 0.75,
	source: new ol.source.ImagesStatic({
	attributions: [
			 new ol.Attribution({
			 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		url: 'photos/1/01.jpg',
		imageSize: [3740,3399],
		projection: map.getView().getProjection(),
		imageExtent: ol.extent.applyTransform([-100.7227, 20.8793, -21.6211, -45.027]),
		//ol.proj.getTransform("EPSG:4326"; "EPSG:3857"))
	})
});

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
		 url: '../test7',
		 imageSize: [7281, 7098],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-52.8223, -21.5757, -33.5742,-3.338], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 
 var chilArg = new ol.layer.Image({
	 opacity: 0.25,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: '../test9',
		 imageSize: [3042, 9143],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-74.1202, -41.5677, -66.1044,-21.6166], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 var perou = new ol.layer.Image({
	 opacity: 0.25,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
			 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: '../test10',
		 imageSize: [6101, 6500],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-79.1016, -21.5757, -62.9736,-4.9158], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 var eqCol = new ol.layer.Image({
	 opacity: 0.25,
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
		 url: '../test12',
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
		 url: '../test14',
		 imageSize: [6824, 2364],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-66.6431, -29.7644, -48.6035,-24.1969], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 
 var guy2br = new ol.layer.Image({
	 opacity: 0.50,
	 source: new ol.source.ImageStatic({
		 attributions: [
			 new ol.Attribution({
				 html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			 })
		 ],
		 url: '../test15',
		 imageSize: [6284, 4247],
		 projection: map.getView().getProjection(),
		 imageExtent: ol.extent.applyTransform([-48.6035, -11.8889, -31.9922,-0.747], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	 })
 });
 
 
map.addLayer(southAmerica);
  //map.addLayer(guy2br) //guyane to br
  // map.addLayer(br2igu) //br to iguassu
  // map.addLayer(br1) //br salvador
  // map.addLayer(br2rio) //br rio
  // map.addLayer(gf)
  /* map.addLayer(chilArg);
   map.addLayer(perou)
   map.addLayer(eqCol)
 */

 //ENDOFFLINE
 //###########################################################
 

