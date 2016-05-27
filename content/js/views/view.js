View = Class.create({
    rendered: null,
    template: null,
    data: {},
    initialize: function(){

    },
    render: function(){
        this.prepareView(this.data);
        this.rendered = app.render(this.template, this.data);
    },
    prepareView: function(data){},
    handleEvent: function(name, el){
        if(this.events[name])
            this.events[name](el);
        else
            console.error('Unknown event '+name+'.');
    },
    events: {}
});

VIEWS = {};