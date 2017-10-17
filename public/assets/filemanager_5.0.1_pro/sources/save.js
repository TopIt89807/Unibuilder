export function makeSaveRequest(view, url,obj,callback){
	if(view.callEvent("onBeforeRequest",[url, obj])){
		showSaveMessage(view);
		if(url.load){
			var rCallback = {
				success: function(text,response){
					var data = view.data.driver.toObject(text, response);
					hideSaveMessage(view);
					if(view.callEvent("onSuccessResponse",[obj,data]) && callback){
						callback.call(view,obj,data);
					}
				},
				error: function(result){
					if(view.callEvent("onErrorResponse", [obj,result])){
						errorHandler(view, result);
					}
				}
			};
			url.load(null, rCallback, webix.copy(obj));
		}
	}
}

function showSaveMessage(view, message){
	view._saveMessageDate = new Date();
	if (!view._saveMessage){
		view._saveMessage = webix.html.create("DIV",{ "class":"webix_fmanager_save_message"},"");
		view.$view.style.position = "relative";
		webix.html.insertBefore(view._saveMessage, view.$view);
	}
	var msg = "";
	if (!message) {
		msg = webix.i18n.filemanager.saving;
	} else{
		msg = webix.i18n.filemanager.errorResponse;
	}

	view._saveMessage.innerHTML = msg;
}

function hideSaveMessage(view){
	if (view._saveMessage){
		webix.html.remove(view._saveMessage);
		view._saveMessage = null;
	}
}

export function errorHandler(view){
	// reload data on error response
	var url = view.data.url;
	if(url){
		var driver = view.data.driver;
		showSaveMessage(view, true);

		webix.ajax().get(url, {success:function(text, response){
			var data = driver.toObject(text, response);
			if (data){
				data = driver.getDetails(driver.getRecords(data));
				view.clearAll();
				view.parse(data);
				view.data.url = url;
			}
		},error:function(){}});
	}
}