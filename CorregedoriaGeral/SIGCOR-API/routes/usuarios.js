import express from "express";

import {
    admin,
    auth,
    db
} from "../config/firebase.js";

import {
    autenticar,
    exigirGerenciamentoUsuarios
} from "../middleware/auth.js";


const router =
    express.Router();


// ==========================================================
// TODAS AS ROTAS EXIGEM LOGIN
// ==========================================================

router.use(
    autenticar
);


// ==========================================================
// LISTAR USUÁRIOS
// ==========================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const snapshot =
                await db
                    .collection("usuarios")
                    .get();


            const usuarios =
                snapshot.docs.map(
                    documento => ({
                        id: documento.id,
                        ...documento.data()
                    })
                );


            return res.json({
                sucesso: true,
                usuarios
            });


        } catch (erro) {

            console.error(
                "Listar usuários:",
                erro
            );


            return res.status(500).json({
                sucesso: false,
                erro:
                    "Não foi possível carregar os usuários."
            });

        }

    }
);


// ==========================================================
// CRIAR USUÁRIO
// ==========================================================

router.post(
    "/",
    exigirGerenciamentoUsuarios,
    async (req, res) => {

        let contaCriada =
            null;


        try {

            const {
                nome,
                email,
                senha,
                matricula,
                departamento,
                cargo,
                status = "ativo",
                foto = "",
                permissoes = {}
            } = req.body;


            // ==================================================
            // VALIDAÇÃO
            // ==================================================

            if (
                !nome ||
                !email ||
                !senha ||
                !matricula ||
                !departamento ||
                !cargo
            ) {

                return res.status(400).json({
                    sucesso: false,
                    erro:
                        "Preencha todos os campos obrigatórios."
                });

            }


            if (
                String(senha).length < 6
            ) {

                return res.status(400).json({
                    sucesso: false,
                    erro:
                        "A senha precisa ter pelo menos 6 caracteres."
                });

            }


            const emailNormalizado =
                String(email)
                    .trim()
                    .toLowerCase();


            // ==================================================
            // MATRÍCULA DUPLICADA
            // ==================================================

            const matriculaExistente =
                await db
                    .collection("usuarios")
                    .where(
                        "matricula",
                        "==",
                        String(matricula).trim()
                    )
                    .limit(1)
                    .get();


            if (
                !matriculaExistente.empty
            ) {

                return res.status(409).json({
                    sucesso: false,
                    erro:
                        "Essa matrícula já está cadastrada."
                });

            }


            // ==================================================
            // FIREBASE AUTH
            // ==================================================

            contaCriada =
                await auth.createUser({
                    email:
                        emailNormalizado,

                    password:
                        String(senha),

                    displayName:
                        String(nome).trim(),

                    disabled:
                        status !== "ativo"
                });


            // ==================================================
            // FIRESTORE
            // ==================================================

            await db
                .collection("usuarios")
                .doc(contaCriada.uid)
                .set({

                    uid:
                        contaCriada.uid,

                    nome:
                        String(nome).trim(),

                    email:
                        emailNormalizado,

                    matricula:
                        String(matricula).trim(),

                    departamento:
                        String(departamento).trim(),

                    cargo:
                        String(cargo)
                            .trim()
                            .toLowerCase(),

                    status:
                        String(status)
                            .trim()
                            .toLowerCase(),

                    foto:
                        String(foto || "").trim(),

                    permissoes:
                        permissoes || {},

                    criadoPor:
                        req.usuario.uid,

                    criadoEm:
                        admin.firestore
                            .FieldValue
                            .serverTimestamp(),

                    atualizadoEm:
                        admin.firestore
                            .FieldValue
                            .serverTimestamp(),

                    ultimoAcesso:
                        null
                });


            return res.status(201).json({

                sucesso: true,

                mensagem:
                    "Usuário criado com sucesso.",

                usuario: {
                    uid:
                        contaCriada.uid,

                    nome:
                        String(nome).trim(),

                    email:
                        emailNormalizado
                }

            });


        } catch (erro) {

            console.error(
                "Criar usuário:",
                erro
            );


            // Rollback

            if (
                contaCriada?.uid
            ) {

                try {

                    await auth.deleteUser(
                        contaCriada.uid
                    );

                } catch (
                    rollbackErro
                ) {

                    console.error(
                        "Rollback:",
                        rollbackErro
                    );

                }

            }


            if (
                erro.code ===
                "auth/email-already-exists"
            ) {

                return res.status(409).json({
                    sucesso: false,
                    erro:
                        "Este e-mail já possui uma conta."
                });

            }


            return res.status(500).json({
                sucesso: false,
                erro:
                    "Não foi possível criar o usuário."
            });

        }

    }
);


// ==========================================================
// EDITAR USUÁRIO
// ==========================================================

router.put(
    "/:uid",
    exigirGerenciamentoUsuarios,
    async (req, res) => {

        try {

            const uid =
                req.params.uid;


            const {
                nome,
                email,
                matricula,
                departamento,
                cargo,
                status,
                foto,
                permissoes
            } = req.body;


            const atualizacaoAuth =
                {};


            if (email) {

                atualizacaoAuth.email =
                    String(email)
                        .trim()
                        .toLowerCase();

            }


            if (nome) {

                atualizacaoAuth.displayName =
                    String(nome).trim();

            }


            if (status) {

                atualizacaoAuth.disabled =
                    status !== "ativo";

            }


            if (
                Object.keys(
                    atualizacaoAuth
                ).length
            ) {

                await auth.updateUser(
                    uid,
                    atualizacaoAuth
                );

            }


            await db
                .collection("usuarios")
                .doc(uid)
                .set(
                    {

                        ...(nome !== undefined
                            ? { nome }
                            : {}),

                        ...(email !== undefined
                            ? {
                                email:
                                    String(email)
                                        .trim()
                                        .toLowerCase()
                            }
                            : {}),

                        ...(matricula !== undefined
                            ? { matricula }
                            : {}),

                        ...(departamento !== undefined
                            ? { departamento }
                            : {}),

                        ...(cargo !== undefined
                            ? { cargo }
                            : {}),

                        ...(status !== undefined
                            ? { status }
                            : {}),

                        ...(foto !== undefined
                            ? { foto }
                            : {}),

                        ...(permissoes !== undefined
                            ? { permissoes }
                            : {}),

                        atualizadoEm:
                            admin.firestore
                                .FieldValue
                                .serverTimestamp()

                    },
                    {
                        merge: true
                    }
                );


            return res.json({
                sucesso: true,
                mensagem:
                    "Usuário atualizado."
            });


        } catch (erro) {

            console.error(
                "Editar usuário:",
                erro
            );


            return res.status(500).json({
                sucesso: false,
                erro:
                    "Não foi possível editar o usuário."
            });

        }

    }
);


// ==========================================================
// EXCLUIR USUÁRIO
// ==========================================================

router.delete(
    "/:uid",
    exigirGerenciamentoUsuarios,
    async (req, res) => {

        try {

            const uid =
                req.params.uid;


            if (
                uid === req.usuario.uid
            ) {

                return res.status(400).json({
                    sucesso: false,
                    erro:
                        "Você não pode excluir sua própria conta."
                });

            }


            await auth.deleteUser(
                uid
            );


            await db
                .collection("usuarios")
                .doc(uid)
                .delete();


            return res.json({
                sucesso: true,
                mensagem:
                    "Usuário removido."
            });


        } catch (erro) {

            console.error(
                "Excluir usuário:",
                erro
            );


            return res.status(500).json({
                sucesso: false,
                erro:
                    "Não foi possível excluir o usuário."
            });

        }

    }
);


export default router;