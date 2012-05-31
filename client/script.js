//TODO: handled no connection
var socket = io.connect('ws://wyne.dyndns.org:8080');

$(document).ready(function(){
  
    socket.on('connect', function () {
        // User traffic
        socket.on('client-count-push', function (data) {
          $("#clientCount").html( "Clients connected: " + data );
          shake( $("#clientCount") ); 
        });

        // Image Change
        socket.on('image-change', function (data) {
            scrollToImage( data );
        });

        // Stat Graph value
        socket.on('stats', function (data) {
            updateGraph( data["client-count"], data["action-count"] );
        });

    });

});

function shake( obj ){
  if ( !obj.hasClass("shake") ) {
    obj.addClass("shake");
  } else {
    obj.css('animation-name', 'none');
    obj.css('-moz-animation-name', 'none');
    obj.css('-webkit-animation-name', 'none');

    setTimeout(function() {
      obj.css('-webkit-animation-name', 'shake');
    }, 0);
  }
}
