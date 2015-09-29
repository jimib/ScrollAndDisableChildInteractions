$(document).ready( function(){
	console.log("ready");

	var modelApp = new AppModel();
	ko.applyBindings( modelApp );

	var $ul = $("ul"), $doc = $(document);

	$ul.on("scroll",function(){
		if( !$ul.hasClass("scrolling") ){
			$ul.addClass("scrolling");
			$doc.on( "touchend", onScrollStop );
		}
	});

	function onScrollStop( evt ){
		if( $ul.hasClass("scrolling") ){
			evt.preventDefault();
			$ul.removeClass("scrolling");
		}
		
		$doc.unbind("touchend",onScrollStop );
	}



} );

function AppModel(){
	var self = this;
	
	self.onSelectItem = function(){
		console.log("onSelectItem", arguments);
	}
}