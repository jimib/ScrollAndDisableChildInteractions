$(document).ready( function(){
	console.log("ready");

	var modelApp = new AppModel();
	ko.applyBindings( modelApp );

	var $ul = $("ul"), $doc = $(document);
	var evtTouchStart = null;

	$doc.on("touchstart", function( evt ){
		evtTouchStart = evt;
	});

	$ul.on("scroll",function(){
		console.log("scroll", arguments);

		if( !$ul.hasClass("scrolling") ){
			$ul.addClass("scrolling");
			$doc.on( "touchend", onScrollStop );
		}

		if( evtTouchStart ){
			evtTouchStart.preventDefault();
			evtTouchStart = null;
		}
	});

	function onScrollStop( evt ){
		evt.preventDefault();
		$doc.unbind("touchend",onScrollStop );
		//$ul.removeClass("scrolling");
		evtTouchStart = null;
	}



} );

function AppModel(){
	var self = this;
	
	self.onSelectItem = function(){
		console.log("onSelectItem", arguments);
	}
}