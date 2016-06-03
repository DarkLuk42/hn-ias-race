PhaseQualifyingView = Class.extend(View, {
    initialize: function(){
        this.template = 'phase_qualifying';
        this.name = 'Qualifying';
    },
    prepareView: function(data){
        data.complete = true;
        for( var v = 0; v < app.data.vehicles.length; v++)
        {
            var vehicle = app.data.vehicles[v];
            if( vehicle.race_id == data.id){
                if( !app.findRaceQualifying(data.id, vehicle.id)){
                    data.complete = false;
                }
            }
        }
        data.qualified_vehicles_by_category = App.groupBy(app.data.vehicles, "category_id", function(vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id);
            return vehicle.race_id == data.id && (!qualifying || qualifying.state == 'QUALIFIED');
        });
        data.not_qualified_vehicles_by_category = App.groupBy(app.data.vehicles, "category_id", function(vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id);
            return vehicle.race_id == data.id && (qualifying && qualifying.state != 'QUALIFIED');
        });
    },
    events: {
        save: function(el){
            var race_id = VIEWS.phase_qualifying.data.id;
            var requests = [];
            $("input[name='time_s']").each(function(key, el){
                var $el = $(el);
                var vehicle_id = $el.attr("data-vehicle_id");
                var vehicle = app.findVehicle(vehicle_id) || {};
                var vehicle_category = app.findVehicleCategory(vehicle.category_id) || {};
                var time_s = $el.val();
                var state = time_s <= vehicle_category.qualifying_time_s ? 'QUALIFIED' : 'UNQUALIFIED';
                requests.push({
                    "type": 'PUT',
                    "url": "/race_qualifying/"+race_id+"/"+vehicle_id,
                    "data": {"state": state, "time_s": time_s},
                    "error": function(error){
                        if(error && error.fields)
                        {
                            $el.addClass("uk-form-danger");
                        }
                    }
                });
            });

            App.ajaxMany(requests, function(){
                app.load.race_qualifying(function(){
                    app.alertSuccess('Qualifikationszeiten wurden gespeichert.');
                    app.refreshView();
                });
            });
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = VIEWS.phase_qualifying.data.id;
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.alertSuccess('Rennphase wurde aktualisiert.');
                    app.showPreviousView();
                });
            });
        },
        disqualify: function(el){
            var race_id = VIEWS.phase_qualifying.data.id;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('PUT', '/race_qualifying/'+race_id+'/'+vehicle_id, {"state": 'DISQUALIFIED'}, function(){
                app.load.race_qualifying(function(){
                    app.alertSuccess('Fahrzeug wurde disqualifiziert.');
                    app.refreshViewButKeepInput();
                });
            });
        },
        unDisqualify: function(el){
            var race_id = VIEWS.phase_qualifying.data.id;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('PUT', '/race_qualifying/'+race_id+'/'+vehicle_id, {"state": 'QUALIFIED'}, function(){
                app.load.race_qualifying(function(){
                    app.alertSuccess('Disqualifizierung wurde aufgehoben.');
                    app.refreshViewButKeepInput();
                });
            });
        }
    }
});

VIEWS.phase_qualifying = new PhaseQualifyingView();