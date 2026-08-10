// =========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// assets/js/ui.js
//
// Central de interface.
//
// Integra:
// - Toasts
// - Loading
// - Modais
// - Confirmações
// - Botões
// - Estados vazios
// - Validação visual
// - Lucide Icons
// =========================================================


// =========================================================
// TOAST
// =========================================================

import {
    mostrarToast,
    toastSucesso,
    toastErro,
    toastAviso,
    toastInfo,
    fecharToast,
    fecharTodosToasts
} from "./toast.js";


// =========================================================
// LOADING
// =========================================================

import {
    mostrarLoading,
    esconderLoading,
    showLoading,
    hideLoading,
    setLoadingText,
    setLoadingProgress,
    updateLoading,
    setButtonLoading,
    tableLoading,
    containerLoading,
    withLoading
} from "./loading.js";


// =========================================================
// MODAIS
// =========================================================

import {
    abrirModal,
    fecharModal,
    fecharTodosModais,
    modalAlerta,
    modalConfirmacao,
    modalEstaAberto
} from "./modal.js";


// =========================================================
// EXPORTAÇÕES DIRETAS
//
// Permite que outros arquivos continuem usando:
//
// import {
//     mostrarToast,
//     mostrarLoading,
//     esconderLoading
// } from "./ui.js";
// =========================================================

export {

    // Toast
    mostrarToast,
    toastSucesso,
    toastErro,
    toastAviso,
    toastInfo,
    fecharToast,
    fecharTodosToasts,

    // Loading
    mostrarLoading,
    esconderLoading,
    showLoading,
    hideLoading,
    setLoadingText,
    setLoadingProgress,
    updateLoading,
    setButtonLoading,
    tableLoading,
    containerLoading,
    withLoading,

    // Modal
    abrirModal,
    fecharModal,
    fecharTodosModais,
    modalAlerta,
    modalConfirmacao,
    modalEstaAberto

};


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarBotoesCopiar();

        configurarInputs();

        configurarTextareas();

        configurarArquivos();

        configurarSenhas();

        configurarConfirmacoes();

        configurarAutoFocus();

        recriarIcones();

    }
);


// =========================================================
// DESABILITAR ELEMENTO
// =========================================================

export function desabilitarElemento(
    elemento,
    desabilitado = true
) {

    if (!elemento) {

        return;

    }


    if (
        "disabled" in elemento
    ) {

        elemento.disabled =
            desabilitado;

    }


    elemento.classList.toggle(
        "disabled",
        desabilitado
    );


    elemento.setAttribute(
        "aria-disabled",
        String(desabilitado)
    );

}


// =========================================================
// HABILITAR ELEMENTO
// =========================================================

export function habilitarElemento(
    elemento
) {

    desabilitarElemento(
        elemento,
        false
    );

}


// =========================================================
// MOSTRAR ELEMENTO
// =========================================================

export function mostrarElemento(
    elemento
) {

    if (!elemento) {

        return;

    }


    elemento.classList.remove(
        "hidden"
    );


    elemento.hidden =
        false;

}


// =========================================================
// ESCONDER ELEMENTO
// =========================================================

export function esconderElemento(
    elemento
) {

    if (!elemento) {

        return;

    }


    elemento.classList.add(
        "hidden"
    );


    elemento.hidden =
        true;

}


// =========================================================
// ALTERNAR VISIBILIDADE
// =========================================================

export function alternarElemento(
    elemento,
    mostrar = null
) {

    if (!elemento) {

        return;

    }


    const deveMostrar =
        mostrar === null
            ?
            elemento.classList
                .contains(
                    "hidden"
                )
            :
            Boolean(
                mostrar
            );


    if (deveMostrar) {

        mostrarElemento(
            elemento
        );

    } else {

        esconderElemento(
            elemento
        );

    }

}


// =========================================================
// DEFINIR TEXTO
// =========================================================

export function definirTexto(
    elementoOuId,
    texto
) {

    const elemento =
        resolverElemento(
            elementoOuId
        );


    if (!elemento) {

        return false;

    }


    elemento.textContent =
        texto ?? "";


    return true;

}


