export function init(view){
	var locale =  webix.i18n.filemanager;
	return [
		{ id:"value",	header: locale.name, fillspace:3, sort: "string", template: function(obj,common){
			var name = common.templateName(obj,common);
			return common.templateIcon(obj,common)+name;
		}, editor: "text"},
		{ id:"date",	header: locale.date, fillspace:2, sort: "int", template: function(obj,common){
			return common.templateDate(obj,common);
		}},
		{ id:"type",	header: locale.type, fillspace:1, sort: "string", template: function(obj,common){
			return common.templateType(obj);
		}},
		{ id:"size",	header: locale.size, fillspace:1, sort: "int", css:{"text-align":"right"}, template: function(obj,common){
			return obj.type=="folder"?"":common.templateSize(obj);
		}},
		{ id:"location",	header: locale.location, fillspace:2, sort: "string", template: function(obj){
			return view._getLocation(obj);
		},hidden:true}
	];
}