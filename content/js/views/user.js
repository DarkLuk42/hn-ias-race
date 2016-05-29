 UserView = Class.extend(View, {
    initialize: function(){
        this.template = 'user';
        this.name = 'Benutzer';
    },
    prepareView: function(data){
        data.races = app.data.races;
    },
    events: {
        addVehicle: function(){
            app.showView(VIEWS.form_vehicle, {});
        },
        editVehicle: function(el){
            app.showView(VIEWS.form_vehicle, app.findVehicle(el.closest("[data-id]").attr("data-id")));
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
            App.ajax('PUT', '/vehicle/'+vehicle_id, vehicle, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        removeVehicle: function(el){
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/vehicle/'+vehicle_id, null, function(){
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
            App.ajax('PUT', '/vehicle/'+data.vehicle_id, vehicle, function(){
                UIkit.modal('#registerVehicleModal').hide();
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        }
    }
});

VIEWS.user = new UserView();