export const values = {
	modes: ["files","table"],
	mode: "table",
	handlers: {},
	structure:{},
	fsIds: true,
	templateName: webix.template("#value#"),
	templateSize: function(obj){
		var value = obj.size;
		var labels = webix.i18n.filemanager.sizeLabels;
		var pow = 0;
		while(value/1024 >1){
			value = value/1024;
			pow++;
		}
		var isInt = (parseInt(value,10) == value);

		var format = webix.Number.numToStr({
			decimalDelimiter:webix.i18n.decimalDelimiter,
			groupDelimiter:webix.i18n.groupDelimiter,
			decimalSize : isInt?0:webix.i18n.groupSize
		});

		return format(value)+""+labels[pow];
	},
	templateType: function(obj){
		var types = webix.i18n.filemanager.types;
		return types&&types[obj.type]?types[obj.type]:obj.type;
	},
	templateDate: function(obj){
		var date = obj.date;
		if(typeof(date) != "object"){
			date = new Date(parseInt(obj.date,10)*1000);
		}
		return webix.i18n.fullDateFormatStr(date);
	},
	templateCreate: function(){
		return {value: "newFolder", type: "folder", date: new Date()};
	},
	templateIcon: function(obj,common){
		return "<div class='webix_fmanager_icon fm-"+(common.icons[obj.type]||common.icons.file)+"'></div>";
	},
	uploadProgress: {
		type:"icon",
		hide:false
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