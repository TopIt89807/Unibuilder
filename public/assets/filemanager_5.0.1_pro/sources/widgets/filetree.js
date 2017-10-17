// editable Tree
webix.protoUI({
	name:"filetree",
	$dragHTML:function(item, pos){
		var ctx = webix.DragControl.getContext();
		var type = this.type;
		var text = type.dragTemplate(item,type);
		var size = webix.html.getTextSize(text);
		var posView = webix.html.offset(this.$view);
		var offset = pos.x - posView.x;
		ctx.x_offset = offset > size.width? - size.width/4 : -offset;
		ctx.y_offset = - size.height/2;
		return "<div class='webix_tree_item webix_fmanager_drag' style='width:auto'>"+text+"</div>";
	}
}, webix.EditAbility, webix.ui.tree);