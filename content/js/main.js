function showMessage(message){
    alert(message);
    /*
    var id = "alert-" + parseInt(Math.random()*1000);
    var alert = $("<p></p>").addClass("message").text(message).attr("id",id);
    $(".content").prepend(alert);
    //window.location.href = "#" + id;*/
};
function showError(message){
    alert(message);
    /*
    var id = "alert-" + parseInt(Math.random()*1000);
    var alert = $("<p></p>").addClass("message").addClass("message-error").text(message).attr("id",id);
    $(".content").prepend(alert);
    //window.location.href = "#" + id;*/
};

function snakeToCamel(s){
    return s.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();});
}

function registerHandlers(element)
{
    var $ele = $(element);

    $ele.find("form.ajax").submit(function(e){
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        if( $this.find(".required.error").length == 0 )
        {
            $("p.message").remove();
            var data = {};
            $this.find("input, textarea, select").each(function(i,ele){
                var $ele = $(ele);
                data[$ele.attr("name")] = $ele.val();
            });
            $.ajax({
                url: $this.attr("action"),
                type: $this.attr("method"),
                data: data,
                dataType: "json",
                success: function(data){
                    if( data.success )
                    {
                        var fn = snakeToCamel($this.attr("action").substring(1));
                        if( fn && window.hasOwnProperty(fn) )
                        {
                            window[fn](data.data);
                            showMessage(data.message);
                        }
                        else
                        {
                            showMessage(data.message);
                            if( data.redirect )
                            {
                                window.location.href = data.redirect
                            }
                            else
                            {
                                window.location.reload();
                            }
                        }
                    }
                    else
                    {
                        showError(data.message);
                    }
                },
                error: function(error){
                    if( error.responseJSON && error.responseJSON.message )
                    {
                        showError( error.responseJSON.message );
                    }
                    else
                    {
                        console.log( error );
                        showError( "Es ist leider etwas schief gelaufen..." );
                    }
                }
            });
        }
    });

    $ele.find(".btn-delete").click(function(e){
        if( !confirm("Wirklich löschen?") )
        {
            e.preventDefault()
        }
    });
}

$(function(){
    registerHandlers(document);
});