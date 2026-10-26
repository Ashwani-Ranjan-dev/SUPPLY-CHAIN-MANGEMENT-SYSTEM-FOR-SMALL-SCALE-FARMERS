import "dotenv/config";
import app from "./app.js";
import ConnectDB from "./config/db.js";
import { startMandiPriceSyncJob } from "./jobs/mandiPriceSyncJob.js";

const PORT = process.env.PORT || 50000;

const StartServer = async () => {
    await ConnectDB();

    startMandiPriceSyncJob();
    
    app.listen(PORT, () => {
        console.log(`KrishiConnect is listening on ${PORT}`);
    });
}

StartServer();