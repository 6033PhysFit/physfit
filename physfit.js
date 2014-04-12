// if (Meteor.isClient) {
//   Template.hello.greeting = function () {
//     return "Welcome to PhysFit.";
//   };

//   Template.hello.events({
//     'click input': function () {
//       // template data, if any, is available in 'this'
//       if (typeof console !== 'undefined')
//         console.log("You pressed the button");
//     }
//   });
// }

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });
// }

// Set up a collection to contain patient information. On the server,
// it is backed by a MongoDB collection named "patients".

Patients = new Meteor.Collection("patients");

if (Meteor.isClient) {
  Template.patientsList.patients = function () {
    // Players.find({}, {sort: {score: -1, name: 1}});
    return Patients.find({}, {sort: {name : 1, collection: -1}});
  };

  Template.patientsList.selected_name = function () {
    var patient = Patients.findOne(Session.get("selected_patient"));
    return patient && patient.name;
  };

  Template.patient.selected = function () {
    return Session.equals("selected_patient", this._id) ? "selected" : '';
  };

  // Template.patientsList.events({
  //   'click input.inc': function () {
  //     Patients.update(Session.get("selected_patient"), {$inc: {score: 5}});
  //   }
  // });

  Template.patient.events({
    'click': function () {
      Session.set("selected_patient", this._id);
    }
  });
}

// On server startup, create some Patients if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Patients.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      var conditions = ["Cancer",
                        "Stubbed toe",
                        "The new HTC One",
                        "Overenthusiastic personal life",
                        "Syphillis",
                        "Lack of friends"];
      for (var i = 0; i < names.length; i++)
        Patients.insert({name: names[i], condition: conditions[i]});
    }
  });
}

