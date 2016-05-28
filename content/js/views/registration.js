RegistrationView = Class.extend(View, {
    initialize: function(){
        this.template = 'registration';
    },
    events: {
        registerVehicle: function(el){
            var race_id = VIEWS.registration.data.id;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            LITAPP.ajax('PUT', '/vehicle/'+vehicle_id, {"race_id": race_id}, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        unregisterVehicle: function(el){
            var race_id = 0;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            LITAPP.ajax('PUT', '/vehicle/'+vehicle_id, {"race_id": race_id}, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        editRaceState: function(el){
            var race_id = VIEWS.registration.data.id;
            var state = el.attr("data-state");
            LITAPP.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.showPreviousView();
                });
            });
        },
        editVehicle: function(el){
            app.showView(VIEWS.vehicle, app.findVehicle(el.closest("[data-id]").attr("data-id")));
        },
        removeVehicle: function(el){
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            LITAPP.ajax('DELETE', '/vehicle/'+vehicle_id, null, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
    }
});

VIEWS.registration = new RegistrationView();