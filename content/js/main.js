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
    if(LITAPP.modal)
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
        LITAPP.ajax(form.attr("method"), form.attr("action"), form.serializeArray(), function(data){
            var event = form.attr("data-event");
            if(event)
                LITAPP.es_o.publish_px('app', [event, data]);
        });
    });

    $ele.find("[data-event]:not(form)").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        LITAPP.es_o.publish_px('app', [$(this).attr("data-event"), $(this).attr("data-event-data")]);
    });

    $ele.find(".btn-delete").click(function(e){
        if( !UIkit.modal.confirm("Wirklich löschen?") )
        {
            e.preventDefault()
        }
    });
};

LITAPP.Application_cl = Class.create({
    initialize: function () {
        LITAPP.es_o.subscribe_px(this, 'app');
        LITAPP.es_o.subscribe_px(this, 'ajax');
        LITAPP.tm_o = new TELIB.TemplateManager_cl();
    },
    notify_px: function (self, message, data_arr) {
        switch (message) {
            case 'app':
                var data = data_arr[1];
                switch (data_arr[0]) {
                    case 'init':
                        break;
                    case 'templates.loaded':
                        this.setContent('loginView');
                        break;
                    case 'login':
                    case 'register':
                        LITAPP.user = data;
                        LITAPP.ajax('GET', 'race', null, function(data){
                            LITAPP.app_o.setContent(LITAPP.user.is_admin ? 'adminView' : 'userView', { races: data });
                            LITAPP.hideModal();
                        });
                        break;
                    case 'login.form':
                        LITAPP.showModal('#loginModal');
                        break;
                    case 'register.form':
                        LITAPP.showModal('#registerModal');
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
    },
    setContent: function(view, data){
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
    }
});

LITAPP.es_o = new EventService_cl();
LITAPP.app_o = new LITAPP.Application_cl();
LITAPP.es_o.publish_px('app', ['init']);

$(function(){
    LITAPP.registerHandlers('body');
});