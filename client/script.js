//TODO: handled no connection
var socket = io.connect('ws://wyne.dyndns.org:8080');

$(document).ready(function(){
  

    socket.on('connect', function () {
        // User traffic
        socket.on('client-count-push', function (data) {
            $("#clientCount").html( "Clients connected: " + data );
            console.log("Clients: " + data );
        });

        // Image Change
        socket.on('image-change', function (data) {
            console.log("Scroll to image " + data );
            scrollToImage( data );
        });

        // Stat Graph value
        socket.on('stats', function (data) {
            updateGraph( data["client-count"], data["action-count"] );
        });

    });

});
