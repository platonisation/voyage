
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


/*mauvais, à refactoriser*/
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
          if(featureHovered.get("transport") == null){
            if (featureHovered.get("interet") == 0) {
              document.getElementById("map").style.cursor = 'not-allowed';
            }
            else {
              document.getElementById("map").style.cursor = 'pointer';
            }
          }
          else{
            this.lastHighlitedFeature.set("selected",false);
            this.lastHighlitedFeature = false;
            document.getElementById("map").style.cursor = '';
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
        if(featureHovered.get("transport") == null){
          if (featureHovered.get("interet") == 0) {
            document.getElementById("map").style.cursor = 'not-allowed';
          }
          else {
            document.getElementById("map").style.cursor = 'pointer';
          }
        }
      }
    }
  });
}

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
		console.log(feature.get('id_photo'));
        _paq.push(['trackEvent', 'Behavior', 'OpenGallery', feature.get('text')]);
        getPhotos(id_photo);
      }
    };
  });
}
