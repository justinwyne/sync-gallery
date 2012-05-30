var DEBUG = false,
  IMG_WIDTH = 640,
  currentImg=0,
  maxImages=7,
  speed=200,
  imgs;

var swipeOptions = {
  triggerOnTouchEnd : true, 
  allowPageScroll:"none",
  swipeStatus : swipeStatus,
  threshold:50
}

$(function() {       
  imgs = $("#images");
  imgs.swipe( swipeOptions );
});

/**
* Catch each phase of the swipe.
*/      
function swipeStatus( event, phase, direction, distance ) {
  // Update debug view
  if ( typeof DEBUG != 'undefined' && DEBUG == true ) {
    updateDebugView( phase, direction, distance );
  }

  // MOVE Phase
  if( phase=="move" && ( direction=="left" || direction=="right" ) ) {
    // Set duration of scroll animation to 0 by default.
    // This is used during the drag event to immediately
    // track the user's pointer/finger.

    if ( direction == "left" )
      scrollImages( (IMG_WIDTH * currentImg) + distance, 0 );
    else if ( direction == "right" )
      scrollImages( (IMG_WIDTH * currentImg) - distance, 0 );

  // CANCEL Phase
  } else if ( phase == "cancel") {
    scrollImages(IMG_WIDTH * currentImg, speed);

  // END Phase
  } else if ( phase == "end" ) {

    if ( direction == "right" ) {
      broadcastImageChange( currentImg - 1 );
      previousImage();
    } else if ( direction == "left" ) {
      broadcastImageChange( currentImg + 1 );
      nextImage();
    }

  }
}

function updateDebugView( phase, direction, distance ) {
  var str = "Swipe Phase : " + phase + "<br/>";
  str += "Direction from inital touch: " + direction + "<br/>";
  str += "Distance from inital touch:: " + distance + "<br/>";

  if ( distance < swipeOptions.threshold ) {
    str += "<br/>Not yet reached threshold. <br/> " +
      "Swipe will be canceled if you release at this point."
    } else {
    str +="<br/>Threshold reached<br/>" +
      "Swipe handler will be triggered if you release at this point."
  }

  if ( phase == "cancel" ) {
    str += "<br/>Handler not triggered."
  }
  if ( phase == "end" ) {
    str += "<br/>Handler was triggered." 
  }

  $("#debug").html( str );
}

function previousImage() {
  scrollToImage( currentImg - 1 );
}

function nextImage() {
  scrollToImage( currentImg + 1 );
}

function scrollToImage( i ) {
  currentImg = Math.max(i, 0);
  currentImg = Math.min(currentImg, maxImages-1);
  scrollImages( IMG_WIDTH * currentImg, speed);
  $("img").removeClass("focused");
  $("img:eq(" + currentImg + ")").addClass("focused");
}

/**
* Manually update the position of the imgs on drag
*/
function scrollImages(distance, duration) {
  // toFixed takes care of divide by zero
  imgs.css( "-webkit-transition-duration", 
    ( duration/1000 ).toFixed(1) + "s");

  //inverse the number we set in the css
  var value = ( distance < 0 ? "" : "-") + Math.abs( distance ).toString();

  imgs.css( "-webkit-transform", "translateX(" + value + "px)" );
}
