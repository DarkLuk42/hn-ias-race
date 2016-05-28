QualifyingView = Class.extend(View, {
    initialize: function(){
        this.template = 'qualifying';
    },
    events: {
        save: function(el){
            var race_id = VIEWS.qualifying.data.id;
            var urls = [];
            var datas = [];
            $("input[name='time']").each(function(){
                urls.push("/race_qualifying/"+race_id+"/"+vehicle_id);
                datas.push({"state": "QUALIFIED", "time": $(this).val()});
            });

            LITAPP.ajaxMany('PUT', urls, datas, function(){
                app.load.race_qualifying(function(){
                    app.refreshView();
                });
            });
        },
        editRaceState: function(el){
            var state = el.attr("data-state");
            var race_id = VIEWS.qualifying.data.id;
            LITAPP.ajax('PUT', '/race/'+race_id, {"state": state}, function(){
                app.load.races(function(){
                    app.showPreviousView();
                });
            });
        }
    }
});

VIEWS.qualifying = new QualifyingView();