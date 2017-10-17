export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return { view: "search", gravity: 0.3, minWidth: 80, css: "webix_fmanager_search", icon:" webix_fmanager_icon" };
}

function ready(view){
	var search = view.$$("search");
	if(search){
		view.attachEvent("onHideSearchResults", function(){
			search.setValue("");
		});
		view.attachEvent("onBeforeCursorChange", function(){
			if(view.$searchResults){
				view.hideSearchResults(true);
			}
		});
		search.attachEvent("onTimedKeyPress",  function(){
			if(this._code != 9){
				var value = search.getValue();
				if(value){
					if(view.callEvent("onBeforeSearch", [value])){
						view.showSearchResults(value);
						view.callEvent("onAfterSearch", [value]);
					}
				}
				else if(view.$searchResults){
					view.hideSearchResults();
				}

			}

		});
		search.attachEvent("onKeyPress",  function(code){
			this._code = code;
		});

		view.attachEvent("onAfterModeChange",function(){
			if(view.$searchResults)
				view.showSearchResults(search.getValue());
		});
	}
}