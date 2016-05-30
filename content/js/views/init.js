InitView = Class.extend(View, {
    initialize: function(){
        this.template = 'init';
        this.name = 'Home';
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
                    app.alertSuccess('Du hast dich erfolgreich registriert.');
                    app.showView(app.data.current_user.is_admin ? VIEWS.admin : VIEWS.user);
                    $(".current-user").text(app.data.current_user.firstname + ' ' + app.data.current_user.lastname);
                    $(".logged-in").show();
                });
            });
        },
        loginSubmit: function(el){
            App.ajax('POST', '/login', el.serializeObject(), function(data){
                app.data.current_user = data;
                app.load.users(function(){
                    app.alertSuccess('Du hast dich erfolgreich eingeloggt.');
                    app.showView(app.data.current_user.is_admin ? VIEWS.admin : VIEWS.user);
                    $(".current-user").text(app.data.current_user.firstname + ' ' + app.data.current_user.lastname);
                    $(".logged-in").show();
                });
            });
        },
        showEvaluationResult: function(el){
            var race_id = el.closest("[data-id]").attr("data-id");
            var race = app.findRace(race_id);
            app.showView(VIEWS.phase_evaluation, race);
        }
    }
});

VIEWS.init = new InitView();