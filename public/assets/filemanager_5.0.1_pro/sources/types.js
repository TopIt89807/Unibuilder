// tree type
webix.type(webix.ui.tree,{
	name: "FileTree",
	css: "webix_fmanager_tree",
	dragTemplate: webix.template("#value#"),
	icon:function(obj){
		var html = "";
		for(var i =1; i < obj.$level; i++){
			html += "<div class='webix_tree_none'></div>";
		}
		if(obj.webix_child_branch && !obj.$count){
			html += "<div class='webix_tree_child_branch webix_fmanager_icon webix_tree_close'></div>";
		}
		else if (obj.$count>0){
			if (obj.open)
				html += "<div class='webix_fmanager_icon webix_tree_open'></div>";
			else
				html += "<div class='webix_fmanager_icon webix_tree_close'></div>";
		} else
			html += "<div class='webix_tree_none'></div>";
		return html;
	},
	folder:function(obj){
		if (obj.$count && obj.open)
			return "<div class='webix_fmanager_icon webix_folder_open'></div>";
		return "<div class='webix_fmanager_icon webix_folder'></div>";
	}
});
// dataview type
webix.type(webix.ui.dataview, {
	name:"FileView",
	css: "webix_fmanager_files",
	height: 110,
	margin: 10,
	width: 150,
	template: function(obj,common){
		var css = "webix_fmanager_data_icon";
		var name = common.templateName(obj,common);
		return "<div class='webix_fmanager_file'><div class='"+css+"'>"+common.templateIcon(obj,common)+"</div>"+name+"</div>";
	}
});