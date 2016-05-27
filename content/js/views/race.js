RaceView = Class.extend(View, {
    initialize: function(){
        this.template = 'race';
    },
    events: {
        save: function(el){
            var data = VIEWS.race.data;
            if(data.id)
            {
                LITAPP.ajax('PUT', '/race/'+data.id, el.serializeObject(), function(data){
                    VIEWS.race.data = data;
                    app.load.races(function(){
                    app.alertSuccess('Rennen wurde gespeichert.');
                        app.refreshView();
                    });
                });
            }
            else
            {
                LITAPP.ajax('POST', '/race', el.serializeObject(), function(data){
                    VIEWS.race.data = data;
                    app.load.races(function(){
                        app.alertSuccess('Rennen wurde erstellt.');
                        app.refreshView();
                    });
                });
            }
        },
        remove: function(){
            var data = VIEWS.race.data;
            LITAPP.ajax('DELETE', '/race/'+data.id, null, function(){
                app.load.races(function(){
                    app.alertSuccess('Rennen wurde entfernt.');
                    app.showPreviousView();
                });
            });
        },
        removeStation: function(el){
            el.parent().remove();
            VIEWS.race.data.stations = el.closest("form").serializeObject().stations;
            app.refreshView();
        },
        addStation: function(el){
            var data = VIEWS.race.data;
            data.stations = el.closest("form").serializeObject().stations;
            data.stations.push({
                "race_id": data.id,
                "name": "Station "+(data.stations.length+1)
            });
            app.refreshView();
        }
    }
});

VIEWS.race = new RaceView();