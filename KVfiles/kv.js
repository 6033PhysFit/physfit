$(function() {

    activaTab('nameList');
    //  $('.tabs').bind('change', function (e) {
    //     // e.target is the new active tab according to docs
    //     // so save the reference in case it's needed later on
    //     window.activeTab = e.target;
    //     // display the alert
    //     alert("hello");
    //     // Load data etc
    // });
  });

function activaTab(tab){
	console.log(tab);
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};