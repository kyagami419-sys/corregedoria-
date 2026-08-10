// =========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// assets/js/modal.js
//
// Responsável por:
// - Abrir e fechar modais
// - Modal de confirmação
// - Modal de alerta
// - Modal de formulário
// - Fechar com ESC
// - Fechar ao clicar fora
// - Travar scroll da página
// - Restaurar foco
// =========================================================


// =========================================================
// ESTADO
// =========================================================

let modalAtivo = null;

let elementoFocadoAntes = null;


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarBotoesModal();

        configurarFechamentoPorOverlay();

        configurarEscape();

    }
);


// =========================================================
// ABRIR MODAL
// =========================================================

export function abrirModal(
    modalOuId
) {

    const modal =
        resolverModal(
            modalOuId
        );


    if (!modal) {

        console.warn(
            "SIGCOR Modal: modal não encontrado.",
            modalOuId
        );

        return false;

    }


    if (
        modalAtivo &&
        modalAtivo !== modal
    ) {

        fecharModal(
            modalAtivo,
            false
        );

    }


    elementoFocadoAntes =
        document.activeElement;


    modalAtivo =
        modal;


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    focarPrimeiroElemento(
        modal
    );


    dispararEvento(
        modal,
        "sigcor:modal:open"
    );


    return true;

}


// =========================================================
// FECHAR MODAL
// =========================================================

export function fecharModal(
    modalOuId = null,
    restaurarFoco = true
) {

    const modal =
        modalOuId
            ?
            resolverModal(
                modalOuId
            )
            :
            modalAtivo;


    if (!modal) {

        return false;

    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        modal === modalAtivo
    ) {

        modalAtivo =
            null;

    }


    if (
        !document.querySelector(
            ".modal-overlay.show"
        )
    ) {

        document.body.style.overflow =
            "";

    }


    if (
        restaurarFoco &&
        elementoFocadoAntes &&
        typeof elementoFocadoAntes.focus ===
        "function"
    ) {

        setTimeout(
            () => {

                elementoFocadoAntes?.focus();

            },
            50
        );

    }


    dispararEvento(
        modal,
        "sigcor:modal:close"
    );


    return true;

}


// =========================================================
// FECHAR TODOS
// =========================================================

export function fecharTodosModais() {

    document
        .querySelectorAll(
            ".modal-overlay.show"
        )
        .forEach(
            modal => {

                fecharModal(
                    modal,
                    false
                );

            }
        );


    modalAtivo =
        null;


    document.body.style.overflow =
        "";

}


// =========================================================
// RESOLVER MODAL
// =========================================================

function resolverModal(
    modalOuId
) {

    if (!modalOuId) {

        return null;

    }


    if (
        modalOuId instanceof
        HTMLElement
    ) {

        return modalOuId;

    }


    return document.getElementById(
        String(
            modalOuId
        )
    );

}


// =========================================================
// BOTÕES AUTOMÁTICOS
//
// Abrir:
//
// data-modal-open="meuModal"
//
// Fechar:
//
// data-modal-close
// =========================================================

