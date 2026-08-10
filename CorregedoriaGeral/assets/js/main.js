// =========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// assets/js/main.js
//
// Responsável por:
// - Inicialização global das páginas internas
// - Sidebar mobile
// - Overlay
// - Dropdowns
// - Links ativos
// - Lucide Icons
// - Dados básicos do usuário
// - Navegação
// - Logout
// - Atalhos
// - Relógio/data
// - Utilidades gerais da interface
// =========================================================


// =========================================================
// AUTENTICAÇÃO
// =========================================================

import {
    protegerPagina,
    configurarLogout,
    obterPerfilAtual,
    aplicarUsuarioNaInterface,
    aplicarPermissoesVisuais
} from "../../firebase/auth.js";


// =========================================================
// ESTADO
// =========================================================

let perfilAtual = null;

let sistemaInicializado = false;


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await iniciarSistema();

    }
);


// =========================================================
// INICIAR SISTEMA
// =========================================================

async function iniciarSistema() {

    if (sistemaInicializado) {

        return;

    }


    sistemaInicializado =
        true;


    try {

        // =================================================
        // AUTENTICAÇÃO
        // =================================================

        const resultado =
            await protegerPagina();


        if (!resultado) {

            return;

        }


        perfilAtual =
            resultado.perfil ||
            obterPerfilAtual();


        // =================================================
        // INTERFACE DO USUÁRIO
        // =================================================

        if (perfilAtual) {

            aplicarUsuarioNaInterface(
                perfilAtual,
                resultado.usuario
            );


            aplicarPermissoesVisuais(
                perfilAtual
            );

        }


        // =================================================
        // CONFIGURAÇÕES GERAIS
        // =================================================

        configurarLogout();

        configurarSidebar();

        configurarOverlaySidebar();

        configurarDropdowns();

        configurarMenuAtivo();

        configurarLinks();

        configurarAtalhos();

        configurarNavbar();

        configurarRelogio();

        configurarTooltips();

        configurarBotoesVoltar();

        configurarConfirmacoes();

        configurarModais();

        configurarEscape();

        recriarIcones();


        document.body.classList.add(
            "sigcor-ready"
        );

    } catch (erro) {

        console.error(
            "SIGCOR - Erro ao inicializar sistema:",
            erro
        );

    }

}


// =========================================================
// SIDEBAR
// =========================================================

function configurarSidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    const botaoMenu =
        document.getElementById(
            "mobileMenuButton"
        )
        ||
        document.querySelector(
            ".mobile-menu-button"
        );


    if (
        !sidebar ||
        !botaoMenu
    ) {

        return;

    }


    botaoMenu.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();


            sidebar.classList.toggle(
                "open"
            );


            atualizarOverlaySidebar();

        }
    );

}


// =========================================================
// OVERLAY SIDEBAR
// =========================================================

function configurarOverlaySidebar() {

    let overlay =
        document.querySelector(
            ".sidebar-overlay"
        );


    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "sidebar-overlay";


        document.body.appendChild(
            overlay
        );

    }


    overlay.addEventListener(
        "click",
        fecharSidebar
    );

}


// =========================================================
// ATUALIZAR OVERLAY
// =========================================================

function atualizarOverlaySidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    const overlay =
        document.querySelector(
            ".sidebar-overlay"
        );


    if (
        !sidebar ||
        !overlay
    ) {

        return;

    }


    overlay.classList.toggle(
        "show",
        sidebar.classList.contains(
            "open"
        )
    );

}


// =========================================================
// FECHAR SIDEBAR
// =========================================================

function fecharSidebar() {

    document
        .querySelector(
            ".sidebar"
        )
        ?.classList
        .remove(
            "open"
        );


    document
        .querySelector(
            ".sidebar-overlay"
        )
        ?.classList
        .remove(
            "show"
        );

}


// =========================================================
// DROPDOWNS
// =========================================================

function configurarDropdowns() {

    document
        .querySelectorAll(
            ".dropdown"
        )
        .forEach(
            dropdown => {

                const trigger =
                    dropdown.querySelector(
                        "[data-dropdown-toggle]"
                    );


                if (!trigger) {

                    return;

                }


                trigger.addEventListener(
                    "click",
                    evento => {

                        evento.stopPropagation();


                        fecharTodosDropdowns(
                            dropdown
                        );


                        dropdown.classList.toggle(
                            "open"
                        );

                    }
                );

            }
        );


    document.addEventListener(
        "click",
        () => {

            fecharTodosDropdowns();

        }
    );

}


// =========================================================
// FECHAR DROPDOWNS
// =========================================================

function fecharTodosDropdowns(
    excecao = null
) {

    document
        .querySelectorAll(
            ".dropdown.open"
        )
        .forEach(
            dropdown => {

                if (
                    excecao &&
                    dropdown === excecao
                ) {

                    return;

                }


                dropdown.classList.remove(
                    "open"
                );

            }
        );

}


// =========================================================
// MENU ATIVO
// =========================================================

