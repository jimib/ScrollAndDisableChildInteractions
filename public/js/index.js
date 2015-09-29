$(document).ready( function(){
	console.log("ready");

	var modelApp = new AppModel();
	ko.applyBindings( modelApp );

	var $ul = $("ul"), $doc = $(document);
	var isScrolling = false;

	$ul.on("scroll",function(){
		if( !isScrolling ){
			//$ul.addClass("scrolling");
			isScrolling = true;
			$doc.on( "touchend", onScrollStop );
		}
	});

	function onScrollStop( evt ){
		$doc.unbind("touchend",onScrollStop );

		if( isScrolling ){
			isScrolling = false;
			//try cancelling the event
			evt.originalEvent.ignore = true;
			evt.preventDefault();
		}
		
		
	}



} );

function AppModel(){
	var self = this;
	
	self.onSelectItem = function(){
		console.log("onSelectItem", arguments);
	}
}