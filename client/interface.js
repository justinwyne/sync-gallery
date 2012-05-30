var canvasLeft = document.getElementById("statCanvasL");
var canvasRight = document.getElementById("statCanvasR");
var ctxLeft = canvasLeft.getContext("2d");
var ctxRight = canvasRight.getContext("2d");

$(document).ready(function() {

    // Disable default drag/drop of images
    $('img').bind('dragstart', function(event) { event.preventDefault(); });

    // Register handlers
    $("#prev").click( function() {
      socket.emit("image-change", currentImg-1);
      previousImage();
    });

    $("#next").click( function() {
      socket.emit("image-change", currentImg+1);
      nextImage();
    });

    $("body").keydown(function(e) {
      // Left Arrow
      if (e.keyCode == 37) { 
        socket.emit("image-change", currentImg-1);
        previousImage();
        return false;
      // Right Arrow
      } else if (e.keyCode == 39) { 
        socket.emit("image-change", currentImg+1);
        nextImage();
        return false;
      }
    });

});

function broadcastImageChange( i ) {
  socket.emit("image-change", i);
}

function updateGraph( value, value2 ) {
  // Copy img
  ctxLeft.save();
  ctxRight.save();

  var barWidth = 5;
  var barHeight = 10 * value;
  var barHeight2 = 10 * value2;
  var imgL = ctxLeft.getImageData( barWidth, 0, ctxLeft.canvas.width - barWidth, ctxLeft.canvas.height );
  var imgR = ctxRight.getImageData( 0, 0, ctxRight.canvas.width - barWidth, ctxRight.canvas.height );

  // Shift outward. <--L R-->
  ctxLeft.putImageData( imgL, 0, 0 );
  ctxRight.putImageData( imgR, barWidth , 0 );

  // Clear right-most column
  ctxLeft.fillStyle = "rgba(0,100,150,0.5)";
  ctxRight.fillStyle = "rgba(68,119,68,0.5)";
  ctxLeft.strokeStyle = "rgba(0,50,75,0.5)";
  ctxRight.strokeStyle = "rgba(0,31,0,0.2)";
  ctxLeft.lineWidth = 1;
  ctxRight.lineWidth = 1;

  ctxLeft.clearRect( ctxLeft.canvas.width - barWidth, 0, barWidth, ctxLeft.canvas.height );
  ctxRight.clearRect( 0, 0, barWidth, ctxRight.canvas.height );
  
  ctxLeft.fillRect( ctxLeft.canvas.width - barWidth, 0, barWidth,barHeight );
  ctxRight.fillRect( 0, 0, barWidth,barHeight2 );

  ctxLeft.strokeRect( ctxLeft.canvas.width - barWidth, 0, barWidth,barHeight );
  ctxRight.strokeRect( 0, 0, barWidth,barHeight2 );

  ctxLeft.restore();
  ctxRight.restore();
}
