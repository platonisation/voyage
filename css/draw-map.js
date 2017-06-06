var edit_mode = false;
var point_max = 169;
//var point_max = 9999;

function compute_bezier(point1,param1,param2,point2) {
  var points=[];
  var courbe = new Bezier(point1[0],point1[1],param1[0],param1[1],param2[0],param2[1],point2[0],point2[1]);
  var coordinates = courbe.getLUT(40);
  for (var i=0; i<coordinates.length; i++) {
    points.push(ol.proj.transform([coordinates[i]["x"].toString(),coordinates[i]["y"].toString()],'EPSG:4326','EPSG:3857'));
  }
  return points;
}

function color_from_hue(hue,alpha)
{
  var h = hue/60;
  var c = 255;
  var x = (1 - Math.abs(h%2 - 1))*255;
  var color;
  //console.log(h,x);
 
  var i = Math.floor(h);
  if (i == 0) color = [c, x, 0];
  else if (i == 1) color = [x, c, 0];
  else if (i == 2) color = [0, c, x];
  else if (i == 3) color = [0, x, c];
  else if (i == 4) color = [x, 0, c];
  else color = [c, 0, x];
  
  var color_int=color.map(function (x) {return parseInt(x, 10);});
  color_int.push(alpha);
  return color_int;
}

var tripStyle = function(resolution) {
  if (this.get("selected")) {
    coeff=1.3;
    police='16px Calibri,sans-serif';
    prio=30;
  }
  else {
    coeff=1;
    police='14px Calibri,sans-serif';
    prio=0;
  }
  switch (this.get("interet")) {
    case "0" : ;
      coeff=1;
      circle_color=[255,255,255,this.get("alpha")];
      coeff_interet=1;
    break;
    case "1" : ;
      circle_color=[255,255,255,this.get("alpha")];
      coeff_interet=1;
    break;
    case "2" : ;
      circle_color=[255,255,255,this.get("alpha")];
      coeff_interet=1;
    break;
  }
  switch (this.get("transport")) {
    case "moto" : case "voiture" : case "bus" : var wayStyle = [
      new ol.style.Style({
        zIndex: 5,
        stroke: new ol.style.Stroke({
          color: [255,255,255,this.get("alpha")],
          width: 10*coeff,
        }),
      }),
      new ol.style.Style({
        zIndex: 5,
        stroke: new ol.style.Stroke({
          color: [72,72,72,this.get("alpha")],
          width: 6*coeff,
        }),
      }),
      new ol.style.Style({
        zIndex: 5,
        stroke: new ol.style.Stroke({
          color: [255,255,255,this.get("alpha")],
          width: 2*coeff,
          lineDash: [6,10]
        }),
      }),
    ]; break;
    case "avion" : var wayStyle = [
      new ol.style.Style({
        zIndex: 6,
        stroke: new ol.style.Stroke({
          color: [68,170,221,this.get("alpha")],
          width: 8*coeff,
        }),
      }),
      new ol.style.Style({
        zIndex: 6,
        stroke: new ol.style.Stroke({
          color: [245,245,245,this.get("alpha")],
          width: 3*coeff,
        }),
      }),
    ]; break;
    case "bateau" : var wayStyle = [
      new ol.style.Style({
        zIndex: 6,
        stroke: new ol.style.Stroke({
          color: [68,170,221,this.get("alpha")],
          width: 9*coeff,
        }),
      }),
      new ol.style.Style({
        zIndex: 6,
        stroke: new ol.style.Stroke({
          color: [245,245,245,this.get("alpha")],
          width: 7*coeff,
        }),
      }),
      new ol.style.Style({
        zIndex: 6,
        stroke: new ol.style.Stroke({
          color: [68,170,221,this.get("alpha")],
          width: 7*coeff,
          lineDash: [10,20],
          lineCap: "square",
        }),
      }),
    ]; break;
    case "train" : var wayStyle = [
      new ol.style.Style({
        zIndex: 5,
        stroke: new ol.style.Stroke({
          color: [255,255,255,this.get("alpha")],
          width: 10*coeff,
        }),
      }),
      new ol.style.Style({
        zIndex: 5,
        stroke: new ol.style.Stroke({
          color: [72,72,72,this.get("alpha")],
          width: 7*coeff,
        }),
      }),
      new ol.style.Style({
        zIndex: 5,
        stroke: new ol.style.Stroke({
          color: [255,255,255,this.get("alpha")],
          width: 5*coeff,
          lineDash: [5,9],
          lineCap: "square",
        }),
      }),
    ]; break;
    case "null" : var wayStyle = []; break;
    default: var wayStyle = [
      new ol.style.Style({
        zIndex: 5,
        stroke: new ol.style.Stroke({
          color: [0,255,0,this.get("alpha")],
          width: 6*coeff,
        }),
      }),
    ];
  }
  if (this.get("selected")) {
    wayStyle.push(new ol.style.Style({
      zIndex: 30+prio,
      text : new ol.style.Text({
        font : police,
        text: this.get("text"),
        fill : new ol.style.Fill({
          color: [0,0,0,1],
        }),
        stroke : new ol.style.Stroke({
          color: [255,255,255,1],
          width : 5*coeff
        }),
        offsetY: -15*coeff
      }),
    }));
  }
  return wayStyle.concat([
    new ol.style.Style({
      zIndex: 10+prio,
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: color_from_hue(this.get("hue"),this.get("alpha")),
        }),
        radius: 8*coeff*coeff_interet,
        stroke: new ol.style.Stroke({
          color: circle_color,
          width: 2*coeff*coeff_interet,
          opacity: 0.5,
        }),
      }),      
    }),
  ]);
};

