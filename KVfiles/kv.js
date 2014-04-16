$(function() {

	$('#actualTabs a[href="#nameList"]').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
		});

	$('#actualTabs a[href="#freedomList"]').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
		});

  });

