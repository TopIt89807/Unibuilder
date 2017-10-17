export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return { view: "button", type:"htmlbutton", css: "webix_fmanager_expand",
		label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30,
		tooltip: webix.i18n.filemanager.expandTree
	};
}

function ready(view){
	if(view._getDynMode() && view.$$("expandAll")){
		view.$$("expandAll").hide();
	}
	if(view.$$("expandAll") && view.$$("tree")){
		view.$$("expandAll").attachEvent("onItemClick", function(){
			view.$$("tree").openAll();
		});
	}
}