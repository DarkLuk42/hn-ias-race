View = Class.create({
    rendered: null,
    template: null,
    data: {},
    initialize: function(){

    },
    getName: function(){
        return this.name;
    },
    render: function(){
        this.prepareView(this.data);
        this.rendered = app.render(this.template, this.data);
    },
    prepareView: function(data){},
    handleEvent: function(name, el){
        if(name == 'return') {
            app.showPreviousView();
        }else{
            if(this.events[name])
                this.events[name](el);
            else
                console.error('Unknown event '+name+'.');
        }
    },
    events: {}
});

VIEWS = {};