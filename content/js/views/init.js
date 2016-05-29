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
            App.ajax('POST', '/user', el.serializeObject(), function(data){
                app.data.current_user = data;
                app.load.users(function(){
                    app.load.vehicles(function(){
                        app.load.race_qualifying(function(){
                            app.showView(app.data.current_user.is_admin ? VIEWS.admin : VIEWS.user);
                        });
                    });
                });
            });
        },
        loginSubmit: function(el){
            App.ajax('POST', '/login', el.serializeObject(), function(data){
                app.data.current_user = data;
                app.load.users(function(){
                    app.load.vehicles(function(){
                        app.load.race_qualifying(function(){
                            app.showView(app.data.current_user.is_admin ? VIEWS.admin : VIEWS.user);
                        });
                    });
                });
            });
        }
    }
});

VIEWS.init = new InitView();