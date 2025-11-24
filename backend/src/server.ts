import express from "express";
import routes from "./routes/rootRouter.ts";
import cors from "cors";
import cookieParser from "cookie-parser";

class Server {
    public app = express();
    private port = process.env.PORT || 5000;

    constructor() {
        this.config();
        this.routes();
        this.start();
    }

    private config() {
        // Validate FRONTEND_URL is configured
        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) {
            console.error(" FRONTEND_URL environment variable is not set");
            process.exit(1);
        }

        // Enable CORS
        this.app.use(cors({
            origin: frontendUrl,
            credentials: true,
        }));
        
        this.app.use(cookieParser());
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes() {
        this.app.use("/api", routes);
    }

    private start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

new Server();
