/**
 *
 */
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app'
    }
});

// application entry point
requirejs('app/tshirt-constructor');