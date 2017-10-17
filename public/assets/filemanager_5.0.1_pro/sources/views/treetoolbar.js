export function init(){
	return {
		css: "webix_fmanager_tree_toolbar",
		height: 34,
		paddingX: 8,
		paddingY:1,
		margin: 7,
		cols:[
			"hideTree",
			{id: "treeSpacer"},
			"expandAll","collapseAll"
		]
	};
}