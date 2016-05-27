AdminView = Class.extend(View, {
    initialize: function(){
        this.template = 'admin';
    },
    prepareView: function(data){
        data.races = app.data.races;
    },
    events: {
        addRace: function(){
            app.showView(VIEWS.race, {});
        },
        editRace: function(el){
            app.showView(VIEWS.race, app.findRace(el.closest("[data-id]").attr("data-id")));
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = el.closest("[data-id]").attr("data-id");
            LITAPP.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.refreshView();
                });
            });
        },
        addVehicle: function(){
            app.showView(VIEWS.vehicle, {});
        },
        editVehicle: function(el){
            app.showView(VIEWS.vehicle, app.findVehicle(el.closest("[data-id]").attr("data-id")));
        },
        registerVehicle: function(el){
            $('#registerVehicleModal').find("[name='vehicle_id']").val(el.closest("[data-id]").attr("data-id"));
            UIkit.modal('#registerVehicleModal').show();
        },
        unregisterVehicle: function(el){
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            var vehicle = app.findVehicle(vehicle_id);
            vehicle.race_id = 0;
            delete vehicle.id;
            LITAPP.ajax('PUT', '/vehicle/'+vehicle_id, vehicle, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        removeVehicle: function(el){
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            LITAPP.ajax('DELETE', '/vehicle/'+vehicle_id, null, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        registerVehicleSubmit: function(el){
            var data = el.serializeObject();
            var vehicle = app.findVehicle(data.vehicle_id);
            vehicle.race_id = data.race_id;
            delete vehicle.id;
            LITAPP.ajax('PUT', '/vehicle/'+data.vehicle_id, vehicle, function(){
                UIkit.modal('#registerVehicleModal').hide();
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        showQualifying: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.qualifying, race);
        }
    }
});

VIEWS.admin = new AdminView();