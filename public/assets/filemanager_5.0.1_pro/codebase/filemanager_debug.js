/*
@license
Webix FileManager v.5.0.1
This software is covered by Webix Commercial License.
Usage without proper license is prohibited.
(c) XB Software Ltd.
*/
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(3);
	
	__webpack_require__(9);
	
	__webpack_require__(10);
	
	__webpack_require__(11);
	
	var _actions = __webpack_require__(18);
	
	var context = _interopRequireWildcard(_actions);
	
	var _defaults = __webpack_require__(19);
	
	var defaults = _interopRequireWildcard(_defaults);
	
	var _history = __webpack_require__(20);
	
	var history = _interopRequireWildcard(_history);
	
	var _load = __webpack_require__(21);
	
	var loader = _interopRequireWildcard(_load);
	
	var _path = __webpack_require__(23);
	
	var path = _interopRequireWildcard(_path);
	
	var _save = __webpack_require__(24);
	
	var save = _interopRequireWildcard(_save);
	
	var _tree = __webpack_require__(25);
	
	var tree = _interopRequireWildcard(_tree);
	
	var _ui = __webpack_require__(26);
	
	var ui = _interopRequireWildcard(_ui);
	
	var _upload = __webpack_require__(48);
	
	var uploader = _interopRequireWildcard(_upload);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	webix.protoUI({
		name: "filemanager",
		$init: function $init(config) {
			var _this = this;
	
			this.$view.className += " webix_fmanager";
			webix.extend(this.data, webix.TreeStore, true);
			this.data.provideApi(this, true);
			webix.extend(config, this.defaults);
			ui.init(this, config);
			history.init(this);
			loader.init(this);
	
			config.legacyUploader = config.legacyUploader || webix.isUndefined(XMLHttpRequest) || webix.isUndefined(new XMLHttpRequest().upload);
	
			this.$ready.push(function () {
				_this._beforeInit();
				_this.callEvent("onComponentInit", []);
			});
			webix.UIManager.tabControl = true;
			webix.extend(config, ui.getUI(this, config));
		},
		handlers_setter: function handlers_setter(handlers) {
			for (var h in handlers) {
				var url = handlers[h];
				if (typeof url == "string") {
					if (url.indexOf("->") != -1) {
						var parts = url.split("->");
						url = webix.proxy(parts[0], parts[1]);
					} else if (h != "upload" && h != "download") url = webix.proxy("post", url);
				}
				handlers[h] = url;
			}
			return handlers;
		},
		_beforeInit: function _beforeInit() {
			context.init(this);
			uploader.init(this);
	
			// folder type definition
			if (!this.config.scheme) this.define("scheme", {
				init: function init(obj) {
					var item = this.getItem(obj.id);
					if (item && item.$count) {
						obj.type = "folder";
					}
				}
			});
	
			this.attachEvent("onAfterLoad", function () {
				// default cursor
				if (!this.getCursor()) {
					var selection = this.config.defaultSelection;
					selection = selection ? selection.call(this) : this.getFirstChildId(0);
					this.setCursor(selection);
				}
			});
	
			this.attachEvent("onFolderSelect", function (id) {
				this.setCursor(id);
			});
	
			this.attachEvent("onBeforeDragIn", function (context) {
				var target = context.target;
				if (target) {
					var ids = context.source;
					for (var i = 0; i < ids.length; i++) {
						while (target) {
							if (target == ids[i]) {
								return false;
							}
							target = this._getParentId(target);
						}
					}
				}
				return true;
			});
		},
		_getParentId: function _getParentId(id) {
			if (!this.getItem(id)) {
				var activeView = this.$$(this.config.mode);
				var item = activeView.getItem(id);
				if (item && item.parent && this.getItem(item.parent)) {
					return item.parent;
				}
				return null;
			}
			return webix.TreeStore.getParentId.apply(this, arguments);
		},
		getMenu: function getMenu() {
			return this._contextMenu;
		},
		getPath: function getPath(id) {
			return path.getPath(this, id);
		},
		getPathNames: function getPathNames(id) {
			return path.getPathNames(this, id);
		},
		setPath: function setPath(id) {
			return path.setPath(this, id);
		},
		_getLocation: function _getLocation(obj) {
			var location = "",
			    path;
			if (this.getItem(obj.id) || obj.parent && this.getItem(obj.parent)) {
				if (obj.parent) {
					path = this.getPathNames(obj.parent);
					path.shift();
				} else {
					path = this.getPathNames(obj.id);
					path.shift();
					path.pop();
				}
				var names = [];
				for (var i = 0; i < path.length; i++) {
					names.push(path[i].value);
				}
				location = "/" + names.join("/");
			} else if (obj.location) {
				location = obj.location;
			} else if (typeof obj.id == "string") {
				var parts = obj.id.split("/");
				parts.pop();
				location = "/" + parts.join("/");
			}
			return location;
		},
		getSearchData: function getSearchData(id, value) {
			var found = [];
			this.data.each(function (obj) {
				var text = this.config.templateName(obj);
				if (text.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					found.push(webix.copy(obj));
				}
			}, this, true, id);
			return found;
		},
		showSearchResults: function showSearchResults(value) {
			var id = this.getCursor();
			if (this.config.handlers.search) {
				loader.loadSearchData(this, this.config.handlers.search, id, value);
			} else {
				var data = this.getSearchData(id, value);
				loader.parseSearchData(this, data);
			}
		},
		hideSearchResults: function hideSearchResults(skipRefresh) {
			if (this.$searchResults) {
				this.callEvent("onHideSearchResults", []);
				this.$searchResults = false;
				// refresh cursor
				if (!skipRefresh) {
					var id = this.getCursor();
					this.blockEvent();
					this.setCursor(null);
					this.unblockEvent();
					this.setCursor(id);
				}
			}
		},
		goBack: function goBack(step) {
			step = step ? -1 * Math.abs(step) : -1;
			return history.changeCursor(this, step);
		},
		goForward: function goForward(step) {
			return history.changeCursor(this, step || 1);
		},
		levelUp: function levelUp(id) {
			id = id || this.getCursor();
			if (id) {
				id = this.getParentId(id);
				this.setCursor(id);
			}
		},
		markCopy: function markCopy(ids) {
			if (ids) {
				if (!webix.isArray(ids)) {
					ids = [ids];
				}
				this._moveData = ids;
				this._copyFiles = true;
			}
		},
		markCut: function markCut(ids) {
			if (ids) {
				if (!webix.isArray(ids)) {
					ids = [ids];
				}
				this._moveData = ids;
				this._copyFiles = false;
			}
		},
		pasteFile: function pasteFile(id) {
			if (webix.isArray(id)) {
				id = id[0];
			}
			if (id) {
				id = id.toString();
				var activeItem = this.getActiveView().getItem(id);
				if (this.data.branch[id] && this.getItem(id).type == "folder" || activeItem && activeItem.type == "folder") {
					if (this._moveData) {
						if (this._copyFiles) {
							this.copyFile(this._moveData, id);
						} else this.moveFile(this._moveData, id);
					}
				}
			}
		},
		download: function download(id) {
			var url = this.config.handlers.download;
			if (url) webix.send(url, { action: "download", source: id });
		},
		fileExists: function fileExists(name, target, id) {
			var result = false;
			this.data.eachChild(target, webix.bind(function (obj) {
				if (name == obj.value && !(id && obj.id == id)) {
					result = obj.id;
				}
			}, this));
			return result;
		},
		_refreshActiveFolder: function _refreshActiveFolder() {
			this.$skipDynLoading = true;
			this.$$(this.config.mode).$skipBinding = false;
			this.refreshCursor();
		},
		_setFSId: function _setFSId(item) {
			var newId = this.getParentId(item.id) + "/" + item.value;
			if (item.id != newId) this.data.changeId(item.id, newId);
		},
		_changeChildIds: function _changeChildIds(id) {
			this.data.eachSubItem(id, webix.bind(function (item) {
				if (item.value) this._setFSId(item);
			}, this));
		},
		_callbackRename: function _callbackRename(id, value) {
			var item = this.getItem(id);
			if (item.value != value) {
				item.value = value;
				this._refreshActiveFolder();
				this.callEvent("onItemRename", [id]);
			}
		},
		_moveFile: function _moveFile(source, target, copy) {
			var action = copy ? "copy" : "move",
			    ids = [];
			source.reverse();
			for (var i = 0; i < source.length; i++) {
				if (this.getItem(source[i])) {
					var newId = this.move(source[i], 0, this, { parent: target, copy: copy ? true : false });
					ids.push(newId);
				}
			}
	
			this._refreshActiveFolder();
			var url = this.config.handlers[action];
			if (url) {
				save.makeSaveRequest(this, url, { action: action, source: source.join(","), temp: ids.join(","), target: target.toString() }, function (requestData, responseData) {
					if (responseData && webix.isArray(responseData)) {
						var ids = requestData.temp.split(",");
						for (var i = 0; i < responseData.length; i++) {
							if (responseData[i].id && responseData[i].id != ids[i] && this.data.pull[ids[i]]) {
								this.data.changeId(ids[i], responseData[i].id);
								if (this.config.fsIds) this._changeChildIds(responseData[i].id);
								if (responseData[i].value) {
									this._callbackRename(responseData[i].id, responseData[i].value);
								}
							}
						}
					}
					this._updateDynSearch();
				});
			}
		},
		_updateDynSearch: function _updateDynSearch() {
			if (this.$searchResults && this.$searchValue) {
				this.showSearchResults(this.$searchValue);
			}
		},
		copyFile: function copyFile(source, target) {
			this.moveFile(source, target, true);
		},
		moveFile: function moveFile(source, target, copy) {
			var i, id, result;
			if (typeof source == "string") {
				source = source.split(",");
			}
			if (!webix.isArray(source)) {
				source = [source];
			}
			if (!target) {
				target = this.getCursor();
			} else if (!this.data.branch[target] && this.getItem(target.toString()).type != "folder") {
				target = this.getParentId(target);
			}
	
			result = true;
			target = target.toString();
	
			for (i = 0; i < source.length; i++) {
				id = source[i].toString();
				result = result && this._isMovingAllowed(id, target);
			}
			if (result) {
				this._moveFile(source, target, copy ? true : false);
			} else {
				this.callEvent(copy ? "onCopyError" : "onMoveError", []);
			}
		},
		deleteFile: function deleteFile(ids, callback) {
			if (typeof ids == "string") {
				ids = ids.split(",");
			}
			if (!webix.isArray(ids)) {
				ids = [ids];
			}
			for (var i = 0; i < ids.length; i++) {
				var id = ids[i];
				if (this.$$(this.config.mode).isSelected(id)) this.$$(this.config.mode).unselect(id);
				if (id == this.getCursor()) this.setCursor(this.getFirstId());
				if (id) this.remove(id);
			}
			this._refreshActiveFolder();
	
			var url = this.config.handlers.remove;
			if (url) {
				if (callback) callback = webix.bind(callback, this);
				save.makeSaveRequest(this, url, { action: "remove", source: ids.join(",") }, callback);
			} else if (callback) {
				callback.call(this);
			}
		},
		_createFolder: function _createFolder(obj, target) {
			this.add(obj, 0, target);
			obj.source = obj.value;
			obj.target = target;
			this._refreshActiveFolder();
			var url = this.config.handlers.create;
			if (url) {
				obj.action = "create";
				save.makeSaveRequest(this, url, obj, function (requestData, responseData) {
					if (responseData.id) {
						if (requestData.id != responseData.id) this.data.changeId(requestData.id, responseData.id);
						if (this.config.fsIds) this._changeChildIds(responseData.id);
						if (responseData.value) {
							this._callbackRename(responseData.id, responseData.value);
						}
					}
				});
			}
		},
		createFolder: function createFolder(target) {
			if (typeof target == "string") {
				target = target.split(",");
			}
			if (webix.isArray(target)) {
				target = target[0];
			}
			if (target) {
				target = "" + target;
				var item = this.getItem(target);
				if (!this.data.branch[target] && item.type != "folder") {
					target = this.getParentId(target);
				}
				var obj = this.config.templateCreate(item);
	
				target = "" + target;
				this._createFolder(obj, target);
			}
		},
		editFile: function editFile(id) {
			if (webix.isArray(id)) {
				id = id[0];
			}
			if (this.getActiveView() && this.getActiveView().edit) this.getActiveView().edit(id);
		},
		renameFile: function renameFile(id, name, field) {
			var item = this.getItem(id);
			field = field || "value";
			if (item) item[field] = name;
	
			this.refresh(item.id);
			this._refreshActiveFolder();
			this.callEvent("onFolderSelect", [this.getCursor()]);
	
			var url = this.config.handlers.rename;
			if (url) {
				var obj = { source: id, action: "rename", target: name };
				save.makeSaveRequest(this, url, obj, function (requestData, responseData) {
					if (responseData.id && this.getItem(requestData.source)) {
						if (requestData.source != responseData.id) this.data.changeId(requestData.source, responseData.id);
						if (this.config.fsIds) this._changeChildIds(responseData.id);
						if (responseData.value) {
							this._callbackRename(responseData.id, responseData.value);
						}
					}
					this._updateDynSearch();
				});
			}
		},
		_isMovingAllowed: function _isMovingAllowed(source, target) {
			while (target) {
				if (target == source || !this.data.branch[target] && this.getItem(target.toString()).type != "folder") {
					return false;
				}
				target = this.getParentId(target);
			}
			return true;
		},
		getActiveView: function getActiveView() {
			return this._activeView || this.$$("tree") || null;
		},
		getActive: function getActive() {
			var selected = this.getSelectedFile();
			return selected ? selected : this.getCursor();
		},
		/*
	  * returns the name of the folder selected in Tree
	  * */
		getCurrentFolder: function getCurrentFolder() {
			return this.$$("tree").getSelectedId();
		},
		/*
	  * returns a string or an array with selected file(folder) name(s)
	  * */
		getSelectedFile: function getSelectedFile() {
			var result = null,
			    selected = this.$$(this.config.mode).getSelectedId();
	
			if (selected) {
				if (!webix.isArray(selected)) result = selected.toString();else {
					result = [];
					for (var i = 0; i < selected.length; i++) {
						result.push(selected[i].toString());
					}
				}
			}
	
			return result;
		},
		_openFolder: function _openFolder(id) {
			if (this.callEvent("onBeforeLevelDown", [id])) {
				this.setCursor(id);
				this.callEvent("onAfterLevelDown", [id]);
			}
		},
		_runFile: function _runFile(id) {
			if (this.callEvent("onBeforeRun", [id])) {
				this.download(id);
				this.callEvent("onAfterRun", [id]);
			}
		},
		_onFileDblClick: function _onFileDblClick(id) {
			id = id.toString();
			var item = this.getItem(id);
			if (item) {
				if (this.data.branch[id] || item.type == "folder") this._openFolder(id);else this._runFile(id);
			} else {
				// dynamic loading
				if (this.$$(this.config.mode).filter) {
					item = this.$$(this.config.mode).getItem(id);
					if (item.type != "folder") {
						this._runFile(id);
					} else {
						var folders = item && item.parents ? item.parents : path.getParentFolders(id);
						if (folders.length) {
							this.openFolders(folders).then(webix.bind(function () {
								this._openFolder(id);
							}, this));
						}
					}
				}
			}
		},
	
		openFolders: function openFolders(folders) {
			return loader.openFolders(this, folders);
		},
		_addElementHotKey: function _addElementHotKey(key, func, view) {
			var keyCode = webix.UIManager.addHotKey(key, func, view);
			(view || this).attachEvent("onDestruct", function () {
				webix.UIManager.removeHotKey(keyCode, func, view);
			});
		},
		clearBranch: function clearBranch(id) {
			loader.clearBranch(this, id);
		},
		parseData: function parseData(data) {
			loader.parseData(this, data);
		},
		_getDynMode: function _getDynMode() {
			return loader.getDynMode(this);
		},
		loadDynData: function loadDynData(url, obj, mode, open) {
			loader.loadDynData(this, url, obj, mode, open);
		},
		getUploader: function getUploader() {
			return uploader.getUploader(this);
		},
		uploadFile: function uploadFile(id, e) {
			return uploader.uploadFile(this, id, e);
		},
		hideTree: function hideTree() {
			if (this.callEvent("onBeforeHideTree", [])) {
				tree.hideTree(this);
				this.callEvent("onAfterHideTree", []);
			}
		},
		showTree: function showTree() {
			if (this.callEvent("onBeforeShowTree", [])) {
				tree.showTree(this);
				this.callEvent("onAfterShowTree", []);
			}
		},
		defaults: defaults.values
	}, webix.ProgressBar, webix.IdSpace, webix.ui.layout, webix.TreeDataMove, webix.TreeDataLoader, webix.DataLoader, webix.EventSystem, webix.Settings);

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	"use strict";

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	
	// tree type
	webix.type(webix.ui.tree, {
		name: "FileTree",
		css: "webix_fmanager_tree",
		dragTemplate: webix.template("#value#"),
		icon: function icon(obj) {
			var html = "";
			for (var i = 1; i < obj.$level; i++) {
				html += "<div class='webix_tree_none'></div>";
			}
			if (obj.webix_child_branch && !obj.$count) {
				html += "<div class='webix_tree_child_branch webix_fmanager_icon webix_tree_close'></div>";
			} else if (obj.$count > 0) {
				if (obj.open) html += "<div class='webix_fmanager_icon webix_tree_open'></div>";else html += "<div class='webix_fmanager_icon webix_tree_close'></div>";
			} else html += "<div class='webix_tree_none'></div>";
			return html;
		},
		folder: function folder(obj) {
			if (obj.$count && obj.open) return "<div class='webix_fmanager_icon webix_folder_open'></div>";
			return "<div class='webix_fmanager_icon webix_folder'></div>";
		}
	});
	// dataview type
	webix.type(webix.ui.dataview, {
		name: "FileView",
		css: "webix_fmanager_files",
		height: 110,
		margin: 10,
		width: 150,
		template: function template(obj, common) {
			var css = "webix_fmanager_data_icon";
			var name = common.templateName(obj, common);
			return "<div class='webix_fmanager_file'><div class='" + css + "'>" + common.templateIcon(obj, common) + "</div>" + name + "</div>";
		}
	});

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";
	
	// locale values
	webix.i18n.filemanager = {
		actions: "Actions",
		back: "Back",
		forward: "Forward",
		levelUp: "Level Up",
		name: "Name",
		size: "Size",
		type: "Type",
		date: "Date",
		copy: "Copy",
		cut: "Cut",
		paste: "Paste",
		upload: "Upload",
		remove: "Delete",
		create: "Create Folder",
		rename: "Rename",
		location: "Location",
		select: "Select Files",
		sizeLabels: ["B", "KB", "MB", "GB"],
		iconsView: "Icons View",
		tableView: "Table View",
		hideTree: "Hide Tree",
		showTree: "Show Tree",
		collapseTree: "Collapse Tree",
		expandTree: "Expand Tree",
		saving: "Saving...",
		errorResponse: "Error: changes were not saved!",
		replaceConfirmation: "The folder already contains files with such names. Would you like to replace existing files ?",
		createConfirmation: "The folder with such a name already exists. Would you like to replace it ?",
		renameConfirmation: "The file with such a name already exists. Would you like to replace it ?",
		yes: "Yes",
		no: "No",
		types: {
			folder: "Folder",
			doc: "Document",
			excel: "Excel",
			pdf: "PDF",
			pp: "PowerPoint",
			text: "Text File",
			video: "Video File",
			image: "Image",
			code: "Code",
			audio: "Audio",
			archive: "Archive",
			file: "File"
		}
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(12);
	
	__webpack_require__(13);
	
	__webpack_require__(14);
	
	__webpack_require__(15);
	
	__webpack_require__(16);
	
	__webpack_require__(17);

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	
	webix.protoUI({
		name: "filelist"
	}, webix.EditAbility, webix.ui.list);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";
	
	webix.protoUI({
		name: "filemenu"
	}, webix.ContextHelper, webix.ui.submenu);

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";
	
	// editable Tree
	webix.protoUI({
		name: "filetree",
		$dragHTML: function $dragHTML(item, pos) {
			var ctx = webix.DragControl.getContext();
			var type = this.type;
			var text = type.dragTemplate(item, type);
			var size = webix.html.getTextSize(text);
			var posView = webix.html.offset(this.$view);
			var offset = pos.x - posView.x;
			ctx.x_offset = offset > size.width ? -size.width / 4 : -offset;
			ctx.y_offset = -size.height / 2;
			return "<div class='webix_tree_item webix_fmanager_drag' style='width:auto'>" + text + "</div>";
		}
	}, webix.EditAbility, webix.ui.tree);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	"use strict";
	
	// Datatable with customized drag element
	webix.protoUI({
		name: "filetable",
		$dragHTML: function $dragHTML(item, pos) {
			var ctx = webix.DragControl.getContext();
			var index = this.getColumnIndex("value");
			var text = this.config.columns[index].template(item, this.type);
			var size = webix.html.getTextSize(text);
	
			var posView = webix.html.offset(this.$view);
			var offset = pos.x - posView.x;
	
			ctx.x_offset = offset > size.width ? -size.width / 4 : -offset;
			ctx.y_offset = -size.height / 2;
	
			var html = "<div class='webix_dd_drag webix_fmanager_drag' >";
			html += "<div style='width:" + (size.width + 40) + "px'>" + text + "</div>";
			return html + "</div>";
		}
	}, webix.ui.datatable);

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	
	// editable Dataview
	webix.protoUI({
		name: "fileview"
	}, webix.EditAbility, webix.ui.dataview);

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	"use strict";
	
	// a new view for path display, based on List view
	webix.protoUI({
		name: "path",
		defaults: {
			layout: "x",
			separator: ",",
			scroll: false
		},
		$skin: function $skin() {
			this.type.height = webix.skin.$active.buttonHeight || webix.skin.$active.inputHeight;
		},
		$init: function $init() {
			this.$view.className += " webix_path";
		},
		value_setter: function value_setter(value) {
			this.setValue();
			return value;
		},
		setValue: function setValue(values) {
			this.clearAll();
			if (values) {
				if (typeof values == "string") {
					values = values.split(this.config.separator);
				}
				this.parse(webix.copy(values));
			}
		},
		getValue: function getValue() {
			return this.serialize();
		}
	}, webix.ui.list);

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function getData() {
		return [{ id: "copy", batch: "item", method: "markCopy", icon: "fm-copy", value: webix.i18n.filemanager.copy }, { id: "cut", batch: "item", method: "markCut", icon: "fm-cut", value: webix.i18n.filemanager.cut }, { id: "paste", method: "pasteFile", icon: "fm-paste", value: webix.i18n.filemanager.paste }, { $template: "Separator" }, { id: "create", method: "createFolder", icon: "fm-folder", value: webix.i18n.filemanager.create }, { id: "remove", batch: "item", method: "deleteFile", icon: "fm-delete", value: webix.i18n.filemanager.remove }, { id: "edit", batch: "item", method: "editFile", icon: "fm-edit", value: webix.i18n.filemanager.rename }, { id: "upload", method: "uploadFile", event: "UploadDialog", icon: "fm-upload", value: webix.i18n.filemanager.upload }];
	}
	
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		var templateName = view.config.templateName;
		var data = getData();
	
		var popup = {
			view: "filemenu",
			id: "actions",
			width: 200,
			padding: 0,
			autofocus: false,
			css: "webix_fmanager_actions",
			template: function template(obj, common) {
				var name = templateName(obj, common);
				var icon = obj.icon.indexOf("fm-") == -1 ? "fa-" + obj.icon : obj.icon;
				return "<span class='webix_fmanager_icon " + icon + "'></span> " + name + "";
			},
			data: data
		};
	
		view.callEvent("onViewInit", ["actions", popup]);
		view._contextMenu = view.ui(popup);
		view.attachEvent("onDestruct", function () {
			view._contextMenu.destructor();
		});
	}
	
	function ready(view) {
		var menu = view.getMenu();
		if (menu) {
			menu.attachEvent("onItemClick", function (id, e) {
				var obj = this.getItem(id);
				var method = view[obj.method] || view[id];
				if (method) {
					var active = view.getActive();
					if (view.callEvent("onbefore" + (obj.event || obj.method || id), [active])) {
						if (!(id == "upload" && view.config.legacyUploader)) {
							if (view._uploadPopup) view._uploadPopup.hide();
							menu.hide();
						}
						var args = [active];
						if (id == "upload") {
							e = webix.html.pos(e);
							args.push(e);
						}
						webix.delay(function () {
							method.apply(view, args);
							view.callEvent("onafter" + (obj.event || obj.method || id), []);
						});
					}
				}
			});
			menu.attachEvent("onBeforeShow", function (e) {
				menu.filter("");
				menu.hide();
				var c = menu.getContext();
	
				//context menu over empty area 
				if (c && c.obj && !c.id) c.obj.unselectAll();
	
				if (c && c.obj) return c.obj.callEvent("onBeforeMenuShow", [c.id, e]);
	
				return true;
			});
		}
	}

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var values = exports.values = {
		modes: ["files", "table"],
		mode: "table",
		handlers: {},
		structure: {},
		fsIds: true,
		templateName: webix.template("#value#"),
		templateSize: function templateSize(obj) {
			var value = obj.size;
			var labels = webix.i18n.filemanager.sizeLabels;
			var pow = 0;
			while (value / 1024 > 1) {
				value = value / 1024;
				pow++;
			}
			var isInt = parseInt(value, 10) == value;
	
			var format = webix.Number.numToStr({
				decimalDelimiter: webix.i18n.decimalDelimiter,
				groupDelimiter: webix.i18n.groupDelimiter,
				decimalSize: isInt ? 0 : webix.i18n.groupSize
			});
	
			return format(value) + "" + labels[pow];
		},
		templateType: function templateType(obj) {
			var types = webix.i18n.filemanager.types;
			return types && types[obj.type] ? types[obj.type] : obj.type;
		},
		templateDate: function templateDate(obj) {
			var date = obj.date;
			if ((typeof date === "undefined" ? "undefined" : _typeof(date)) != "object") {
				date = new Date(parseInt(obj.date, 10) * 1000);
			}
			return webix.i18n.fullDateFormatStr(date);
		},
		templateCreate: function templateCreate() {
			return { value: "newFolder", type: "folder", date: new Date() };
		},
		templateIcon: function templateIcon(obj, common) {
			return "<div class='webix_fmanager_icon fm-" + (common.icons[obj.type] || common.icons.file) + "'></div>";
		},
		uploadProgress: {
			type: "icon",
			hide: false
		},
		//idChange: true,
		icons: {
			folder: "folder",
			excel: "file-excel",
			pdf: "file-pdf",
			pp: "file-powerpoint",
			text: "file-text",
			video: "file-video",
			image: "file-image",
			code: "file-code",
			audio: "file-audio",
			archive: "file-archive",
			doc: "file-word",
			file: "file"
		}
	};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.changeCursor = changeCursor;
	function init(view) {
		view._cursorHistory = webix.extend([], webix.PowerArray, true);
		view.$ready.push(function () {
			return setHandlers(view);
		});
	}
	
	function setHandlers(view) {
		view.attachEvent("onAfterLoad", function () {
			if (!view.config.disabledHistory) {
				var state = window.location.hash;
				if (state && state.indexOf("#!/") === 0) {
					view.setPath(state.replace("#!/", ""));
				}
			}
		});
	
		view.attachEvent("onAfterCursorChange", function (id) {
			if (!view._historyIgnore) {
				if (!view._historyCursor) view._cursorHistory.splice(1);
				if (view._cursorHistory[this._historyCursor] != id) {
					if (view._cursorHistory.length == 20) view._cursorHistory.splice(0, 1);
					view._cursorHistory.push(id);
					view._historyCursor = this._cursorHistory.length - 1;
				}
			}
			view._historyIgnore = false;
			if (!view.config.disabledHistory) pushHistory(view, id);
			view.callEvent("onHistoryChange", [id, view._cursorHistory, view._historyCursor]);
		});
	}
	
	function pushHistory(view, path) {
		path = path || view.getCursor();
	
		if (window.history && window.history.replaceState) {
			window.history.replaceState({ webix: true, id: view.config.id, value: path }, "", "#!/" + path);
		} else {
			window.location.hash = "#!/" + path;
		}
	}
	
	function changeCursor(view, step) {
		if (view._cursorHistory.length > 1) {
			var index = view._historyCursor + step;
			if (index > -1 && index < view._cursorHistory.length) {
				view._historyIgnore = true;
				view._historyCursor = index;
				view.setCursor(view._cursorHistory[index]);
			}
		}
		return view.getCursor();
	}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.loadDynData = loadDynData;
	exports.clearBranch = clearBranch;
	exports.parseData = parseData;
	exports.openFolders = openFolders;
	exports.getDynMode = getDynMode;
	exports.loadSearchData = loadSearchData;
	exports.parseSearchData = parseSearchData;
	
	var _sort = __webpack_require__(22);
	
	var sorting = _interopRequireWildcard(_sort);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function init(view) {
		view.attachEvent("onBeforeCursorChange", function () {
			view.$skipDynLoading = false;
			return true;
		});
		setDataParsers(view);
	}
	
	function setDataParsers(view) {
		view.dataParser = {
			files: function files(obj, data) {
				if (this.config.noFileCache) {
					clearBranch(this, obj.id);
				} else obj.webix_files = 0;
	
				parseData(this, data);
			},
			branch: function branch(obj, data) {
				if (this.config.noFileCache) {
					clearBranch(this, obj.id);
				} else {
					obj.webix_branch = 0;
					obj.webix_child_branch = 0;
				}
	
				parseData(this, data);
			}
		};
	}
	function loadDynData(view, url, obj, mode, open) {
		view.showProgress();
		if (view.callEvent("onBeforeDynLoad", [url, obj, mode, open])) {
			var callback = {
				success: function success(text, response) {
					view.hideProgress();
					var data = view.data.driver.toObject(text, response);
					if (open) obj.open = true;
	
					if (view.callEvent("onBeforeDynParse", [obj, data, mode])) {
						view.dataParser[mode].call(view, obj, data);
						view.callEvent("onAfterDynParse", [obj, data, mode]);
					}
				},
				error: function error() {
					view.hideProgress();
					view.callEvent("onDynLoadError", []);
				}
			};
			if (url.load) return url.load(null, callback, { action: mode, source: obj.id });
		}
	}
	
	function clearBranch(view, id) {
		var items = [];
	
		view.data.eachChild(id, function (item) {
			if (!view.data.branch[item.id] && item.type != "folder") items.push(item.id);
		}, view, true);
	
		for (var i = 0; i < items.length; i++) {
			view.remove(items[i]);
		}
	}
	
	function parseData(view, data) {
		view.parse(data);
		view.$skipDynLoading = true;
		view._refreshActiveFolder();
		view.$skipDynLoading = false;
	}
	
	function openFolders(view, folders) {
		var dynMode, i, pItem;
		var defer = webix.promise.defer();
		dynMode = getDynMode(view);
	
		if (dynMode && folders.length) {
			for (i = 0; i < folders.length; i++) {
				pItem = view.getItem(folders[i]);
				if (!(pItem && !pItem["webix_" + dynMode])) {
					openDynFolder(view, folders.slice(i), dynMode, defer);
					return defer;
				} else {
					pItem.open = true;
					if (view.$$("tree")) view.$$("tree").refresh(folders[i]);
				}
			}
			defer.resolve(folders[i]);
		} else {
			defer.reject();
		}
		return defer;
	}
	function openDynFolder(view, ids, mode, defer) {
		var obj = view.getItem(ids[0]);
		view.showProgress();
		var url = view.config.handlers[mode];
		var callback = {
			success: function success(text, response) {
				view.hideProgress();
				var data = view.data.driver.toObject(text, response);
				if (view.callEvent("onBeforeDynParse", [obj, data, mode])) {
					obj.open = true;
					view.dataParser[mode].call(view, obj, data);
	
					var lastId = ids.shift();
					if (ids.length && view.getItem(ids[0]).type == "folder") {
						openDynFolder(view, ids, mode, defer);
					} else {
						view.refreshCursor();
						defer.resolve(lastId);
					}
					view.callEvent("onAfterDynParse", [obj, data, mode]);
				}
			}
		};
		if (url.load) return url.load(null, callback, { action: mode, source: ids[0] });
	}
	
	function getDynMode(view) {
		for (var mode in view.dataParser) {
			if (view.config.handlers[mode]) {
				return mode;
			}
		}
		return null;
	}
	function loadSearchData(view, url, id, value) {
		var params = { action: "search", source: id, text: value };
		if (view.callEvent("onBeforeSearchRequest", [id, params])) {
			var callback = {
				success: function success(text, response) {
					view.hideProgress();
					var data = view.data.driver.toObject(text, response);
					parseSearchData(view, data);
					view.$searchValue = value;
				},
				error: function error() {
					view.hideProgress();
				}
			};
			if (url.load) return url.load(null, callback, params);
		}
	}
	function parseSearchData(view, data) {
		view.callEvent("onShowSearchResults", []);
		view.$searchResults = true;
		var cell = view.$$(view.config.mode);
		if (cell && cell.filter) {
			cell.clearAll();
			if (view.sortState && view.sortState.view == cell.config.id) data = sorting.sortData(view.sortState.sort, data);
			cell.parse(data);
		}
	}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.sortData = sortData;
	function sortData(sort, data) {
		var sorter = webix.DataStore.prototype.sorting.create(sort);
		var folders = [];
		var files = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].type == "folder") folders.push(data[i]);else files.push(data[i]);
		}
		folders.sort(sorter);
		files.sort(sorter);
		return folders.concat(files);
	}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.getPath = getPath;
	exports.getPathNames = getPathNames;
	exports.setPath = setPath;
	exports.getParentFolders = getParentFolders;
	function getPath(view, id) {
		id = id || view.getCursor();
		var path = [];
		while (id && view.getItem(id)) {
			path.push(id);
			id = view.getParentId(id);
		}
		return path.reverse();
	}
	
	function getPathNames(view, id) {
		id = id || view.getCursor();
		var item = null;
		var path = [];
		while (id && view.getItem(id)) {
			item = view.getItem(id);
			path.push({ id: id, value: view.config.templateName(item) });
			id = view.getParentId(id);
		}
		return path.reverse();
	}
	
	function setPath(view, id) {
		var pId = id;
		while (pId && view.getItem(pId)) {
			view.callEvent("onPathLevel", [pId]);
			pId = view.getParentId(pId);
		}
		if (view.getItem(id)) {
			if (id != view.getCursor()) {
				view.setCursor(id);
				view.callEvent("onPathComplete", [id]);
			}
		} else {
			// dynamic loading
			var folders = getParentFolders(id);
			view.openFolders(folders).then(function () {
				view.setCursor(id);
				view.callEvent("onPathComplete", [id]);
			});
		}
	}
	
	function getParentFolders(id) {
		var i,
		    parts,
		    ids = [];
		if (typeof id == "string") {
			parts = id.replace(/^\//, "").split("/");
			for (i = 0; i < parts.length; i++) {
				ids.push(parts.slice(0, i + 1).join("/"));
			}
		}
		return ids;
	}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.makeSaveRequest = makeSaveRequest;
	exports.errorHandler = errorHandler;
	function makeSaveRequest(view, url, obj, callback) {
		if (view.callEvent("onBeforeRequest", [url, obj])) {
			showSaveMessage(view);
			if (url.load) {
				var rCallback = {
					success: function success(text, response) {
						var data = view.data.driver.toObject(text, response);
						hideSaveMessage(view);
						if (view.callEvent("onSuccessResponse", [obj, data]) && callback) {
							callback.call(view, obj, data);
						}
					},
					error: function error(result) {
						if (view.callEvent("onErrorResponse", [obj, result])) {
							errorHandler(view, result);
						}
					}
				};
				url.load(null, rCallback, webix.copy(obj));
			}
		}
	}
	
	function showSaveMessage(view, message) {
		view._saveMessageDate = new Date();
		if (!view._saveMessage) {
			view._saveMessage = webix.html.create("DIV", { "class": "webix_fmanager_save_message" }, "");
			view.$view.style.position = "relative";
			webix.html.insertBefore(view._saveMessage, view.$view);
		}
		var msg = "";
		if (!message) {
			msg = webix.i18n.filemanager.saving;
		} else {
			msg = webix.i18n.filemanager.errorResponse;
		}
	
		view._saveMessage.innerHTML = msg;
	}
	
	function hideSaveMessage(view) {
		if (view._saveMessage) {
			webix.html.remove(view._saveMessage);
			view._saveMessage = null;
		}
	}
	
	function errorHandler(view) {
		// reload data on error response
		var url = view.data.url;
		if (url) {
			var driver = view.data.driver;
			showSaveMessage(view, true);
	
			webix.ajax().get(url, { success: function success(text, response) {
					var data = driver.toObject(text, response);
					if (data) {
						data = driver.getDetails(driver.getRecords(data));
						view.clearAll();
						view.parse(data);
						view.data.url = url;
					}
				}, error: function error() {} });
		}
	}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.hideTree = hideTree;
	exports.showTree = showTree;
	function hideTree(view) {
		if (view.$$("treeLayout")) {
			view.$$("treeLayout").hide();
			if (view.$$("resizer")) view.$$("resizer").hide();
			if (view.$$("sidePanel")) view.$$("sidePanel").show();
		}
	}
	function showTree(view) {
		if (view.$$("treeLayout")) {
			view.$$("treeLayout").show();
			if (view.$$("resizer")) view.$$("resizer").show();
			if (view.$$("sidePanel")) view.$$("sidePanel").hide();
		}
	}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.getViews = getViews;
	exports.getCellConfig = getCellConfig;
	exports.getUI = getUI;
	
	var _back = __webpack_require__(27);
	
	var back = _interopRequireWildcard(_back);
	
	var _bodylayout = __webpack_require__(28);
	
	var bodyLayout = _interopRequireWildcard(_bodylayout);
	
	var _collapseall = __webpack_require__(29);
	
	var collapse = _interopRequireWildcard(_collapseall);
	
	var _columns = __webpack_require__(30);
	
	var columns = _interopRequireWildcard(_columns);
	
	var _expandall = __webpack_require__(31);
	
	var expand = _interopRequireWildcard(_expandall);
	
	var _files = __webpack_require__(32);
	
	var files = _interopRequireWildcard(_files);
	
	var _forward = __webpack_require__(33);
	
	var forward = _interopRequireWildcard(_forward);
	
	var _mainlayout = __webpack_require__(34);
	
	var mainLayout = _interopRequireWildcard(_mainlayout);
	
	var _menu = __webpack_require__(35);
	
	var menu = _interopRequireWildcard(_menu);
	
	var _modes = __webpack_require__(36);
	
	var modes = _interopRequireWildcard(_modes);
	
	var _modeviews = __webpack_require__(37);
	
	var modeViews = _interopRequireWildcard(_modeviews);
	
	var _path = __webpack_require__(38);
	
	var path = _interopRequireWildcard(_path);
	
	var _search = __webpack_require__(39);
	
	var search = _interopRequireWildcard(_search);
	
	var _panel = __webpack_require__(40);
	
	var sidePanel = _interopRequireWildcard(_panel);
	
	var _table = __webpack_require__(41);
	
	var table = _interopRequireWildcard(_table);
	
	var _treelayout = __webpack_require__(42);
	
	var treeLayout = _interopRequireWildcard(_treelayout);
	
	var _treetoolbar = __webpack_require__(43);
	
	var treeToolbar = _interopRequireWildcard(_treetoolbar);
	
	var _toggle = __webpack_require__(44);
	
	var toggle = _interopRequireWildcard(_toggle);
	
	var _toolbar = __webpack_require__(45);
	
	var toolbar = _interopRequireWildcard(_toolbar);
	
	var _tree = __webpack_require__(46);
	
	var tree = _interopRequireWildcard(_tree);
	
	var _up = __webpack_require__(47);
	
	var up = _interopRequireWildcard(_up);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function init(view, config) {
		view.structure = {
			"mainLayout": mainLayout.init(view),
			"toolbar": toolbar.init(view),
			"menu": menu.init(view),
			"back": back.init(view),
			"forward": forward.init(view),
			"up": up.init(view),
			"path": path.init(view),
			"search": search.init(view),
			"bodyLayout": bodyLayout.init(view),
			"treeLayout": treeLayout.init(view),
			"sidePanel": sidePanel.init(view),
			"treeToolbar": treeToolbar.init(view),
			"showTree": toggle.init(view),
			"hideTree": toggle.init(view),
			"expandAll": expand.init(view),
			"collapseAll": collapse.init(view),
			"tree": tree.init(view),
			"modeViews": {
				config: function config(settings) {
					return modeViews.init(view, settings);
				}
			},
			"modes": {
				config: function config(settings) {
					return modes.init(view, settings);
				}
			},
			"files": {
				config: files.init(view)
			},
	
			"table": {
				config: table.init(view)
			},
			"columns": {
				config: columns.init(view)
			}
		};
	
		changeStructure(view, config);
	}
	
	function getViews(view, struct, config) {
		var cells,
		    found,
		    i,
		    id,
		    arrName = "",
		    arrs = ["rows", "cols", "elements", "cells", "columns", "options", "data"];
	
		for (i = 0; i < arrs.length; i++) {
			if (struct[arrs[i]]) {
				arrName = arrs[i];
				cells = struct[arrName];
			}
		}
		if (cells) {
			if (typeof cells == "string") {
				if (view.structure[cells]) {
					struct[arrName] = getCellConfig(view, view.structure[cells], config);
					cells = struct[arrName];
				}
			}
	
			for (i = 0; i < cells.length; i++) {
				found = null;
				if (typeof cells[i] == "string") {
					found = id = cells[i];
					if (view.structure[id]) {
						cells[i] = getCellConfig(view, webix.extend({}, view.structure[id]), config);
						cells[i].id = id;
					} else cells[i] = {};
				}
				getViews(view, cells[i], config);
				if (found) {
					if (config.on && config.on.onViewInit) {
						config.on.onViewInit.apply(this, [found, cells[i]]);
					}
					webix.callEvent("onViewInit", [found, cells[i], this]);
				}
			}
		}
	}
	
	function getCellConfig(view, defConfig, config) {
		var cellConfig = defConfig.config || defConfig;
		return typeof cellConfig == "function" ? cellConfig.call(view, config) : webix.copy(cellConfig);
	}
	
	function isSVG() {
		return typeof SVGRect != "undefined";
	}
	
	function getUI(view, config) {
		var layoutConf = view.structure.mainLayout;
		var structure = webix.extend({}, layoutConf.config || layoutConf);
		getViews(view, structure, config);
	
		if (config.on && config.on.onViewInit) {
			config.on.onViewInit.apply(view, [config.id || "mainLayout", structure]);
		}
		webix.callEvent("onViewInit", [config.id || "mainLayout", structure, view]);
		if (!isSVG()) config.css = config.css ? config.css + " webix_nosvg" : "webix_nosvg";
		return structure;
	}
	
	function changeStructure(view, config) {
		var newView,
		    vName,
		    newViews = config.structure;
	
		if (newViews) {
			for (vName in newViews) {
				if (newViews.hasOwnProperty(vName)) {
					newView = webix.copy(newViews[vName]);
					if (view.structure[vName] && view.structure[vName].config) {
						view.structure[vName].config = newView.config || newView;
					} else {
						view.structure[vName] = newView.config || newView;
					}
				}
			}
		}
	}

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return { view: "button", type: "htmlbutton", css: "webix_fmanager_back",
			label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 37,
			tooltip: webix.i18n.filemanager.back
		};
	}
	
	function ready(view) {
		if (view.$$("back")) {
			view.$$("back").attachEvent("onItemClick", function () {
				if (view.callEvent("onBeforeBack", [])) {
					view.goBack();
					view.callEvent("onAfterBack", []);
				}
			});
			view.attachEvent("onHistoryChange", function (path, ids, cursor) {
				if (!cursor) view.$$("back").disable();else view.$$("back").enable();
			});
		}
	}

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init() {
		return {
			css: "webix_fmanager_body",
			cols: ["sidePanel", "treeLayout", { view: "resizer", id: "resizer", width: 3 }, "modeViews"]
		};
	}

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return { view: "button", type: "htmlbutton", css: "webix_fmanager_collapse",
			label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30, tooltip: webix.i18n.filemanager.collapseTree
		};
	}
	
	function ready(view) {
		if (view._getDynMode() && view.$$("collapseAll")) {
			view.$$("collapseAll").hide();
		}
		if (view.$$("collapseAll") && view.$$("tree")) {
			view.$$("collapseAll").attachEvent("onItemClick", function () {
				view.$$("tree").closeAll();
			});
		}
	}

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		var locale = webix.i18n.filemanager;
		return [{ id: "value", header: locale.name, fillspace: 3, sort: "string", template: function template(obj, common) {
				var name = common.templateName(obj, common);
				return common.templateIcon(obj, common) + name;
			}, editor: "text" }, { id: "date", header: locale.date, fillspace: 2, sort: "int", template: function template(obj, common) {
				return common.templateDate(obj, common);
			} }, { id: "type", header: locale.type, fillspace: 1, sort: "string", template: function template(obj, common) {
				return common.templateType(obj);
			} }, { id: "size", header: locale.size, fillspace: 1, sort: "int", css: { "text-align": "right" }, template: function template(obj, common) {
				return obj.type == "folder" ? "" : common.templateSize(obj);
			} }, { id: "location", header: locale.location, fillspace: 2, sort: "string", template: function template(obj) {
				return view._getLocation(obj);
			}, hidden: true }];
	}

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return { view: "button", type: "htmlbutton", css: "webix_fmanager_expand",
			label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30,
			tooltip: webix.i18n.filemanager.expandTree
		};
	}
	
	function ready(view) {
		if (view._getDynMode() && view.$$("expandAll")) {
			view.$$("expandAll").hide();
		}
		if (view.$$("expandAll") && view.$$("tree")) {
			view.$$("expandAll").attachEvent("onItemClick", function () {
				view.$$("tree").openAll();
			});
		}
	}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init() {
		return {
			view: "fileview",
			type: "FileView",
			select: "multiselect",
			editable: true,
			editaction: false,
			editor: "text",
			editValue: "value",
			drag: true,
			navigation: true,
			tabFocus: true,
			onContext: {}
		};
	}

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return { view: "button", type: "htmlbutton", css: "webix_fmanager_forward",
			label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 37,
			tooltip: webix.i18n.filemanager.forward
		};
	}
	
	function ready(view) {
		if (view.$$("forward")) {
			view.$$("forward").attachEvent("onItemClick", function () {
				if (view.callEvent("onBeforeForward", [])) {
					view.goForward();
					view.callEvent("onAfterForward", []);
				}
			});
			view.attachEvent("onHistoryChange", function (path, ids, cursor) {
				if (ids.length == 1 || cursor == ids.length - 1) view.$$("forward").disable();else view.$$("forward").enable();
			});
		}
	}

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init() {
		var config = {
			type: "clean",
			rows: ["toolbar", "bodyLayout"]
		};
		if (typeof SVGRect == "undefined") config.css = "webix_nosvg";
		return config;
	}

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
		return { view: "button", type: "htmlbutton", label: "<div class=\"webix_fmanager_bar_icon \"></div>",
			css: "webix_fmanager_menu", icon: "bars", width: 37,
			tooltip: webix.i18n.filemanager.actions
		};
	}
	
	function ready(view) {
		var btn = view.$$("menu");
		if (btn) {
			btn.attachEvent("onItemClick", function () {
				if (view.callEvent("onBeforeMenu", [])) {
					view.getMenu().setContext({ obj: view.getActiveView(), id: view.getActive() });
					view.getMenu().show(btn.$view);
					view.callEvent("onAfterMenu", []);
				}
			});
	
			if (view.config.readonly) {
				btn.hide();
				if (view.$$("menuSpacer")) view.$$("menuSpacer").hide();
			}
		}
	}

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view, settings) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		var config = { view: "segmented", width: 70, options: [{
				id: "files",
				width: 32,
				value: "<div class=\"webix_fmanager_bar_icon webix_fmanager_files_mode \"></div>",
				tooltip: webix.i18n.filemanager.iconsView
			}, {
				id: "table",
				width: 32,
				value: "<div class=\"webix_fmanager_bar_icon webix_fmanager_table_mode \"></div>",
				tooltip: webix.i18n.filemanager.tableView
			}], css: "webix_fmanager_modes", value: settings.mode };
	
		return config;
	}
	
	function ready(view) {
		if (view.$$("modes")) {
			view.$$("modes").attachEvent("onBeforeTabClick", function (id) {
				var value = view.$$("modes").getValue();
				if (view.callEvent("onBeforeModeChange", [value, id])) {
					if (view.$$(id)) {
						view.config.mode = id;
						view.$$(id).show();
						view.callEvent("onAfterModeChange", [value, id]);
						return true;
					}
				}
				return false;
			});
		}
	}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	
	var _sort = __webpack_require__(22);
	
	var sorting = _interopRequireWildcard(_sort);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function init(view, settings) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return {
			animate: false,
			cells: settings.modes ? webix.copy(settings.modes) : []
		};
	}
	
	function ready(view) {
		var i,
		    mCell,
		    cell = view.$$(view.config.mode),
		    modes = view.config.modes;
	
		if (cell) {
			cell.show();
			view.attachEvent("onBeforeCursorChange", function () {
				var cell = view.$$(view.config.mode);
				if (cell) cell.unselect();
				return true;
			});
			view.attachEvent("onAfterCursorChange", function () {
				var cell = view.$$(view.config.mode);
				if (cell) cell.editStop();
			});
		}
	
		if (modes) {
			for (i = 0; i < modes.length; i++) {
				mCell = view.$$(modes[i]);
				if (mCell && mCell.filter) {
					addCellConfig(view, mCell);
				}
			}
		}
	}
	
	function addCellConfig(view, cell) {
		bindData(view, cell);
		applyTemplates(view, cell);
		setCellHandlers(view, cell);
		// link with context menu
		var menu = view.getMenu();
		if (menu && !view.config.readonly) addMenuHandlers(view, cell, menu);
		//read-only
		if (view.config.readonly) {
			cell.define("drag", false);
			cell.define("editable", false);
		}
	}
	
	function bindData(view, cell) {
		view.data.attachEvent("onClearAll", function () {
			return cell.clearAll();
		});
	
		view.data.attachEvent("onIdChange", function (oldId, newId) {
			if (cell.data.pull[oldId]) cell.data.changeId(oldId, newId);
		});
	
		// we do not need call binding on row selection
		cell.attachEvent("onBeforeSelect", function () {
			cell.$skipBinding = true;
		});
		view.attachEvent("onBeforeCursorChange", function () {
			cell.$skipBinding = false;
		});
		view.attachEvent("onAfterCursorChange", function () {
			cell.$skipBinding = false;
		});
		cell.bind(view, "$data", function (obj, source) {
			var url;
			if (cell.$skipBinding) return false;
			if (!obj) return cell.clearAll();
	
			if (!view.$searchResults) {
				if (!view.$skipDynLoading) {
					for (var mode in view.dataParser) {
						if (!url && obj["webix_" + mode]) {
							url = view.config.handlers[mode];
							if (url) {
								view.$skipDynLoading = true;
								view.loadDynData(url, obj, mode);
							}
						}
					}
				}
				// import child items
				importSelectedBranch(view, cell, source, obj);
			}
		});
	}
	
	function importSelectedBranch(view, target, source, obj) {
		var data = [].concat(webix.copy(source.data.getBranch(obj.id))).concat(obj.files || []);
		if (view.sortState && view.sortState.view == target.config.id) data = sorting.sortData(view.sortState.sort, data);
		target.data.importData(data, true);
	}
	
	function applyTemplates(view, cell) {
		cell.type.icons = view.config.icons;
		cell.type.templateIcon = view.config.templateIcon;
		cell.type.templateName = view.config.templateName;
		cell.type.templateSize = view.config.templateSize;
		cell.type.templateDate = view.config.templateDate;
		cell.type.templateType = view.config.templateType;
	}
	
	function addMenuHandlers(view, cell, menu) {
		cell.on_context.webix_view = function (e, id) {
			id = this.locate(e.target || e.srcElement);
			if (!id) {
				if (menu.setContext) menu.setContext({ obj: webix.$$(e) });
				menu.show(e);
				webix.html.preventEvent(e);
			}
		};
		menu.attachTo(cell);
	
		cell.attachEvent("onBeforeMenuShow", function () {
			var context = menu.getContext();
			var type = "";
			if (context.id) type = view.getItem(context.id).type === "folder" ? "folder" : "file";
	
			menu.filter(function (obj) {
				var res = true;
	
				if (obj.batch) {
					if (!type) {
						res = obj.batch == "empty";
					} else {
						res = obj.batch == type || obj.batch == "item";
					}
				}
	
				if (view.config.menuFilter) res = res && view.config.menuFilter(obj);
	
				return res;
			});
	
			if (menu.count() && context.id) {
				webix.UIManager.setFocus(this);
				var sel = this.getSelectedId();
				var found = false;
				if (webix.isArray(sel)) {
					for (var i = 0; !found && i < sel.length; i++) {
						if ("" + sel[i] == "" + context.id) found = true;
					}
				}
				if (!found && this.exists(context.id)) this.select(context.id);
			}
	
			return menu.count() > 0;
		});
	
		cell.attachEvent("onAfterMenuShow", function (id) {
			if (id) {
				var selected = this.getSelectedId(true);
				var isSelected = false;
				for (var i = 0; i < selected.length && !isSelected; i++) {
					if (selected[i].toString() == id.toString()) {
						isSelected = true;
					}
				}
				if (!isSelected) this.select(id.toString());
	
				webix.UIManager.setFocus(this);
			} else {
				this.unselect();
			}
		});
	}
	function setCellHandlers(view, cell) {
	
		cell.attachEvent("onAfterSelect", function (id) {
			if (view.getItem(id)) view.callEvent("onItemSelect", [id]);
		});
	
		// double-click handlers
		cell.attachEvent("onItemDblClick", function (id) {
			view._onFileDblClick(id);
		});
	
		// focus and blur styling
		view._addElementHotKey("tab", function (cell) {
			if (!cell.getSelectedId()) {
				var id = cell.getFirstId();
				if (id) {
					cell.select(id);
				}
			}
		}, cell);
		cell.attachEvent("onFocus", function () {
			view._activeView = this;
			webix.html.removeCss(this.$view, "webix_blur");
		});
		cell.attachEvent("onBlur", function () {
			if (!view.getMenu() || !view.getMenu().isVisible()) webix.html.addCss(cell.$view, "webix_blur");
		});
	
		// editing (rename)
		cell.attachEvent("onBeforeEditStop", function (state, editor) {
			return this.getTopParentView().callEvent("onBeforeEditStop", [editor.id || editor.row, state, editor, this]);
		});
		cell.attachEvent("onAfterEditStop", function (state, editor) {
			var view = this.getTopParentView();
			if (view.callEvent("onAfterEditStop", [editor.id || editor.row, state, editor, this])) {
				if (!editor.column || editor.column == "value") view.renameFile(editor.id || editor.row, state.value);else if (editor.column) {
					view.getItem(editor.id || editor.row)[editor.column] = state.value;
				}
			}
		});
	
		// drag-n-drop
		cell.attachEvent("onBeforeDrop", function (context) {
			if (view.callEvent("onBeforeDrop", [context])) {
				if (context.from) {
					//from different component
					view.moveFile(context.source, context.target);
				}
			}
			return false;
		});
		cell.attachEvent("onBeforeDrag", function (context, e) {
			return !view.config.readonly && view.callEvent("onBeforeDrag", [context, e]);
		});
		cell.attachEvent("onBeforeDragIn", function (context, e) {
			return !view.config.readonly && view.callEvent("onBeforeDragIn", [context, e]);
		});
	
		// enter hot key
		view._addElementHotKey("enter", function (sview) {
			var selected = sview.getSelectedId(true);
			for (var i = 0; i < selected.length; i++) {
				view._onFileDblClick(selected[i]);
			}
			webix.UIManager.setFocus(sview);
			selected = sview.getSelectedId(true);
			if (!selected.length) {
				var id0 = sview.getFirstId();
				if (id0) sview.select(id0);
			}
		}, cell);
	}

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return { view: "path", borderless: true };
	}
	
	function ready(view) {
		if (view.$$("path")) {
			view.attachEvent("onFolderSelect", function (id) {
				view.$$("path").setValue(view.getPathNames(id));
			});
			view.$$("path").attachEvent("onItemClick", function (id) {
				var targetIndex = view.$$("path").getIndexById(id);
				var levelUp = view.$$("path").count() - targetIndex - 1;
	
				if (view.$searchResults) view.hideSearchResults();
	
				if (levelUp) {
					id = view.getCursor();
					while (levelUp) {
						id = view.getParentId(id);
						levelUp--;
					}
					view.setCursor(id);
				}
				view.callEvent("onAfterPathClick", [id]);
			});
	
			view.data.attachEvent("onClearAll", function () {
				view.$$("path").clearAll();
			});
		}
	}

