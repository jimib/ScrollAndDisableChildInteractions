ko.bindingHandlers.eventPreventable = { 
	init : function( element, valueAccessor, allBindings, viewModel, bindingContext ){
		var eventsToHandle = valueAccessor() || {};
		ko.utils.objectForEach(eventsToHandle, function(eventName) {
			if (typeof eventName == "string") {
				ko.utils.registerEventHandler(element, eventName, function (event) {
					//wait a split second giving the root document change to cancel it
					setTimeout( function(){
						
						var prevented = event.isDefaultPrevented() || event.ignore || event.originalEvent.ignore;
						
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

console.log("custom bindingss");