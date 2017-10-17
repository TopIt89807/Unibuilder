export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return { view: "path", borderless: true};
}

function ready(view){
	if(view.$$("path")){
		view.attachEvent("onFolderSelect",function(id){
			view.$$("path").setValue(view.getPathNames(id));
		});
		view.$$("path").attachEvent("onItemClick",function(id){
			var targetIndex = view.$$("path").getIndexById(id);
			var levelUp = view.$$("path").count()-targetIndex-1;

			if(view.$searchResults)
				view.hideSearchResults();

			if(levelUp){
				id = view.getCursor();
				while(levelUp){
					id = view.getParentId(id);
					levelUp--;
				}
				view.setCursor(id);
			}
			view.callEvent("onAfterPathClick",[id]);
		});

		view.data.attachEvent("onClearAll",function(){
			view.$$("path").clearAll();
		});
	}
}