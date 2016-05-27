VehicleView = Class.extend(View, {
    initialize: function(){
        this.template = 'vehicle';
    },
    events: {
        save: function(){
            // TODO
        }
    }
});

VIEWS.vehicle = new VehicleView();