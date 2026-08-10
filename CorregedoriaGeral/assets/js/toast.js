// =========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// assets/js/toast.js
//
// Sistema global de notificações.
//
// Tipos:
// - success
// - error
// - warning
// - info
//
// Recursos:
// - Toast automático
// - Fechamento manual
// - Barra de progresso
// - Pilha de notificações
// - Limite de notificações
// - Pausa ao passar o mouse
// - Acessibilidade
// - Integração com Lucide Icons
// =========================================================


// =========================================================
// CONFIGURAÇÃO
// =========================================================

const TOAST_CONFIG = {

    duracaoPadrao:
        4500,

    duracaoCurta:
        2500,

    duracaoLonga:
        7000,

    limite:
        5,

    posicao:
        "top-right",

    fecharAutomaticamente:
        true,

    pausarNoHover:
        true

};


// =========================================================
// ESTADO
// =========================================================

let toastContainer =
    null;

let contadorToast =
    0;


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        criarContainer();

        adicionarEstilos();

    }
);


// =========================================================
// CRIAR CONTAINER
// =========================================================

function criarContainer() {

    if (
        toastContainer &&
        document.body.contains(
            toastContainer
        )
    ) {

        return toastContainer;

    }


    const existente =
        document.getElementById(
            "sigcor-toast-container"
        );


    if (existente) {

        toastContainer =
            existente;


        return toastContainer;

    }


    toastContainer =
        document.createElement(
            "div"
        );


    toastContainer.id =
        "sigcor-toast-container";


    toastContainer.className =
        `sigcor-toast-container ${TOAST_CONFIG.posicao}`;


    toastContainer.setAttribute(
        "aria-live",
        "polite"
    );


    toastContainer.setAttribute(
        "aria-atomic",
        "false"
    );


    document.body.appendChild(
        toastContainer
    );


    return toastContainer;

}


// =========================================================
// ESTILOS
// =========================================================

