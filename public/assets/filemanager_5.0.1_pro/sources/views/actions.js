function getData(){
	return [
		{id: "copy", batch: "item", method: "markCopy",  icon: "fm-copy", value: webix.i18n.filemanager.copy},
		{id: "cut", batch: "item", method: "markCut", icon: "fm-cut", value: webix.i18n.filemanager.cut},
		{id: "paste",  method: "pasteFile", icon: "fm-paste", value: webix.i18n.filemanager.paste},
		{ $template:"Separator" },
		{id: "create", method: "createFolder", icon: "fm-folder", value: webix.i18n.filemanager.create},
		{id: "remove", batch: "item", method: "deleteFile", icon: "fm-delete", value: webix.i18n.filemanager.remove},
		{id: "edit", batch: "item", method: "editFile",  icon: "fm-edit", value: webix.i18n.filemanager.rename},
		{id: "upload", method: "uploadFile", event:"UploadDialog", icon: "fm-upload", value: webix.i18n.filemanager.upload}
	];
}

export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

	var templateName = view.config.templateName;
	var data = getData();


	var popup = {
		view: "filemenu",
		id:"actions",
		width: 200,
		padding:0,
		autofocus: false,
		css: "webix_fmanager_actions",
		template: function(obj,common){
			var name = templateName(obj,common);
			var icon = obj.icon.indexOf("fm-") == -1?"fa-"+obj.icon:obj.icon;
			return "<span class='webix_fmanager_icon "+icon+"'></span> "+name+"";
		},
		data: data
	};


	view.callEvent("onViewInit", ["actions", popup]);
	view._contextMenu = view.ui(popup);
	view.attachEvent("onDestruct",function(){
		view._contextMenu.destructor();
	});
}

function ready(view){
	var menu = view.getMenu();
	if(menu){
		menu.attachEvent("onItemClick",function(id,e){
			var obj = this.getItem(id);
			var method = view[obj.method]||view[id];
			if(method){
				var active = view.getActive();
				if(view.callEvent("onbefore"+(obj.event||obj.method||id),[active])){
					if(!(id=="upload" && view.config.legacyUploader)){
						if(view._uploadPopup)
							view._uploadPopup.hide();
						menu.hide();
					}
					var args = [active];
					if(id=="upload"){
						e = webix.html.pos(e);
						args.push(e);
					}
					webix.delay(function(){
						method.apply(view,args);
						view.callEvent("onafter"+(obj.event||obj.method||id),[]);
					});

				}

			}
		});
		menu.attachEvent("onBeforeShow",function(e){
			menu.filter("");
			menu.hide();
			var c = menu.getContext();

			//context menu over empty area 
			if(c && c.obj && !c.id)
				c.obj.unselectAll();
			
			if(c && c.obj)
				return c.obj.callEvent("onBeforeMenuShow",[c.id,e]);

			return true;
		});

	}
}
