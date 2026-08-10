// ==========================================================
// SIGCOR
// assets/js/novo-inquerito.js
// ==========================================================

import {
    protegerPagina,
    logout,
    gerarIniciais,
    normalizarCargo
} from "../../firebase/auth.js";


// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

const CONFIG = {
    apiBase: "https://corregedoriapf.discloud.app"
};


// ==========================================================
// ESTADO
// ==========================================================

let usuarioLogado = null;
let perfilLogado = null;


// ==========================================================
// ELEMENTOS
// ==========================================================

const elementos = {

    userAvatar:
        document.getElementById("userAvatar"),

    userName:
        document.getElementById("userName"),

    userRole:
        document.getElementById("userRole"),

    logoutButton:
        document.getElementById("logoutButton"),

    form:
        document.getElementById("inqueritoForm"),

    titulo:
        document.getElementById("titulo"),

    tipo:
        document.getElementById("tipo"),

    status:
        document.getElementById("status"),

    responsavel:
        document.getElementById("responsavel"),

    numeroExterno:
        document.getElementById("numeroExterno"),

    descricao:
        document.getElementById("descricao"),

    envolvidos:
        document.getElementById("envolvidos"),

    observacoes:
        document.getElementById("observacoes"),

    salvar:
        document.getElementById("salvarInquerito"),

    toastContainer:
        document.getElementById("toastContainer")

};


// ==========================================================
// INICIAR
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    try {

        const sessao =
            await protegerPagina();

        if (!sessao) {
            return;
        }

        usuarioLogado =
            sessao.usuario;

        perfilLogado =
            sessao.perfil;

        preencherPerfil();

        preencherResponsavel();

        configurarEventos();

        window.lucide?.createIcons();

    } catch (erro) {

        console.error(
            "SIGCOR - Novo Inquérito:",
            erro
        );

        mostrarToast(
            "Não foi possível carregar a página.",
            "error"
        );

    }

}


// ==========================================================
// PERFIL
// ==========================================================

function preencherPerfil() {

    const nome =
        perfilLogado?.nome ||
        usuarioLogado?.email ||
        "Usuário";

    if (elementos.userName) {
        elementos.userName.textContent =
            nome;
    }

    if (elementos.userRole) {
        elementos.userRole.textContent =
            formatarCargo(
                perfilLogado?.cargo
            );
    }

    if (elementos.userAvatar) {

        const foto =
            String(
                perfilLogado?.foto ||
                ""
            ).trim();

        if (foto) {

            elementos.userAvatar.innerHTML = `
                <img
                    src="${escaparHTML(foto)}"
                    alt="${escaparHTML(nome)}"
                >
            `;

        } else {

            elementos.userAvatar.textContent =
                gerarIniciais(nome);

        }

    }

}


// ==========================================================
// RESPONSÁVEL PADRÃO
// ==========================================================

function preencherResponsavel() {

    if (!elementos.responsavel) {
        return;
    }

    if (
        !elementos.responsavel.value.trim()
    ) {

        elementos.responsavel.value =
            perfilLogado?.nome ||
            usuarioLogado?.email ||
            "";

    }

}


// ==========================================================
// EVENTOS
// ==========================================================

function configurarEventos() {

    elementos.logoutButton
        ?.addEventListener(
            "click",
            logout
        );

    elementos.form
        ?.addEventListener(
            "submit",
            salvarInquerito
        );

}


// ==========================================================
// SALVAR
// ==========================================================

