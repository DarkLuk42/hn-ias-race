QualifyingView = Class.extend(View, {
    initialize: function(){
        this.template = 'qualifying';
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
    },
    events: {
        save: function(el){
            var race_id = VIEWS.qualifying.data.id;
            var requests = [];
            $("input[name='time_s']").each(function(key, el){
                var $el = $(el);
                var vehicle_id = $el.attr("data-vehicle_id");
                var vehicle = app.findVehicle(vehicle_id);
                var vehicle_category = app.findVehicleCategory(vehicle.category_id);
                var time_s = $el.val();
                var state = time_s <= vehicle_category.qualifying_time_s ? 'QUALIFIED' : 'UNQUALIFIED';
                if($el.closest("tr").hasClass("disqualified"))
                {
                    state = 'DISQUALIFIED';
                }
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
                    app.refreshView();
                });
            });
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = VIEWS.qualifying.data.id;
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.showPreviousView();
                });
            });
        },
        disqualify: function(el){
            el.closest("tr").addClass("disqualified");
            el.closest("td").html('<span class="uk-badge uk-badge-danger">disqualifiziert</span>')
        }
    }
});

VIEWS.qualifying = new QualifyingView();