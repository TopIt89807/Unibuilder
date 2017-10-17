export function sortData(sort, data){
	var sorter = webix.DataStore.prototype.sorting.create(sort);
	var folders = [];
	var files = [];
	for(var i =0; i < data.length; i++){
		if(data[i].type == "folder")
			folders.push(data[i]);
		else
			files.push(data[i]);
	}
	folders.sort(sorter);
	files.sort(sorter);
	return folders.concat(files);
}