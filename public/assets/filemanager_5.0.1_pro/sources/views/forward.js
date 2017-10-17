export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return { view: "button", type:"htmlbutton", css: "webix_fmanager_forward",
		label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 37,
		tooltip: webix.i18n.filemanager.forward
	};
}

function ready(view){
	if(view.$$("forward")){
		view.$$("forward").attachEvent("onItemClick", function(){
			if(view.callEvent("onBeforeForward", [])){
				view.goForward();
				view.callEvent("onAfterForward", []);
			}
		});
		view.attachEvent("onHistoryChange", function(path, ids, cursor){
			if(ids.length ==1 || cursor == ids.length-1)
				view.$$("forward").disable();
			else
				view.$$("forward").enable();
		});
	}
}