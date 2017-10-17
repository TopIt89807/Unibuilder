export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return { view: "button", type:"htmlbutton", css: "webix_fmanager_toggle",
		label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30,
		tooltip: webix.i18n.filemanager.hideTree
	};
}

function ready(view){
	if(view.$$("hideTree")){
		view.$$("hideTree").attachEvent("onItemClick", function(){
			view.hideTree();
		});
	}
}