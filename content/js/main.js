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

App = Class.create({
    data: {
        current_user: {},
        users: [],
        races: [],
        vehicles: [],
        vehicle_categories: [],
        race_qualifyings: [],
        race_evaluations: []
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
        this.refreshBreadcrumb();
    },
    refreshBreadcrumb: function(){
        var view = this.activeView;
        var viewBreadcrumb = $("#view-breadcrumb");
        viewBreadcrumb.html("");
        while (view)
        {
            if(view.getName()) {
                var $li = $("<li></li>").append($("<span></span>").text(view.getName()));
                if(view == this.activeView)
                    $li.addClass("uk-active");
                viewBreadcrumb.prepend($li);
            }
            view = view.previousView;
        }
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
            App.ajax('GET', '/user', null, function(data){
                app.data.users = data;
                callback();
            });
        },
        races: function(callback){
            App.ajax('GET', '/race', null, function(data){
                app.data.races = data;
                callback();
            });
        },
        vehicles: function(callback){
            App.ajax('GET', '/vehicle', null, function(data){
                app.data.vehicles = data;
                callback();
            });
        },
        vehicle_categories: function(callback){
            App.ajax('GET', '/vehicle_category', null, function(data){
                app.data.vehicle_categories = data;
                callback();
            });
        },
        race_qualifying: function(callback){
            App.ajax('GET', '/race_qualifying', null, function(data){
                app.data.race_qualifyings = data;
                var positions = {};
                for( var q in app.data.race_qualifyings )
                {
                    if(app.data.race_qualifyings.hasOwnProperty(q))
                    {
                        var race_qualifying = app.data.race_qualifyings[q];
                        if(race_qualifying.state == 'QUALIFIED') {
                            var vehicle = app.findVehicle(race_qualifying.vehicle_id);
                            if(vehicle) {
                                var group = "r" + race_qualifying.race_id + "_c" + vehicle.category_id;
                                var position = positions[group] + 1 || 1;
                                race_qualifying.position = position;
                                positions[group] = position;
                            }
                        }
                    }
                }
                callback();
            });
        },
        race_evaluations: function(callback){
            App.ajax('GET', '/race_evaluation', null, function(data){
                app.data.race_evaluations = data;
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
    },
    findRaceQualifying: function(race_id, vehicle_id){
        for(var v in this.data.race_qualifyings)
        {
            if(this.data.race_qualifyings.hasOwnProperty(v)) {
                var race_qualifying = this.data.race_qualifyings[v];
                if (race_qualifying.race_id == race_id && race_qualifying.vehicle_id == vehicle_id)
                    return race_qualifying;
            }
        }
    },
    findRaceEvaluation: function(race_id, vehicle_id, station){
        for(var v in this.data.race_evaluations)
        {
            if(this.data.race_evaluations.hasOwnProperty(v)) {
                var race_evaluation = this.data.race_evaluations[v];
                if (race_evaluation.race_id == race_id && race_evaluation.vehicle_id == vehicle_id && race_evaluation.station == station)
                    return race_evaluation;
            }
        }
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

App.modal = null;

App.showModal = function(el, data)
{
    App.hideModal();
    App.modal = UIkit.modal(el);
    //App.modal.options.bgclose = false;
    App.modal.options.keyboard = false;
    App.modal.show();
};

App.hideModal = function()
{
    if(App.modal && App.modal.active)
        App.modal.hide();
    App.modal = null;
};

App.snakeToCamel = function(s){
    return s.replace(/(_\w)/g, function(m){return m[1].toUpperCase();});
};

App.ajax = function(type, url, data, success, error_callback){
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
            if(error_callback) {
                error_callback(error.responseJSON);
            }
            else if( error.responseJSON && error.responseJSON.fields )
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


App.ajaxMany = function(requests, success_callback, error_callback){
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
        if(error+success == requests.length)
        {
            if(error == 0 && success_callback)
                success_callback();
            else if(error != 0 && error_callback)
                error_callback();
        }
    };
    for(var i in requests){
        if(requests.hasOwnProperty(i))
        {
            var request = requests[i];
            (function(request) {
                var l_request = request;
                App.ajax(l_request.type, l_request.url, l_request.data, function (data) {
                    fn_success();
                    if (l_request.success)
                        l_request.success(data);
                }, function (data) {
                    fn_error();
                    if (l_request.error)
                        l_request.error(data);
                });
            })(request);
        }
    }
};

LITAPP.es_o = new EventService_cl();
app = new App();
LITAPP.tm_o = new TELIB.TemplateManager_cl();