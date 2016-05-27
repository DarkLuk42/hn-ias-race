InitView = Class.extend(View, {
    initialize: function(){
        this.template = 'init';
    },
    events: {
        loginModal: function(){
            UIkit.modal('#loginModal').show();
        },
        registerModal: function(){
            UIkit.modal('#registerModal').show();
        },
        registerSubmit: function(el){
            LITAPP.ajax('POST', '/register', el.serializeObject(), function(data){
                app.data.current_user = data;
                app.load.races(function(){
                    app.load.users(function(){
                        app.load.vehicles(function(){
                            app.showView(VIEWS.user);
                        });
                    });
                });
            });
        },
        loginSubmit: function(el){
            LITAPP.ajax('POST', '/login', el.serializeObject(), function(data){
                app.data.current_user = data;
                app.load.races(function(){
                    app.load.users(function(){
                        app.load.vehicles(function(){
                            app.showView(VIEWS.user);
                        });
                    });
                });
            });
        }
    }
});

VIEWS.init = new InitView();