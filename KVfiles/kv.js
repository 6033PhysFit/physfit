$(function() {

    // activaTab('freedomList');
    //  $('.tabs').bind('change', function (e) {
    //     // e.target is the new active tab according to docs
    //     // so save the reference in case it's needed later on
    //     window.activeTab = e.target;
    //     // display the alert
    //     alert("hello");
    //     // Load data etc
    // });

	$('#actualTabs a[href="#nameList"]').click(function (e) {
		  e.preventDefault();
		  console.log("nameList");
		  $(this).tab('show');
		});

	$('#actualTabs a[href="#freedomList"]').click(function (e) {
		  e.preventDefault();
		  console.log("freedomList");
		  $(this).tab('show');
		});
  });

function activaTab(tab){
	console.log(tab);
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};