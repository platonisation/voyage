var coeff_interet=1;
var circle_color=0;

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
  
  var placeStyle = new ol.style.Style({
      zIndex: 10+prio,
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: color_from_hue(this.get("hue"),this.get("alpha")),
        }),
        radius: 6*coeff*coeff_interet,
        stroke: new ol.style.Stroke({
          color: circle_color,
          width: 2*coeff*coeff_interet,
          opacity: 0.5,
        }),
      }),
    });
  
  switch (this.get("hasPic")) {
    case "0" : ;
      coeff=1;
      circle_color=[255,255,255,this.get("alpha")];
      coeff_interet=1+this.get("interet")/5;
    break;
    case "1" : ;
      switch (this.get("interet")) {
        case "5" :
          var picSrc = 'images/5starsbis.png';
          var offsetPic = 20;
          prio += 50;
        break;
        case "4" :
          var picSrc = 'images/4starsbis.png';
          var offsetPic = 20;
          prio += 40;
        break;
        case "3" :
          var picSrc = 'images/3starsbis.png';
          var offsetPic = 20;
          prio += 30;
        break;
        case "2":
          var picSrc = 'images/2starsbis.png';
          var offsetPic = 20;
          prio += 20;
        break;
        case "1":
          var picSrc = 'images/1starsbis.png';
          var offsetPic = 20;
          prio += 10;
        break;
        default:
          var picSrc = 'images/1stars.png';
          var offsetPic = 20;
          prio = 0;
        break;
      }
      placeStyle = new ol.style.Style({
    	  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    		anchor: [0.5, offsetPic],
    		anchorXUnits: 'fraction',
    		anchorYUnits: 'pixels',
    		opacity: 1,
    		src: picSrc
  	  })),
	    zIndex: 30+prio,
	    });
      circle_color=[255,255,255,this.get("alpha")];
      //coeff_interet=this.get("interet");
    break;
    case "2" : ;
      circle_color=[255,255,255,this.get("alpha")];
      coeff_interet=1+this.get("interet")/5;
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
    placeStyle,
  ]);
};




/*
return wayStyle.concat([
    new ol.style.Style({
      zIndex: 10+prio,
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: color_from_hue(this.get("hue"),this.get("alpha")),
        }),
        radius: 8*coeff*coeff_interet,
        stroke: new ol.style.Stroke({
          image: new ol.style.Icon(({
                            scale: 1 + rnd,
                            rotateWithView: (rnd < 0.9) ? true : false,
                            rotation: 360 * rnd * Math.PI / 180,
                            anchor: [0.5, 1],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: rnd,
                            src: icons[ Math.floor(rnd * (icons.length-1) ) ]
                        }))
          width: 2*coeff*coeff_interet,
          opacity: 0.5,

*/
