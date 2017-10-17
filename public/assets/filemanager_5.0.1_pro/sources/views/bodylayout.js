export function init(){
	return {
		css: "webix_fmanager_body",
		cols:[
			"sidePanel",
			"treeLayout",
			{view:"resizer", id: "resizer", width:3},
			"modeViews"
		]
	};
}