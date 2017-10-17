import * as sorting from "../sort.js";

export function init(view, settings){
	view.attachEvent("onComponentInit", () => ready(view));

	return {
		animate: false,
		cells: (settings.modes?webix.copy(settings.modes):[])
	};
}

function ready(view){
	var i, mCell,
		cell = view.$$(view.config.mode),
		modes = view.config.modes;

	if(cell){
		cell.show();
		view.attachEvent("onBeforeCursorChange", function(){
			var cell = view.$$(view.config.mode);
			if(cell)
				cell.unselect();
			return true;
		});
		view.attachEvent("onAfterCursorChange", function(){
			var cell = view.$$(view.config.mode);
			if(cell)
				cell.editStop();
		});
	}

	if(modes){
		for(i =0; i < modes.length; i++) {
			mCell = view.$$(modes[i]);
			if (mCell && mCell.filter) {
				addCellConfig(view, mCell);
			}
		}
	}
}

function addCellConfig(view, cell){
	bindData(view, cell);
	applyTemplates(view, cell);
	setCellHandlers(view, cell);
	// link with context menu
	var menu = view.getMenu();
	if (menu && !view.config.readonly)
		addMenuHandlers(view, cell, menu);
	//read-only
	if(view.config.readonly){
		cell.define("drag",false);
		cell.define("editable",false);
	}
}

function bindData(view, cell){
	view.data.attachEvent("onClearAll", () => cell.clearAll());

	view.data.attachEvent("onIdChange",(oldId,newId) => {
		if(cell.data.pull[oldId])
			cell.data.changeId(oldId,newId);
	});

	// we do not need call binding on row selection
	cell.attachEvent("onBeforeSelect", function(){
		cell.$skipBinding = true;
	});
	view.attachEvent("onBeforeCursorChange", function(){
		cell.$skipBinding = false;
	});
	view.attachEvent("onAfterCursorChange", function(){
		cell.$skipBinding = false;
	});
	cell.bind(view, "$data", (obj, source) => {
		var url;
		if(cell.$skipBinding)
			return false;
		if (!obj) return cell.clearAll();

		if (!view.$searchResults) {
			if(!view.$skipDynLoading){
				for(var mode in view.dataParser){
					if(!url && obj["webix_"+mode]) {
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

function importSelectedBranch(view, target, source, obj){
	var data = [].concat(webix.copy(source.data.getBranch(obj.id))).concat(obj.files || []);
	if(view.sortState && view.sortState.view == target.config.id)
		data = sorting.sortData(view.sortState.sort, data);
	target.data.importData(data, true);
}



function applyTemplates(view, cell){
	cell.type.icons = view.config.icons;
	cell.type.templateIcon = view.config.templateIcon;
	cell.type.templateName = view.config.templateName;
	cell.type.templateSize = view.config.templateSize;
	cell.type.templateDate = view.config.templateDate;
	cell.type.templateType = view.config.templateType;
}

function addMenuHandlers(view,cell,menu){
	cell.on_context.webix_view = function(e,id){
		id = this.locate(e.target|| e.srcElement);
		if(!id){
			if(menu.setContext)
				menu.setContext({ obj:webix.$$(e)});
			menu.show(e);
			webix.html.preventEvent(e);
		}

	};
	menu.attachTo(cell);

	cell.attachEvent("onBeforeMenuShow", function () {
		var context = menu.getContext();
		var type = "";
		if (context.id)
			type = view.getItem(context.id).type === "folder" ? "folder" : "file";

		menu.filter(function(obj){
			var res = true;

			if (obj.batch){
				if(!type){
					res = (obj.batch == "empty");
				} else {
					res = (obj.batch == type || obj.batch == "item");
				}
			}

			if(view.config.menuFilter)
				res =  res && view.config.menuFilter(obj);

			return res;
		});

		if(menu.count() && context.id){
			webix.UIManager.setFocus(this);
			var sel = this.getSelectedId();
			var found = false;
			if(webix.isArray(sel)){
				for(var i =0; !found && i < sel.length; i++){
					if(""+sel[i] == ""+context.id)
						found = true;
				}
			}
			if(!found && this.exists(context.id))
				this.select(context.id);
		}

		return menu.count()>0;
	});

	cell.attachEvent("onAfterMenuShow", function (id) {
		if(id){
			var selected = this.getSelectedId(true);
			var isSelected = false;
			for (var i = 0; ( i < selected.length) && !isSelected; i++) {
				if (selected[i].toString() == id.toString()) {
					isSelected = true;
				}
			}
			if (!isSelected)
				this.select(id.toString());

			webix.UIManager.setFocus(this);
		}
		else{
			this.unselect();
		}
	});
}
function setCellHandlers(view, cell){

	cell.attachEvent("onAfterSelect", (id) => {
		if(view.getItem(id))
			view.callEvent("onItemSelect",[id]);
	});

	// double-click handlers
	cell.attachEvent("onItemDblClick", function(id) {
		view._onFileDblClick(id);
	});

	// focus and blur styling
	view._addElementHotKey("tab", function(cell){
		if (!cell.getSelectedId()) {
			var id = cell.getFirstId();
			if (id){
				cell.select(id);
			}
		}
	},cell);
	cell.attachEvent("onFocus", function(){
		view._activeView = this;
		webix.html.removeCss(this.$view, "webix_blur");
	});
	cell.attachEvent("onBlur", function() {
		if (!view.getMenu() || !view.getMenu().isVisible())
			webix.html.addCss(cell.$view, "webix_blur");
	});

	// editing (rename)
	cell.attachEvent("onBeforeEditStop", function (state, editor) {
		return this.getTopParentView().callEvent("onBeforeEditStop", [editor.id || editor.row, state, editor, this]);
	});
	cell.attachEvent("onAfterEditStop", function (state, editor) {
		var view = this.getTopParentView();
		if (view.callEvent("onAfterEditStop", [editor.id || editor.row, state, editor, this])) {
			if(!editor.column || editor.column == "value")
				view.renameFile(editor.id || editor.row, state.value);
			else if(editor.column){
				view.getItem(editor.id || editor.row)[editor.column] = state.value;
			}
		}
	});

	// drag-n-drop
	cell.attachEvent("onBeforeDrop", function (context) {
		if (view.callEvent("onBeforeDrop", [context])) {
			if (context.from) {    //from different component
				view.moveFile(context.source, context.target);
			}
		}
		return false;
	});
	cell.attachEvent("onBeforeDrag", function (context, e) {
		return !view.config.readonly&&view.callEvent("onBeforeDrag", [context, e]);
	});
	cell.attachEvent("onBeforeDragIn", function (context, e) {
		return !view.config.readonly&&view.callEvent("onBeforeDragIn", [context, e]);
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
			if (id0)
				sview.select(id0);
		}
	}, cell);


}