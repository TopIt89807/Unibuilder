export function init(view,settings){
	view.attachEvent("onComponentInit", () => ready(view));

	var config = { view: "segmented", width: 70, options: [
		{
			id: "files",
			width: 32,
			value: "<div class=\"webix_fmanager_bar_icon webix_fmanager_files_mode \"></div>",
			tooltip: webix.i18n.filemanager.iconsView
		},
		{
			id: "table",
			width: 32,
			value: "<div class=\"webix_fmanager_bar_icon webix_fmanager_table_mode \"></div>",
			tooltip:webix.i18n.filemanager.tableView
		}
	], css:"webix_fmanager_modes", value: settings.mode};

	return config;
}

function ready(view){
	if(view.$$("modes")){
		view.$$("modes").attachEvent("onBeforeTabClick",function(id){
			var value = view.$$("modes").getValue();
			if(view.callEvent("onBeforeModeChange",[value,id])){
				if(view.$$(id)){
					view.config.mode = id;
					view.$$(id).show();
					view.callEvent("onAfterModeChange",[value,id]);
					return true;
				}
			}
			return false;
		});
	}
}