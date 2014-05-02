var appt_id;
var appts = {};
var view_date;
var start_hour;
var end_hour;
var patientInfo = [];
//NOTE appointment is for Parse, Appointment is for internal array until Parse fully implemented
var appointment;
var Patient;
$(document).ready(function(){
    Parse.initialize("KTPQvAC5MnRTfoPJfqtOq1HS5zQy5OomLrRVmkH0", "UcT9MFG78hnKlgVz94FEolxdmJ63xyy1ZG9TTo10");
    appointment = Parse.Object.extend("Appointment");

    Patient = Parse.Object.extend("Patient");
    var query = new Parse.Query(Patient);

    query.exists("Name");

    query.find({
        success: function(results) {
            results.forEach(function(patient) {
                patientInfo.push([patient.id, patient.get("Name"), patient.get("Conditions"), patient.get("Summary")]);
            });
            var patientNameList = document.getElementById("patientNameList");
            for (var i=0; i<patientInfo.length; i++) {
                console.log(patientInfo[i]);
                var newListItem = document.createElement("li");
                var newLinkItem = document.createElement("a");
                newLinkItem.href="#";
                newListItem.className = newListItem.className+" list-group-item patient";
                var newListValue = document.createTextNode(patientInfo[i][1]);
                newLinkItem.appendChild(newListValue);
                newListItem.appendChild(newLinkItem);
                patientNameList.appendChild(newListItem);
                newListItem.onclick = function() {
                    $("#starting_patient_view").css("visibility", "hidden");
                    $("#letterman_patient_view").css("visibility", "visible");
                }
            }
        }
    });
appt_id = 0;
start_hour = 9;
end_hour = 17;
_put_hours_list(start_hour, end_hour);

    //Add tabs Listeners
    $('#actualTabs a[href="#nameList"]').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
  });

    $('#actualTabs a[href="#freedomList"]').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
  });

    $('#popovergoddamit').popover('hide');

    // set view date to current
    view_date = new Date();
    var date_str = $.datepicker.formatDate('yy/mm/dd', view_date);

    // placeholder "database" = appts
    appts[0] = new Appointment('ch', date_str, 10, 'Jeffrey Sun', 'Broken bone');
    appts[1] = new Appointment('ev', date_str, 11, 'Keertan Kini', 'Running exercises');
    appts[2] = new Appointment('hon', date_str, 12, 'Ashley Smith', 'Stretches');
    appts[3] = new Appointment('hof', date_str, 10, 'Vynnie Kong', 'Weights');
    appts[4] = new Appointment('me', date_str, 11, 'Keertan Kini', 'Progress Report');
    appts[5] = new Appointment('me', '2014/04/16', 11, 'Jeffrey Sun', 'Progress Report');
    appts[6] = new Appointment('me', '2014/04/25', 11, 'Ashley Smith', 'Progress Report');
    appts[7] = new Appointment('me', '2014/04/27', 11, 'Vynnie Kong', 'Progress Report');
    // appts[8] = new Appointment('me', '2014/04/02', 11, 'David', 'Progress Report');
    // appts[9] = new Appointment('me', '2014/03/27', 11, 'David', 'Progress Report');
    
    // put appts into sheet
    _draw_date(date_str);

    $("#today").click(function(){
        set_day($.datepicker.formatDate('yy/mm/dd', new Date()));
    });
    $("#prev_day").click(prev_day);
    $("#next_day").click(next_day);

    $("#calendar_icon").datepicker({
        buttonImage: 'calendar_icon.png',
        buttonImageOnly: true,
        dateFormat: 'yy/mm/dd',
        showOn: 'both',
    });
    $("#calendar_icon").change(function(){
        set_day($("#calendar_icon").val());
    });

    $("#view_date").text(date_str);
    $("#add_appt").click(_lightbox_new);

    $("#date425").click(function(){
        _lightbox_appt(appts[6]);
    });
    $("#date427").click(function(){
        _lightbox_appt(appts[7]);
    });
    $("#date42").click(function(){
        _lightbox_appt(appts[8]);
    });
    $("#date327").click(function(){
        _lightbox_appt(appts[9]);
    });
});


// insert a certain appointment appt into the DOM
var insert_appt = function(appt){
    var apptElement = $("<div id='appt"+appt.appt_id+"' class='appt_elem'>");
    apptElement.html(appt.to_string());
    if(appt.kind == "ch"){
        apptElement.prepend($("<span class='appt_icon glyphicon glyphicon-ok'></span>"));
    } else if(appt.kind == "ev"){
        apptElement.prepend($("<span class='appt_icon glyphicon glyphicon-list-alt'></span>"));
    } else if(appt.kind == "hon"){
        apptElement.prepend($("<span class='appt_icon glyphicon glyphicon-thumbs-up'></span>"));
    } else if(appt.kind == "hof"){
        apptElement.prepend($("<span class='appt_icon glyphicon glyphicon-ban-circle'></span>"));
    } else if(appt.kind == "me"){
        apptElement.prepend($("<span class='appt_icon glyphicon glyphicon-user'></span>"));
    }
    apptElement.addClass(appt.kind);
    $("#hour"+appt.hour).append($("<li>").append(apptElement));

    // attach popup handler
    apptElement.click(function(){
        _lightbox_appt(appt);
    });
}

