export function init(){
	return {
		view: "filelist",
		template: function(obj,common){
			return common.templateIcon(obj,common)+obj.value;
		},
		select: "multiselect",
		// editing options
		editable:true,
		editor:"text",
		editValue:"value",
		// disable editing on double-click
		editaction: false,
		// drag-n-drop
		drag: true,
		// mouse navigation
		navigation: true,
		// tab 'key' navigation
		tabFocus: true,
		// context menu
		onContext:{}
	};
}