 function getPhotos(id_photo) {
  $.get("photos/"+id_photo+"/filelist.csv", function (data) {parsePhotoList(id_photo,data)});
  //var tt = "01.jpg\ttoto le rigolo";
	//parsePhotoList(1,tt);
}


function parsePhotoList(id_photo,data_csv) {
  var data_array = $.csv.toArrays(data_csv,{"separator" : "§"});
  if (data_array.length > 0) {
	openGallery(id_photo,data_array);
  }
  else {
	alert("Pas de photos");
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
  console.log(fancybox_table);
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

