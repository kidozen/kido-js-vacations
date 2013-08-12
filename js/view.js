

/**
 * view
 **/
var view = {

    months: [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ],

    showVacations: function ( items ) {
        var $vacations = $("#Vacations");
        //clean the list.
        $vacations.html('');
        //set an empty message if no vacations found.
        if (items.length === 0) {
            $vacations.append('<li>No vacations found.</li>');
            return;
        }
        //create a list item per each vacation.
        var month = -1; //the list is ordered, so this is the current month
        for(var i in items) {
            var start = new Date(items[i].EventDate);
            var end   = new Date(items[i].EndDate);
            //create a divider for each month
            if (month !== start.getUTCMonth()) {
                month =  start.getUTCMonth();
                var divider =
                    '<li data-role="list-divider">' +
                        view.months[month] + ', ' + start.getUTCFullYear() +
                    '</li>';
                $vacations.append(divider);
            }
            //add the entry to the list
            var li =
                '<li>' +
                    '<h2>' + items[i].Title + '</h2>' +
                    '<p>' + (start.getUTCMonth() + 1) + '/' + start.getUTCDate() + ' - ' +
                            (end.getUTCMonth() + 1) + '/' + end.getUTCDate() +
                            ' (' + items[i].Location + ')' +
                    '</p>' +
                '</li>';
            $vacations.append(li);
        }
        //refresh the jqm listview
        $vacations.listview("refresh").trigger("create");
    },

    cleanRequestForm: function () {
        $("#EventDate").val('');
        $("#EndDate").val('');
    },

    showDiscussion: function ( disc ) {
        $("#discussion-subject").html(disc.subject);
        // $("#discussion-content").html(disc.content.text);
        $("#discussion-replies").html('');
        for(var i in disc.replies) {
            var li = '<li>' +
                        '<div>' +
                            disc.replies[i].author.displayName + ': ' +
                        '</div>' +
                        '<br/>' +
                        disc.replies[i].content.text +
                     '</li>';
            $("#discussion-replies").append(li);
        }
        $("#discussion-replies").listview("refresh").trigger("create");
    },

    cleanReplyForm: function () {
        $("#discussion-reply").val('');
    }
};