function adicionarEstilos() {

    if (
        document.getElementById(
            "sigcor-toast-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "sigcor-toast-styles";


    style.textContent = `

        /* ================================================
           CONTAINER
        ================================================= */

        .sigcor-toast-container {

            position: fixed;

            z-index: 9999999;

            width: min(
                390px,
                calc(100vw - 30px)
            );

            display: flex;

            flex-direction: column;

            gap: 10px;

            pointer-events: none;

        }


        .sigcor-toast-container.top-right {

            top: 18px;

            right: 18px;

        }


        .sigcor-toast-container.top-left {

            top: 18px;

            left: 18px;

        }


        .sigcor-toast-container.bottom-right {

            right: 18px;

            bottom: 18px;

            flex-direction:
                column-reverse;

        }


        .sigcor-toast-container.bottom-left {

            left: 18px;

            bottom: 18px;

            flex-direction:
                column-reverse;

        }


        /* ================================================
           TOAST
        ================================================= */

        .sigcor-toast {

            position: relative;

            width: 100%;

            min-height: 74px;

            display: flex;

            align-items: flex-start;

            gap: 12px;

            padding:
                14px
                42px
                16px
                14px;

            overflow: hidden;

            color: #f8fafc;

            background:
                rgba(
                    15,
                    23,
                    42,
                    0.97
                );

            border:
                1px solid
                rgba(
                    148,
                    163,
                    184,
                    0.15
                );

            border-radius:
                12px;

            box-shadow:
                0 18px 45px
                rgba(
                    0,
                    0,
                    0,
                    0.35
                );

            backdrop-filter:
                blur(14px);

            -webkit-backdrop-filter:
                blur(14px);

            pointer-events:
                auto;

            opacity: 0;

            transform:
                translateX(25px)
                scale(0.98);

            transition:
                opacity
                0.22s ease,
                transform
                0.22s ease,
                border-color
                0.22s ease;

        }


        .sigcor-toast.show {

            opacity: 1;

            transform:
                translateX(0)
                scale(1);

        }


        .sigcor-toast.hide {

            opacity: 0;

            transform:
                translateX(35px)
                scale(0.97);

        }


        /* ================================================
           ÍCONE
        ================================================= */

        .sigcor-toast-icon {

            width: 36px;

            height: 36px;

            display: grid;

            place-items: center;

            flex-shrink: 0;

            border-radius: 10px;

        }


        .sigcor-toast-icon svg {

            width: 18px;

            height: 18px;

        }


        /* ================================================
           CONTEÚDO
        ================================================= */

        .sigcor-toast-content {

            min-width: 0;

            flex: 1;

            padding-top: 1px;

        }


        .sigcor-toast-title {

            display: block;

            margin-bottom: 3px;

            color: #f8fafc;

            font-family:
                "Inter",
                Arial,
                sans-serif;

            font-size: 11px;

            font-weight: 700;

            line-height: 1.35;

        }


        .sigcor-toast-message {

            display: block;

            color: #94a3b8;

            font-family:
                "Inter",
                Arial,
                sans-serif;

            font-size: 9px;

            font-weight: 400;

            line-height: 1.55;

            overflow-wrap:
                anywhere;

        }


        /* ================================================
           BOTÃO FECHAR
        ================================================= */

        .sigcor-toast-close {

            position: absolute;

            top: 9px;

            right: 9px;

            width: 27px;

            height: 27px;

            padding: 0;

            display: grid;

            place-items: center;

            color: #64748b;

            background:
                transparent;

            border: 0;

            border-radius: 7px;

            cursor: pointer;

            transition:
                color
                0.18s ease,
                background
                0.18s ease;

        }


        .sigcor-toast-close:hover {

            color: #f8fafc;

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.05
                );

        }


        .sigcor-toast-close svg {

            width: 14px;

            height: 14px;

        }


        /* ================================================
           PROGRESSO
        ================================================= */

        .sigcor-toast-progress {

            position: absolute;

            left: 0;

            right: 0;

            bottom: 0;

            height: 3px;

            overflow: hidden;

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.025
                );

        }


        .sigcor-toast-progress-bar {

            width: 100%;

            height: 100%;

            transform-origin:
                left center;

        }


        /* ================================================
           SUCCESS
        ================================================= */

        .sigcor-toast.success {

            border-color:
                rgba(
                    34,
                    197,
                    94,
                    0.20
                );

        }


        .sigcor-toast.success
        .sigcor-toast-icon {

            color: #86efac;

            background:
                rgba(
                    34,
                    197,
                    94,
                    0.10
                );

            border:
                1px solid
                rgba(
                    34,
                    197,
                    94,
                    0.14
                );

        }


        .sigcor-toast.success
        .sigcor-toast-progress-bar {

            background: #22c55e;

        }


        /* ================================================
           ERROR
        ================================================= */

        .sigcor-toast.error {

            border-color:
                rgba(
                    239,
                    68,
                    68,
                    0.20
                );

        }


        .sigcor-toast.error
        .sigcor-toast-icon {

            color: #fca5a5;

            background:
                rgba(
                    239,
                    68,
                    68,
                    0.10
                );

            border:
                1px solid
                rgba(
                    239,
                    68,
                    68,
                    0.14
                );

        }


        .sigcor-toast.error
        .sigcor-toast-progress-bar {

            background: #ef4444;

        }


        /* ================================================
           WARNING
        ================================================= */

        .sigcor-toast.warning {

            border-color:
                rgba(
                    212,
                    175,
                    55,
                    0.24
                );

        }


        .sigcor-toast.warning
        .sigcor-toast-icon {

            color: #fde68a;

            background:
                rgba(
                    212,
                    175,
                    55,
                    0.10
                );

            border:
                1px solid
                rgba(
                    212,
                    175,
                    55,
                    0.16
                );

        }


        .sigcor-toast.warning
        .sigcor-toast-progress-bar {

            background: #d4af37;

        }


        /* ================================================
           INFO
        ================================================= */

        .sigcor-toast.info {

            border-color:
                rgba(
                    59,
                    130,
                    246,
                    0.20
                );

        }


        .sigcor-toast.info
        .sigcor-toast-icon {

            color: #93c5fd;

            background:
                rgba(
                    59,
                    130,
                    246,
                    0.10
                );

            border:
                1px solid
                rgba(
                    59,
                    130,
                    246,
                    0.14
                );

        }


        .sigcor-toast.info
        .sigcor-toast-progress-bar {

            background: #3b82f6;

        }


        /* ================================================
           MOBILE
        ================================================= */

        @media (
            max-width: 600px
        ) {

            .sigcor-toast-container {

                width:
                    calc(
                        100vw - 20px
                    );

                left: 10px !important;

                right: 10px !important;

                top: 10px;

            }


            .sigcor-toast {

                min-height:
                    68px;

                padding:
                    12px
                    39px
                    14px
                    12px;

            }


            .sigcor-toast-icon {

                width: 33px;

                height: 33px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// =========================================================
// CRIAR TOAST
// =========================================================

export function mostrarToast(
    mensagem,
    tipo = "info",
    opcoes = {}
) {

    criarContainer();

    adicionarEstilos();


    const configuracao =
        normalizarOpcoes(
            mensagem,
            tipo,
            opcoes
        );


    removerExcesso();


    contadorToast++;


    const id =
        `sigcor-toast-${contadorToast}`;


    const toast =
        document.createElement(
            "div"
        );


    toast.id =
        id;


    toast.className =
        `sigcor-toast ${configuracao.tipo}`;


    toast.setAttribute(
        "role",
        configuracao.tipo === "error"
            ?
            "alert"
            :
            "status"
    );


    toast.setAttribute(
        "aria-live",
        configuracao.tipo === "error"
            ?
            "assertive"
            :
            "polite"
    );


    const icone =
        obterIcone(
            configuracao.tipo
        );


    toast.innerHTML = `

        <div
            class="sigcor-toast-icon"
        >

            <i
                data-lucide="${icone}"
            ></i>

        </div>


        <div
            class="sigcor-toast-content"
        >

            <strong
                class="sigcor-toast-title"
            >

                ${
                    escaparHTML(
                        configuracao.titulo
                    )
                }

            </strong>


            <span
                class="sigcor-toast-message"
            >

                ${
                    escaparHTML(
                        configuracao.mensagem
                    )
                }

            </span>

        </div>


        <button
            type="button"
            class="sigcor-toast-close"
            aria-label="Fechar notificação"
            data-toast-close
        >

            <i
                data-lucide="x"
            ></i>

        </button>


        ${
            configuracao.duracao > 0
                ?
                `

                <div
                    class="sigcor-toast-progress"
                >

                    <div
                        class="sigcor-toast-progress-bar"
                    ></div>

                </div>

                `
                :
                ""
        }

    `;


    toastContainer.appendChild(
        toast
    );


    const estado = {

        elemento:
            toast,

        inicio:
            Date.now(),

        restante:
            configuracao.duracao,

        duracao:
            configuracao.duracao,

        timer:
            null,

        animacao:
            null,

        fechado:
            false

    };


    configurarToast(
        toast,
        estado,
        configuracao
    );


    recriarIcones();


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );

        }
    );


    if (
        configuracao.duracao >
        0
    ) {

        iniciarTemporizador(
            estado
        );

    }


    return {

        id,

        element:
            toast,

        close:
            () => {

                fecharToast(
                    toast
                );

            }

    };

}


// =========================================================
// NORMALIZAR OPÇÕES
// =========================================================

function normalizarOpcoes(
    mensagem,
    tipo,
    opcoes
) {

    const tipoNormalizado =
        normalizarTipo(
            tipo
        );


    const tituloPadrao = {

        success:
            "Sucesso",

        error:
            "Erro",

        warning:
            "Atenção",

        info:
            "Informação"

    };


    let duracao =
        Number(
            opcoes.duracao ??
            TOAST_CONFIG.duracaoPadrao
        );


    if (
        opcoes.persistente ===
        true
    ) {

        duracao =
            0;

    }


    return {

        mensagem:
            String(
                mensagem ??
                ""
            ),

        tipo:
            tipoNormalizado,

        titulo:
            String(
                opcoes.titulo ??
                tituloPadrao[
                    tipoNormalizado
                ]
            ),

        duracao:
            Math.max(
                0,
                duracao
            )

    };

}


// =========================================================
// NORMALIZAR TIPO
// =========================================================

function normalizarTipo(
    tipo
) {

    const valor =
        String(
            tipo ||
            "info"
        )
            .trim()
            .toLowerCase();


    if (
        [
            "success",
            "error",
            "warning",
            "info"
        ].includes(
            valor
        )
    ) {

        return valor;

    }


    if (
        valor === "sucesso"
    ) {

        return "success";

    }


    if (
        valor === "erro" ||
        valor === "danger"
    ) {

        return "error";

    }


    if (
        valor === "aviso" ||
        valor === "alerta"
    ) {

        return "warning";

    }


    return "info";

}


// =========================================================
// CONFIGURAR TOAST
// =========================================================

function configurarToast(
    toast,
    estado,
    configuracao
) {

    const fechar =
        toast.querySelector(
            "[data-toast-close]"
        );


    fechar?.addEventListener(
        "click",
        () => {

            fecharToast(
                toast
            );

        }
    );


    if (
        TOAST_CONFIG.pausarNoHover &&
        configuracao.duracao > 0
    ) {

        toast.addEventListener(
            "mouseenter",
            () => {

                pausarTemporizador(
                    estado
                );

            }
        );


        toast.addEventListener(
            "mouseleave",
            () => {

                continuarTemporizador(
                    estado
                );

            }
        );

    }

}


// =========================================================
// TEMPORIZADOR
// =========================================================

function iniciarTemporizador(
    estado
) {

    estado.inicio =
        Date.now();


    estado.timer =
        window.setTimeout(
            () => {

                fecharToast(
                    estado.elemento
                );

            },
            estado.restante
        );


    animarBarra(
        estado,
        estado.restante
    );

}


// =========================================================
// PAUSAR
// =========================================================

function pausarTemporizador(
    estado
) {

    if (
        estado.fechado
    ) {

        return;

    }


    if (
        estado.timer
    ) {

        clearTimeout(
            estado.timer
        );


        estado.timer =
            null;

    }


    const tempoPassado =
        Date.now() -
        estado.inicio;


    estado.restante =
        Math.max(
            0,
            estado.restante -
            tempoPassado
        );


    const barra =
        estado.elemento
            .querySelector(
                ".sigcor-toast-progress-bar"
            );


    if (barra) {

        const estilo =
            window.getComputedStyle(
                barra
            );


        const matriz =
            estilo.transform;


        let escala =
            1;


        if (
            matriz &&
            matriz !== "none"
        ) {

            try {

                const valores =
                    matriz
                        .replace(
                            "matrix(",
                            ""
                        )
                        .replace(
                            ")",
                            ""
                        )
                        .split(",");


                escala =
                    Number(
                        valores[0]
                    ) || 0;

            } catch {

                escala = 1;

            }

        }


        barra
            .getAnimations()
            .forEach(
                animacao =>
                    animacao.cancel()
            );


        barra.style.transform =
            `scaleX(${escala})`;

    }

}


// =========================================================
// CONTINUAR
// =========================================================

function continuarTemporizador(
    estado
) {

    if (
        estado.fechado ||
        estado.restante <= 0
    ) {

        return;

    }


    iniciarTemporizador(
        estado
    );

}


// =========================================================
// ANIMAR BARRA
// =========================================================

function animarBarra(
    estado,
    duracao
) {

    const barra =
        estado.elemento
            .querySelector(
                ".sigcor-toast-progress-bar"
            );


    if (!barra) {

        return;

    }


    const proporcao =
        estado.duracao > 0
            ?
            Math.max(
                0,
                Math.min(
                    1,
                    estado.restante /
                    estado.duracao
                )
            )
            :
            1;


    barra.style.transform =
        `scaleX(${proporcao})`;


    estado.animacao =
        barra.animate(
            [
                {
                    transform:
                        `scaleX(${proporcao})`
                },
                {
                    transform:
                        "scaleX(0)"
                }
            ],
            {
                duration:
                    duracao,

                easing:
                    "linear",

                fill:
                    "forwards"
            }
        );

}


// =========================================================
// FECHAR TOAST
// =========================================================

export function fecharToast(
    toastOuId
) {

    let toast =
        toastOuId;


    if (
        typeof toastOuId ===
        "string"
    ) {

        toast =
            document.getElementById(
                toastOuId
            );

    }


    if (
        !toast ||
        !(toast instanceof HTMLElement)
    ) {

        return false;

    }


    if (
        toast.dataset
            .closing ===
        "true"
    ) {

        return false;

    }


    toast.dataset.closing =
        "true";


    toast
        .querySelectorAll(
            ".sigcor-toast-progress-bar"
        )
        .forEach(
            barra => {

                barra
                    .getAnimations()
                    .forEach(
                        animacao =>
                            animacao.cancel()
                    );

            }
        );


    toast.classList.remove(
        "show"
    );


    toast.classList.add(
        "hide"
    );


    setTimeout(
        () => {

            toast.remove();

        },
        230
    );


    return true;

}


// =========================================================
// REMOVER EXCESSO
// =========================================================

function removerExcesso() {

    if (!toastContainer) {

        return;

    }


    const toasts =
        [
            ...toastContainer
                .querySelectorAll(
                    ".sigcor-toast"
                )
        ];


    while (
        toasts.length >=
        TOAST_CONFIG.limite
    ) {

        const antigo =
            toasts.shift();


        fecharToast(
            antigo
        );

    }

}


// =========================================================
// FECHAR TODOS
// =========================================================

export function fecharTodosToasts() {

    if (!toastContainer) {

        return;

    }


    toastContainer
        .querySelectorAll(
            ".sigcor-toast"
        )
        .forEach(
            toast => {

                fecharToast(
                    toast
                );

            }
        );

}


// =========================================================
// FUNÇÕES RÁPIDAS
// =========================================================

export function toastSucesso(
    mensagem,
    opcoes = {}
) {

    return mostrarToast(
        mensagem,
        "success",
        opcoes
    );

}


export function toastErro(
    mensagem,
    opcoes = {}
) {

    return mostrarToast(
        mensagem,
        "error",
        opcoes
    );

}


export function toastAviso(
    mensagem,
    opcoes = {}
) {

    return mostrarToast(
        mensagem,
        "warning",
        opcoes
    );

}


export function toastInfo(
    mensagem,
    opcoes = {}
) {

    return mostrarToast(
        mensagem,
        "info",
        opcoes
    );

}


// =========================================================
// ALIASES EM INGLÊS
// =========================================================

export const toastSuccess =
    toastSucesso;

export const toastError =
    toastErro;

export const toastWarning =
    toastAviso;


// =========================================================
// ÍCONES
// =========================================================

function obterIcone(
    tipo
) {

    switch (
        tipo
    ) {

        case "success":

            return "circle-check-big";


        case "error":

            return "circle-x";


        case "warning":

            return "triangle-alert";


        case "info":

        default:

            return "info";

    }

}


// =========================================================
// ALTERAR POSIÇÃO
// =========================================================

export function definirPosicaoToast(
    posicao
) {

    const permitidas = [

        "top-right",

        "top-left",

        "bottom-right",

        "bottom-left"

    ];


    if (
        !permitidas.includes(
            posicao
        )
    ) {

        console.warn(
            "SIGCOR Toast: posição inválida:",
            posicao
        );


        return false;

    }


    TOAST_CONFIG.posicao =
        posicao;


    criarContainer();


    toastContainer.classList.remove(
        "top-right",
        "top-left",
        "bottom-right",
        "bottom-left"
    );


    toastContainer.classList.add(
        posicao
    );


    return true;

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
// LUCIDE
// =========================================================

function recriarIcones() {

    if (
        typeof window.lucide !==
        "undefined"
    ) {

        window.lucide.createIcons();

    }

}


// =========================================================
// API GLOBAL
//
// Também permite usar:
//
// SIGCORToast.success("Salvo!");
// SIGCORToast.error("Erro!");
// =========================================================

window.SIGCORToast = {

    show:
        mostrarToast,

    success:
        toastSucesso,

    error:
        toastErro,

    warning:
        toastAviso,

    info:
        toastInfo,

    close:
        fecharToast,

    closeAll:
        fecharTodosToasts,

    position:
        definirPosicaoToast

};