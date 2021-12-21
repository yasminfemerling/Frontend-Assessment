$(document).ready(function() {

	//Getting the table ready
	var table = $('#countries-table').DataTable({
		"drawCallback": function(settings, json) {
			document.getElementById("loadCols").hidden = false;
			document.getElementById("reloadingCols").hidden = true;
		},
		"bSmart":true,
		ajax: {
			url: 'https://restcountries.com/v3.1/all',
			dataSrc: ""
		},
		"columns": [
			{
				data: null,
				"render": function(row) {
					return row.name.official
				}
			},
			{ data: "capital" },
			{ data: "region" },
			{
				data: "languages",
				"render": function(list) {
					return '<a class="language-control" href="#">View Languages</a>';
				}
			},
			{ data: "population" },
			{
				data: "flags",
				"render": function(flag) {
					return '<img src="' + flag.png + '" />';
				}
			},
		],
		"columnDefs": [{
			"targets": '_all',
			"defaultContent": ""
		}],

		"order": [[0, "asc"]]
	})

	// Funcion para delete usuarios proveedor
	$('#countries-table tbody').on('click', 'td.a', 'tr', function(event) {

		event.preventDefault();
		alert('lala')
		var data = table.row($(this)).data();
		var result = [];
		for (var key in list) {
			result.push(list[key]);
		}
		var html_list = result.map(elem => '<li>${elem}</li>').join('')
		bootbox.alert('<ul>' + html_list + '</ul>' );
		
	});
	
	//Function to display Wikipedia summary when clicking any row
	$('#countries-table tbody').on('click', 'tr', function(e) {
		var data = table.row($(this)).data();
		var cell=$(e.target).closest('td');
		if( cell.index()==3){
			var result = [];
			for (var key in data.languages) {
				result.push(data.languages[key]);
			}
			var html_list = result.length > 0 ? result.sort().map(elem => '<li>'+elem+'</li>').join('') : 'No Languages Available';
			bootbox.alert({title:'Languages', message:'<ul>' + html_list + '</ul>' });
		}else{
			$.getJSON('https://en.wikipedia.org/api/rest_v1/page/summary/'+data.name.official)
				.done(function(json) {
					bootbox.alert(json.extract_html);
				})
				.fail(function(jqxhr, textStatus, error) {
					bootbox.alert("Not able to load results!");
					console.log("Request Failed: " + err);
				});
		}
	});
	
	var searchFun = function(){
		var index =parseInt($('#columnSel').val(),10);
		var sVal =$('#searchBox').val();
		alert(index)
		if (index>0){
			table
				.column(index)
				.search(sVal,true,true)
				.draw(); 	
				
		}else{
			table
				.columns()
				.search(sVal,true,true)
				.draw();
		
		}
	}
	
	$('#searchBox').on('keyup change', function() {
		 var val = $(this).val().trim();
         val = val.replace(/\s+/g, '');
         if(val.length > 2) {   
			searchFun();
		} 
	});
	
	$('#searchBtn').on('click',function(){
		searchFun();
	});
	
	$('#loadCols').on('click',function(){
		document.getElementById("loadCols").hidden = true;
		document.getElementById("reloadingCols").hidden = false;
		table.ajax.reload();
	});

});