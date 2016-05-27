VehicleView = Class.extend(View, {
    initialize: function(){
        this.template = 'vehicle';
    },
    events: {
        save: function(el){
            var data = VIEWS.vehicle.data;
            if(data.id)
            {
                LITAPP.ajax('PUT', '/vehicle/'+data.id, el.serializeObject(), function(data){
                    VIEWS.vehicle.data = data;
                    app.load.vehicles(function(){
                        app.alertSuccess('Fahrzeug wurde gespeichert.');
                        app.refreshView();
                    });
                });
            }
            else
            {
                LITAPP.ajax('POST', '/vehicle', el.serializeObject(), function(data){
                    VIEWS.vehicle.data = data;
                    app.load.vehicles(function(){
                        app.alertSuccess('Fahrzeug wurde erstellt.');
                        app.refreshView();
                    });
                });
            }
        },
        remove: function(){
            var data = VIEWS.vehicle.data;
            LITAPP.ajax('DELETE', '/vehicle/'+data.id, null, function(){
                app.load.vehicles(function(){
                    app.alertSuccess('Fahrzeug wurde entfernt.');
                    app.showPreviousView();
                });
            });
        }
    }
});

VIEWS.vehicle = new VehicleView();