function configurarMenuAtivo() {

    const paginaAtual =
        obterPaginaAtual();


    document
        .querySelectorAll(
            ".sidebar-link"
        )
        .forEach(
            link => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {

                    return;

                }


                const paginaLink =
                    href
                        .split("?")[0]
                        .split("#")[0]
                        .split("/")
                        .pop();


                const ativo =
                    paginaLink ===
                    paginaAtual;


                link.classList.toggle(
                    "active",
                    ativo
                );


                if (ativo) {

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    link.removeAttribute(
                        "aria-current"
                    );

                }

            }
        );

}


// =========================================================
// OBTER PÁGINA ATUAL
// =========================================================

function obterPaginaAtual() {

    const pagina =
        window.location.pathname
            .split("/")
            .pop();


    return (
        pagina ||
        "index.html"
    );

}


// =========================================================
// LINKS INTERNOS
// =========================================================

function configurarLinks() {

    document
        .querySelectorAll(
            ".sidebar-link"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        if (
                            window.innerWidth <=
                            900
                        ) {

                            fecharSidebar();

                        }

                    }
                );

            }
        );

}


// =========================================================
// NAVBAR
// =========================================================

function configurarNavbar() {

    const botaoNotificacoes =
        document.getElementById(
            "notificationButton"
        );


    botaoNotificacoes?.addEventListener(
        "click",
        () => {

            const painel =
                document.getElementById(
                    "notificationPanel"
                );


            painel?.classList.toggle(
                "show"
            );

        }
    );

}


// =========================================================
// RELÓGIO
// =========================================================

function configurarRelogio() {

    atualizarRelogio();


    setInterval(
        atualizarRelogio,
        30000
    );

}


// =========================================================
// ATUALIZAR RELÓGIO
// =========================================================

function atualizarRelogio() {

    const agora =
        new Date();


    const hora =
        agora.toLocaleTimeString(
            "pt-BR",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );


    const data =
        agora.toLocaleDateString(
            "pt-BR",
            {
                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"
            }
        );


    document
        .querySelectorAll(
            "[data-current-time]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    hora;

            }
        );


    document
        .querySelectorAll(
            "[data-current-date]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    data;

            }
        );


    document
        .querySelectorAll(
            "[data-current-datetime]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    `${data} • ${hora}`;

            }
        );

}


// =========================================================
// TOOLTIP
// =========================================================

function configurarTooltips() {

    document
        .querySelectorAll(
            "[title]"
        )
        .forEach(
            elemento => {

                if (
                    elemento.dataset.tooltip
                ) {

                    return;

                }


                const titulo =
                    elemento.getAttribute(
                        "title"
                    );


                if (!titulo) {

                    return;

                }


                elemento.dataset.tooltip =
                    titulo;


                elemento.removeAttribute(
                    "title"
                );

            }
        );

}


// =========================================================
// BOTÕES VOLTAR
// =========================================================

function configurarBotoesVoltar() {

    document
        .querySelectorAll(
            "[data-back]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    evento => {

                        evento.preventDefault();


                        if (
                            window.history.length >
                            1
                        ) {

                            window.history.back();

                            return;

                        }


                        window.location.href =
                            "./dashboard.html";

                    }
                );

            }
        );

}


// =========================================================
// CONFIRMAÇÕES
//
// Exemplo:
//
// data-confirm="Deseja excluir?"
// =========================================================

function configurarConfirmacoes() {

    document
        .querySelectorAll(
            "[data-confirm]"
        )
        .forEach(
            elemento => {

                elemento.addEventListener(
                    "click",
                    evento => {

                        const mensagem =
                            elemento.dataset
                                .confirm;


                        if (!mensagem) {

                            return;

                        }


                        const confirmar =
                            window.confirm(
                                mensagem
                            );


                        if (!confirmar) {

                            evento.preventDefault();

                            evento.stopImmediatePropagation();

                        }

                    }
                );

            }
        );

}


// =========================================================
// MODAIS
// =========================================================

function configurarModais() {

    // =====================================================
    // ABRIR
    // =====================================================

    document
        .querySelectorAll(
            "[data-modal-open]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const id =
                            botao.dataset
                                .modalOpen;


                        abrirModal(
                            id
                        );

                    }
                );

            }
        );


    // =====================================================
    // FECHAR
    // =====================================================

    document
        .querySelectorAll(
            "[data-modal-close]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const modal =
                            botao.closest(
                                ".modal-overlay"
                            );


                        fecharModal(
                            modal
                        );

                    }
                );

            }
        );


    // =====================================================
    // CLIQUE FORA
    // =====================================================

    document
        .querySelectorAll(
            ".modal-overlay"
        )
        .forEach(
            overlay => {

                overlay.addEventListener(
                    "click",
                    evento => {

                        if (
                            evento.target ===
                            overlay
                        ) {

                            fecharModal(
                                overlay
                            );

                        }

                    }
                );

            }
        );

}


// =========================================================
// ABRIR MODAL
// =========================================================

