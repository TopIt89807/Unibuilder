export function init(){
	return {
		view: "fileview",
		type: "FileView",
		select: "multiselect",
		editable:true,
		editaction: false,
		editor:"text",
		editValue:"value",
		drag: true,
		navigation: true,
		tabFocus: true,
		onContext:{}
	};
}

