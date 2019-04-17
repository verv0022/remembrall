// Local Notifications:
// https://www.npmjs.com/package/de.appplant.cordova.plugin.local-notification/v/0.8.5
// https://github.com/katzer/cordova-plugin-local-notifications/wiki - reference
// https://github.com/katzer/cordova-plugin-local-notifications - beware the ReadMe file. This is v0.9.0-beta

// Installation
// cordova plugin add de.appplant.cordova.plugin.local-notification

//Build (XCode 10 causes build issues for iOS so it needs the --buildFlag)
// cordova emulate ios --target="iPhone-8, 12.0" --buildFlag="-UseModernBuildSystem=0"

// Dialogs:
// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-dialogs/index.html

let app = {

    pages: [],

    init: function () {
        if (window.hasOwnProperty("cordova")) {
            console.log("You're on a mobile device");
            document.addEventListener("deviceready", app.ready);
            app.pageSwitch();
        } else {
            document.addEventListener("DOMcontentLoaded", app.ready);
            console.log("we're in the browser")
            app.pageSwitch();
        }
    },
    ready: function () {
        app.addListeners();
    },

    addListeners: function () {
        document.querySelector("#add-btn").addEventListener("click", app.addNote);
        cordova.plugins.notification.local.on("click", function (notification) {
            navigator.notification.alert("clicked: " + notification.id);
            //user has clicked on the popped up notification
            console.log(notification.data);
        });
        cordova.plugins.notification.local.on("trigger", function (notification) {
            //added to the notification center on the date to trigger it.
            navigator.notification.alert("triggered: " + notification.id);
        });
    },

    pageSwitch: function () {

        app.pages = document.querySelectorAll('.page');
        app.pages[0].classList.add('active');

        app.pages.forEach(page => {
            page.querySelector('.nav').addEventListener('click', app.navigate);
        });
    },
    navigate: function (ev) {
        ev.preventDefault();
        let tapped = ev.currentTarget;
        if (tapped.getAttribute("data-id")) {
            app.reviewIndex = tapped.getAttribute("data-id");
        }
        console.log(tapped);
        document.querySelector('.active').classList.remove('active');
        let target = tapped.getAttribute('data-target');
        document.getElementById(target).classList.add('active');

    },

    addNote: function (ev) {
        let props = cordova.plugins.notification.local.getDefaults();
        let title = document.getElementById("title").value;
        let date = document.getElementById("date").value;
        let time = document.getElementById("time").value;
        let id = new Date().getMilliseconds();
        let timestamp = (selectedDate.valueOf() - (7 * 24 * 60 * 60 * 1000));
        let oneWeekAgo = new Date(timestamp);

        //console.log(props);
        /**
         * Notification Object Properties - use it as a reference later on
         * id
         * text
         * title
         * every
         * at
         * data
         * sound
         * badge
         */
        let inOneMin = new Date();
        inOneMin.setMinutes(inOneMin.getMinutes() + 1);
        let id = new Date().getMilliseconds();

        let noteOptions = {
            id: id,
            title: title,
            text: title,
            at: oneWeekAgo,
            badge: 1,
            data: title + "" + date + "" + time
        };

        

        /**
         * if(props.icon){
          noteOptions.icon = './img/calendar-md-@2x.png'
        }
        if(props.led){
          noteOptions.led = '#33CC00'
        }
        if(props.actions){
          noteOptions.actions = [{ id: "yes", title: "Do it" }, { id: "no", title: "Nah" }]
        }
        **/
        cordova.plugins.notification.local.schedule(noteOptions, function (note) {
            //this is the callback function for the schedule method
            //this runs AFTER the notification has been scheduled.
        });

        navigator.notification.alert("Added notification id " + id);

        cordova.plugins.notification.local.cancel(id, function () {
            // will get rid of notification id 1 if it has NOT been triggered or added to the notification center
            // cancelAll() will get rid of all of them
        });
        cordova.plugins.notification.local.clear(id, function () {
            // will dismiss a notification that has been triggered or added to notification center
        });
        cordova.plugins.notification.local.isPresent(id, function (present) {
            // navigator.notification.alert(present ? "present" : "not found");
            // can also call isTriggered() or isScheduled()
            // getAllIds(), getScheduledIds() and getTriggeredIds() will give you an array of ids
            // get(), getAll(), getScheduled() and getTriggered() will get the notification based on an id
        });

    }
};
app.init();