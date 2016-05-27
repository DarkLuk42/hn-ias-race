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
            var form = el.closest("form");
            el.parent().remove();
            var data = form.serializeObject();
            var stations = [];
            var race_id = el.parent().attr("data-id");
            if(typeof data["stations[]name"] == "string")
            {
                data["stations[]name"] = [data["stations[]name"]];
                data["stations[]description"] = [data["stations[]description"]];
            }
            for(var i = 0; i < data["stations[]name"].length; i++)
            {
                var name = data["stations[]name"][i];
                var description = data["stations[]description"][i];
                stations.push({
                    "name": name,
                    "position": i,
                    "description": description,
                    "race_id": race_id
                });
            }
            VIEWS.race.data.stations = stations;
            console.log(VIEWS.race.data.stations);
            app.refreshView();
        },
        addStation: function(el){
            var form = el.closest("form");
            var data = form.serializeObject();
            var stations = [];
            var race_id = el.parent().attr("data-id");
            if(typeof data["stations[]name"] == "string")
            {
                data["stations[]name"] = [data["stations[]name"]];
                data["stations[]description"] = [data["stations[]description"]];
            }
            for(var i = 0; i < data["stations[]name"].length; i++)
            {
                var name = data["stations[]name"][i];
                var description = data["stations[]description"][i];
                stations.push({
                    "name": name,
                    "position": i,
                    "description": description,
                    "race_id": race_id
                });
            }
            stations.push({
                "race_id": race_id,
                "name": "Station "+(stations.length+1)
            });
            VIEWS.race.data.stations = stations;
            app.refreshView();
        }
    }
});

VIEWS.race = new RaceView();