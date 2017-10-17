export function init(){
	var config = {
		type: "clean",
		rows:[
			"toolbar",
			"bodyLayout"
		]
	};
	if(typeof SVGRect == "undefined")
		config.css = "webix_nosvg";
	return config;
}