import "less/filemanager.less";
import "types.js";
import "locale.js";
import "widgets.js";

import * as context from "views/actions.js";
import * as defaults from "defaults.js";
import * as history from "history.js";
import * as loader from "load.js";
import * as path from "path.js";
import * as save from "save.js";
import * as tree from "tree.js";
import * as ui from "ui.js";
import * as uploader from "views/upload.js";


webix.protoUI({
	name:"filemanager",
	$init: function(config) {
		this.$view.className += " webix_fmanager";
		webix.extend(this.data, webix.TreeStore, true);
		this.data.provideApi(this,true);
		webix.extend(config,this.defaults);
		ui.init(this,config);
		history.init(this);
		loader.init(this);

		config.legacyUploader = config.legacyUploader || webix.isUndefined(XMLHttpRequest) || webix.isUndefined((new XMLHttpRequest()).upload);

		this.$ready.push(()=>{
			this._beforeInit();
			this.callEvent("onComponentInit",[]);
		});
		webix.UIManager.tabControl = true;
		webix.extend(config, ui.getUI(this,config));
	},
	handlers_setter: function(handlers){
		for(var h in handlers){
			var url = handlers[h];
			if (typeof url == "string"){
				if(url.indexOf("->") != -1){
					var parts = url.split("->");
					url = webix.proxy(parts[0], parts[1]);
				}
				else if(h != "upload" && h != "download")
					url = webix.proxy("post", url);
			}
			handlers[h] = url;
		}
		return handlers;
	},
	_beforeInit: function(){
		context.init(this);
		uploader.init(this);

		// folder type definition
		if(!this.config.scheme)
			this.define("scheme", {
				init:function (obj) {
					var item = this.getItem(obj.id);
					if (item && item.$count) {
						obj.type = "folder";
					}
				}
			});

		this.attachEvent("onAfterLoad",function(){
			// default cursor
			if(!this.getCursor()){
				var selection =  this.config.defaultSelection;
				selection = selection?selection.call(this):this.getFirstChildId(0);
				this.setCursor(selection);
			}
		});

		this.attachEvent("onFolderSelect", function(id){
			this.setCursor(id);
		});

		this.attachEvent("onBeforeDragIn",function(context){
			var target = context.target;
			if(target){
				var ids = context.source;
				for(var i=0; i < ids.length; i++){
					while(target){
						if(target==ids[i]){
							return false;
						}
						target = this._getParentId(target);
					}
				}
			}
			return true;
		});

	},
	_getParentId: function(id){
		if(!this.getItem(id)){
			var activeView = this.$$(this.config.mode);
			var item = activeView.getItem(id);
			if(item && item.parent && this.getItem(item.parent)){
				return item.parent;
			}
			return null;
		}
		return webix.TreeStore.getParentId.apply(this,arguments);
	},
	getMenu: function(){
		return this._contextMenu;
	},
	getPath: function(id){
		return path.getPath(this,id);
	},
	getPathNames: function(id){
		return path.getPathNames(this,id);
	},
	setPath: function(id){
		return path.setPath(this,id);
	},
	_getLocation: function(obj){
		var location = "", path;
		if(this.getItem(obj.id) || obj.parent && this.getItem(obj.parent)){
			if(obj.parent){
				path = this.getPathNames(obj.parent);
				path.shift();
			}
			else{
				path = this.getPathNames(obj.id);
				path.shift();
				path.pop();
			}
			var names = [];
			for(var i=0; i < path.length;i++){
				names.push(path[i].value);
			}
			location = "/"+names.join("/");
		}
		else if(obj.location){
			location = obj.location;
		}
		else if(typeof obj.id == "string"){
			var parts = obj.id.split("/");
			parts.pop();
			location = "/"+parts.join("/");
		}
		return location;
	},
	getSearchData: function(id,value){
		var found = [];
		this.data.each(function(obj){
			var text = this.config.templateName(obj);
			if(text.toLowerCase().indexOf(value.toLowerCase())>=0){
				found.push(webix.copy(obj));
			}
		},this,true,id);
		return found;
	},
	showSearchResults: function(value){
		var id = this.getCursor();
		if(this.config.handlers.search){
			loader.loadSearchData(this,this.config.handlers.search, id, value);
		}
		else{
			var data = 	this.getSearchData(id, value);
			loader.parseSearchData(this,data);
		}
	},
	hideSearchResults: function(skipRefresh){
		if(this.$searchResults){
			this.callEvent("onHideSearchResults",[]);
			this.$searchResults = false;
			// refresh cursor
			if(!skipRefresh){
				var id = this.getCursor();
				this.blockEvent();
				this.setCursor(null);
				this.unblockEvent();
				this.setCursor(id);
			}
		}
	},
	goBack: function(step){
		step = (step?(-1)*Math.abs(step):-1);
		return history.changeCursor(this, step);
	},
	goForward: function(step){
		return history.changeCursor(this, step||1);
	},
	levelUp: function(id){
		id = id||this.getCursor();
		if(id){
			id = this.getParentId(id);
			this.setCursor(id);
		}
	},
	markCopy: function(ids){
		if(ids){
			if(!webix.isArray(ids)){
				ids = [ids];
			}
			this._moveData = ids;
			this._copyFiles = true;
		}
	},
	markCut: function(ids){
		if(ids){
			if(!webix.isArray(ids)){
				ids = [ids];
			}
			this._moveData = ids;
			this._copyFiles = false;
		}
	},
	pasteFile: function(id){
		if(webix.isArray(id)){
			id = id[0];
		}
		if(id){
			id = id.toString();
			var activeItem = this.getActiveView().getItem(id);
			if(this.data.branch[id]&&this.getItem(id).type == "folder" || activeItem && activeItem.type == "folder"){
				if(this._moveData){
					if(this._copyFiles){
						this.copyFile(this._moveData,id);
					}
					else
						this.moveFile(this._moveData,id);
				}
			}
		}
	},
	download:function(id){
		var url = this.config.handlers.download;
		if (url)
			webix.send(url, { action:"download", source: id });
	},
	fileExists: function(name,target,id){
		var result = false;
		this.data.eachChild(target, webix.bind(function(obj){
			if(name == obj.value&&!(id && obj.id==id)){
				result = obj.id;
			}
		},this));
		return result;
	},
	_refreshActiveFolder: function(){
		this.$skipDynLoading = true;
		this.$$(this.config.mode).$skipBinding = false;
		this.refreshCursor();
	},
	_setFSId: function(item){
		var newId = this.getParentId(item.id)+"/"+item.value;
		if(item.id != newId)
			this.data.changeId( item.id, newId );
	},
	_changeChildIds: function(id){
		this.data.eachSubItem(id,webix.bind(function(item){
			if(item.value)
				this._setFSId(item);
		},this));
	},
	_callbackRename: function(id, value){
		var item = this.getItem(id);
		if(item.value != value){
			item.value = value;
			this._refreshActiveFolder();
			this.callEvent("onItemRename", [id]);
		}
	},
	_moveFile: function(source,target,copy){
		var action = (copy?"copy":"move"),
			ids = [];
		source.reverse();
		for(var i=0; i<source.length; i++){
			if(this.getItem(source[i])){
				var newId = this.move(source[i],0,this,{parent:target,copy:copy?true:false});
				ids.push(newId);
			}
		}

		this._refreshActiveFolder();
		var url = this.config.handlers[action];
		if (url){
			save.makeSaveRequest(this, url,{ action: action, source:source.join(","), temp: ids.join(","), target: target.toString() },function(requestData,responseData){
				if(responseData && webix.isArray(responseData)){
					var ids = requestData.temp.split(",");
					for(var i=0;i < responseData.length;i++){
						if(responseData[i].id && (responseData[i].id!=ids[i]) && this.data.pull[ids[i]]){
							this.data.changeId(ids[i],responseData[i].id);
							if(this.config.fsIds)
								this._changeChildIds(responseData[i].id);
							if(responseData[i].value){
								this._callbackRename(responseData[i].id,responseData[i].value);
							}

						}
					}
				}
				this._updateDynSearch();
			});
		}
	},
	_updateDynSearch: function(){
		if(this.$searchResults && this.$searchValue){
			this.showSearchResults(this.$searchValue);
		}
	},
	copyFile: function(source, target){
		this.moveFile(source, target, true);
	},
	moveFile:function(source, target, copy){
		var i, id, result;
		if(typeof(source) == "string"){
			source = source.split(",");
		}
		if(!webix.isArray(source)){
			source = [source];
		}
		if(!target){
			target = this.getCursor();
		}
		else if(!this.data.branch[target]&&this.getItem(target.toString()).type!="folder"){
			target = this.getParentId(target);
		}

		result = true;
		target = target.toString();

		for(i=0; i<source.length; i++){
			id = source[i].toString();
			result = result&&this._isMovingAllowed(id,target);

		}
		if(result){
			this._moveFile(source,target,copy?true:false);
		}
		else{
			this.callEvent(copy?"onCopyError":"onMoveError", []);
		}
	},
	deleteFile:function(ids,callback){
		if(typeof(ids) == "string"){
			ids = ids.split(",");
		}
		if(!webix.isArray(ids)){
			ids = [ids];
		}
		for(var i=0; i<ids.length; i++){
			var id = ids[i];
			if(this.$$(this.config.mode).isSelected(id))
				this.$$(this.config.mode).unselect(id);
			if(id == this.getCursor())
				this.setCursor(this.getFirstId());
			if(id)
				this.remove(id);
		}
		this._refreshActiveFolder();

		var url = this.config.handlers.remove;
		if (url){
			if(callback)
				callback = webix.bind(callback,this);
			save.makeSaveRequest(this, url,{ action:"remove", source:ids.join(",") }, callback);
		}
		else if(callback){
			callback.call(this);
		}

	},
	_createFolder: function(obj,target){
		this.add(obj, 0, target);
		obj.source = obj.value;
		obj.target = target;
		this._refreshActiveFolder();
		var url = this.config.handlers.create;
		if (url){
			obj.action = "create";
			save.makeSaveRequest(this, url,obj,function(requestData,responseData){
				if(responseData.id){
					if(requestData.id != responseData.id)
						this.data.changeId(requestData.id,responseData.id);
					if(this.config.fsIds)
						this._changeChildIds(responseData.id);
					if(responseData.value){
						this._callbackRename(responseData.id,responseData.value);
					}
				}
			});
		}
	},
	createFolder: function(target){
		if(typeof(target) == "string"){
			target = target.split(",");
		}
		if(webix.isArray(target)){
			target = target[0];
		}
		if(target){
			target = ""+target;
			var item = this.getItem(target);
			if(!this.data.branch[target] && (item.type != "folder")){
				target = this.getParentId(target);
			}
			var obj = this.config.templateCreate(item);

			target = ""+target;
			this._createFolder(obj,target);
		}
	},
	editFile: function(id){
		if(webix.isArray(id)){
			id = id[0];
		}
		if(this.getActiveView()&&this.getActiveView().edit)
			this.getActiveView().edit(id);

	},
	renameFile: function(id,name,field){
		var item = this.getItem(id);
		field = (field||"value");
		if(item)
			item[field] = name;

		this.refresh(item.id);
		this._refreshActiveFolder();
		this.callEvent("onFolderSelect",[this.getCursor()]);

		var url = this.config.handlers.rename;
		if (url){
			var obj = { source:id, action:"rename", target: name};
			save.makeSaveRequest(this, url,obj,function(requestData,responseData){
				if(responseData.id && this.getItem(requestData.source)){
					if(requestData.source != responseData.id)
						this.data.changeId(requestData.source,responseData.id);
					if(this.config.fsIds)
						this._changeChildIds(responseData.id);
					if(responseData.value){
						this._callbackRename(responseData.id,responseData.value);
					}
				}
				this._updateDynSearch();
			});
		}
	},
	_isMovingAllowed: function(source,target){
		while(target){
			if(target==source || (!this.data.branch[target]&&this.getItem(target.toString()).type != "folder")){
				return false;
			}
			target = this.getParentId(target);
		}
		return true;
	},
	getActiveView: function(){
		return this._activeView||this.$$("tree")||null;
	},
	getActive: function(){
		var selected = this.getSelectedFile();
		return selected?selected:this.getCursor();
	},
	/*
	 * returns the name of the folder selected in Tree
	 * */
	getCurrentFolder: function(){
		return this.$$("tree").getSelectedId();
	},
	/*
	 * returns a string or an array with selected file(folder) name(s)
	 * */
	getSelectedFile: function(){
		var result = null,
			selected = this.$$(this.config.mode).getSelectedId();

		if(selected){
			if(!webix.isArray(selected))
				result = selected.toString();
			else{
				result = [];
				for(var i=0; i < selected.length; i++){
					result.push(selected[i].toString());
				}
			}
		}

		return result;
	},
	_openFolder: function(id){
		if(this.callEvent("onBeforeLevelDown",[id])){
			this.setCursor(id);
			this.callEvent("onAfterLevelDown",[id]);
		}
	},
	_runFile: function(id){
		if(this.callEvent("onBeforeRun",[id])){
			this.download(id);
			this.callEvent("onAfterRun",[id]);
		}
	},
	_onFileDblClick: function(id){
		id = id.toString();
		var item = this.getItem(id);
		if(item) {
			if (this.data.branch[id] || (item.type == "folder"))
				this._openFolder(id);
			else
				this._runFile(id);
		} else{
			// dynamic loading
			if(this.$$(this.config.mode).filter){
				item = this.$$(this.config.mode).getItem(id);
				if(item.type != "folder"){
					this._runFile(id);
				}
				else{
					var folders = item&&item.parents?item.parents:path.getParentFolders(id);
					if(folders.length){
						this.openFolders(folders).then( webix.bind(function(){
							this._openFolder(id);
						},this));
					}
				}
			}
		}
	},

	openFolders: function(folders){
		return loader.openFolders(this, folders);
	},
	_addElementHotKey: function(key, func, view){
		var keyCode = webix.UIManager.addHotKey(key, func, view);
		(view||this).attachEvent("onDestruct", function(){
			webix.UIManager.removeHotKey(keyCode, func, view);
		});
	},
	clearBranch: function(id){
		loader.clearBranch(this,id);
	},
	parseData: function(data){
		loader.parseData(this,data);
	},
	_getDynMode: function(){
		return loader.getDynMode(this);
	},
	loadDynData: function(url, obj, mode, open){
		loader.loadDynData(this, url, obj, mode, open);
	},
	getUploader: function(){
		return 	uploader.getUploader(this);
	},
	uploadFile: function(id,e){
		return uploader.uploadFile(this,id,e);
	},
	hideTree: function(){
		if(this.callEvent("onBeforeHideTree",[])){
			tree.hideTree(this);
			this.callEvent("onAfterHideTree",[]);
		}
	},
	showTree: function(){
		if(this.callEvent("onBeforeShowTree",[])){
			tree.showTree(this);
			this.callEvent("onAfterShowTree",[]);
		}
	},
	defaults: defaults.values
},  webix.ProgressBar, webix.IdSpace, webix.ui.layout,webix.TreeDataMove, webix.TreeDataLoader, webix.DataLoader, webix.EventSystem, webix.Settings);