var next_day = function(){
    view_date.setTime(view_date.getTime() + (24 * 60 * 60 * 1000));
    var date_str = $.datepicker.formatDate('yy/mm/dd', view_date);
    _draw_date(date_str);
}

var prev_day = function(){
    view_date.setTime(view_date.getTime() - (24 * 60 * 60 * 1000));
    var date_str = $.datepicker.formatDate('yy/mm/dd', view_date);
    _draw_date(date_str);
}

var set_day = function(date){
    view_date.setTime(Date.parse(date));
    var date_str = $.datepicker.formatDate('yy/mm/dd', view_date);
    _draw_date(date_str);
}

// create object from appointment parameters
// kind = type of appointment
// date = current date in 'yyyy/mm/dd' format
// hour = hour of appointment
// patient_name = patient's name
// notes = notes for that appointment
// returns: Appointment object

var Appointment = function(kind, date, hour, patient_name, notes){
    this.kind = kind;
    this.date = date;
    this.hour = hour;
    this.patient_name = patient_name;
    this.notes = notes;
    this.appt_id = appt_id;
    this.to_string = function(){
        var s = "<span>";
        if(this.kind == "ch"){
            s += "Check-In";
        } else if(this.kind == "ev"){
            s += "Evaluation";
        } else if(this.kind == "hon"){
            s += "Hands-On";
        } else if(this.kind == "hof"){
            s += "Hands-Off";
        } else if(this.kind == "me"){
            s += "Meeting";
        } else {
            s += "Other";
        }

        s += "</span><div>" + this.patient_name + "</div>";
        return s;
    }

    // INSERT INTO DATABASE
    appts[appt_id] = this;
    appt_id += 1;
}

var _draw_date = function(date_str){
    $("#view_date").text(date_str);
    $(".appt_elem").parent().remove();

    for(var appt in appts){
        if(appts[appt].date == date_str){
            insert_appt(appts[appt]);
        }
    }
    var today = $.datepicker.formatDate('yy/mm/dd', new Date());
    if(date_str == today){
        $("#today").addClass('disabled');
    } else {
        $("#today").removeClass('disabled');
    }
}

// given time i, return hour with AM or PM
// i = integer (0-23)
// returns: string with time in AM/PM
var _readable_hour = function(i){
    if(i == 0){
        return "12 AM";
    } else if(i < 12){
        return i+" AM";
    } else if(i == 12){
        return "12 PM"
    } else {
        return (i-12)+" PM";
    }
}

// Draws the hours list in the calendar view.
// start = earliest hour desired to view (0-23)
// end = latest hour desired to view (0-23)

var _put_hours_list = function(start, end){
    var hour_ul = $("<ul id='schedule_view'>");
    for(var i=start;i<end;i++){
        hour_ul.append(_make_hour_element(i));
    }
    $("#calendar_view").append(hour_ul);
}

// Draw row for hour given by integer i
var _make_hour_element = function(i){
    var hour_div = $("<div class='row hour_row'>");
    hour_div.id = 'hour_'+i;

    hour_label = $("<label class='label' style='font-size:10px'>"+_readable_hour(i)+"</label>");

    var hour_inner_ul = $("<ul class='hour_inner' id='hour"+i+"' style='height:100%;'>");

    hour_div.prepend($("<div class='span1 hour_label'>").append(hour_label));
    hour_div.append(hour_inner_ul);
    return hour_div;
}

function _generate_timepicker(start, end, curr){
    var s = "<select id='timepicker'>";
    for(var i=start;i<end;i++){
        if(i == curr){
            s += "<option value='"+i+"' selected='selected'>"+_readable_hour(i)+"</option>";
        } else {
            s += "<option value='"+i+"'>"+_readable_hour(i)+"</option>";
        }
    }
    s += "</select>";
    return s;
}


// display the lightbox for a certain Appointment object appt

