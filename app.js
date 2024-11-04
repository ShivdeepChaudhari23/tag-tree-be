import express from "express";
import { configDotenv } from "dotenv";
import cors from 'cors';
import { getTree, postTree } from "./controllers/index.js";
import con from "./utils/db.js";

configDotenv();

const app = express();

app.use(cors({
    methods: ['GET', 'POST'],
}));

app.use(express.json());

app.get('/tree', getTree);

app.post('/tree', postTree);

app.get('/test', (req, res) => res.status(200).json({ greetings: `Hello ${req.query.name}` }));
const server = app.listen(process.env.PORT, () => console.log('Listening Requests on : %o', process.env.PORT));

function closeServer() {
    console.log('Initiating Exit...');

    // Set a timeout to forcefully exit if shutdown takes too long
    const shutdownTimeout = setTimeout(() => {
        console.error('Shutdown Timeout... Initiating Forceful Exit');
        process.exit(1);
    }, 10000); // 10-second timeout

    // Close Database connection
    con.end((error) => {
        if (error) {
            console.error('Failed to terminate database connection:', error);
        } else {
            console.log('Database connection terminated!');
        }

        // Stop server
        server.close((error) => {
            clearTimeout(shutdownTimeout);  // Clear timeout if shutdown completes
            if (error) {
                console.error('Failed to terminate server');
                process.exit(1);
            }
            console.log('Server terminated');
            process.exit(0);
        });
    });
}


process.on('SIGTERM', closeServer);
process.on('SIGINT', closeServer);
