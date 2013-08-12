/**
 * model
 **/

var kido       = new Kido();
var sharepoint = kido.services('tellagosharepoint');
var jive       = kido.services('jive');

var model = {

    //eagerly look for the PTO approver from kidozen config
    approver: kido.config().get('approver'),
    //eagerly look for the Jive discussionId from kidozen config
    discussionId: kido.config().get('discussionId'),

    /**
     * get the logged in user, and returns the name and email.
     * @api public
     */
    getUser: function () {
        return kido
            .security()
            .getLoggedInUser()
            //get the user in a more useful format
            .pipe(function (claims) {
                var user = {};
                for(var i in claims) {
                    var type = claims[i].type;
                    if (type === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress") {
                        user.email = claims[i].value;
                    } else if ( type === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name") {
                        user.name = claims[i].value;
                    }
                }
                return user;
            })
            .fail(function (err) {
                kido.logging().writeError("Unable to get currently logged in user: " + JSON.stringify(err, 0, 2));
            });
    },

    /**
     * sends an email to the approver
     */
    sendRequest: function ( name, email, eventDate, endDate ) {
        //get the approver from kidozen config.
        return model.approver.pipe(function ( approver ) {
                    var body = name + " would like to take some PTOs starting: " +
                               eventDate + " until: " + endDate;
                    return kido.email().send(email, approver, name + " is asking for PTOs", body, body);
                })
                .fail(function ( err ) {
                    kido.logging().writeError('Unable to send PTO request: ' + JSON.stringify(err, 0, 2));
                });
    },

    /**
     * authenticate to sharepoint, and get the vacations
     * from the calendar list
     */
    getVacations: function () {
        return sharepoint
                //authenticate with default credentials, or
                //override by sending { username: '', password: ''}
                .invoke('authenticate', {})
                //pull the auth token
                .pipe(function (result) {
                    return result.auth;
                })
                .pipe(function (auth) {
                    return sharepoint
                            .invoke('query', {
                                //perform query with the auth token
                                auth: auth,
                                resource: "CalendarListItems",
                                //get only the properties that I care to show,
                                //this will lower the bandwith usage.
                                select: "Title, Location, EventDate, EndDate",
                                //order the list server-side
                                orderBy: "EventDate"
                            });
                })
                //remove the OData unnecessary stuff.
                .pipe(function ( results ) {
                    return results.data.d.results;
                })
                .fail(function (err) {
                    kido.logging().writeError('Unable to get vacations: ' + JSON.stringify(err, 0 , 2));
                });
    },

    /**
     * gets the vacations discussion along with it's replies.
     * @api public
     */
    getDiscussion: function () {
        return model.discussionId.pipe(function (discussionId) {
                //$.when will execute both jive.invoke in parallel
                //and wait for both of them to finish.
                return $.when(
                        jive.invoke('getContent', {
                            "contentID":discussionId,
                            "params":{ "fields":"subject,content"}
                        }),
                        jive.invoke('getContentReplies', {
                             "contentID":discussionId,
                             "params": { "fields": "content,author" }
                        })
                    )
                    //in res1 and res2 are the responses to both of the
                    //jive.invoke we did with $.when
                    .pipe(function (res1, res2) {
                        var discussion     = res1[0].body;
                        discussion.replies = res2[0].body.list;
                        return discussion;
                    });
            })
            .fail(function (err) {
                kido.logging().writeError('Unable to get discussion from jive: ' + JSON.stringify(err, 0, 2));
            });
    },

    /**
     * sends a reply to the discussion of vacations.
     * @api public
     */
    sendReply: function (msg) {
        //use the discussionId from the config service
        return model.discussionId.pipe(function (discussionId) {
            return jive.invoke('createContentMessage', {
                "contentID": discussionId,
                "body": {
                    "content": {
                        "type": "text/html",
                        "text": "<body><p>" + msg + "</p></body>"
                    },
                    "type": "message"
                }
            });
        })
        .fail(function (err) {
            kido.logging().writeError('Unable to post a reply to jive: ' + JSON.stringify(err, 0, 2));
        });
    }
};