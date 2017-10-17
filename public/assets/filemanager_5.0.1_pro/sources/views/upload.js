import * as save from "../save.js";

function getConfig(legacy){
	var config = {};
	if (legacy){
		config = {
			view: "uploader",
			css: "webix_upload_select_ie",
			type: "iconButton",
			icon:"check",
			label: webix.i18n.filemanager.select,
			formData:{ action:"upload" },
			urlData:{}
		};
	}
	else{
		config = {
			view:"uploader",
			apiOnly:true,
			formData:{ action:"upload" },
			urlData:{}
		};
	}
	return config;
}

export function init(view){
	var legacy = view.config.legacyUploader;
	var config = getConfig(legacy);

	if(config){
		if (legacy){
			createFlashUploader(view, webix.copy(config));
		}
		else{
			view._uploader = webix.ui(config);
			view.attachEvent("onDestruct", function(){
				view._uploader.destructor();
			});
		}
	}
	setUploadHandlers(view);
}



function setUploadHandlers(view){
	var uploader = getUploader(view);
	if(uploader){
		// define url
		uploader.config.upload = view.config.handlers.upload;
		// add drop areas
		var modes = view.config.modes;
		if(modes && !view.config.readonly){
			for(var i =0; i < modes.length; i++){
				if(view.$$(modes[i]))
					uploader.addDropZone(view.$$(modes[i]).$view);
			}
		}

		// handlers
		uploader.attachEvent("onBeforeFileAdd",function(file){
			var target = ""+getUploadFolder(view);

			uploader.config.formData.target = target;
			uploader.config.urlData.target = target;

			return view.callEvent("onBeforeFileUpload",[file]);
		});
		uploader.attachEvent("onAfterFileAdd", function(file){
			view._uploaderFolder = null;
			file.oldId = file.id;
			view.add({
				"id"   : file.id,
				"value": file.name,
				"type" : file.type,
				size   : file.size,
				date   : Math.round((new Date()).valueOf()/1000)
			}, -1, uploader.config.formData.target);

			if(view.config.uploadProgress){
				view.showProgress(view.config.uploadProgress);
			}
			view._refreshActiveFolder();
		});

		uploader.attachEvent("onUploadComplete",function(file){
			if(view._uploadPopup){
				view.getMenu().hide();
				view._uploadPopup.hide();
			}
			view.hideProgress();
			view.callEvent("onAfterFileUpload",[file]);
		});
		uploader.attachEvent("onFileUpload",function(item){
			if(item.oldId)
				view.data.changeId(item.oldId,item.id);
			if(item.value)
				view.getItem(item.id).value = item.value;

			view.getItem(item.id).type = item.type;
			view._refreshActiveFolder();
		});
		uploader.attachEvent("onFileUploadError",function(item, response){
			save.errorHandler(view, response);
			view.hideProgress();

		});
	}
}

function createFlashUploader(view, config){
	if(!config){
		config = getConfig(view.config.legacyUploader);
	}
	view._uploadPopup = webix.ui({
		view:"popup",
		padding:0,
		width:250,
		body: config
	});
	view._uploader = view._uploadPopup.getBody();
	view.attachEvent("onDestruct", function(){
		view._uploadPopup.destructor();
	});
}

function getUploadFolder(view){
	return 	view._uploaderFolder||view.getCursor();
}

export function getUploader(view){
	return 	view._uploader;
}

export function uploadFile(view,id,e){

	if(!view.data.branch[id] && view.getItem(id).type != "folder"){
		id = view.getParentId(id);
	}

	view._uploaderFolder = id;
	if(view._uploadPopup){
		view._uploadPopup.destructor();
		createFlashUploader(view);
		setUploadHandlers(view);
		view._uploadPopup.show(e,{x:20,y:5});
	}
	else{
		if(view._uploader)
			view._uploader.fileDialog();
	}
}