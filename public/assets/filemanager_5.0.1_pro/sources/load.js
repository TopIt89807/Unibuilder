import * as sorting from "sort.js";

export function init(view){
	view.attachEvent("onBeforeCursorChange", function(){
		view.$skipDynLoading = false;
		return true;
	});
	setDataParsers(view);
}

function setDataParsers(view){
	view.dataParser = {
		files: function(obj, data){
			if(this.config.noFileCache){
				clearBranch(this, obj.id);
			}
			else
				obj.webix_files = 0;

			parseData(this, data);
		},
		branch : function(obj, data){
			if(this.config.noFileCache){
				clearBranch(this, obj.id);
			}
			else{
				obj.webix_branch = 0;
				obj.webix_child_branch = 0;
			}

			parseData(this, data);
		}
	};
}
export function loadDynData(view, url, obj, mode, open){
	view.showProgress();
	if(view.callEvent("onBeforeDynLoad", [url, obj, mode, open])){
		var callback = {
			success: function(text,response){
				view.hideProgress();
				var data = view.data.driver.toObject(text, response);
				if(open)
					obj.open = true;

				if(view.callEvent("onBeforeDynParse", [obj, data, mode])){
					view.dataParser[mode].call(view, obj, data);
					view.callEvent("onAfterDynParse", [obj, data, mode]);
				}
			},
			error: function(){
				view.hideProgress();
				view.callEvent("onDynLoadError",[]);
			}
		};
		if (url.load)
			return url.load(null, callback, { action: mode, source: obj.id});
	}
}

export function clearBranch(view, id){
	var items = [];

	view.data.eachChild(id,function(item){
		if(!view.data.branch[item.id] && item.type != "folder")
			items.push(item.id);
	},view,true);

	for(var i=0; i< items.length; i++){
		view.remove(items[i]);
	}
}

export function parseData(view, data){
	view.parse(data);
	view.$skipDynLoading = true;
	view._refreshActiveFolder();
	view.$skipDynLoading = false;
}

export function openFolders(view, folders){
	var dynMode, i, pItem;
	var defer = webix.promise.defer();
	dynMode = getDynMode(view);

	if(dynMode && folders.length){
		for(i =0; i < folders.length; i++){
			pItem = view.getItem(folders[i]);
			if(!(pItem && !pItem["webix_" + dynMode])){
				openDynFolder(view,folders.slice(i), dynMode, defer);
				return defer;
			}
			else{
				pItem.open = true;
				if(view.$$("tree"))
					view.$$("tree").refresh(folders[i]);
			}
		}
		defer.resolve(folders[i]);
	}
	else{
		defer.reject();
	}
	return defer;
}
function openDynFolder(view,ids, mode, defer){
	var obj = view.getItem(ids[0]);
	view.showProgress();
	var url = view.config.handlers[mode];
	var callback = {
		success: function(text,response){
			view.hideProgress();
			var data = view.data.driver.toObject(text, response);
			if(view.callEvent("onBeforeDynParse", [obj, data, mode])){
				obj.open = true;
				view.dataParser[mode].call(view, obj, data);

				var lastId = ids.shift();
				if(ids.length && view.getItem(ids[0]).type == "folder"){
					openDynFolder(view,ids, mode, defer);
				}
				else{
					view.refreshCursor();
					defer.resolve(lastId);
				}
				view.callEvent("onAfterDynParse", [obj, data, mode]);
			}

		}
	};
	if (url.load)
		return url.load(null, callback,  { action: mode, source: ids[0]});
}

export function getDynMode(view){
	for(var mode in view.dataParser){
		if (view.config.handlers[mode]) {
			return mode;
		}
	}
	return null;
}
export function loadSearchData(view, url, id, value){
	var params =  { action:"search", source: id, text: value};
	if(view.callEvent("onBeforeSearchRequest",[id, params])){
		var callback = {
			success: function(text,response){
				view.hideProgress();
				var data = view.data.driver.toObject(text, response);
				parseSearchData(view, data);
				view.$searchValue = value;
			},
			error:function(){
				view.hideProgress();
			}
		};
		if (url.load)
			return url.load(null, callback, params);
	}
}
export function parseSearchData(view, data){
	view.callEvent("onShowSearchResults",[]);
	view.$searchResults = true;
	var cell = view.$$(view.config.mode);
	if(cell && cell.filter){
		cell.clearAll();
		if(view.sortState && view.sortState.view == cell.config.id)
			data = sorting.sortData(view.sortState.sort, data);
		cell.parse(data);
	}
}

