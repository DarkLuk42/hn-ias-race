FormRaceView = Class.extend(View, {
    initialize: function(){
        this.template = 'form_race';
        this.name = 'Rennen';
    },
    getName: function(){
        return this.name + (this.data.id ? ' bearbeiten' : ' anlegen');
    },
    prepareView: function(data){
        if(!data.stations || data.stations.length < 1)
        {
            data.stations = [{"name": "Station 1"}];
        }
    },
    events: {
        save: function(el){
            var data = VIEWS.form_race.data;
            if(data.id)
            {
                App.ajax('PUT', '/race/'+data.id, el.serializeObject(), function(data){
                    VIEWS.form_race.data = data;
                    app.load.races(function(){
                        app.alertSuccess('Rennen wurde gespeichert.');
                        app.refreshView();
                    });
                });
            }
            else
            {
                App.ajax('POST', '/race', el.serializeObject(), function(data){
                    VIEWS.form_race.data = data;
                    app.load.races(function(){
                        app.alertSuccess('Rennen wurde erstellt.');
                        app.showPreviousView();
                    });
                });
            }
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
            VIEWS.form_race.data.name = $("[name='name']").val();
            VIEWS.form_race.data.description = $("[name='description']").val();
            VIEWS.form_race.data.date = $("[name='date']").val();
            VIEWS.form_race.data.stations = stations;
            app.refreshView();
        },
        addStation: function(el){
            var form = el.closest("form");
            $(el).parent().clone().insertAfter($(el).parent());
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
            VIEWS.form_race.data.name = $("[name='name']").val();
            VIEWS.form_race.data.description = $("[name='description']").val();
            VIEWS.form_race.data.date = $("[name='date']").val();
            VIEWS.form_race.data.stations = stations;
            app.refreshView();
        }
    }
});

VIEWS.form_race = new FormRaceView();