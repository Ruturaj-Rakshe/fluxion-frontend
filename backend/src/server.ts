import "dotenv/config";
import express from "express";
import routes from "./routes/rootRouter.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
// import webhook from "./routes/paymentRoutes.ts";
class Server {
    public app = express();
    private port = process.env.PORT || 5000;

    constructor() {
        this.config();
        this.routes();
        this.start();
    }

    private config() {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:4040";
        const adminUrl = process.env.ADMIN_URL || "http://localhost:3001";
        
        // Enable CORS for both client and admin apps
        this.app.use(cors({
            origin: [clientUrl, adminUrl],
            credentials: true,
        }));
        
        this.app.use(cookieParser());
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }


    private routes() {
        this.app.use("/api", routes);
        // this.app.use("/webhook", webhook)
        // this.app.use("/webhook", webhook)


    }

    private start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

new Server();
