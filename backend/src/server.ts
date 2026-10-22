import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import v1Router from "./routes";
import { connectMongoDB } from "./config/db";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
type Environment = "development" | "test" | "production";
const NODE_ENV: Environment = (process.env.NODE_ENV as Environment) ?? "development";

// QUERY no esta en los metodos por defecto de cors: sin esto el preflight de QUERY /subjects falla.

// CORS_ORIGIN acepta una lista de origenes separada por comas.
// Con un unico valor fijo, el header Access-Control-Allow-Origin se devuelve siempre con ese
// valor: si el frontend se abre en otro host o puerto (127.0.0.1, otro puerto) el browser
// descarta la respuesta y axios lo reporta como "Network Error".
const configuredOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// En desarrollo se admite cualquier loopback (localhost/127.0.0.1) en cualquier puerto.
// En produccion solo los origenes configurados: con credentials:true, reflejar cualquier
// origen seria un agujero de CSRF.
const isLoopbackOrigin = (origin: string): boolean =>
    NODE_ENV === "development" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(cors({
    origin: (origin, callback) => {
        // Sin header Origin (curl, server-to-server) no hay CORS que aplicar.
        if (!origin) {
            callback(null, true);
            return;
        }
        callback(null, configuredOrigins.includes(origin) || isLoopbackOrigin(origin));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "QUERY"],
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", v1Router);

if (NODE_ENV === 'development') {
    app.get("/", (_req: Request, res: Response) => {
        res.send("hola");
    });
}

app.get("/health", (_req: Request, res: Response) => {
    res.json({
        status: "ok",
        uptimeSeconds: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

async function startServer(): Promise<void> {
    await connectMongoDB();

    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}

startServer().catch((error: unknown) => {
    console.error("[server] failed to start:", error);
    process.exit(1);
});