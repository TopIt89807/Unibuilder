export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return { view: "button", type:"htmlbutton", css: "webix_fmanager_back",
		label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 37,
		tooltip: webix.i18n.filemanager.back
	};
}

function ready(view){
	if(view.$$("back")){
		view.$$("back").attachEvent("onItemClick", function(){
			if(view.callEvent("onBeforeBack", [])){
				view.goBack();
				view.callEvent("onAfterBack", []);
			}
		});
		view.attachEvent("onHistoryChange", function(path, ids, cursor){
			if(!cursor)
				view.$$("back").disable();
			else
				view.$$("back").enable();
		});
	}
}