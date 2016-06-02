FormVehicleCategoryView = Class.extend(View, {
    initialize: function(){
        this.template = 'form_vehicle_category';
        this.name = 'Fahrzeugklasse';
    },
    getName: function(){
        return this.name + (this.data.id ? ' bearbeiten' : ' anlegen');
    },
    events: {
        save: function(el){
            var data = VIEWS.form_vehicle_category.data;
            if(data.id)
            {
                App.ajax('PUT', '/vehicle_category/'+data.id, el.serializeObject(), function(data){
                    VIEWS.form_vehicle_category.data = data;
                    app.load.vehicle_categories(function(){
                        app.alertSuccess('Fahrzeugklasse wurde gespeichert.');
                        app.refreshView();
                    });
                });
            }
            else
            {
                App.ajax('POST', '/vehicle_category', el.serializeObject(), function(data){
                    VIEWS.form_vehicle_category.data = data;
                    app.load.vehicle_categories(function(){
                        app.alertSuccess('Fahrzeugklasse wurde erstellt.');
                        app.showPreviousView();
                    });
                });
            }
        },
        remove: function(){
            var data = VIEWS.form_vehicle_category.data;
            App.ajax('DELETE', '/vehicle_category/'+data.id, null, function(){
                app.load.vehicle_categories(function(){
                    app.alertSuccess('Fahrzeugklasse wurde entfernt.');
                    app.showPreviousView();
                });
            });
        }
    }
});

VIEWS.form_vehicle_category = new FormVehicleCategoryView();