export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return { view: "button", type:"htmlbutton", css: "webix_fmanager_collapse",
		label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30, tooltip: webix.i18n.filemanager.collapseTree
	};
}

function ready(view){
	if(view._getDynMode() && view.$$("collapseAll")){
		view.$$("collapseAll").hide();
	}
	if(view.$$("collapseAll") && view.$$("tree")){
		view.$$("collapseAll").attachEvent("onItemClick", function(){
			view.$$("tree").closeAll();
		});
	}
}