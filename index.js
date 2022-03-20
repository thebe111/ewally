const app = require('./src/app');

function bootstrap(app) {
    app.listen(8080, () => console.log('app started on port 8080\n'));
}

bootstrap(app);

