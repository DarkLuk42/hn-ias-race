 UserView = Class.extend(View, {
    initialize: function(){
        this.template = 'user';
    },
    prepareView: function(data){
        data.races = app.data.races;
    },
    events: {
        addVehicle: function(){
            app.showView(VIEWS.vehicle, {});
        },
        registerVehicle: function(el){
            $('#registerVehicleModal').find("[name='vehicle_id']").val(el.closest("[data-id]").attr("data-id"));
            UIkit.modal('#registerVehicleModal').show();
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
        }
    }
});

VIEWS.user = new UserView();