PhaseRegistrationView = Class.extend(View, {
    initialize: function(){
        this.template = 'phase_registration';
        this.name = 'Anmeldephase';
    },
    events: {
        registerVehicle: function(el){
            var race_id = VIEWS.phase_registration.data.id;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('PUT', '/vehicle/'+vehicle_id, {"race_id": race_id}, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        unregisterVehicle: function(el){
            var race_id = 0;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('PUT', '/vehicle/'+vehicle_id, {"race_id": race_id}, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        editRaceState: function(el){
            var race_id = VIEWS.phase_registration.data.id;
            var state = el.attr("data-state");
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.showPreviousView();
                });
            });
        },
        editVehicle: function(el){
            app.showView(VIEWS.form_vehicle, app.findVehicle(el.closest("[data-id]").attr("data-id")));
        },
        removeVehicle: function(el){
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/vehicle/'+vehicle_id, null, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        }
    }
});

VIEWS.phase_registration = new PhaseRegistrationView();