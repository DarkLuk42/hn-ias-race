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

LITAPP.registerHandlers = function(element)
{
    var $ele = $(element);

    $ele.find("form").submit(function(e){
        e.preventDefault();
        e.stopPropagation();
        var form = $(this);
        var sendEvent = form.attr("data-send-event");
        if(sendEvent)
        {
            LITAPP.publishEvent(sendEvent, form.serializeObject());
        }
        else
        {
            LITAPP.ajax(form.attr("method"), form.attr("action"), form.serializeArray(), function (data) {
                var event = form.attr("data-event");
                if (event)
                    LITAPP.publishEvent(event, data);
            });
        }
    });

    $ele.find("[data-event]:not(form)").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var data = $(this).attr("data-event-data");
        try {
            data = JSON.parse(data);
        }catch( e )
        {
            // ignore
        }
        LITAPP.es_o.publish_px('app', [$(this).attr("data-event"), data]);
    });

    $ele.find(".btn-delete").click(function(e){
        if( !UIkit.modal.confirm("Wirklich löschen?") )
        {
            e.preventDefault()
        }
    });
};

LITAPP.setContent = function(view, data){
    try {
        var html = LITAPP.tm_o.execute_px(view, data);
        if(html!==null)
        {
            var content = $(".content");
            content.html(html);
            LITAPP.registerHandlers(content);
        }
        else
        {
            LITAPP.es_o.publish_px('app', ['error', 'Template not found.']);
        }
    }catch(e){
        LITAPP.es_o.publish_px('app', ['error', 'Template is incorrect.', e]);
        LITAPP.tm_o.execute_px(view, data);
    }
};

LITAPP.publishEvent = function(name, data){
    LITAPP.es_o.publish_px('app', [name, data])
};

LITAPP.Application_cl = Class.create({
    initialize: function () {
        LITAPP.es_o.subscribe_px(this, 'app');
        LITAPP.tm_o = new TELIB.TemplateManager_cl();
    },
    notify_px: function (self, message, data_arr) {
        console.log('event', message, data_arr);
        switch (message) {
            case 'app':
                var data = data_arr[1];
                switch (data_arr[0]) {
                    case 'init':
                        break;
                    case 'templates.loaded':
                        LITAPP.setContent('loginView');
                        break;
                    case 'show.index':
                        LITAPP.ajax('GET', 'race', null, function(data){
                            LITAPP.races = data;
                            LITAPP.ajax('GET', 'vehicle', null, function(data){
                                LITAPP.vehicles = data;
                                LITAPP.setContent(LITAPP.user.is_admin ? 'adminView' : 'userView', { });
                                LITAPP.hideModal();
                            });
                        });
                        break;
                    case 'show.login':
                        LITAPP.showModal('#loginModal');
                        break;
                    case 'show.register':
                        LITAPP.showModal('#registerModal');
                        break;
                    case 'show.race':
                        LITAPP.setContent('raceView', data || {});
                        break;
                    case 'show.vehicle':
                        LITAPP.ajax('GET', 'user', null, function(data){
                            LITAPP.users = data;
                            LITAPP.setContent('vehicleView', data);
                        });
                        break;
                    case 'send.station.create':
                        break;
                    case 'response.login':
                    case 'response.register':
                        LITAPP.user = data;
                        LITAPP.publishEvent('show.index');
                        break;
                    case 'response.race.create':
                    case 'response.race.update':
                        LITAPP.publishEvent('show.race', data);
                        break;
                    case 'response.race.delete':
                        LITAPP.publishEvent('show.index');
                        break;
                    case 'response.vehicle.create':
                    case 'response.vehicle.update':
                        LITAPP.publishEvent('show.vehicle', data);
                        break;
                    case 'error':
                        LITAPP.showError(data_arr[1]);
                        break;
                    default:
                        console.error('[Application_cl] unbekannte app-Notification: ' + data_arr[0]);
                        break;
                }
                break;
            default:
                console.error('[Application_cl] unbekannte Notification: ' + message);
                break;
        }
    }
});

LITAPP.es_o = new EventService_cl();
LITAPP.app_o = new LITAPP.Application_cl();
LITAPP.es_o.publish_px('app', ['init']);

$(function(){
    LITAPP.registerHandlers('body');
});