import express from 'express';
import expressWs from 'express-ws';

const expressWsInstance = expressWs(express());
const app = expressWsInstance.app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT: number = 3001;

app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
});

app.ws('/', function(ws, _req) {
    ws.on('message', function(msg) {
        console.log('server msg received: ' + msg);
    });

    ws.on('close', function (_code, _reason) {
        console.log('connection closed')
    })
});

expressWsInstance.getWss().on('connection', function () {
    console.log('new connection')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});