function configurarBotoesModal() {

    document
        .querySelectorAll(
            "[data-modal-open]"
        )
        .forEach(
            botao => {

                if (
                    botao.dataset
                        .modalConfigured ===
                    "true"
                ) {

                    return;

                }


                botao.dataset
                    .modalConfigured =
                    "true";


                botao.addEventListener(
                    "click",
                    evento => {

                        evento.preventDefault();


                        abrirModal(
                            botao.dataset
                                .modalOpen
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-modal-close]"
        )
        .forEach(
            botao => {

                if (
                    botao.dataset
                        .modalConfigured ===
                    "true"
                ) {

                    return;

                }


                botao.dataset
                    .modalConfigured =
                    "true";


                botao.addEventListener(
                    "click",
                    evento => {

                        evento.preventDefault();


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

}


// =========================================================
// FECHAR CLICANDO NO OVERLAY
// =========================================================

function configurarFechamentoPorOverlay() {

    document
        .querySelectorAll(
            ".modal-overlay"
        )
        .forEach(
            overlay => {

                if (
                    overlay.dataset
                        .overlayConfigured ===
                    "true"
                ) {

                    return;

                }


                overlay.dataset
                    .overlayConfigured =
                    "true";


                overlay.addEventListener(
                    "mousedown",
                    evento => {

                        if (
                            evento.target !==
                            overlay
                        ) {

                            return;

                        }


                        if (
                            overlay.dataset
                                .modalStatic ===
                            "true"
                        ) {

                            return;

                        }


                        fecharModal(
                            overlay
                        );

                    }
                );

            }
        );

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


            if (!modalAtivo) {

                return;

            }


            if (
                modalAtivo.dataset
                    .modalStatic ===
                "true"
            ) {

                return;

            }


            fecharModal(
                modalAtivo
            );

        }
    );

}


// =========================================================
// FOCAR PRIMEIRO CAMPO
// =========================================================

function focarPrimeiroElemento(
    modal
) {

    const elemento =
        modal.querySelector(
            [
                "input:not([disabled])",
                "select:not([disabled])",
                "textarea:not([disabled])",
                "button:not([disabled])",
                "a[href]"
            ].join(",")
        );


    if (!elemento) {

        return;

    }


    setTimeout(
        () => {

            elemento.focus();

        },
        80
    );

}


// =========================================================
// MODAL DE ALERTA
// =========================================================

export function modalAlerta(
    {
        titulo =
            "Aviso",

        mensagem =
            "",

        textoBotao =
            "Entendi",

        tipo =
            "info"
    } = {}
) {

    return new Promise(
        resolve => {

            const id =
                gerarIdModal();


            const overlay =
                document.createElement(
                    "div"
                );


            overlay.id =
                id;


            overlay.className =
                "modal-overlay";


            overlay.innerHTML = `

                <div class="modal modal-sm">

                    <div class="modal-header">

                        <div>

                            <div class="modal-title">

                                ${escaparHTML(titulo)}

                            </div>

                            <div class="modal-description">

                                ${escaparHTML(mensagem)}

                            </div>

                        </div>

                    </div>


                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-primary"
                            data-alert-confirm
                        >

                            ${escaparHTML(textoBotao)}

                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(
                overlay
            );


            const botao =
                overlay.querySelector(
                    "[data-alert-confirm]"
                );


            botao.addEventListener(
                "click",
                () => {

                    fecharModal(
                        overlay,
                        false
                    );


                    overlay.remove();


                    resolve(
                        true
                    );

                }
            );


            abrirModal(
                overlay
            );

        }
    );

}


// =========================================================
// MODAL DE CONFIRMAÇÃO
// =========================================================

export function modalConfirmacao(
    {
        titulo =
            "Confirmar ação",

        mensagem =
            "Deseja continuar?",

        confirmarTexto =
            "Confirmar",

        cancelarTexto =
            "Cancelar",

        perigo =
            false
    } = {}
) {

    return new Promise(
        resolve => {

            const overlay =
                document.createElement(
                    "div"
                );


            overlay.id =
                gerarIdModal();


            overlay.className =
                "modal-overlay";


            overlay.innerHTML = `

                <div class="modal modal-sm">

                    <div class="modal-header">

                        <div>

                            <div class="modal-title">

                                ${escaparHTML(titulo)}

                            </div>

                            <div class="modal-description">

                                ${escaparHTML(mensagem)}

                            </div>

                        </div>

                    </div>


                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-confirm-cancel
                        >

                            ${escaparHTML(cancelarTexto)}

                        </button>


                        <button
                            type="button"
                            class="btn ${
                                perigo
                                    ?
                                    "btn-danger"
                                    :
                                    "btn-primary"
                            }"
                            data-confirm-ok
                        >

                            ${escaparHTML(confirmarTexto)}

                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(
                overlay
            );


            const cancelar =
                overlay.querySelector(
                    "[data-confirm-cancel]"
                );


            const confirmar =
                overlay.querySelector(
                    "[data-confirm-ok]"
                );


            cancelar.addEventListener(
                "click",
                () => {

                    fecharModal(
                        overlay,
                        false
                    );


                    overlay.remove();


                    resolve(
                        false
                    );

                }
            );


            confirmar.addEventListener(
                "click",
                () => {

                    fecharModal(
                        overlay,
                        false
                    );


                    overlay.remove();


                    resolve(
                        true
                    );

                }
            );


            overlay.addEventListener(
                "mousedown",
                evento => {

                    if (
                        evento.target !==
                        overlay
                    ) {

                        return;

                    }


                    fecharModal(
                        overlay,
                        false
                    );


                    overlay.remove();


                    resolve(
                        false
                    );

                }
            );


            abrirModal(
                overlay
            );

        }
    );

}


// =========================================================
// ALTERAR TÍTULO DE MODAL
// =========================================================

export function definirTituloModal(
    modalOuId,
    titulo
) {

    const modal =
        resolverModal(
            modalOuId
        );


    if (!modal) {

        return;

    }


    const elemento =
        modal.querySelector(
            ".modal-title"
        );


    if (elemento) {

        elemento.textContent =
            titulo ?? "";

    }

}


// =========================================================
// ALTERAR DESCRIÇÃO
// =========================================================

export function definirDescricaoModal(
    modalOuId,
    descricao
) {

    const modal =
        resolverModal(
            modalOuId
        );


    if (!modal) {

        return;

    }


    const elemento =
        modal.querySelector(
            ".modal-description"
        );


    if (elemento) {

        elemento.textContent =
            descricao ?? "";

    }

}


// =========================================================
// MODAL ESTÁ ABERTO?
// =========================================================

export function modalEstaAberto(
    modalOuId
) {

    const modal =
        resolverModal(
            modalOuId
        );


    return Boolean(
        modal?.classList
            .contains(
                "show"
            )
    );

}


// =========================================================
// OBTER MODAL ATIVO
// =========================================================

export function obterModalAtivo() {

    return modalAtivo;

}


// =========================================================
// ATUALIZAR EVENTOS DE MODAIS NOVOS
//
// Use caso você injete modal no DOM depois.
// =========================================================

export function atualizarModais() {

    configurarBotoesModal();

    configurarFechamentoPorOverlay();

}


// =========================================================
// EVENTO PERSONALIZADO
// =========================================================

function dispararEvento(
    modal,
    nome
) {

    try {

        modal.dispatchEvent(
            new CustomEvent(
                nome,
                {
                    bubbles:
                        true,

                    detail: {
                        modal
                    }
                }
            )
        );

    } catch {

        // Ignora navegadores antigos.

    }

}


// =========================================================
// ID DE MODAL
// =========================================================

function gerarIdModal() {

    if (
        window.crypto?.randomUUID
    ) {

        return (
            "modal-" +
            window.crypto.randomUUID()
        );

    }


    return (
        "modal-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2)
    );

}


// =========================================================
// ESCAPAR HTML
// =========================================================

function escaparHTML(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================================
// API GLOBAL OPCIONAL
// =========================================================

window.SIGCORModal = {

    abrir:
        abrirModal,

    fechar:
        fecharModal,

    fecharTodos:
        fecharTodosModais,

    alerta:
        modalAlerta,

    confirmar:
        modalConfirmacao,

    estaAberto:
        modalEstaAberto,

    atualizar:
        atualizarModais

};                              