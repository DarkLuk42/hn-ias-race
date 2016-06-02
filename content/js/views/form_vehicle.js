FormVehicleView = Class.extend(View, {
    initialize: function(){
        this.template = 'form_vehicle';
        this.name = 'Fahrzeug';
    },
    getName: function(){
        return this.name + (this.data.id ? ' bearbeiten' : ' anlegen');
    },
    events: {
        save: function(el){
            var data = VIEWS.form_vehicle.data;
            if(data.id)
            {
                App.ajax('PUT', '/vehicle/'+data.id, el.serializeObject(), function(data){
                    VIEWS.form_vehicle.data = data;
                    app.load.vehicles(function(){
                        app.alertSuccess('Fahrzeug wurde gespeichert.');
                        app.refreshView();
                    });
                });
            }
            else
            {
                App.ajax('POST', '/vehicle', el.serializeObject(), function(data){
                    VIEWS.form_vehicle.data = data;
                    app.load.vehicles(function(){
                        app.alertSuccess('Fahrzeug wurde erstellt.');
                        app.showPreviousView();
                    });
                });
            }
        },
        remove: function(){
            var data = VIEWS.form_vehicle.data;
            App.ajax('DELETE', '/vehicle/'+data.id, null, function(){
                app.load.vehicles(function(){
                    app.alertSuccess('Fahrzeug wurde entfernt.');
                    app.showPreviousView();
                });
            });
        }
    }
});

VIEWS.form_vehicle = new FormVehicleView();