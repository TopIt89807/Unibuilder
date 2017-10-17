export function getPath(view, id){
	id = id||view.getCursor();
	var path = [];
	while(id && view.getItem(id)){
		path.push(id);
		id = view.getParentId(id);
	}
	return path.reverse();
}

export function getPathNames(view, id){
	id = id||view.getCursor();
	var item = null;
	var path = [];
	while(id && view.getItem(id)){
		item = view.getItem(id);
		path.push({id:id, value:view.config.templateName(item)});
		id = view.getParentId(id);
	}
	return path.reverse();
}


export function setPath(view, id){
	var pId = id;
	while(pId && view.getItem(pId)){
		view.callEvent("onPathLevel",[pId]);
		pId = view.getParentId(pId);
	}
	if(view.getItem(id)){
		if(id!= view.getCursor()){
			view.setCursor(id);
			view.callEvent("onPathComplete",[id]);
		}

	}else{
		// dynamic loading
		var folders = getParentFolders(id);
		view.openFolders(folders).then(function(){
			view.setCursor(id);
			view.callEvent("onPathComplete",[id]);
		});
	}

}

export function getParentFolders(id){
	var i, parts,
		ids = [];
	if(typeof id == "string"){
		parts = id.replace(/^\//,"").split("/");
		for(i=0; i< parts.length; i++){
			ids.push(parts.slice(0, i+1).join("/"));
		}
	}
	return ids;
}