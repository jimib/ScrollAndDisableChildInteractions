ko.bindingHandlers.eventPreventable = { 
	init : function( element, valueAccessor, allBindings, viewModel, bindingContext ){
		var eventsToHandle = valueAccessor() || {};
		ko.utils.objectForEach(eventsToHandle, function(eventName) {
			if (typeof eventName == "string") {
				ko.utils.registerEventHandler(element, eventName, function (event) {
					//overwrite this so we can ignore the cancelable : false flag
					var prevented = false;

					event.originalEvent.cancel = function(){
						console.log("cancelled");
						prevented = true;
						event.preventDefault();
					}

					//wait a split second giving the root document change to cancel it
					setTimeout( function(){
						
						prevented = prevented || event.isDefaultPrevented();

						if( !prevented ){
							var handlerReturnValue;
							var handlerFunction = valueAccessor()[eventName];
							if (!handlerFunction)
								return;

							try {
								// Take all the event args, and prefix with the viewmodel
								var argsForHandler = Array.prototype.slice.call(arguments);
								viewModel = bindingContext['$data'];
								argsForHandler.unshift(viewModel);
								handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
							} finally {
								if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
									if (event.preventDefault)
										event.preventDefault();
									else
										event.returnValue = false;
								}
							}

							var bubble = allBindings.get(eventName + 'Bubble') !== false;
							if (!bubble) {
								event.cancelBubble = true;
								if (event.stopPropagation)
									event.stopPropagation();
							}
						}
						
					}, 10 );
					
				});
			}
		});
	}
}

ko.bindingHandlers.widget = {
	init : function( element, valueAccessor, allBindings, viewModel, bindingContext ){
	
		var oElement = element;
		//reach up to the parent pinpad and get the options from it
		var widgets = valueAccessor();
		var $element = $(element);
		//if this element is called component - then we reach up to our parent
		if( $element.prop("tagName").toLowerCase() == "component" ){
			$element = $element.parent();
			element = $element.get(0);
		}
	
		//build up a list of widgets we can access
		element.widget = {};
	
		for( var id in widgets ){
			(function(id){
				var options = widgets[ id ];
				var optionsCustom = {};
		
				//read the custom parameters the user passed through
				try{
					eval( "optionsCustom = {" +$element.attr("options") + "}" );
				}catch(err){
					console.log("Unable to parse parent options", err);
				}
	
				//merge these values
				for( var property in optionsCustom ){
					options[property] = optionsCustom[property];
				}
		
				//add the model to the options
				options.viewModel = viewModel;
		
				//apply the widget
				try{
					$( element )[id]( options );
					element.widget[id] = function(){
						$( element )[id].apply( $( element ), arguments );
					}
				}catch(err){
					console.error("Failed to bind widget '"+id+"'", err);
				}
			})(id);
		}
	
	}
}

$.widget("pixel.scroller", {
	_init : function(){
		var self = this;
		
		self.element.on("scroll", onScroll);
		
		var $doc = $(document), isScrolling = false;
		
		console.log("implemented scroller");
		
		function onScroll( evt ){
			if( !isScrolling ){
				isScrolling = true;
				$doc.on("touchend", onScrollCancel);
			}
		}
		
		function onScrollCancel( evt ){
			$doc.unbind("touchend", onScrollCancel);
			if( isScrolling ){
				isScrolling = false;
				(evt.originalEvent.cancel || evt.preventDefault)();
			}
		}
	}
})