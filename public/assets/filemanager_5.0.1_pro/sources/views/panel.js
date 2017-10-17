export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));
	return {
		hidden:true,
		css:"webix_fmanager_panel",
		type: "clean",
		rows:[
			{
				height: 34,
				paddingY:1,
				paddingX:0,
				view: "form",
				cols:[
					{ view: "button", id: "showTree", type:"htmlbutton", css: "webix_fmanager_toggle",
						label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30,
						tooltip: webix.i18n.filemanager.showTree
					}
				]
			},
			{ template:" "}
		]
	};
}
function ready(view){
	if(view.$$("showTree")){
		view.$$("showTree").attachEvent("onItemClick", function(){
			view.showTree();
		});
	}
}