var pointerStyle = function(resolution) {
  style = new ol.style.Style({
    zIndex: 50,
    image: new ol.style.Icon({
      src: "images/pin-small.png",
      anchor: [0.5,1],
      scale: 0.8,
    }),
    text : new ol.style.Text({
      font : '18px Calibri,sans-serif',
      text: this.get("text"),
      fill : new ol.style.Fill({
        color: [0,0,0,1],
      }),
      stroke : new ol.style.Stroke({
        color: [255,255,255,1],
        width : 5
      }),
      offsetY: -70,
      offsetX: 0
    }),
  });
  return style;
}


var tripVectorSource = new ol.source.Vector({});

if (edit_mode == true) {
  //var paramVectorSource = new ol.source.Vector({});
  var paramStyle = new ol.style.Style({
    zIndex: 90,
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: "#DDDDDD",
      }),
      radius: 6,
    }),
  });
}



$.get("points.csv", function (data) {add_data_to_map(data,edit_mode)});



function add_data_to_map(data,edit_mode) {
  var points_array = $.csv.toArrays(data);
  add_points_to_map(points_array);
  //if (edit_mode == true) {
  //  editor(points_array);
  //}
}

function add_points_to_map(points_array) {
  var real_y_coord=parseFloat(points_array[points_array.length -1][2],10)+90;
  var pointerFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([points_array[points_array.length -1][3],real_y_coord.toString()],'EPSG:4326','EPSG:3857')),
    selected: false,
    text: "Je suis là : " + points_array[points_array.length -1][0] + ", " + points_array[points_array.length -1][1] + ' !',
    interet: points_array[points_array.length -1][9],
    id_photo: (points_array.length-1)*2+1,
  });
  pointerFeature.setStyle(pointerStyle);
  tripVectorSource.addFeature(pointerFeature);
  var hue=0;
  var delta_hue=330/points_array.length;
  for (var point=0; point<points_array.length; point++){
    if (point*2+1 > point_max) {
      var alpha=0.3;
      var comment_point=points_array[point][0] + ' (pas encore publié)';
    }
    else {
      var alpha = 1;
      if (points_array[point][9] == "0") {
        var comment_point=points_array[point][0] + ' (pas de photos)';
      }
      else {
        var comment_point=points_array[point][0];
      }
    }
    var real_y_coord=parseFloat(points_array[point][2],10)+90;
    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([points_array[point][3],real_y_coord.toString()],'EPSG:4326','EPSG:3857')),
      text: comment_point,
      selected: false,
      interet: points_array[point][9],
      id_photo: point*2+1,
      hue: hue,
      alpha: alpha,
    });
    hue=hue+delta_hue;
    iconFeature.setStyle(tripStyle);
    tripVectorSource.addFeature(iconFeature);
    if (point+1<points_array.length) {
      if (points_array[point][0] == points_array[point+1][0]) {
        var comment_line='Balade en '+points_array[point][4]+' dans les environs de '+points_array[point][0];
      }
      else {
        var comment_line='Trajet en '+points_array[point][4]+' de '+points_array[point][0] + ' à ' + points_array[point+1][0];
      }
      if (point*2+2 > point_max) {
        var alpha=0.2;
        comment_line=comment_line + ' (pas encore publié)';
      }
      else {
        var alpha = 1;
          if (points_array[point][10] == "0") {
            comment_line=comment_line + ' (pas de photos)';
          }
      }
      var real_y_coord_2=parseFloat(points_array[point+1][2],10)+90;
      var real_param_y_coord=parseFloat(points_array[point][5],10)+90;
      var real_param_y_coord_2=parseFloat(points_array[point][7],10)+90;
      var courbe = compute_bezier(
        [points_array[point][3],real_y_coord.toString()],
        [points_array[point][6],real_param_y_coord.toString()],
        [points_array[point][8],real_param_y_coord_2.toString()],
        [points_array[point+1][3],real_y_coord_2.toString()]
      );
      var lineFeature = new ol.Feature({
        geometry: new ol.geom.LineString(courbe),
        text: comment_line,
        transport: points_array[point][4],
        selected: false,
        interet: points_array[point][10],
        id_photo: point*2+2,
        alpha: alpha,
        hue: 0,
      });
      lineFeature.setStyle(tripStyle);
      tripVectorSource.addFeature(lineFeature);
      if (edit_mode == true) {
        var paramFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([points_array[point][6],real_param_y_coord.toString()],'EPSG:4326','EPSG:3857')),
          id_loc: point,
          x_t: 5,
          y_t: 6,
        });
        paramFeature.setStyle(paramStyle);
        console.log("first"+points_array[point][0]);
        console.log(point+' '+points_array[point][6]+' '+real_param_y_coord.toString());
        tripVectorSource.addFeature(paramFeature);
        var paramFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([points_array[point][8],real_param_y_coord_2.toString()],'EPSG:4326','EPSG:3857')),
          id_loc: point,
          x_t: 7,
          y_t: 8,
        });
        paramFeature.setStyle(paramStyle);
        console.log("deuz"+points_array[point][0]);
        console.log(point+' '+points_array[point][8]+' '+real_param_y_coord_2.toString());
        tripVectorSource.addFeature(paramFeature);
      }
    }
  }
}

