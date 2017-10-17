export function hideTree(view){
	if(view.$$("treeLayout")){
		view.$$("treeLayout").hide();
		if(view.$$("resizer"))
			view.$$("resizer").hide();
		if(view.$$("sidePanel"))
			view.$$("sidePanel").show();
	}
}
export function showTree(view){
	if(view.$$("treeLayout")){
		view.$$("treeLayout").show();
		if(view.$$("resizer"))
			view.$$("resizer").show();
		if(view.$$("sidePanel"))
			view.$$("sidePanel").hide();
	}
}