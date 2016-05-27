AdminView = Class.extend(View, {
    initialize: function(){
        this.template = 'admin';
    },
    prepareView: function(data){
        data.races = app.data.races;
    },
    events: {
        addRace: function(){
            app.showView(VIEWS.race, {});
        },
        editRace: function(el){
            app.showView(VIEWS.race, app.findRace(el.closest("[data-id]").attr("data-id")));
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = el.closest("[data-id]").attr("data-id");
            LITAPP.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.refreshView();
                });
            });
        }
    }
});

VIEWS.admin = new AdminView();