AdminView = Class.extend(View, {
    initialize: function(){
        this.template = 'admin';
        this.name = 'Administrator';
    },
    prepareView: function(data){
        data.races = app.data.races;
    },
    events: {
        tabVehicleCategory: function(){
            VIEWS.admin.data.active_tab = "vc";
            $('#tab-race').hide();
            $('#tab-vc').show();
            $('.uk-tab li').removeClass('uk-active').eq(1).addClass('uk-active');
        },
        tabRace: function(){
            VIEWS.admin.data.active_tab = "race";
            $('#tab-vc').hide();
            $('#tab-race').show();
            $('.uk-tab li').removeClass('uk-active').eq(0).addClass('uk-active');
        },
        addRace: function(){
            app.showView(VIEWS.form_race, {});
        },
        editRace: function(el){
            app.showView(VIEWS.form_race, app.findRace(el.closest("[data-id]").attr("data-id")));
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = el.closest("[data-id]").attr("data-id");
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.alertSuccess('Rennphase wurde aktualisiert.');
                    app.refreshView();
                });
            });
        },
        addVehicle: function(){
            app.showView(VIEWS.form_vehicle, {});
        },
        editVehicle: function(el){
            app.showView(VIEWS.form_vehicle, app.findVehicle(el.closest("[data-id]").attr("data-id")));
        },
        removeVehicle: function(el){
            var vehicle_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/vehicle/'+vehicle_id, null, function(){
                app.load.vehicles(function(){
                    app.alertSuccess('Fahrzeug wurde gelöscht.');
                    app.refreshView();
                });
            });
        },
        showRegistration: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.phase_registration, race);
        },
        showQualifying: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.phase_qualifying, race);
        },
        showEvaluationForm: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.phase_race, race);
        },
        showEvaluationResult: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.phase_evaluation, race);
        },
        removeRace: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/race/'+race_id, null, function(){
                app.load.races(function(){
                    app.alertSuccess('Rennen wurde gelöscht.');
                    app.refreshView();
                });
            });
        },
        addVehicleCategory: function(){
            app.showView(VIEWS.form_vehicle_category, {});
        },
        editVehicleCategory: function(el){
            app.showView(VIEWS.form_vehicle_category, app.findVehicleCategory(el.closest("[data-id]").attr("data-id")));
        },
        removeVehicleCategory: function(el){
            var vehicle_category_id = el.closest("[data-id]").attr("data-id");
            App.ajax('DELETE', '/vehicle_category/'+vehicle_category_id, null, function(){
                app.load.vehicle_categories(function(){
                    app.alertSuccess('Fahrzeugkategorie wurde gelöscht.');
                    app.refreshView();
                });
            });
        }
    }
});

VIEWS.admin = new AdminView();