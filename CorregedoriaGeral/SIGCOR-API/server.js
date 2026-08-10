import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usuariosRoutes from "./routes/usuarios.js";

dotenv.config();

const app = express();

const PORT =
    process.env.PORT || 8080;


// ==========================================================
// CORS
// ==========================================================

app.use(
    cors({
        origin: process.env.FRONTEND_URL || true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// ==========================================================
// JSON
// ==========================================================

app.use(
    express.json({
        limit: "2mb"
    })
);


// ==========================================================
// STATUS
// ==========================================================

app.get("/", (req, res) => {

    res.json({
        sistema: "SIGCOR API",
        status: "online",
        versao: "1.0.0"
    });

});


app.get("/api/status", (req, res) => {

    res.json({
        online: true,
        sistema: "SIGCOR",
        api: "Valkyria Optimization"
    });

});


// ==========================================================
// ROTAS
// ==========================================================

app.use(
    "/api/usuarios",
    usuariosRoutes
);


// ==========================================================
// 404
// ==========================================================

app.use((req, res) => {

    res.status(404).json({
        sucesso: false,
        erro: "Rota não encontrada."
    });

});


// ==========================================================
// ERRO
// ==========================================================

app.use((erro, req, res, next) => {

    console.error(
        "SIGCOR API:",
        erro
    );

    res.status(500).json({
        sucesso: false,
        erro: "Erro interno do servidor."
    });

});


// ==========================================================
// INICIAR
// ==========================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `SIGCOR API online na porta ${PORT}`
        );

    }
);