// TO DO: remove appt
function _lightbox_appt(appt){

    var content = $("<div id='innerbox' />");
    content.append($("<div id='lightbox_title'>"+appt.patient_name+"'s Appointment<div id='lightbox_cancel' style='float:right;color:red;cursor:pointer'><b>X</b></div></div>"));
    content.append($("<br>"));
    content.append($("<div id='lightbox_date'><b>Date:</b> <input id='datepicker' type='text' value='"+appt.date+"'></input></div>"));
    content.append($("<div id='lightbox_time'><b>Time:</b>"+
        _generate_timepicker(start_hour, end_hour, appt.hour)+
        "</div>"));
    content.append($("<div id='lightbox_kind'><b>Type:</b> "+
        "<select id='lightbox_selected'>"+
        "<option value='ch'>Check-In</option>"+
        "<option value='ev'>Evaluation</option>"+
        "<option value='hon'>Hands-On</option>"+
        "<option value='hof'>Hands-Off</option>"+
        "<option value='me'>Meeting</option>"+
        "</select>"+
        "</div>"));

    content.append($("<div id='lightbox_notes'><b>Notes:</b></div>"+
        "<div><textarea id='lightbox_input'>"+appt.notes+"</textarea></div>"
        ));

    var button_div = $("<div id='lightbox_buttons' />");
    button_div.append($("<button id='lightbox_remove' class='btn btn-danger'>Remove</button>"));
    button_div.append($("<button id='lightbox_save' class='btn btn-primary'>Save</button>"));

    content.append(button_div);

    _lightbox(content, 50);

    $('#datepicker').datepicker({ dateFormat: 'yy/mm/dd' })
    $("#lightbox_selected").val(appt.kind); // set default to appt's current type

    $("#lightbox_cancel").click(_closeLightbox);

    $("#lightbox_remove").click(function(){
        // TO DO: (Insert backend call to delete appointment)
        _draw_date($.datepicker.formatDate('yy/mm/dd', view_date)); // redraw calendar
        _closeLightbox();
    });

    // TODO: Save appointment with parse
    $("#lightbox_save").click(function(){
        appt.kind = $('#lightbox_selected').val();
        appt.date = $('#datepicker').val();
        appt.hour = $('#timepicker').val();
        appt.notes = $("#lightbox_input").val();
        _draw_date($.datepicker.formatDate('yy/mm/dd', view_date));
        _closeLightbox();
    });
}

function _lightbox_new(){
    var content = $("<div id='innerbox' />");
    content.append($("<div id='lightbox_title'>Create a New Appointment<div id='lightbox_cancel' style='float:right;color:red;cursor:pointer'><b>X</b></div></div>"));
    content.append($("<br>"));
    content.append($("<div id='lightbox_name'><b>Name:</b> <input id='namepicker' type='text'></input></div>"));

    content.append($("<div id='lightbox_date'><b>Date:</b> <input id='datepicker' type='text' value='"+$.datepicker.formatDate('yy/mm/dd', view_date)+"'></input></div>"));
    content.append($("<div id='lightbox_time'><b>Time:</b>"+
        _generate_timepicker(start_hour, end_hour)+
        "</div>"));
    content.append($("<div id='lightbox_kind'><b>Type:</b> "+
        "<select id='lightbox_selected'>"+
        "<option value='ch'>Check-In</option>"+
        "<option value='ev'>Evaluation</option>"+
        "<option value='hon'>Hands-On</option>"+
        "<option value='hof'>Hands-Off</option>"+
        "<option value='me'>Meeting</option>"+
        "</select>"+
        "</div>"));



    content.append($("<div id='lightbox_notes'><b>Notes:</b></div>"+
        "<div><textarea id='lightbox_input'></textarea></div>"
        ));

    var button_div = $("<div id='lightbox_buttons' />");
    button_div.append($("<button id='lightbox_save' class='btn btn-primary'>Save</button>"));

    content.append(button_div);

    // draw on screen
    _lightbox(content, 50);

    $('#datepicker').datepicker({ dateFormat: 'yy/mm/dd' });


    $("#lightbox_cancel").click(_closeLightbox);
    // TODO: Save appointment with parse
    $("#lightbox_save").click(function(){

       if(($("#namepicker").val() == "") || ($("#timepicker").val() == "")){
        content.append($('<div class="alert">'+
            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
            '<strong>Error:</strong> Please fill in all fields. Thanks!'+
            '</div>'));
    } else {
        var new_appt = new Appointment($('#lightbox_selected').val(),
            $('#datepicker').val(),
            $("#timepicker").val(),
            $("#namepicker").val(),
            $("#lightbox_input").val());

        _draw_date($.datepicker.formatDate('yy/mm/dd', view_date));
        _closeLightbox();

        // TODO: (BACKEND) INSERT APPT BACKEND
        _lightbox($("<div style='text-align: center'>You've added an appointment for "+
            new_appt.patient_name+
            " at "+
            _readable_hour(new_appt.hour)+
            " on "+
            new_appt.date+
            "!</div>"), 5);
    }

});

}

// display the lightbox for a certain jQuery DOM element content
// content = DOM element
// top = px from top
function _lightbox(content, top){

    // add lightbox/shadow <div/>'s if not previously added
    if($('#lightbox').size() == 0){
        var theLightbox = $('<div id="lightbox"/>');
        var theShadow = $('<div id="lightbox-shadow"/>');
        $(theShadow).click(function(e){
            _closeLightbox();
        });
        $('body').append(theShadow);
        $('body').append(theLightbox);
    }

    // remove any previously added content
    $('#lightbox').empty();

    $('#lightbox').append(content);

    // move the lightbox to the current window top + 100px
    //$('#lightbox').css('top', top + 'px');
    $('#lightbox').css('top', '100px');

    // display the lightbox
    $('#lightbox').show();
    $('#lightbox-shadow').show();

}

// close the lightbox
function _closeLightbox(){

    // hide lightbox and shadow <div/>'s
    $('#lightbox').hide();
    $('#lightbox-shadow').hide();

    // remove contents of lightbox in case a video or other content is actively playing
    $('#lightbox').empty();
}