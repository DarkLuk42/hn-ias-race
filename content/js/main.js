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

LITAPP.ajax = function(type, url, data, success, error_callback){
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
                app.alertSuccess(data.message);
            loading.hide();
        },
        "error": function(error){
            if(error_callback)
                error_callback();
            if( error.responseJSON && error.responseJSON.fields )
            {
                var fields = error.responseJSON.fields;
                for( var f in fields )
                {
                    var field = fields[f];
                    if(field.hasOwnProperty(f))
                    {
                        $("[name='"+field+"']").addClass("uk-form-danger");
                    }
                }
            }
            else if( error.responseJSON && error.responseJSON.message )
            {
                app.alertError( error.responseJSON.message );
            }
            else
            {
                console.log( error );
                app.alertError( "Es ist leider etwas schief gelaufen..." );
            }
            loading.hide();
        }
    });
};
LITAPP.ajaxMany = function(type, urls, datas, success_callback, error_callback){
    var success = 0;
    var error = 0;
    var fn_success = function(){
        success++;
        fn_done();
    };
    var fn_error = function(){
        error++;
        fn_done();
    };
    var fn_done = function(){
        if(error+success == urls.length)
        {
            if(error == 0 && success_callback)
                success_callback();
            else if(error != 0 && error_callback)
                error_callback();
        }
    };
    for(var i in urls){
        if(urls.hasOwnProperty(i))
        {
            var url = urls[i];
            var data = datas[i];
            LITAPP.ajax(type, url, data, fn_success, fn_error);
        }
    }
};

App = Class.create({
    data: {
        current_user: {},
        users: [],
        races: [],
        vehicles: [],
        vehicle_categories: [],
        race_qualifyings: []
    },
    initialize: function () {
        LITAPP.es_o.subscribe_px(this, 'app');
    },
    render: function(template, data){
        var template_data = $.extend(true, {}, this.data);
        template_data.data = data;
        return LITAPP.tm_o.execute_px(template, template_data)
    },
    showView: function(view, data, setPreviousView){
        setPreviousView = typeof(setPreviousView) == "undefined" ? true : setPreviousView == true;
        $('html').removeClass('uk-modal-page');
        if(setPreviousView && this.activeView != view)
            view.previousView = this.activeView;
        this.activeView = view;
        if(data)
            view.data = data;
        if(true || !view.rendered) // render always new
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
        content.find(".uk-modal input").on("keydown", function(e){
            if(e.keyCode == 13)
            {
                e.preventDefault();
                e.stopPropagation();
                $(e.target).closest("form").submit()
            }
        });
        content.find("input").on("change", function(e){
            $(this).removeClass("uk-form-danger");
        });
    },
    showPreviousView: function(){
        this.showView(this.activeView.previousView || VIEWS.init, null, false);
    },
    notify_px: function (self, message, data_arr) {
        console.log('event', message, data_arr);
        switch (message) {
            case 'app':
                switch (data_arr[0]) {
                    case 'init':
                    case 'templates.loaded':
                        app.load.races(function(){
                            app.load.vehicle_categories(function(){
                                app.showView(VIEWS.init);
                            });
                        });
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
        },
        vehicle_categories: function(callback){
            LITAPP.ajax('GET', '/vehicle_category', null, function(data){
                app.data.vehicle_categories = data;
                callback();
            });
        },
        race_qualifying: function(callback){
            LITAPP.ajax('GET', '/race_qualifying', null, function(data){
                app.data.race_qualifyings = data;
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
    findVehicleCategory: function(vehicle_category_id){
        for(var v in this.data.vehicle_categories)
        {
            if(this.data.vehicle_categories.hasOwnProperty(v)) {
                var vehicle_category = this.data.vehicle_categories[v];
                if (vehicle_category.id == vehicle_category_id)
                    return vehicle_category;
            }
        }
    },
    findRace: function(race_id){
        for(var v in this.data.races)
        {
            if(this.data.races.hasOwnProperty(v)) {
                var race = this.data.races[v];
                if (race.id == race_id)
                    return race;
            }
        }
        console.log(race_id, this.data.races);
    },
    refreshView: function(){
        this.showView(this.activeView);
    },
    alertSuccess: function(message){
        var alertBox = $("#alert-box");
        var alert = $('<div class="uk-alert uk-alert-success" data-uk-alert>'+
        '<a href="" class="uk-alert-close uk-close"></a>'+
        $('<p></p>').text(message).html()+
        '</div>');
        setTimeout(function(){
            alert.fadeOut();
        }, 3000);
        alertBox.prepend(alert);
    },
    alertError: function(message){
        var alertBox = $("#alert-box");
        var alert = $('<div class="uk-alert uk-alert-danger" data-uk-alert>'+
        '<a href="" class="uk-alert-close uk-close"></a>'+
        $('<p></p>').text(message).html()+
        '</div>');
        setTimeout(function(){
            alert.fadeOut();
        }, 3000);
        alertBox.prepend(alert);
    }
});

LITAPP.es_o = new EventService_cl();
app = new App();
LITAPP.tm_o = new TELIB.TemplateManager_cl();