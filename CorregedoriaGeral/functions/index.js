const { onCall, HttpsError } =
    require("firebase-functions/v2/https");

const admin =
    require("firebase-admin");

admin.initializeApp();


// ==========================================================
// CRIAR USUÁRIO
// ==========================================================

exports.criarUsuario =
    onCall(
        async request => {

            // ==================================================
            // PRECISA ESTAR AUTENTICADO
            // ==================================================

            if (!request.auth) {

                throw new HttpsError(
                    "unauthenticated",
                    "Você precisa estar autenticado."
                );

            }


            const uidAdministrador =
                request.auth.uid;


            // ==================================================
            // BUSCAR PERFIL DO ADMINISTRADOR
            // ==================================================

            const adminRef =
                admin
                    .firestore()
                    .collection(
                        "usuarios"
                    )
                    .doc(
                        uidAdministrador
                    );


            const adminSnap =
                await adminRef.get();


            if (!adminSnap.exists) {

                throw new HttpsError(
                    "permission-denied",
                    "Perfil administrativo não encontrado."
                );

            }


            const adminPerfil =
                adminSnap.data();


            const cargo =
                String(
                    adminPerfil.cargo ||
                    ""
                )
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[\s-]+/g,
                        "_"
                    );


            const possuiPermissao =
                adminPerfil
                    .permissoes
                    ?.gerenciarUsuarios ===
                true;


            const autorizado =
                cargo ===
                    "administrador"
                ||
                cargo ===
                    "corregedor_geral"
                ||
                possuiPermissao;


            if (!autorizado) {

                throw new HttpsError(
                    "permission-denied",
                    "Você não possui permissão para criar usuários."
                );

            }


            // ==================================================
            // DADOS
            // ==================================================

            const dados =
                request.data || {};


            const nome =
                String(
                    dados.nome ||
                    ""
                ).trim();


            const email =
                String(
                    dados.email ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            const senha =
                String(
                    dados.senha ||
                    ""
                );


            const matricula =
                String(
                    dados.matricula ||
                    ""
                ).trim();


            const departamento =
                String(
                    dados.departamento ||
                    ""
                ).trim();


            const cargoNovo =
                String(
                    dados.cargo ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            const status =
                String(
                    dados.status ||
                    "ativo"
                )
                    .trim()
                    .toLowerCase();


            const foto =
                String(
                    dados.foto ||
                    ""
                ).trim();


            const permissoes =
                dados.permissoes &&
                typeof dados.permissoes ===
                "object"
                    ?
                    dados.permissoes
                    :
                    {};


            // ==================================================
            // VALIDAR
            // ==================================================

            if (!nome) {

                throw new HttpsError(
                    "invalid-argument",
                    "Informe o nome."
                );

            }


            if (!email) {

                throw new HttpsError(
                    "invalid-argument",
                    "Informe o e-mail."
                );

            }


            if (
                !senha ||
                senha.length < 6
            ) {

                throw new HttpsError(
                    "invalid-argument",
                    "A senha precisa ter pelo menos 6 caracteres."
                );

            }


            if (!matricula) {

                throw new HttpsError(
                    "invalid-argument",
                    "Informe a matrícula."
                );

            }


            if (!departamento) {

                throw new HttpsError(
                    "invalid-argument",
                    "Informe o departamento."
                );

            }


            if (!cargoNovo) {

                throw new HttpsError(
                    "invalid-argument",
                    "Informe o cargo."
                );

            }


            // ==================================================
            // VERIFICAR MATRÍCULA DUPLICADA
            // ==================================================

            const matriculaConsulta =
                await admin
                    .firestore()
                    .collection(
                        "usuarios"
                    )
                    .where(
                        "matricula",
                        "==",
                        matricula
                    )
                    .limit(
                        1
                    )
                    .get();


            if (
                !matriculaConsulta.empty
            ) {

                throw new HttpsError(
                    "already-exists",
                    "Essa matrícula já está cadastrada."
                );

            }


            let usuarioCriado =
                null;


            try {

                // ==================================================
                // CRIAR AUTHENTICATION
                // ==================================================

                usuarioCriado =
                    await admin
                        .auth()
                        .createUser(
                            {

                                email,

                                password:
                                    senha,

                                displayName:
                                    nome,

                                disabled:
                                    status !==
                                    "ativo"

                            }
                        );


                // ==================================================
                // CRIAR PERFIL NO FIRESTORE
                // ==================================================

                await admin
                    .firestore()
                    .collection(
                        "usuarios"
                    )
                    .doc(
                        usuarioCriado.uid
                    )
                    .set(
                        {

                            uid:
                                usuarioCriado.uid,

                            nome,

                            email,

                            matricula,

                            departamento,

                            cargo:
                                cargoNovo,

                            status,

                            foto,

                            permissoes,

                            criadoPor:
                                uidAdministrador,

                            criadoEm:
                                admin
                                    .firestore
                                    .FieldValue
                                    .serverTimestamp(),

                            atualizadoEm:
                                admin
                                    .firestore
                                    .FieldValue
                                    .serverTimestamp(),

                            ultimoAcesso:
                                null

                        }
                    );


                return {

                    sucesso:
                        true,

                    uid:
                        usuarioCriado.uid,

                    nome,

                    email

                };


            } catch (erro) {

                console.error(
                    "Erro ao criar usuário:",
                    erro
                );


                // ==================================================
                // ROLLBACK
                // ==================================================

                if (
                    usuarioCriado?.uid
                ) {

                    try {

                        await admin
                            .auth()
                            .deleteUser(
                                usuarioCriado.uid
                            );

                    } catch (
                        rollbackErro
                    ) {

                        console.error(
                            "Erro no rollback:",
                            rollbackErro
                        );

                    }

                }


                // ==================================================
                // E-MAIL JÁ EXISTE
                // ==================================================

                if (
                    erro.code ===
                    "auth/email-already-exists"
                ) {

                    throw new HttpsError(
                        "already-exists",
                        "Esse e-mail já possui uma conta."
                    );

                }


                throw new HttpsError(
                    "internal",
                    erro.message ||
                    "Não foi possível criar o usuário."
                );

            }

        }
    );