export function init(view){
	view._cursorHistory = webix.extend([],webix.PowerArray,true);
	view.$ready.push(()=>setHandlers(view));
}

function setHandlers(view){
	view.attachEvent("onAfterLoad",function(){
		if(!view.config.disabledHistory){
			var state = window.location.hash;
			if (state && state.indexOf("#!/") === 0){
				view.setPath(state.replace("#!/",""));
			}
		}
	});

	view.attachEvent("onAfterCursorChange", function(id){
		if(!view._historyIgnore){
			if(!view._historyCursor )
				view._cursorHistory.splice(1);
			if(view._cursorHistory[this._historyCursor] != id){
				if(view._cursorHistory.length==20)
					view._cursorHistory.splice(0,1);
				view._cursorHistory.push(id);
				view._historyCursor = this._cursorHistory.length-1;
			}
		}
		view._historyIgnore = false;
		if(!view.config.disabledHistory)
			pushHistory(view, id);
		view.callEvent("onHistoryChange",[id, view._cursorHistory,view._historyCursor]);
	});
}

function pushHistory(view,path){
	path = path||view.getCursor();

	if(window.history && window.history.replaceState){
		window.history.replaceState({ webix:true, id:view.config.id, value:path }, "", "#!/"+path);
	}
	else{
		window.location.hash =  "#!/"+path;
	}
}

export function changeCursor(view, step){
	if(view._cursorHistory.length>1){
		var index = view._historyCursor + step;
		if(index>-1 && index < view._cursorHistory.length){
			view._historyIgnore = true;
			view._historyCursor = index;
			view.setCursor(view._cursorHistory[index]);
		}
	}
	return view.getCursor();
}