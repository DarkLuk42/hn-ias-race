PhaseRaceView = Class.extend(View, {
    initialize: function(){
        this.template = 'phase_race';
        this.name = 'Rennen';
    },
    prepareView: function(data){
        data.complete = true;
        var stations = this.data.stations;
        $.each(app.data.vehicles, function(v, vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id) || {};
            if( vehicle.race_id == data.id && qualifying.state == 'QUALIFIED'){
                $.each(stations, function(s, station){
                    if( !app.findRaceEvaluation(data.id, vehicle.id, s)){
                        data.complete = false;
                    }
                });
            }
        });
        data.qualified_vehicles_by_category = App.groupBy(app.data.vehicles, "category_id", function(vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id) || {};
            return vehicle.race_id == data.id && qualifying.state == 'QUALIFIED';
        });
        data.not_qualified_vehicles_by_category = App.groupBy(app.data.vehicles, "category_id", function(vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id) || {};
            return vehicle.race_id == data.id && qualifying.state != 'QUALIFIED';
        });
    },
    events: {
        save: function(el){
            var race_id = VIEWS.phase_race.data.id;
            var requests = [];
            $("input[name='time_s']").each(function(key, el){
                var $el = $(el);
                var vehicle_id = $el.attr("data-vehicle_id");
                var station = $el.attr("data-station");
                var time_s = $el.val();
                requests.push({
                    "type": 'PUT',
                    "url": "/race_evaluation/"+race_id+"/"+vehicle_id+"/"+station,
                    "data": {"time_s": time_s},
                    "error": function(error){
                        if(error && error.fields)
                        {
                            $el.addClass("uk-form-danger");
                        }
                    }
                });
            });

            App.ajaxMany(requests, function(){
                app.load.race_evaluations(function(){
                    app.refreshView();
                });
            });
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = VIEWS.phase_race.data.id;
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.showPreviousView();
                });
            });
        },
        disqualify: function(el){
            var race_id = VIEWS.phase_race.data.id;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('PUT', '/race_qualifying/'+race_id+'/'+vehicle_id, {"state": 'DISQUALIFIED'}, function(){
                app.load.race_qualifying(function(){
                    app.refreshViewButKeepInput();
                });
            });
        },
        unDisqualify: function(el){
            var race_id = VIEWS.phase_race.data.id;
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('PUT', '/race_qualifying/'+race_id+'/'+vehicle_id, {"state": 'QUALIFIED'}, function(){
                app.load.race_qualifying(function(){
                    app.refreshViewButKeepInput();
                });
            });
        }
    }
});

VIEWS.phase_race = new PhaseRaceView();