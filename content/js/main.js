$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var LITAPP = {};
LITAPP.showMessage = function(message){
    UIkit.modal.alert(message);
};

LITAPP.showError = function(message){
    UIkit.modal.alert(message);
};

LITAPP.setNav = function(list)
{
    var nav = $(".uk-navbar-nav");
    nav.html("");
    for(var i = 0; i < list.length; i++)
    {
        nav.append($("<li></li>").text(list[i]));
    }
};

LITAPP.modal = null;

LITAPP.showModal = function(el, data)
{
    LITAPP.hideModal();
    LITAPP.modal = UIkit.modal(el);
    //LITAPP.modal.options.bgclose = false;
    LITAPP.modal.options.keyboard = false;
    LITAPP.modal.show();
};

LITAPP.hideModal = function()
{
    if(LITAPP.modal && LITAPP.modal.active)
        LITAPP.modal.hide();
    LITAPP.modal = null;
};

LITAPP.snakeToCamel = function(s){
    return s.replace(/(_\w)/g, function(m){return m[1].toUpperCase();});
};

LITAPP.ajax = function(type, url, data, success){
    var loading = UIkit.modal.blockUI('Loading...');
    $.ajax({
        "url": url,
        "type": type,
        "data": data,
        "dataType": "json",
        "success": function(data){
            if( success )
                success(data);
            if(data.message)
                helper.showMessage(data.message);
            loading.hide();
        },
        "error": function(error){
            if( error.responseJSON && error.responseJSON.message )
            {
                LITAPP.showError( error.responseJSON.message );
            }
            else
            {
                console.log( error );
                LITAPP.showError( "Es ist leider etwas schief gelaufen..." );
            }
            loading.hide();
        }
    });
};

App = Class.create({
    data: {
        current_user: {},
        users: [],
        races: [],
        vehicles: []
    },
    initialize: function () {
        LITAPP.es_o.subscribe_px(this, 'app');
    },
    render: function(template, data){
        var template_data = $.extend(true, {}, this.data);
        template_data.data = data;
        return LITAPP.tm_o.execute_px(template, template_data)
    },
    showView: function(view){
        this.activeView = view;
        //if(!view.rendered)
            view.render();
        var content = $(".content");
        content.html(view.rendered);
        content.find("[data-submit]").submit(function(e){
            e.preventDefault();
            e.stopPropagation();
            var el = $(this);
            view.handleEvent(el.attr("data-submit"), el);
        });
        content.find("[data-click]").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var el = $(this);
            view.handleEvent(el.attr("data-click"), el);
        });
    },
    notify_px: function (self, message, data_arr) {
        console.log('event', message, data_arr);
        switch (message) {
            case 'app':
                switch (data_arr[0]) {
                    case 'init':
                    case 'templates.loaded':
                        app.showView(VIEWS.init);
                        break;
                }
                break;
            default:
                console.error('[Application_cl] unbekannte Notification: ' + message);
                break;
        }
    },
    load: {
        users: function(callback){
            LITAPP.ajax('GET', '/user', null, function(data){
                app.data.users = data;
                callback();
            });
        },
        races: function(callback){
            LITAPP.ajax('GET', '/race', null, function(data){
                app.data.races = data;
                callback();
            });
        },
        vehicles: function(callback){
            LITAPP.ajax('GET', '/vehicle', null, function(data){
                app.data.vehicles = data;
                callback();
            });
        }
    },
    findVehicle: function(vehicle_id){
        for(var v in this.data.vehicles)
        {
            if(this.data.vehicles.hasOwnProperty(v)) {
                var vehicle = this.data.vehicles[v];
                if (vehicle.id == vehicle_id)
                    return vehicle;
            }
        }
    },
    refreshView: function(){
        this.showView(this.activeView);
    }
});

LITAPP.es_o = new EventService_cl();
app = new App();
LITAPP.tm_o = new TELIB.TemplateManager_cl();