$(document).ready( function(){
	console.log("ready");

	var modelApp = new AppModel();
	ko.applyBindings( modelApp );

} );

function AppModel(){
	var self = this;
	
	self.onSelectItem = function(){
		console.log("onSelectItem", arguments);
	}
}