/***/ }),
/* 39 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return { view: "search", gravity: 0.3, minWidth: 80, css: "webix_fmanager_search", icon: " webix_fmanager_icon" };
	}
	
	function ready(view) {
		var search = view.$$("search");
		if (search) {
			view.attachEvent("onHideSearchResults", function () {
				search.setValue("");
			});
			view.attachEvent("onBeforeCursorChange", function () {
				if (view.$searchResults) {
					view.hideSearchResults(true);
				}
			});
			search.attachEvent("onTimedKeyPress", function () {
				if (this._code != 9) {
					var value = search.getValue();
					if (value) {
						if (view.callEvent("onBeforeSearch", [value])) {
							view.showSearchResults(value);
							view.callEvent("onAfterSearch", [value]);
						}
					} else if (view.$searchResults) {
						view.hideSearchResults();
					}
				}
			});
			search.attachEvent("onKeyPress", function (code) {
				this._code = code;
			});
	
			view.attachEvent("onAfterModeChange", function () {
				if (view.$searchResults) view.showSearchResults(search.getValue());
			});
		}
	}

/***/ }),
/* 40 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
		return {
			hidden: true,
			css: "webix_fmanager_panel",
			type: "clean",
			rows: [{
				height: 34,
				paddingY: 1,
				paddingX: 0,
				view: "form",
				cols: [{ view: "button", id: "showTree", type: "htmlbutton", css: "webix_fmanager_toggle",
					label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30,
					tooltip: webix.i18n.filemanager.showTree
				}]
			}, { template: " " }]
		};
	}
	function ready(view) {
		if (view.$$("showTree")) {
			view.$$("showTree").attachEvent("onItemClick", function () {
				view.showTree();
			});
		}
	}

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return {
			view: "filetable",
			css: "webix_fmanager_table",
			columns: "columns",
			headerRowHeight: 34,
			editable: true,
			editaction: false,
			select: "multiselect",
			drag: true,
			navigation: true,
			resizeColumn: true,
			tabFocus: true,
			onContext: {}
		};
	}
	
	function ready(view) {
		if (view.$$("table")) {
			view.attachEvent("onHideSearchResults", function () {
				if (view.$$("table").isColumnVisible("location")) view.$$("table").hideColumn("location");
			});
			view.attachEvent("onShowSearchResults", function () {
				if (!view.$$("table").isColumnVisible("location")) view.$$("table").showColumn("location");
			});
	
			view.$$("table").attachEvent("onBeforeEditStart", function (id) {
				if ((typeof id === "undefined" ? "undefined" : _typeof(id)) != "object") {
					this.edit({ row: id, column: "value" });
					return false;
				}
				return true;
			});
	
			// sorting
			view.$$("table").data.attachEvent("onBeforeSort", function (by, dir, as, sort) {
				view.sortState = {
					view: view.$$("table").config.id,
					sort: sort
				};
				if (view.$searchResults && view.$$("search")) {
					view.showSearchResults(view.$$("search").getValue());
					return false;
				}
			});
			view.data.attachEvent("onClearAll", function () {
				view.sortState = null;
			});
		}
	}

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init() {
		return {
			rows: ["treeToolbar", "tree"]
		};
	}

/***/ }),
/* 43 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init() {
		return {
			css: "webix_fmanager_tree_toolbar",
			height: 34,
			paddingX: 8,
			paddingY: 1,
			margin: 7,
			cols: ["hideTree", { id: "treeSpacer" }, "expandAll", "collapseAll"]
		};
	}

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return { view: "button", type: "htmlbutton", css: "webix_fmanager_toggle",
			label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 30,
			tooltip: webix.i18n.filemanager.hideTree
		};
	}
	
	function ready(view) {
		if (view.$$("hideTree")) {
			view.$$("hideTree").attachEvent("onItemClick", function () {
				view.hideTree();
			});
		}
	}

/***/ }),
/* 45 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init() {
		return {
			css: "webix_fmanager_toolbar",
			paddingX: 10,
			paddingY: 5,
			margin: 7,
			cols: ["menu", { id: "menuSpacer", width: 75 }, { margin: 0, cols: ["back", "forward"] }, "up", "path", "search", "modes"]
		};
	}

/***/ }),
/* 46 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		return {
			width: 251,
			view: "filetree",
			id: "tree",
			select: true,
			filterMode: {
				showSubItems: false,
				openParents: false
			},
			type: "FileTree",
			navigation: true,
			editor: "text",
			editable: true,
			editaction: false,
			drag: true,
			tabFocus: true,
			onContext: {}
		};
	}
	
	function ready(view) {
		var tree = view.$$("tree");
		var state;
	
		if (tree) {
	
			tree.type.icons = view.config.icons;
	
			// data source definition (syncing with main data source)
			tree.sync(view, function () {
				this.filter(function (obj) {
	
					return obj.$count || obj.type == "folder";
				});
			});
	
			tree.on_click.webix_tree_child_branch = function (ev, id) {
				var url = view.config.handlers.branch;
				if (url) {
					view.loadDynData(url, this.getItem(id), "branch", true);
				}
			};
	
			view.attachEvent("onBeforeDynParse", function () {
				state = tree.getState();
			});
	
			view.attachEvent("onAfterDynParse", function (obj, data, mode) {
				if (state) {
					tree.setState(state);
					state = null;
				}
				if (mode == "branch" && obj.open) {
					tree.open(obj.id);
				}
			});
	
			tree.attachEvent("onAfterSelect", function (id) {
				view.callEvent("onFolderSelect", [id]);
			});
	
			view.attachEvent("onAfterCursorChange", function (id) {
				if (id) {
					tree.select(id);
					tree.showItem(id);
				}
			});
	
			// hide search results on click
			tree.attachEvent("onItemClick", function () {
				if (view.$searchResults) {
					view.hideSearchResults();
				}
			});
	
			view.attachEvent("onItemRename", function (id) {
				tree.refresh(id);
			});
	
			// open/close on double-click
			tree.attachEvent("onItemDblClick", function (id) {
				if (this.isBranchOpen(id)) {
					this.close(id);
				} else {
					this.open(id);
				}
			});
	
			tree.attachEvent("onBlur", function () {
				if (!view.getMenu() || !view.getMenu().isVisible()) {
					webix.html.addCss(this.$view, "webix_blur");
				}
			});
	
			tree.attachEvent("onFocus", function () {
				view._activeView = tree;
				webix.html.removeCss(tree.$view, "webix_blur");
				// clear sub view selection
				view.$$(view.config.mode).unselect();
			});
	
			// setting path (history support)
			view.attachEvent("onPathComplete", function (id) {
				tree.showItem(id);
			});
	
			// context menu
			if (!view.config.readonly) {
				if (view.getMenu()) view.getMenu().attachTo(tree);
				tree.attachEvent("onBeforeMenuShow", function (id) {
					var menu = view.getMenu();
	
					var context = menu.getContext();
					var type = "";
					if (context.id && this.getParentId(context.id)) type = view.getItem(context.id).type === "folder" ? "folder" : "file";
	
					menu.filter(function (obj) {
						var res = true;
	
						if (obj.batch) {
							if (!type) {
								res = obj.batch == "empty";
							} else {
								res = obj.batch == type || obj.batch == "item";
							}
						}
	
						if (view.config.menuFilter) res = res && view.config.menuFilter(obj);
	
						return res;
					});
					this.select(id);
					webix.UIManager.setFocus(this);
					return menu.count() > 0;
				});
			}
	
			// editing (rename)
			tree.attachEvent("onBeforeEditStop", function (state, editor) {
				return view.callEvent("onBeforeEditStop", [editor.id, state, editor, tree]);
			});
			tree.attachEvent("onAfterEditStop", function (state, editor) {
				if (view.callEvent("onAfterEditStop", [editor.id, state, editor, tree])) {
					view.renameFile(editor.id, state.value);
				}
			});
	
			// drag-n-drop
			tree.attachEvent("onBeforeDrag", function (context, e) {
				return !view.config.readonly && view.callEvent("onBeforeDrag", [context, e]);
			});
			tree.attachEvent("onBeforeDragIn", function (context, e) {
				return !view.config.readonly && view.callEvent("onBeforeDragIn", [context, e]);
			});
			tree.attachEvent("onBeforeDrop", function (context, e) {
				if (view.callEvent("onBeforeDrop", [context, e])) {
					if (context.from) {
						//from different component
						view.moveFile(context.source, context.target);
						view.callEvent("onAfterDrop", [context, e]);
					}
				}
				return false;
			});
	
			// focus
			var setTreeCursor = function setTreeCursor() {
				if (tree) webix.UIManager.setFocus(tree);
			};
			view.attachEvent("onAfterBack", setTreeCursor);
			view.attachEvent("onAfterForward", setTreeCursor);
			view.attachEvent("onAfterLevelUp", setTreeCursor);
			view.attachEvent("onAfterPathClick", setTreeCursor);
	
			// read-only mode
			if (view.config.readonly) {
				tree.define("drag", false);
				tree.define("editable", false);
			}
		}
	}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
		return { view: "button", type: "htmlbutton", css: "webix_fmanager_up",
			label: "<div class=\"webix_fmanager_bar_icon \"></div>", width: 37,
			tooltip: webix.i18n.filemanager.levelUp
		};
	}
	
	function ready(view) {
		if (view.$$("up")) {
			view.$$("up").attachEvent("onItemClick", function () {
				if (view.callEvent("onBeforeLevelUp", [])) {
					view.levelUp();
					view.callEvent("onAfterLevelUp", []);
				}
			});
		}
	}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.getUploader = getUploader;
	exports.uploadFile = uploadFile;
	
	var _save = __webpack_require__(24);
	
	var save = _interopRequireWildcard(_save);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function getConfig(legacy) {
		var config = {};
		if (legacy) {
			config = {
				view: "uploader",
				css: "webix_upload_select_ie",
				type: "iconButton",
				icon: "check",
				label: webix.i18n.filemanager.select,
				formData: { action: "upload" },
				urlData: {}
			};
		} else {
			config = {
				view: "uploader",
				apiOnly: true,
				formData: { action: "upload" },
				urlData: {}
			};
		}
		return config;
	}
	
	function init(view) {
		var legacy = view.config.legacyUploader;
		var config = getConfig(legacy);
	
		if (config) {
			if (legacy) {
				createFlashUploader(view, webix.copy(config));
			} else {
				view._uploader = webix.ui(config);
				view.attachEvent("onDestruct", function () {
					view._uploader.destructor();
				});
			}
		}
		setUploadHandlers(view);
	}
	
	function setUploadHandlers(view) {
		var uploader = getUploader(view);
		if (uploader) {
			// define url
			uploader.config.upload = view.config.handlers.upload;
			// add drop areas
			var modes = view.config.modes;
			if (modes && !view.config.readonly) {
				for (var i = 0; i < modes.length; i++) {
					if (view.$$(modes[i])) uploader.addDropZone(view.$$(modes[i]).$view);
				}
			}
	
			// handlers
			uploader.attachEvent("onBeforeFileAdd", function (file) {
				var target = "" + getUploadFolder(view);
	
				uploader.config.formData.target = target;
				uploader.config.urlData.target = target;
	
				return view.callEvent("onBeforeFileUpload", [file]);
			});
			uploader.attachEvent("onAfterFileAdd", function (file) {
				view._uploaderFolder = null;
				file.oldId = file.id;
				view.add({
					"id": file.id,
					"value": file.name,
					"type": file.type,
					size: file.size,
					date: Math.round(new Date().valueOf() / 1000)
				}, -1, uploader.config.formData.target);
	
				if (view.config.uploadProgress) {
					view.showProgress(view.config.uploadProgress);
				}
				view._refreshActiveFolder();
			});
	
			uploader.attachEvent("onUploadComplete", function (file) {
				if (view._uploadPopup) {
					view.getMenu().hide();
					view._uploadPopup.hide();
				}
				view.hideProgress();
				view.callEvent("onAfterFileUpload", [file]);
			});
			uploader.attachEvent("onFileUpload", function (item) {
				if (item.oldId) view.data.changeId(item.oldId, item.id);
				if (item.value) view.getItem(item.id).value = item.value;
	
				view.getItem(item.id).type = item.type;
				view._refreshActiveFolder();
			});
			uploader.attachEvent("onFileUploadError", function (item, response) {
				save.errorHandler(view, response);
				view.hideProgress();
			});
		}
	}
	
	function createFlashUploader(view, config) {
		if (!config) {
			config = getConfig(view.config.legacyUploader);
		}
		view._uploadPopup = webix.ui({
			view: "popup",
			padding: 0,
			width: 250,
			body: config
		});
		view._uploader = view._uploadPopup.getBody();
		view.attachEvent("onDestruct", function () {
			view._uploadPopup.destructor();
		});
	}
	
	function getUploadFolder(view) {
		return view._uploaderFolder || view.getCursor();
	}
	
	function getUploader(view) {
		return view._uploader;
	}
	
	function uploadFile(view, id, e) {
	
		if (!view.data.branch[id] && view.getItem(id).type != "folder") {
			id = view.getParentId(id);
		}
	
		view._uploaderFolder = id;
		if (view._uploadPopup) {
			view._uploadPopup.destructor();
			createFlashUploader(view);
			setUploadHandlers(view);
			view._uploadPopup.show(e, { x: 20, y: 5 });
		} else {
			if (view._uploader) view._uploader.fileDialog();
		}
	}

/***/ })
/******/ ]);