var button = document.createElement('button');
button.innerHTML = 'F';

var handleFollowMe = function(e) {
	$('#exampleModal').modal('show');
    $(document).on("click",".btn-primary",function(event){
		 //Open gmail in browser
		 var link = "https://mail.google.com/mail/?view=cm&fs=1&to=timote.bonnin@gmail.com&"
		 +"su=Suivi de voyage&"
		 +"body=" + escape(document.getElementById('prenom').value) +" "+ escape(document.getElementById('nom').value)
		 +" souhaite être notifié des mise à jour du site et des photos par mail."
		 +"Tu peux me contacter à l'adresse suivante : "+ escape(document.getElementById('email').value)
		 +"&bcc=";
		 //Open local client
		 //~ mailto:timote.bonnin@gmail.com"
		 //~ + "&subject=Suivi de voyage"
		 //~ + "&body=" + escape(document.getElementById('prenom').value) +" "+ escape(document.getElementById('nom').value)
		 //~ + " souhaite être notifié des mise à jour du site et des photos par mail. Tu peux me contacter à l'adresse suivante : "+ escape(document.getElementById('email').value);

		window.open(link,'_blank');
		$('#exampleModal').modal('hide');
	});
};

button.addEventListener('click', handleFollowMe, false);

var element = document.createElement('div');
element.className = 'follow-me ol-unselectable ol-control';
element.appendChild(button);

var followMe = new ol.control.Control({
    element: element
});
map.addControl(followMe);

$('.follow-me').tooltip({
  placement: 'right',
  title: 'Clic pour me suivre'
});
