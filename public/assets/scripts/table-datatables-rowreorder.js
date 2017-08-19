var TableDatatablesRowreorder = function () {

    var initTable1 = function () {
        var table = $('#sample_1');

        var oTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
                { extend: 'print', className: 'btn dark btn-outline' },
                { extend: 'pdf', className: 'btn green btn-outline' },
                { extend: 'csv', className: 'btn purple btn-outline ' },
            ],

            // setup rowreorder extension: http://datatables.net/extensions/rowreorder/
            columnDefs: [
                { orderable: true, className: 'reorder', targets: 0 },
                { orderable: false, targets: '_all' }
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });
    }

    var initTable2 = function () {
        var table = $('#sample_2');
        var oTable = table.dataTable({
            retrieve: true,
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            buttons: [
                { extend: 'print', className: 'btn red' },
                { extend: 'copy', className: 'btn green' },
                { extend: 'pdf', className: 'btn blue' },
                { extend: 'csv', className: 'btn default' },
            ],

            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            // setup rowreorder extension: http://datatables.net/extensions/rowreorder/

//            dom: 'C<"clear">RZlfrtip',

            "order": [
                [0, 'asc']
            ],

            "lengthMenu": [
                [20, 50, 75, 100, 250],
                [20, 50, 75, 100, 250] // change per page values here
            ],
            // set the initial value
            "pageLength": 50,

            "dom": "Z<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });
      }

    var initTable3 = function () {

        var table = $('#sample_3');
        var oTable = table.dataTable({
            retrieve: true,
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            //"dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
            //"dom": "<'row'<'col-xs-4'p><'col-xs-4'l>>t<'row'<'col-xs-4'p><'col-xs-4'l>>",
            "dom": "<'row'<'col-xs-6'p><'col-xs-6 dataTables_paginate'l>>t<'row'<'col-xs-6'p><'col-xs-6 dataTables_paginate'l>>",
            "pageLength": 20, // default records per page
            scrollY:        400,

            "lengthMenu": [
                [20, 50, 75, 100, 250],
                [20, 50, 75, 100, 250] // change per page values here
            ],
            "language": { // language settings
                // metronic spesific
                "metronicGroupActions": "_TOTAL_ records selected:  ",
                "metronicAjaxRequestGeneralError": "Could not complete request. Please check your internet connection",

                // data tables spesific
                "lengthMenu": "_MENU_ per pages",
                "info": "<span class='seperator'>|</span>Found total _TOTAL_ records",
                "infoEmpty": "No records found to show",
                "emptyTable": "No data available in table",
                "zeroRecords": "No matching records found",
                "paginate": {
                    "previous": "Prev",
                    "next": "Next",
                    "last": "Last",
                    "first": "First",
                    "page": "Page",
                    "pageOf": "of"
                }
            },

            "pagingType": "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
        });
    }

    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            initTable1();
            initTable2();
            initTable3();
        }

    };

}();

jQuery(document).ready(function() {
    TableDatatablesRowreorder.init();
});
