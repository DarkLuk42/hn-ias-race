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
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.refreshView();
                });
            });
        },
        addVehicle: function(){
            app.showView(VIEWS.vehicle, {});
        },
        editVehicle: function(el){
            app.showView(VIEWS.vehicle, app.findVehicle(el.closest("[data-id]").attr("data-id")));
        },
        removeVehicle: function(el){
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/vehicle/'+vehicle_id, null, function(){
                app.load.vehicles(function(){
                    app.refreshView();
                });
            });
        },
        showRegistration: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.registration, race);
        },
        showQualifying: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.qualifying, race);
        },
        showEvaluation: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.evaluation, race);
        },
        removeRace: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/race/'+race_id, null, function(){
                app.load.races(function(){
                    app.refreshView();
                });
            });
        },
        addVehicleCategory: function(){
            app.showView(VIEWS.vehicle_category, {});
        },
        editVehicleCategory: function(el){
            app.showView(VIEWS.vehicle_category, app.findVehicleCategory(el.closest("[data-id]").attr("data-id")));
        },
        removeVehicleCategory: function(el){
            var vehicle_category_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/vehicle_category/'+vehicle_category_id, null, function(){
                app.load.vehicle_categories(function(){
                    app.refreshView();
                });
            });
        }
    }
});

VIEWS.admin = new AdminView();