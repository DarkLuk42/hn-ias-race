PhaseRaceView = Class.extend(View, {
    initialize: function(){
        this.template = 'phase_race';
        this.name = 'Rennen';
    },
    prepareView: function(data){
        data.complete = true;
    },
    events: {
        save: function(el){
            var race_id = VIEWS.phase_race.data.id;
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = VIEWS.phase_race.data.id;
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.showPreviousView();
                });
            });
        }
    }
});

VIEWS.phase_race = new PhaseRaceView();