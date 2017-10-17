export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	return {
		width: 251,
		view: "filetree",
		id: "tree",
		select: true,
		filterMode:{
			showSubItems:false,
			openParents:false
		},
		type: "FileTree",
		navigation: true,
		editor:"text",
		editable: true,
		editaction: false,
		drag: true,
		tabFocus: true,
		onContext:{}
	};
}

function ready(view){
	var tree = view.$$("tree");
	var state;

	if(tree){


		tree.type.icons = view.config.icons;

		// data source definition (syncing with main data source)
		tree.sync(view,function(){
			this.filter(function(obj){

				return (obj.$count||obj.type=="folder");
			});
		});

		tree.on_click.webix_tree_child_branch = function(ev, id){
			var url = view.config.handlers.branch;
			if(url){
				view.loadDynData(url, this.getItem(id), "branch", true);
			}
		};

		view.attachEvent("onBeforeDynParse", function(){
			state = tree.getState();
		});

		view.attachEvent("onAfterDynParse", function(obj,data,mode){
			if(state){
				tree.setState(state);
				state = null;
			}
			if(mode == "branch" && obj.open){
				tree.open(obj.id);
			}
		});

		tree.attachEvent("onAfterSelect", function(id){
			view.callEvent("onFolderSelect",[id]);
		});

		view.attachEvent("onAfterCursorChange", function(id){
			if (id){
				tree.select(id);
				tree.showItem(id);
			}
		});

		// hide search results on click
		tree.attachEvent("onItemClick",function(){
			if(view.$searchResults){
				view.hideSearchResults();
			}
		});

		view.attachEvent("onItemRename", function(id){
			tree.refresh(id);
		});

		// open/close on double-click
		tree.attachEvent("onItemDblClick",function(id){
			if(this.isBranchOpen(id)){
				this.close(id);
			}
			else{
				this.open(id);
			}
		});

		tree.attachEvent("onBlur",function(){
			if(!view.getMenu()||!view.getMenu().isVisible()){
				webix.html.addCss(this.$view,"webix_blur");
			}
		});

		tree.attachEvent("onFocus",function(){
			view._activeView = tree;
			webix.html.removeCss(tree.$view,"webix_blur");
			// clear sub view selection
			view.$$(view.config.mode).unselect();
		});


		// setting path (history support)
		view.attachEvent("onPathComplete",function(id){
			tree.showItem(id);
		});

		// context menu
		if(!view.config.readonly){
			if(view.getMenu())
				view.getMenu().attachTo(tree);
			tree.attachEvent("onBeforeMenuShow",function(id){
				var menu = view.getMenu();

				var context = menu.getContext();
				var type = "";
				if (context.id && this.getParentId(context.id))
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
				this.select(id);
				webix.UIManager.setFocus(this);
				return menu.count()>0;
			});
		}

		// editing (rename)
		tree.attachEvent("onBeforeEditStop",function(state,editor){
			return view.callEvent("onBeforeEditStop",[editor.id,state,editor,tree]);
		});
		tree.attachEvent("onAfterEditStop",function(state,editor){
			if(view.callEvent("onAfterEditStop",[editor.id,state,editor,tree])){
				view.renameFile(editor.id,state.value);
			}
		});

		// drag-n-drop
		tree.attachEvent("onBeforeDrag",function(context,e){
			return !view.config.readonly&&view.callEvent("onBeforeDrag",[context,e]);
		});
		tree.attachEvent("onBeforeDragIn",function(context,e){
			return !view.config.readonly&&view.callEvent("onBeforeDragIn",[context,e]);
		});
		tree.attachEvent("onBeforeDrop",function(context,e){
			if(view.callEvent("onBeforeDrop",[context,e])){
				if (context.from){	//from different component
					view.moveFile(context.source, context.target);
					view.callEvent("onAfterDrop",[context,e]);
				}
			}
			return false;
		});

		// focus
		var setTreeCursor = function(){
			if(tree)
				webix.UIManager.setFocus(tree);
		};
		view.attachEvent("onAfterBack",setTreeCursor);
		view.attachEvent("onAfterForward",setTreeCursor);
		view.attachEvent("onAfterLevelUp",setTreeCursor);
		view.attachEvent("onAfterPathClick",setTreeCursor);

		// read-only mode
		if(view.config.readonly){
			tree.define("drag",false);
			tree.define("editable",false);
		}
	}
}