requirejs.config({

    baseUrl: 'assets/js/lib',

    paths: {
        app: '../app'
    },

    map: {
        '*': {
            'masterapp': 'app/app',
            'underscore': 'underscore',
            'backbone': 'backbone',
            'marionette': 'backbone.marionette'
        }
    }
});

requirejs(['masterapp'],
function (MyApp) {

    MyApp.app.start();

})
