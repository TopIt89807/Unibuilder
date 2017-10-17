export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));
	return { view: "button", type:"htmlbutton", label: "<div class=\"webix_fmanager_bar_icon \"></div>",
		css: "webix_fmanager_menu", icon: "bars", width: 37,
		tooltip: webix.i18n.filemanager.actions
	};
}

function ready(view){
	var btn = view.$$("menu");
	if(btn){
		btn.attachEvent("onItemClick",  function(){
			if(view.callEvent("onBeforeMenu", [])){
				view.getMenu().setContext({obj: view.getActiveView(), id: view.getActive()});
				view.getMenu().show(btn.$view);
				view.callEvent("onAfterMenu", []);
			}
		});

		if(view.config.readonly){
			btn.hide();
			if(view.$$("menuSpacer"))
				view.$$("menuSpacer").hide();
		}
	}
}
