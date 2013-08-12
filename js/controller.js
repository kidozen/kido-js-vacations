/**
 * controller
 **/

var controller = {
    loadVacations: function () {
        $.mobile.showPageLoadingMsg();
        model
            .getVacations()
            .done(view.showVacations)
            .fail(function (err) {
                alert("Page load failed: " + JSON.stringify(err, 0, 2));
            })
            .always($.mobile.hidePageLoadingMsg);
    },
    requestPTOs: function ( eventDate, endDate ) {
        $.mobile.showPageLoadingMsg();
        model
            //get the user info, so we can use his email.
            .getUser()
            //pipe the pto request
            .pipe(function (user) {
                return model.sendRequest(user.name, user.email, eventDate, endDate);
            })
            .done(function () {
                alert('Request was sent to approver!');
                view.cleanRequestForm();
                $.mobile.changePage("/");
            })
            .fail(function () {
                alert('Unable to send request.');
            })
            .always($.mobile.hidePageLoadingMsg);
    },
    loadDiscussion: function () {
        $.mobile.showPageLoadingMsg();
        model
            .getDiscussion()
            .done(view.showDiscussion)
            .always($.mobile.hidePageLoadingMsg);
    },

    reply: function(msg) {
        $.mobile.showPageLoadingMsg();
        model
            .sendReply(msg)
            .done(view.cleanReplyForm)
            .done(controller.loadDiscussion)
            .always($.mobile.hidePageLoadingMsg);
    }
};