async function salvarInquerito(
    evento
) {

    evento.preventDefault();

    removerErros();

    if (!validarFormulario()) {

        mostrarToast(
            "Preencha os campos obrigatórios.",
            "error"
        );

        return;

    }

    definirSalvando(true);

    try {

        if (!usuarioLogado) {

            throw new Error(
                "Sessão não encontrada."
            );

        }

        const token =
            await usuarioLogado.getIdToken();

        const dados = {

            titulo:
                elementos.titulo.value
                    .trim(),

            tipo:
                elementos.tipo.value,

            status:
                elementos.status.value,

            responsavel:
                elementos.responsavel.value
                    .trim(),

            responsavelNome:
                elementos.responsavel.value
                    .trim(),

            numeroExterno:
                elementos.numeroExterno.value
                    .trim(),

            descricao:
                elementos.descricao.value
                    .trim(),

            envolvidos:
                elementos.envolvidos.value
                    .trim(),

            observacoes:
                elementos.observacoes.value
                    .trim()

        };

        const resposta =
            await fetch(
                `${CONFIG.apiBase}/api/inqueritos`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            dados
                        )
                }
            );

        let resultado;

        try {

            resultado =
                await resposta.json();

        } catch {

            throw new Error(
                "A API retornou uma resposta inválida."
            );

        }

        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                "Não foi possível criar o inquérito."
            );

        }

        mostrarToast(
            "Inquérito criado com sucesso.",
            "success"
        );

        const id =
            resultado.id;

        setTimeout(
            () => {

                if (id) {

                    window.location.href =
                        `./visualizar.html?id=${encodeURIComponent(id)}`;

                } else {

                    window.location.href =
                        "./inqueritos.html";

                }

            },
            900
        );

    } catch (erro) {

        console.error(
            "SIGCOR - criar inquérito:",
            erro
        );

        mostrarToast(
            erro.message ||
            "Não foi possível criar o inquérito.",
            "error"
        );

    } finally {

        definirSalvando(false);

    }

}


// ==========================================================
// VALIDAR
// ==========================================================

function validarFormulario() {

    let valido = true;

    const obrigatorios = [

        elementos.titulo,
        elementos.tipo,
        elementos.status,
        elementos.descricao

    ];

    obrigatorios.forEach(
        campo => {

            if (
                !String(
                    campo?.value ||
                    ""
                ).trim()
            ) {

                campo
                    ?.classList
                    .add(
                        "input-error"
                    );

                valido = false;

            }

        }
    );

    if (
        String(
            elementos.titulo?.value ||
            ""
        ).trim().length < 3
    ) {

        elementos.titulo
            ?.classList
            .add(
                "input-error"
            );

        valido = false;

    }

    if (
        String(
            elementos.descricao?.value ||
            ""
        ).trim().length < 10
    ) {

        elementos.descricao
            ?.classList
            .add(
                "input-error"
            );

        valido = false;

    }

    return valido;

}


// ==========================================================
// REMOVER ERROS
// ==========================================================

function removerErros() {

    elementos.form
        ?.querySelectorAll(
            ".input-error"
        )
        .forEach(
            elemento => {

                elemento.classList.remove(
                    "input-error"
                );

            }
        );

}


// ==========================================================
// ESTADO DO BOTÃO
// ==========================================================

function definirSalvando(
    ativo
) {

    if (!elementos.salvar) {
        return;
    }

    elementos.salvar.disabled =
        ativo;

    elementos.salvar.textContent =
        ativo
            ? "Criando..."
            : "Criar Inquérito";

}


// ==========================================================
// TOAST
// ==========================================================

function mostrarToast(
    mensagem,
    tipo = "success"
) {

    if (!elementos.toastContainer) {

        console.log(mensagem);

        return;

    }

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `toast ${tipo}`;

    toast.textContent =
        mensagem;

    elementos.toastContainer
        .appendChild(
            toast
        );

    setTimeout(
        () => {

            toast.remove();

        },
        4000
    );

}


// ==========================================================
// CARGO
// ==========================================================

function formatarCargo(
    cargo
) {

    const chave =
        normalizarCargo(
            cargo
        );

    const mapa = {

        administrador:
            "Administrador",

        corregedor_geral:
            "Corregedor-Geral",

        sub_corregedor:
            "Subcorregedor",

        subcorregedor:
            "Subcorregedor",

        corregedor:
            "Corregedor",

        investigador:
            "Investigador",

        perito:
            "Perito",

        escrivao:
            "Escrivão",

        consulta:
            "Consulta"

    };

    return (
        mapa[chave] ||
        cargo ||
        "-"
    );

}


// ==========================================================
// HTML
// ==========================================================

function escaparHTML(
    valor
) {

    return String(
        valor ??
        ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}