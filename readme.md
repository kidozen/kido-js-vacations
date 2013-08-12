##Kidozen HTML5 Sharepoint Vacations sample

The purpose of this app is show how you might create an application using
the Sharepoint and Jive Enterprise APIs shipped with KidoZen.

For information on Kidozen, please visit: [http://kidozen.com](http://kidozen.com)

#Summary

This sample app shows how a simple application that uses the shared Sharepoint
Calendar on our team, to keep track of who is having vacations when. This helps
us organize the vacations a little bit better. It also contains a "Discussion"
panel, where we can discuss potential dates, and opinions about destinations.
The discussion panel is powered by Jive service, the social enterprise platform

#Description

The users can perform the following actions:

- Automatically pulls the Sharepoint Calendar using default Sharepoint
credentials.
- The home screen displays the list of vacations that the team has scheduled in
ascending order (sorted server side).
- Request for vacations using the "Request" form. This will send an email to
the approver which was previously taken from the Configuration Service.
- Can see the discussion panel, and post comments. Uses a Jive discussion
configured in the configuration service.

#Code Structure

We have chosen to use MVC, a pattern that keeps the code from the UI separated
from the code of the Domain Model.
Sections:

- Event handlers (app.js): routes the events to the right controller.
- Controllers (controller.js): in charge of calling the model and rendering the right view.
- Views (view.js): render the information in the HTML though dinamic DOM manipulation.
- Model (model.js): Access to the backend services and domain specific logic.

#Setting up the SharePoint Service

You will have to create a service instance using the SharePoint Enterprise API
from your KidoZen Application Center. If you have an admin profile, you can use
the "Admin" tab, and then go to the "Enterprise APIs" menu to see the list of
services available.

Click on the "SharePoint" API and configure your SharePoint account (ie:
kidozen.SharePoint.com) with some default credentials (optional).

Note: it might be a good idea to somewhat restrict the access of the default
credentials in your SharePoint site.

#Running the app locally

In order to run the app locally, you need to have a KidoZen account, and have
the [kido](https://github.com/kidozen/kido) client tool installed (see the 
[docs](http://docs.kidozen.com/sdks/javascript/) for more information).