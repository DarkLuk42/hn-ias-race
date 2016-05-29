VehicleCategoryView = Class.extend(View, {
    initialize: function(){
        this.template = 'vehicle_category';
    },
    events: {
        save: function(el){
            var data = VIEWS.vehicle_category.data;
            if(data.id)
            {
                App.ajax('PUT', '/vehicle_category/'+data.id, el.serializeObject(), function(data){
                    VIEWS.vehicle_category.data = data;
                    app.load.vehicle_categories(function(){
                        app.alertSuccess('Fahrzeugklasse wurde gespeichert.');
                        app.refreshView();
                    });
                });
            }
            else
            {
                App.ajax('POST', '/vehicle_category', el.serializeObject(), function(data){
                    VIEWS.vehicle_category.data = data;
                    app.load.vehicle_categories(function(){
                        app.alertSuccess('Fahrzeugklasse wurde erstellt.');
                        app.refreshView();
                    });
                });
            }
        },
        remove: function(){
            var data = VIEWS.vehicle_category.data;
            App.ajax('DELETE', '/vehicle_category/'+data.id, null, function(){
                app.load.vehicle_categories(function(){
                    app.alertSuccess('Fahrzeugklasse wurde entfernt.');
                    app.showPreviousView();
                });
            });
        }
    }
});

VIEWS.vehicle_category = new VehicleCategoryView();