// Datatable with customized drag element
webix.protoUI({
	name:"filetable",
	$dragHTML:function(item, pos){
		var ctx = webix.DragControl.getContext();
		var index = this.getColumnIndex("value");
		var text = this.config.columns[index].template(item,this.type);
		var size = webix.html.getTextSize(text);

		var posView = webix.html.offset(this.$view);
		var offset = pos.x - posView.x;
		
		ctx.x_offset = offset > size.width? - size.width/4 : -offset;
		ctx.y_offset = - size.height/2;

		var html="<div class='webix_dd_drag webix_fmanager_drag' >";
		html += "<div style='width:"+(size.width+40)+"px'>"+ text+"</div>";
		return html+"</div>";
	}
}, webix.ui.datatable);