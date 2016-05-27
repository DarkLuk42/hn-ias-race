QualifyingView = Class.extend(View, {
    initialize: function(){
        this.template = 'qualifying';
    },
    events: {
        save: function(el){

        }
    }
});

VIEWS.qualifying = new QualifyingView();