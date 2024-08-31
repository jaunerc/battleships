import express, {Express} from 'express';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT: number = 3001;

app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'Hello from the server 2!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});