export function abrirModal(
    id
) {

    if (!id) {

        return;

    }


    const modal =
        document.getElementById(
            id
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    const primeiroCampo =
        modal.querySelector(
            "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
        );


    setTimeout(
        () => {

            primeiroCampo?.focus();

        },
        100
    );

}


// =========================================================
// FECHAR MODAL
// =========================================================

export function fecharModal(
    modal
) {

    if (
        typeof modal ===
        "string"
    ) {

        modal =
            document.getElementById(
                modal
            );

    }


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );


    if (
        !document.querySelector(
            ".modal-overlay.show"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


// =========================================================
// ESC
// =========================================================

function configurarEscape() {

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key !==
                "Escape"
            ) {

                return;

            }


            fecharSidebar();

            fecharTodosDropdowns();


            const modal =
                document.querySelector(
                    ".modal-overlay.show"
                );


            if (modal) {

                fecharModal(
                    modal
                );

            }

        }
    );

}


// =========================================================
// ATALHOS
// =========================================================

function configurarAtalhos() {

    document.addEventListener(
        "keydown",
        evento => {

            // Evita atalhos enquanto estiver digitando.

            const tag =
                evento.target
                    ?.tagName
                    ?.toLowerCase();


            const digitando =
                tag === "input" ||
                tag === "textarea" ||
                tag === "select";


            if (digitando) {

                return;

            }


            // =================================================
            // ALT + D = DASHBOARD
            // =================================================

            if (
                evento.altKey &&
                evento.key.toLowerCase() ===
                "d"
            ) {

                evento.preventDefault();


                window.location.href =
                    "./dashboard.html";

            }


            // =================================================
            // ALT + N = NOVO INQUÉRITO
            // =================================================

            if (
                evento.altKey &&
                evento.key.toLowerCase() ===
                "n"
            ) {

                evento.preventDefault();


                window.location.href =
                    "./novo-inquerito.html";

            }

        }
    );

}


// =========================================================
// PERFIL ATUAL
// =========================================================

export function obterPerfilSistema() {

    return (
        perfilAtual ||
        obterPerfilAtual()
    );

}


// =========================================================
// PARÂMETRO DA URL
// =========================================================

export function obterParametroUrl(
    nome
) {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return parametros.get(
        nome
    );

}


// =========================================================
// ATUALIZAR PARAMETRO URL
// =========================================================

export function definirParametroUrl(
    nome,
    valor
) {

    const url =
        new URL(
            window.location.href
        );


    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        url.searchParams.delete(
            nome
        );

    } else {

        url.searchParams.set(
            nome,
            valor
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );

}


// =========================================================
// COPIAR TEXTO
// =========================================================

export async function copiarTexto(
    texto
) {

    try {

        await navigator
            .clipboard
            .writeText(
                String(
                    texto || ""
                )
            );


        return true;

    } catch (erro) {

        console.warn(
            "Não foi possível copiar:",
            erro
        );


        return false;

    }

}


// =========================================================
// FORMATAR DATA
// =========================================================

export function formatarData(
    valor
) {

    if (!valor) {

        return "-";

    }


    let data;


    if (
        valor instanceof
        Date
    ) {

        data =
            valor;

    } else if (
        typeof valor?.toDate ===
        "function"
    ) {

        data =
            valor.toDate();

    } else {

        data =
            new Date(
                valor
            );

    }


    if (
        Number.isNaN(
            data.getTime()
        )
    ) {

        return "-";

    }


    return data.toLocaleDateString(
        "pt-BR",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"
        }
    );

}


// =========================================================
// FORMATAR DATA E HORA
// =========================================================

export function formatarDataHora(
    valor
) {

    if (!valor) {

        return "-";

    }


    let data;


    if (
        valor instanceof
        Date
    ) {

        data =
            valor;

    } else if (
        typeof valor?.toDate ===
        "function"
    ) {

        data =
            valor.toDate();

    } else {

        data =
            new Date(
                valor
            );

    }


    if (
        Number.isNaN(
            data.getTime()
        )
    ) {

        return "-";

    }


    return data.toLocaleString(
        "pt-BR",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}


// =========================================================
// NORMALIZAR TEXTO
// =========================================================

export function normalizarTexto(
    texto
) {

    return String(
        texto || ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim()
        .toLowerCase()
        .replace(
            /[\s-]+/g,
            "_"
        );

}


// =========================================================
// ESCAPAR HTML
// =========================================================

export function escaparHTML(
    valor
) {

    const elemento =
        document.createElement(
            "div"
        );


    elemento.textContent =
        String(
            valor ?? ""
        );


    return elemento.innerHTML;

}


// =========================================================
// RECRIAR ÍCONES
// =========================================================

export function recriarIcones() {

    if (
        typeof window.lucide !==
        "undefined"
    ) {

        window.lucide.createIcons();

    }

}


// =========================================================
// EXPORTAR ESTADO
// =========================================================

export {
    perfilAtual
};