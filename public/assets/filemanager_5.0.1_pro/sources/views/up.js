export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));
	return { view: "button", type:"htmlbutton", css: "webix_fmanager_up",
		label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 37,
		tooltip: webix.i18n.filemanager.levelUp
	};
}

function ready(view){
	if(view.$$("up")){
		view.$$("up").attachEvent("onItemClick", function(){
			if(view.callEvent("onBeforeLevelUp", [])){
				view.levelUp();
				view.callEvent("onAfterLevelUp", []);
			}
		});
	}
}