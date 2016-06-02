PhaseEvaluationView = Class.extend(View, {
    initialize: function(){
        this.template = 'phase_evaluation';
        this.name = 'Ergebnisse';
    },
    prepareView: function(data){
        data.qualified_vehicles_by_category = App.groupBy(app.data.vehicles, "category_id", function(vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id) || {};
            return vehicle.race_id == data.id && qualifying.state == 'QUALIFIED';
        });
        data.not_qualified_vehicles_by_category = App.groupBy(app.data.vehicles, "category_id", function(vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id) || {};
            return vehicle.race_id == data.id && qualifying.state != 'QUALIFIED';
        });
        var race_id = data.id;
        var station = data.stations.length-1;
        data.qualified_vehicles_by_category_total = App.groupBy(app.data.vehicles.sort(App.cmpFunctionBuilder(function(vehicle){
            var evaluation = app.findRaceEvaluation(race_id, vehicle.id, station) || {};
            vehicle.time_s_total = evaluation.time_s;
            return evaluation.time_s;
        })), "category_id", function(vehicle){
            var qualifying = app.findRaceQualifying(data.id, vehicle.id) || {};
            return vehicle.race_id == data.id && qualifying.state == 'QUALIFIED';
        });
    },
    events: {
    }
});

VIEWS.phase_evaluation = new PhaseEvaluationView();