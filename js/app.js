/**
 * event handlers
 **/
//on page init (jquery mobile's version of on window load)
$( document ).delegate( "#home", "pageinit", function() {

    controller.loadVacations();

    $("#cancel-request").click(view.cleanRequestForm);

    $("#submit-request").click(function () {
        var eventDate = $("#EventDate").val();
        var endDate = $("#EndDate").val();
        controller.requestPTOs(eventDate, endDate);
    });
});

$( document ).delegate( "#discussion", "pageinit", function () {

    controller.loadDiscussion();

    $("#discussion-reply").keyup(function (event) {
        if ( event.which == 13 ) {
            console.log('Sending reply: ' + this.value);
            controller.reply(this.value);
        }
    });
});

