export function init(view){
	view.attachEvent("onComponentInit", () => ready(view));

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
		resizeColumn:true,
		tabFocus: true,
		onContext:{}
	};
}

function ready(view){
	if(view.$$("table")){
		view.attachEvent("onHideSearchResults", function(){
			if(view.$$("table").isColumnVisible("location"))
				view.$$("table").hideColumn("location");
		});
		view.attachEvent("onShowSearchResults", function(){
			if(!view.$$("table").isColumnVisible("location"))
				view.$$("table").showColumn("location");
		});

		view.$$("table").attachEvent("onBeforeEditStart", function(id){
			if(typeof(id) != "object"){
				this.edit({row:id,column: "value"});
				return false;
			}
			return true;
		});

		// sorting
		view.$$("table").data.attachEvent("onBeforeSort", function(by, dir, as, sort){
			view.sortState = {
				view:  view.$$("table").config.id,
				sort: sort
			};
			if(view.$searchResults && view.$$("search")){
				view.showSearchResults(view.$$("search").getValue());
				return false;
			}
		});
		view.data.attachEvent("onClearAll", function(){
			view.sortState = null;
		});
	}
}