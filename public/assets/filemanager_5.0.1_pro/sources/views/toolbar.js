export function init(){
	return {
		css: "webix_fmanager_toolbar",
		paddingX: 10,
		paddingY:5,
		margin: 7,
		cols:[
			"menu",
			{id: "menuSpacer", width: 75},
			{margin:0, cols:["back","forward"]},"up",
			"path","search","modes"
		]
	};
}