function editor(points_array) {
  for (var point=0; point<points_array.length; point++){
    var real_param_y_coord=parseFloat(points_array[point][5],10)+90;
    var real_param_y_coord_2=parseFloat(points_array[point][7],10)+90;
    var paramFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([points_array[point][6],real_param_y_coord.toString()],'EPSG:4326','EPSG:3857')),
      id_loc: point,
      x_t: 5,
      y_t: 6,
    });
    paramFeature.setStyle(paramStyle);
    console.log("first"+points_array[point][0]);
    console.log(point+' '+points_array[point][6]+' '+real_param_y_coord.toString());
    paramVectorSource.addFeature(paramFeature);
    var paramFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([points_array[point][8],real_param_y_coord_2.toString()],'EPSG:4326','EPSG:3857')),
      id_loc: point,
      x_t: 7,
      y_t: 8,
    });
    paramFeature.setStyle(paramStyle);
    console.log("deuz"+points_array[point][0]);
    console.log(point+' '+points_array[point][8]+' '+real_param_y_coord_2.toString());
    paramVectorSource.addFeature(paramFeature);
  }
}

var tripVectorLayer = new ol.layer.Vector({
  source: tripVectorSource,
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

var map = new ol.Map({
  target: 'map',
  controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }).extend([mousePositionControl]),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileJSON({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure=1',
        crossOrigin: '',
      }),
//      source: new ol.source.Stamen({
//        layer: 'watercolor'
//      }),
    }),
    tripVectorLayer,
  ],
  overlays: [],
  view: new ol.View({
    center: ol.proj.transform([-60, -10], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5,
    maxZoom: 8,
    minZoom: 2,
  }),

});


var projectionSelect = document.getElementById('projection');
projectionSelect.addEventListener('change', function(event) {
mousePositionControl.setProjection(ol.proj.get(event.target.value));
});

var precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', function(event) {
var format = ol.coordinate.createStringXY(event.target.valueAsNumber);
mousePositionControl.setCoordinateFormat(format);
});


