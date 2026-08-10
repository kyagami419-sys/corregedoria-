// ==========================================================
// SIGCOR
// assets/js/login.js
// ==========================================================

import {

    auth,
    configurarPersistencia,
    aguardarAuth

} from "../../firebase/firebase.js";


import {

    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


import {

    buscarPerfilUsuario

} from "../../firebase/auth.js";


// ==========================================================
// ELEMENTOS
// ==========================================================

const form =
    document.getElementById(
        "loginForm"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const senhaInput =
    document.getElementById(
        "senha"
    );


const lembrarInput =
    document.getElementById(
        "lembrarUsuario"
    );


const botao =
    document.getElementById(
        "loginButton"
    );


const alternarSenha =
    document.getElementById(
        "passwordToggle"
    );


const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


const mensagem =
    document.getElementById(
        "loginMessage"
    );


const mensagemTexto =
    document.getElementById(
        "loginMessageText"
    );


const overlay =
    document.getElementById(
        "loginLockOverlay"
    );


// ==========================================================
// MOSTRAR MENSAGEM
// ==========================================================

function mostrarMensagem(
    texto,
    tipo = "error"
) {

    if (
        mensagemTexto
    ) {

        mensagemTexto.textContent =
            texto;

    }


    if (
        mensagem
    ) {

        mensagem.classList.remove(
            "success",
            "error",
            "warning"
        );


        mensagem.classList.add(
            "show",
            tipo
        );

    }

}


// ==========================================================
// OVERLAY
// ==========================================================

function mostrarOverlay() {

    overlay?.classList.add(
        "show"
    );

}


function esconderOverlay() {

    overlay?.classList.remove(
        "show"
    );

}


// ==========================================================
// BOTÃO
// ==========================================================

function carregando(
    ativo
) {

    if (!botao) {

        return;

    }


    botao.disabled =
        ativo;


    botao.classList.toggle(
        "loading",
        ativo
    );

}


// ==========================================================
// REDIRECIONAR
// ==========================================================

function abrirDashboard() {

    console.log(
        "SIGCOR: abrindo dashboard."
    );


    window.location.href =
        "./pages/dashboard.html";

}


// ==========================================================
// LOGIN
// ==========================================================

async function efetuarLogin(
    evento
) {

    evento.preventDefault();


    const email =
        String(
            emailInput.value || ""
        )
            .trim()
            .toLowerCase();


    const senha =
        String(
            senhaInput.value || ""
        );


    if (
        !email ||
        !senha
    ) {

        mostrarMensagem(
            "Informe o e-mail e a senha.",
            "warning"
        );

        return;

    }


    carregando(
        true
    );


    mostrarOverlay();


    try {

        await configurarPersistencia(
            lembrarInput?.checked ===
            true
        );


        const resultado =
            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );


        console.log(
            "SIGCOR: Authentication OK",
            resultado.user.uid
        );


        const perfil =
            await buscarPerfilUsuario(
                resultado.user.uid
            );


        if (!perfil) {

            await signOut(
                auth
            );


            throw new Error(
                "PERFIL_NAO_ENCONTRADO"
            );

        }


        if (
            String(
                perfil.status || ""
            )
                .trim()
                .toLowerCase()
            !==
            "ativo"
        ) {

            await signOut(
                auth
            );


            throw new Error(
                "CONTA_INATIVA"
            );

        }


        console.log(
            "SIGCOR: perfil OK",
            perfil
        );


        sessionStorage.setItem(
            "sigcor_usuario",
            JSON.stringify(
                {

                    uid:
                        resultado.user.uid,

                    nome:
                        perfil.nome || "",

                    email:
                        perfil.email || email,

                    cargo:
                        perfil.cargo || "",

                    departamento:
                        perfil.departamento || "",

                    matricula:
                        perfil.matricula || "",

                    foto:
                        perfil.foto || ""

                }
            )
        );


        mostrarMensagem(
            `Bem-vindo(a), ${perfil.nome || "Usuário"}.`,
            "success"
        );


        console.log(
            "SIGCOR: login concluído."
        );


        setTimeout(
            abrirDashboard,
            300
        );

    } catch (erro) {

        console.error(
            "SIGCOR LOGIN:",
            erro
        );


        esconderOverlay();


        switch (
            erro?.code ||
            erro?.message
        ) {

            case "auth/invalid-credential":

                mostrarMensagem(
                    "E-mail ou senha incorretos."
                );

                break;


            case "auth/too-many-requests":

                mostrarMensagem(
                    "Muitas tentativas. Aguarde alguns minutos."
                );

                break;


            case "auth/network-request-failed":

                mostrarMensagem(
                    "Erro de conexão com o Firebase."
                );

                break;


            case "PERFIL_NAO_ENCONTRADO":

                mostrarMensagem(
                    "A conta existe, mas não possui perfil no Firestore."
                );

                break;


            case "CONTA_INATIVA":

                mostrarMensagem(
                    "Sua conta não está ativa."
                );

                break;


            default:

                mostrarMensagem(
                    "Não foi possível entrar no SIGCOR."
                );

        }

    } finally {

        carregando(
            false
        );

    }

}


// ==========================================================
// SUBMIT
// ==========================================================

form?.addEventListener(
    "submit",
    efetuarLogin
);


// ==========================================================
// MOSTRAR SENHA
// ==========================================================

alternarSenha?.addEventListener(
    "click",
    () => {

        const mostrar =
            senhaInput.type ===
            "password";


        senhaInput.type =
            mostrar
                ?
                "text"
                :
                "password";


        const icone =
            document.getElementById(
                "passwordIcon"
            );


        icone?.setAttribute(
            "data-lucide",
            mostrar
                ?
                "eye-off"
                :
                "eye"
        );


        window.lucide
            ?.createIcons();

    }
);


// ==========================================================
// RECUPERAR SENHA
// ==========================================================

forgotPassword?.addEventListener(
    "click",
    async evento => {

        evento.preventDefault();


        const email =
            String(
                emailInput.value || ""
            )
                .trim()
                .toLowerCase();


        if (!email) {

            mostrarMensagem(
                "Digite seu e-mail primeiro.",
                "warning"
            );

            return;

        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            mostrarMensagem(
                "E-mail de recuperação enviado.",
                "success"
            );

        } catch (erro) {

            console.error(
                erro
            );


            mostrarMensagem(
                "Não foi possível enviar a recuperação."
            );

        }

    }
);


// ==========================================================
// SESSÃO JÁ ATIVA
// ==========================================================

(async () => {

    try {

        const usuario =
            await aguardarAuth();


        if (!usuario) {

            esconderOverlay();

            return;

        }


        const perfil =
            await buscarPerfilUsuario(
                usuario.uid
            );


        if (
            perfil &&
            String(
                perfil.status || ""
            )
                .trim()
                .toLowerCase() ===
                "ativo"
        ) {

            console.log(
                "SIGCOR: sessão existente."
            );


            abrirDashboard();

            return;

        }


        await signOut(
            auth
        );


        esconderOverlay();

    } catch (erro) {

        console.error(
            "SIGCOR sessão:",
            erro
        );


        esconderOverlay();

    }

})();