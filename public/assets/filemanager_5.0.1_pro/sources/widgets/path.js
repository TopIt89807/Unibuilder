// a new view for path display, based on List view
webix.protoUI({
	name: "path",
	defaults:{
		layout: "x",
		separator: ",",
		scroll: false
	},
	$skin:function(){
		this.type.height = webix.skin.$active.buttonHeight||webix.skin.$active.inputHeight;
	},
	$init: function(){
		this.$view.className += " webix_path";
	},
	value_setter: function(value){
		this.setValue();
		return 	value;
	},
	setValue: function(values){
		this.clearAll();
		if(values){
			if(typeof(values) == "string"){
				values = values.split(this.config.separator);
			}
			this.parse(webix.copy(values));
		}
	},
	getValue: function(){
		return this.serialize();
	}
},webix.ui.list);