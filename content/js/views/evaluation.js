EvaluationView = Class.extend(View, {
    initialize: function(){
        this.template = 'evaluation';
    },
    prepareView: function(data){
        data.complete = true;
    },
    events: {
        save: function(el){
            var race_id = VIEWS.evaluation.data.id;
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = VIEWS.evaluation.data.id;
            App.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.showPreviousView();
                });
            });
        }
    }
});

VIEWS.evaluation = new EvaluationView();