// Create an image layer
var imageLayer = new ol.layer.Image({
	opacity: 0.75,
	source: new ol.source.ImageStatic({
		attributions: [
			new ol.Attribution({
				html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
			})
		],
		url: 'test2',
		imageSize: [3740, 3399],
		projection: map.getView().getProjection(),
		imageExtent: ol.extent.applyTransform([-100.7227, 20.8793, -21.6211,-45.027], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	})
});

map.addLayer(imageLayer)





// BEGIN EDIT MODE

if (edit_mode == true) {
  //var paramVectorLayer = new ol.layer.Vector({
  //  source: paramVectorSource,
  //});
  //map.addLayer(paramVectorLayer);
  var select = new ol.interaction.Select();
  var translate = new ol.interaction.Translate({
    features: select.getFeatures()
  });
  map.addInteraction(select);
  map.addInteraction(translate);
}
// END EDIT MODE

if (edit_mode == false) {
  map.on('click', function(event) {
    feature = map.forEachFeatureAtPixel(event.pixel,
      function(feature, layer) {
        return feature;
      }
    );
    if (feature) {
      if (feature.get('interet') != '0') {
        document.getElementById("map").style.cursor = 'progress';
        var id_photo=feature.get('id_photo');
        _paq.push(['trackEvent', 'Behavior', 'OpenGallery', feature.get('text')]);
        getPhotos(id_photo);
      }
    };
  });
}

function getPhotos(id_photo) {
  $.get("photos/"+id_photo+"/filelist.csv", function (data) {parsePhotoList(id_photo,data)});
}

function parsePhotoList(id_photo,data_csv) {
  var data_array = $.csv.toArrays(data_csv,{"separator" : "\t"});
  if (data_array.length > 0) {
    openGallery(id_photo,data_array);
  }
  else {
    alert("Pas de photos à cet endroit.. :-(");
  }
}

function openGallery(id_photo,photos_array) {
  var fancybox_table = [];
  for (var photo=0; photo<photos_array.length; photo++){
    if (/webm$/.test(photos_array[photo][0])) {
      // http://www.picssel.com/play-mp4-videos-with-mediaelement-js-in-fancybox/
      // http://www.picssel.com/demos/play_videos_with_mediaelement_in_fancybox.html
      var newimage = {
        type : "html",
        content : "<video width='900' height='480' id='video_player' src='photos/" + id_photo + "/" + photos_array[photo][0] + "' controls='controls' preload='none' ></video>",
        title : photos_array[photo][1]+' (<a href="photos/'+id_photo+'/'+photos_array[photo][0]+'" download>Télécharger</a>)',
      }
    }
    else {
      var newimage = {
        href : 'photos/'+id_photo+'/'+photos_array[photo][0],
        title : photos_array[photo][1]+' (<a href="photos/'+id_photo+'/'+photos_array[photo][0]+'" download>Télécharger</a>)',
      }
    }
    fancybox_table.push(newimage);
  }
  $.fancybox.open(
    fancybox_table,
    {
      helpers : {
        thumbs : {
          width: 75,
          height: 50
        },
//        buttons : {
//        },
      },
      loop : false,
      scrolling : "no",
      afterShow : function () {
        // initialize MEJS player
        var $video_player = new MediaElementPlayer('#video_player', {
          success : function (mediaElement, domObject) {
            _player = mediaElement; // override the "mediaElement" instance to be used outside the success setting
            _player.load(); // fixes webkit firing any method before player is ready
            _player.play(); // autoplay video (optional)
            _player.addEventListener('playing', function () {
              _isPlaying = true;
            }, false);
          }
        });
      },
    }
  );
}

if (edit_mode == false) {
  map.on('pointermove', function(e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    var featureHovered = map.forEachFeatureAtPixel(
      pixel,
      function(feature) {
        return feature;
      }
    );
    if (this.lastHighlitedFeature) {
      if (hit) {
        if (featureHovered != this.lastHighlitedFeature) {
          this.lastHighlitedFeature.set("selected",false);
          this.lastHighlitedFeature = featureHovered;
          featureHovered.set("selected",true);
          if (featureHovered.get("interet") == 0) {
            document.getElementById("map").style.cursor = 'not-allowed';
          }
          else {
            document.getElementById("map").style.cursor = 'pointer';
          }
        }
      }
      else {
        this.lastHighlitedFeature.set("selected",false);
        this.lastHighlitedFeature = false;
        document.getElementById("map").style.cursor = '';
      }
    }
    else {
      if (hit) {
        this.lastHighlitedFeature = featureHovered;
        featureHovered.set("selected",true);
        if (featureHovered.get("interet") == 0) {
          document.getElementById("map").style.cursor = 'not-allowed';
        }
        else {
          document.getElementById("map").style.cursor = 'pointer';
        }
      }
    }
  });
}