// =========================================================
// DEFINIR HTML
// =========================================================

export function definirHTML(
    elementoOuId,
    html
) {

    const elemento =
        resolverElemento(
            elementoOuId
        );


    if (!elemento) {

        return false;

    }


    elemento.innerHTML =
        html ?? "";


    recriarIcones();


    return true;

}


// =========================================================
// LIMPAR ELEMENTO
// =========================================================

export function limparElemento(
    elementoOuId
) {

    return definirHTML(
        elementoOuId,
        ""
    );

}


// =========================================================
// ESTADO VAZIO
// =========================================================

export function estadoVazio(
    containerOuId,
    {
        icone =
            "inbox",

        titulo =
            "Nenhum registro encontrado",

        mensagem =
            "",

        acaoTexto =
            "",

        acao =
            null
    } = {}
) {

    const container =
        resolverElemento(
            containerOuId
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="empty-state">

            <div
                class="empty-state-icon"
            >

                <i
                    data-lucide="${escaparAtributo(icone)}"
                ></i>

            </div>


            <strong>

                ${escaparHTML(titulo)}

            </strong>


            ${
                mensagem
                    ?
                    `
                    <p>

                        ${escaparHTML(mensagem)}

                    </p>
                    `
                    :
                    ""
            }


            ${
                acaoTexto
                    ?
                    `
                    <button
                        type="button"
                        class="btn btn-primary"
                        data-empty-action
                    >

                        ${escaparHTML(acaoTexto)}

                    </button>
                    `
                    :
                    ""
            }

        </div>

    `;


    const botao =
        container.querySelector(
            "[data-empty-action]"
        );


    if (
        botao &&
        typeof acao ===
        "function"
    ) {

        botao.addEventListener(
            "click",
            acao
        );

    }


    recriarIcones();

}


// =========================================================
// ESTADO DE ERRO
// =========================================================

export function estadoErro(
    containerOuId,
    {
        titulo =
            "Não foi possível carregar",

        mensagem =
            "Ocorreu um erro ao carregar as informações.",

        tentarNovamente =
            null
    } = {}
) {

    estadoVazio(
        containerOuId,
        {
            icone:
                "triangle-alert",

            titulo,

            mensagem,

            acaoTexto:
                typeof tentarNovamente ===
                "function"
                    ?
                    "Tentar novamente"
                    :
                    "",

            acao:
                tentarNovamente
        }
    );

}


// =========================================================
// SKELETON
// =========================================================

export function mostrarSkeleton(
    containerOuId,
    quantidade = 3
) {

    const container =
        resolverElemento(
            containerOuId
        );


    if (!container) {

        return;

    }


    const total =
        Math.max(
            1,
            Number(
                quantidade
            ) || 1
        );


    container.innerHTML =
        Array.from(
            {
                length:
                    total
            }
        )
            .map(
                () => `

                    <div
                        class="ui-skeleton-card"
                    >

                        <div
                            class="ui-skeleton ui-skeleton-title"
                        ></div>

                        <div
                            class="ui-skeleton"
                        ></div>

                        <div
                            class="ui-skeleton ui-skeleton-short"
                        ></div>

                    </div>

                `
            )
            .join("");


    garantirEstilosUI();

}


// =========================================================
// CAMPO INVÁLIDO
// =========================================================

export function marcarCampoInvalido(
    campo,
    mensagem = ""
) {

    if (!campo) {

        return;

    }


    campo.classList.add(
        "input-error"
    );


    campo.setAttribute(
        "aria-invalid",
        "true"
    );


    const grupo =
        campo.closest(
            ".form-group"
        );


    if (!grupo) {

        return;

    }


    let erro =
        grupo.querySelector(
            ".field-error-message"
        );


    if (
        !mensagem
    ) {

        erro?.remove();

        return;

    }


    if (!erro) {

        erro =
            document.createElement(
                "div"
            );


        erro.className =
            "field-error-message";


        grupo.appendChild(
            erro
        );

    }


    erro.textContent =
        mensagem;

}


// =========================================================
// LIMPAR CAMPO INVÁLIDO
// =========================================================

export function limparCampoInvalido(
    campo
) {

    if (!campo) {

        return;

    }


    campo.classList.remove(
        "input-error"
    );


    campo.removeAttribute(
        "aria-invalid"
    );


    campo
        .closest(
            ".form-group"
        )
        ?.querySelector(
            ".field-error-message"
        )
        ?.remove();

}


// =========================================================
// VALIDAR CAMPOS OBRIGATÓRIOS
// =========================================================

export function validarObrigatorios(
    formulario
) {

    if (!formulario) {

        return true;

    }


    let valido =
        true;


    const campos =
        formulario.querySelectorAll(
            "[required]"
        );


    campos.forEach(
        campo => {

            limparCampoInvalido(
                campo
            );


            const valor =
                String(
                    campo.value ?? ""
                ).trim();


            if (
                !valor
            ) {

                marcarCampoInvalido(
                    campo,
                    "Campo obrigatório."
                );


                valido =
                    false;

            }

        }
    );


    if (!valido) {

        const primeiro =
            formulario.querySelector(
                ".input-error"
            );


        primeiro?.focus();


        mostrarToast(
            "Preencha os campos obrigatórios.",
            "warning"
        );

    }


    return valido;

}


// =========================================================
// CONFIGURAR INPUTS
// =========================================================

function configurarInputs() {

    document
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(
            campo => {

                campo.addEventListener(
                    "input",
                    () => {

                        limparCampoInvalido(
                            campo
                        );

                    }
                );


                campo.addEventListener(
                    "change",
                    () => {

                        limparCampoInvalido(
                            campo
                        );

                    }
                );

            }
        );

}


// =========================================================
// CONTADOR DE TEXTAREA
//
// HTML:
//
// <textarea maxlength="1000" data-counter></textarea>
// =========================================================

function configurarTextareas() {

    document
        .querySelectorAll(
            "textarea[data-counter]"
        )
        .forEach(
            textarea => {

                criarContadorTextarea(
                    textarea
                );


                textarea.addEventListener(
                    "input",
                    () => {

                        atualizarContadorTextarea(
                            textarea
                        );

                    }
                );

            }
        );

}


// =========================================================
// CRIAR CONTADOR
// =========================================================

function criarContadorTextarea(
    textarea
) {

    if (
        textarea.dataset
            .counterConfigured ===
        "true"
    ) {

        return;

    }


    textarea.dataset
        .counterConfigured =
        "true";


    const contador =
        document.createElement(
            "div"
        );


    contador.className =
        "textarea-counter";


    textarea.insertAdjacentElement(
        "afterend",
        contador
    );


    atualizarContadorTextarea(
        textarea
    );

}


// =========================================================
// ATUALIZAR CONTADOR
// =========================================================

function atualizarContadorTextarea(
    textarea
) {

    const contador =
        textarea.nextElementSibling;


    if (
        !contador ||
        !contador.classList.contains(
            "textarea-counter"
        )
    ) {

        return;

    }


    const atual =
        textarea.value.length;


    const maximo =
        textarea.maxLength > 0
            ?
            textarea.maxLength
            :
            null;


    contador.textContent =
        maximo
            ?
            `${atual}/${maximo}`
            :
            `${atual} caracteres`;

}


// =========================================================
// INPUT FILE
// =========================================================

function configurarArquivos() {

    document
        .querySelectorAll(
            'input[type="file"][data-file-name]'
        )
        .forEach(
            input => {

                input.addEventListener(
                    "change",
                    () => {

                        const seletor =
                            input.dataset
                                .fileName;


                        if (!seletor) {

                            return;

                        }


                        const destino =
                            document.querySelector(
                                seletor
                            );


                        if (!destino) {

                            return;

                        }


                        const arquivos =
                            [
                                ...(
                                    input.files ||
                                    []
                                )
                            ];


                        if (
                            arquivos.length ===
                            0
                        ) {

                            destino.textContent =
                                "Nenhum arquivo selecionado";


                            return;

                        }


                        if (
                            arquivos.length ===
                            1
                        ) {

                            destino.textContent =
                                arquivos[0].name;


                            return;

                        }


                        destino.textContent =
                            `${arquivos.length} arquivos selecionados`;

                    }
                );

            }
        );

}


// =========================================================
// SENHAS
//
// HTML:
//
// <input id="senha">
// <button data-password-toggle="senha">
// =========================================================

function configurarSenhas() {

    document
        .querySelectorAll(
            "[data-password-toggle]"
        )
        .forEach(
            botao => {

                if (
                    botao.dataset
                        .passwordConfigured ===
                    "true"
                ) {

                    return;

                }


                botao.dataset
                    .passwordConfigured =
                    "true";


                botao.addEventListener(
                    "click",
                    () => {

                        const id =
                            botao.dataset
                                .passwordToggle;


                        const input =
                            document.getElementById(
                                id
                            );


                        if (!input) {

                            return;

                        }


                        const mostrar =
                            input.type ===
                            "password";


                        input.type =
                            mostrar
                                ?
                                "text"
                                :
                                "password";


                        const icone =
                            botao.querySelector(
                                "[data-lucide]"
                            );


                        icone?.setAttribute(
                            "data-lucide",
                            mostrar
                                ?
                                "eye-off"
                                :
                                "eye"
                        );


                        recriarIcones();

                    }
                );

            }
        );

}


// =========================================================
// BOTÕES COPIAR
//
// data-copy="texto"
//
// OU:
//
// data-copy-target="#campo"
// =========================================================

function configurarBotoesCopiar() {

    document
        .querySelectorAll(
            "[data-copy], [data-copy-target]"
        )
        .forEach(
            botao => {

                if (
                    botao.dataset
                        .copyConfigured ===
                    "true"
                ) {

                    return;

                }


                botao.dataset
                    .copyConfigured =
                    "true";


                botao.addEventListener(
                    "click",
                    async () => {

                        let texto =
                            botao.dataset
                                .copy ||
                            "";


                        const alvo =
                            botao.dataset
                                .copyTarget;


                        if (alvo) {

                            const elemento =
                                document.querySelector(
                                    alvo
                                );


                            texto =
                                elemento?.value ??
                                elemento?.textContent ??
                                "";

                        }


                        const sucesso =
                            await copiarTexto(
                                texto
                            );


                        if (sucesso) {

                            mostrarToast(
                                "Copiado para a área de transferência.",
                                "success",
                                {
                                    duracao:
                                        2200
                                }
                            );

                        } else {

                            mostrarToast(
                                "Não foi possível copiar.",
                                "error"
                            );

                        }

                    }
                );

            }
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
                    texto ?? ""
                )
            );


        return true;

    } catch {

        try {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                String(
                    texto ?? ""
                );


            textarea.style.position =
                "fixed";


            textarea.style.opacity =
                "0";


            document.body.appendChild(
                textarea
            );


            textarea.select();


            const sucesso =
                document.execCommand(
                    "copy"
                );


            textarea.remove();


            return sucesso;

        } catch {

            return false;

        }

    }

}


// =========================================================
// CONFIRMAÇÕES AUTOMÁTICAS
//
// data-ui-confirm="Deseja excluir?"
// =========================================================

function configurarConfirmacoes() {

    document
        .querySelectorAll(
            "[data-ui-confirm]"
        )
        .forEach(
            elemento => {

                if (
                    elemento.dataset
                        .uiConfirmConfigured ===
                    "true"
                ) {

                    return;

                }


                elemento.dataset
                    .uiConfirmConfigured =
                    "true";


                elemento.addEventListener(
                    "click",
                    async evento => {

                        if (
                            elemento.dataset
                                .confirmed ===
                            "true"
                        ) {

                            delete elemento.dataset
                                .confirmed;


                            return;

                        }


                        evento.preventDefault();

                        evento.stopImmediatePropagation();


                        const mensagem =
                            elemento.dataset
                                .uiConfirm ||
                            "Deseja continuar?";


                        const confirmado =
                            await modalConfirmacao({
                                titulo:
                                    "Confirmar ação",

                                mensagem,

                                perigo:
                                    elemento.dataset
                                        .confirmDanger ===
                                    "true"
                            });


                        if (!confirmado) {

                            return;

                        }


                        elemento.dataset
                            .confirmed =
                            "true";


                        elemento.click();

                    },
                    true
                );

            }
        );

}


// =========================================================
// AUTOFOCUS
// =========================================================

function configurarAutoFocus() {

    const elemento =
        document.querySelector(
            "[data-autofocus]"
        );


    if (!elemento) {

        return;

    }


    setTimeout(
        () => {

            elemento.focus();

        },
        100
    );

}


// =========================================================
// FORMATAR TAMANHO DE ARQUIVO
// =========================================================

export function formatarBytes(
    bytes,
    casas = 2
) {

    const numero =
        Number(
            bytes
        );


    if (
        !numero ||
        numero <= 0
    ) {

        return "0 B";

    }


    const k =
        1024;


    const unidades = [

        "B",

        "KB",

        "MB",

        "GB",

        "TB"

    ];


    const indice =
        Math.floor(
            Math.log(numero) /
            Math.log(k)
        );


    return (
        parseFloat(
            (
                numero /
                Math.pow(
                    k,
                    indice
                )
            ).toFixed(
                casas
            )
        )
        +
        " "
        +
        unidades[indice]
    );

}


// =========================================================
// FORMATAR TELEFONE
// =========================================================

export function formatarTelefone(
    valor
) {

    const numeros =
        String(
            valor || ""
        )
            .replace(
                /\D/g,
                ""
            )
            .substring(
                0,
                11
            );


    if (
        numeros.length <= 10
    ) {

        return numeros.replace(
            /^(\d{0,2})(\d{0,4})(\d{0,4})/,
            (
                _,
                ddd,
                parte1,
                parte2
            ) => {

                let resultado =
                    "";


                if (ddd) {

                    resultado +=
                        `(${ddd}`;

                }


                if (
                    ddd.length === 2
                ) {

                    resultado +=
                        ") ";

                }


                resultado +=
                    parte1;


                if (
                    parte2
                ) {

                    resultado +=
                        `-${parte2}`;

                }


                return resultado;

            }
        );

    }


    return numeros.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
    );

}


// =========================================================
// FORMATAR RG
// Mantemos simples porque o RP pode usar formatos
// diferentes.
// =========================================================

export function formatarRG(
    valor
) {

    return String(
        valor || ""
    )
        .trim()
        .substring(
            0,
            30
        );

}


// =========================================================
// FORMATAR DATA
// =========================================================

export function formatarData(
    valor
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

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
// FORMATAR DATA / HORA
// =========================================================

export function formatarDataHora(
    valor
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

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
// CONVERTER DATA
// =========================================================

function converterParaData(
    valor
) {

    if (!valor) {

        return null;

    }


    if (
        valor instanceof Date
    ) {

        return Number.isNaN(
            valor.getTime()
        )
            ?
            null
            :
            valor;

    }


    if (
        typeof valor?.toDate ===
        "function"
    ) {

        const data =
            valor.toDate();


        return Number.isNaN(
            data.getTime()
        )
            ?
            null
            :
            data;

    }


    const data =
        new Date(
            valor
        );


    return Number.isNaN(
        data.getTime()
    )
        ?
        null
        :
        data;

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
// CAPITALIZAR
// =========================================================

export function capitalizar(
    texto
) {

    return String(
        texto || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /(^|\s)\S/g,
            letra =>
                letra.toUpperCase()
        );

}


// =========================================================
// TRUNCAR TEXTO
// =========================================================

export function truncarTexto(
    texto,
    limite = 100
) {

    const valor =
        String(
            texto || ""
        );


    if (
        valor.length <=
        limite
    ) {

        return valor;

    }


    return (
        valor.substring(
            0,
            limite
        )
        .trimEnd()
        +
        "..."
    );

}


// =========================================================
// BADGE
// =========================================================

export function criarBadge(
    texto,
    tipo = "muted"
) {

    return `

        <span
            class="badge badge-${escaparAtributo(tipo)}"
        >

            ${escaparHTML(texto)}

        </span>

    `;

}


// =========================================================
// BADGE DE STATUS DE INQUÉRITO
// =========================================================

export function badgeStatusInquerito(
    status
) {

    const normalizado =
        normalizarTexto(
            status
        );


    const mapa = {

        rascunho: {
            texto:
                "Rascunho",

            tipo:
                "muted"
        },

        em_andamento: {
            texto:
                "Em andamento",

            tipo:
                "warning"
        },

        em_analise: {
            texto:
                "Em análise",

            tipo:
                "info"
        },

        em_investigacao: {
            texto:
                "Em investigação",

            tipo:
                "warning"
        },

        aguardando_decisao: {
            texto:
                "Aguardando decisão",

            tipo:
                "warning"
        },

        concluido: {
            texto:
                "Concluído",

            tipo:
                "success"
        },

        arquivado: {
            texto:
                "Arquivado",

            tipo:
                "info"
        }

    };


    const item =
        mapa[
            normalizado
        ] || {
            texto:
                status ||
                "-",

            tipo:
                "muted"
        };


    return criarBadge(
        item.texto,
        item.tipo
    );

}


// =========================================================
// RESOLVER ELEMENTO
// =========================================================

function resolverElemento(
    elementoOuId
) {

    if (!elementoOuId) {

        return null;

    }


    if (
        elementoOuId instanceof
        HTMLElement
    ) {

        return elementoOuId;

    }


    const texto =
        String(
            elementoOuId
        );


    return (
        document.getElementById(
            texto
        )
        ||
        document.querySelector(
            texto
        )
    );

}


// =========================================================
// ESCAPAR HTML
// =========================================================

export function escaparHTML(
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
// ESCAPAR ATRIBUTO
// =========================================================

export function escaparAtributo(
    valor
) {

    return escaparHTML(
        valor
    );

}


// =========================================================
// LUCIDE
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
// ESTILOS AUXILIARES
// =========================================================

function garantirEstilosUI() {

    if (
        document.getElementById(
            "sigcor-ui-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "sigcor-ui-styles";


    style.textContent = `

        .input-error {
            border-color:
                rgba(239, 68, 68, .75)
                !important;

            box-shadow:
                0 0 0 3px
                rgba(239, 68, 68, .06)
                !important;
        }


        .field-error-message {
            margin-top: 5px;

            color: #fca5a5;

            font-size: 8px;
        }


        .textarea-counter {
            margin-top: 5px;

            color: #64748b;

            font-size: 8px;

            text-align: right;
        }


        .ui-skeleton-card {
            padding: 16px;

            background:
                rgba(148, 163, 184, .025);

            border:
                1px solid
                rgba(148, 163, 184, .08);

            border-radius: 11px;
        }


        .ui-skeleton {
            height: 10px;

            margin-top: 9px;

            overflow: hidden;

            background:
                linear-gradient(
                    90deg,
                    rgba(148,163,184,.05),
                    rgba(148,163,184,.12),
                    rgba(148,163,184,.05)
                );

            background-size:
                200% 100%;

            border-radius:
                999px;

            animation:
                sigcorSkeleton
                1.2s linear
                infinite;
        }


        .ui-skeleton-title {
            width: 55%;

            height: 14px;

            margin-top: 0;
        }


        .ui-skeleton-short {
            width: 35%;
        }


        @keyframes sigcorSkeleton {

            from {
                background-position:
                    200% 0;
            }

            to {
                background-position:
                    -200% 0;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// =========================================================
// GARANTIR CSS AUXILIAR
// =========================================================

garantirEstilosUI();


// =========================================================
// API GLOBAL OPCIONAL
// =========================================================

window.SIGCORUI = {

    toast:
        mostrarToast,

    loading:
        mostrarLoading,

    hideLoading:
        esconderLoading,

    modal:
        abrirModal,

    confirm:
        modalConfirmacao,

    alert:
        modalAlerta,

    empty:
        estadoVazio,

    error:
        estadoErro,

    copy:
        copiarTexto,

    icons:
        recriarIcones

};