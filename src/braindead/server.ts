import express from 'express';
import bodyParser from 'body-parser';

import { config } from './configuration';
import { TEST_PATH } from './constants';
import { handleRequest } from './functions';


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.text({type: 'text/plain'}));

if (config.test_mode || config.frontend_mode) {
    app.use(express.static(config.test_mode ? TEST_PATH : config.frontend_path));
}

app.route('/api/*')
    .get((req, res) => {
        const responseData = handleRequest('get', req);
        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
    })
    .post((req, res) => {
        const responseData = handleRequest('post', req);
        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
    })
    .put((req, res) => {
        const responseData = handleRequest('put', req);
        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
    })
    .delete((req, res) => {
        const responseData = handleRequest('delete', req);
        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
    });

app.listen(config.port, () => console.log(`on ${config.port}`));
