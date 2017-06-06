
var edit_mode = false;
var point_max = 269;
//var point_max = 9999;




/*function loadPoints(callback){
 $.get("../points.csv", function (data) {add_data_to_map(data,edit_mode)});
  callback();
}
*/

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

var pointerStyle = function(resolution) {
  style = new ol.style.Style({
    zIndex: 50,
    image: new ol.style.Icon({
      src: "images/pin-smalls.png",
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

function add_data_to_map(data,edit_mode) {
  var points_array = $.csv.toArrays(data);
  add_points_to_map(points_array);
  //if (edit_mode == true) {
  //  editor(points_array);
  //}
}

function add_points_to_map(points_array) {
  var real_y_coord=parseFloat(points_array[points_array.length -1][2],10)+90;
/*  var pointerFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([points_array[points_array.length -1][3],real_y_coord.toString()],'EPSG:4326','EPSG:3857')),
    selected: false,
    text: "Je suis là : " + points_array[points_array.length -1][0] + ", " + points_array[points_array.length -1][1] + ' !',
    interet: points_array[points_array.length -1][9],
    id_photo: (points_array.length-1)*2+1,
  });
  pointerFeature.setStyle(pointerStyle);
  tripVectorSource.addFeature(pointerFeature);*/
  var hue=0;
  
  var delta_hue=330/points_array.length;
  for (var point=0; point<points_array.length; point++){
    var alpha;
    var comment_point
    if(points_array[point][9] == "2"){
      alpha=0.8;
      comment_point=points_array[point][0] + ' (pas encore publié)';
    }
    else {
      alpha = 0.5;
      if (points_array[point][9] == "0") {
        comment_point=points_array[point][0] + ' (pas de photos)';
      }
      else {
        alpha=1;
        comment_point=points_array[point][0];
      }
    }
    var real_y_coord=parseFloat(points_array[point][2],10)+90;
    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([points_array[point][3],real_y_coord.toString()],'EPSG:4326','EPSG:3857')),
      text: comment_point,
      selected: false,
      interet: points_array[point][10],
      id_photo: point*2+1,
      hue: hue,
      alpha: alpha,
      hasPic: points_array[point][9],
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
        var alpha=0.5;
        comment_line=comment_line + ' (pas encore publié)';
      }
      else {
        var alpha = 0.5;
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
