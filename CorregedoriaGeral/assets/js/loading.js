// =========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// loading.js
//
// Responsável por:
// - Tela global de carregamento
// - Overlay
// - Barra de progresso
// - Texto
// - Spinner
// - Bloqueio da interface
// - Transições
// =========================================================


// =========================================================
// CONFIGURAÇÕES
// =========================================================

const CONFIG = {

    fadeTime: 250,

    minimumTime: 300,

    spinnerSpeed: 900,

    autoHide: false

};


// =========================================================
// ESTADO
// =========================================================

let loadingAtivo = false;

let loadingElement = null;

let progressElement = null;

let textElement = null;

let spinnerElement = null;

let startTime = 0;

let progress = 0;


// =========================================================
// CRIAR LOADING
// =========================================================

function criarLoading() {

    if (loadingElement) {

        return;

    }

    loadingElement = document.createElement("div");

    loadingElement.id = "sigcor-loading";

    loadingElement.innerHTML = `

        <div class="loading-backdrop">

            <div class="loading-box">

                <div class="loading-logo">

                    <img
                        src="../assets/img/logo.png"
                        alt="SIGCOR"
                        onerror="this.style.display='none'"
                    >

                </div>

                <div class="loading-spinner">

                    <div class="spinner-circle"></div>

                </div>

                <div
                    class="loading-text"
                    id="loadingText"
                >
                    Carregando...
                </div>

                <div class="loading-progress">

                    <div
                        class="loading-progress-bar"
                        id="loadingProgress"
                    ></div>

                </div>

                <div
                    class="loading-percent"
                    id="loadingPercent"
                >
                    0%
                </div>

            </div>

        </div>

    `;

    document.body.appendChild(
        loadingElement
    );

    progressElement =
        document.getElementById(
            "loadingProgress"
        );

    textElement =
        document.getElementById(
            "loadingText"
        );

    spinnerElement =
        document.querySelector(
            ".spinner-circle"
        );

    aplicarCSS();

}


// =========================================================
// CSS
// =========================================================

function aplicarCSS() {

    if (
        document.getElementById(
            "loading-style"
        )
    ) {

        return;

    }

    const style =
        document.createElement("style");

    style.id = "loading-style";

    style.innerHTML = `

#sigcor-loading{

position:fixed;
top:0;
left:0;
width:100%;
height:100%;
z-index:999999;
display:none;
opacity:0;
transition:.25s;

}

#sigcor-loading.active{

display:block;
opacity:1;

}

.loading-backdrop{

width:100%;
height:100%;
background:#081018;
display:flex;
align-items:center;
justify-content:center;

}

.loading-box{

width:360px;
max-width:92%;
padding:35px;
background:#101826;
border:1px solid rgba(255,255,255,.08);
border-radius:18px;
text-align:center;
box-shadow:0 20px 60px rgba(0,0,0,.45);

}

.loading-logo img{

width:82px;
margin-bottom:20px;

}

.loading-spinner{

display:flex;
justify-content:center;
margin-bottom:18px;

}

.spinner-circle{

width:52px;
height:52px;
border-radius:50%;
border:4px solid rgba(255,255,255,.12);
border-top-color:#d4af37;
animation:loadingRotate .9s linear infinite;

}

.loading-text{

font-size:15px;
color:#fff;
margin-bottom:20px;

}

.loading-progress{

width:100%;
height:8px;
background:#1b2638;
border-radius:999px;
overflow:hidden;

}

.loading-progress-bar{

width:0%;
height:100%;
background:#d4af37;
transition:.25s;

}

.loading-percent{

margin-top:12px;
font-size:13px;
color:#9aa7bb;

}

body.loading{

overflow:hidden;

}

@keyframes loadingRotate{

from{
transform:rotate(0deg);
}

to{
transform:rotate(360deg);
}

}

`;

    document.head.appendChild(style);

}
// =========================================================
// MOSTRAR LOADING
// =========================================================

export function showLoading(
    texto = "Carregando..."
) {

    criarLoading();

    loadingAtivo = true;

    startTime = Date.now();

    progress = 0;

    atualizarTexto(texto);

    atualizarProgresso(0);

    document.body.classList.add("loading");

    loadingElement.style.display = "block";

    requestAnimationFrame(() => {

        loadingElement.classList.add("active");

    });

}


// =========================================================
// ESCONDER LOADING
// =========================================================

export async function hideLoading() {

    if (!loadingAtivo) {

        return;

    }

    const tempo =
        Date.now() - startTime;

    if (
        tempo < CONFIG.minimumTime
    ) {

        await esperar(
            CONFIG.minimumTime - tempo
        );

    }

    atualizarProgresso(100);

    await esperar(120);

    loadingElement.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "loading"
    );

    setTimeout(() => {

        loadingElement.style.display =
            "none";

    }, CONFIG.fadeTime);

    loadingAtivo = false;

}


// =========================================================
// ALTERAR TEXTO
// =========================================================

export function setLoadingText(
    texto
) {

    atualizarTexto(texto);

}


// =========================================================
// TEXTO INTERNO
// =========================================================

function atualizarTexto(
    texto
) {

    if (!textElement) {

        return;

    }

    textElement.textContent =
        texto;

}


// =========================================================
// PROGRESSO
// =========================================================

export function setLoadingProgress(
    valor
) {

    atualizarProgresso(valor);

}


// =========================================================
// ATUALIZAR PROGRESSO
// =========================================================

function atualizarProgresso(
    valor
) {

    progress =
        Math.max(
            0,
            Math.min(
                100,
                Number(valor)
            )
        );

    if (progressElement) {

        progressElement.style.width =
            `${progress}%`;

    }

    const porcentagem =
        document.getElementById(
            "loadingPercent"
        );

    if (porcentagem) {

        porcentagem.textContent =
            `${Math.round(progress)}%`;

    }

}


// =========================================================
// ANIMAÇÃO AUTOMÁTICA
// =========================================================

export async function animateLoading(
    destino = 100,
    velocidade = 15
) {

    while (
        progress < destino &&
        loadingAtivo
    ) {

        progress++;

        atualizarProgresso(
            progress
        );

        await esperar(
            velocidade
        );

    }

}


// =========================================================
// ETAPAS
// =========================================================

export async function loadingStep(
    texto,
    porcentagem
) {

    atualizarTexto(texto);

    await animateLoading(
        porcentagem
    );

}


// =========================================================
// REINICIAR
// =========================================================

export function resetLoading() {

    progress = 0;

    atualizarProgresso(0);

    atualizarTexto(
        "Carregando..."
    );

}
// =========================================================
// LOADING PARA LOGIN
// =========================================================

export async function loadingLogin(
    callback
) {

    try {

        showLoading(
            "Verificando credenciais..."
        );

        await loadingStep(
            "Conectando ao sistema...",
            20
        );

        await loadingStep(
            "Validando usuário...",
            45
        );

        const resultado =
            await callback?.();

        await loadingStep(
            "Carregando permissões...",
            75
        );

        await loadingStep(
            "Preparando ambiente...",
            95
        );

        await hideLoading();

        return resultado;

    } catch (erro) {

        await hideLoading();

        throw erro;

    }

}


// =========================================================
// LOADING PARA DASHBOARD
// =========================================================

export async function loadingDashboard(
    callback
) {

    try {

        showLoading(
            "Carregando Dashboard..."
        );

        await loadingStep(
            "Consultando inquéritos...",
            20
        );

        const resultado =
            await callback?.();

        await loadingStep(
            "Carregando estatísticas...",
            55
        );

        await loadingStep(
            "Carregando movimentações...",
            80
        );

        await loadingStep(
            "Finalizando...",
            100
        );

        await hideLoading();

        return resultado;

    } catch (erro) {

        await hideLoading();

        throw erro;

    }

}


// =========================================================
// LOADING PARA SALVAR INQUÉRITO
// =========================================================

export async function loadingSalvarInquerito(
    callback
) {

    try {

        showLoading(
            "Salvando inquérito..."
        );

        await loadingStep(
            "Validando informações...",
            15
        );

        await loadingStep(
            "Preparando dados...",
            30
        );

        const resultado =
            await callback?.();

        await loadingStep(
            "Registrando no banco de dados...",
            70
        );

        await loadingStep(
            "Finalizando salvamento...",
            95
        );

        await hideLoading();

        return resultado;

    } catch (erro) {

        await hideLoading();

        throw erro;

    }

}


// =========================================================
// LOADING DE UPLOAD
// =========================================================

export function loadingUpload(
    texto = "Enviando arquivo..."
) {

    showLoading(
        texto
    );

    setLoadingProgress(0);

}


// =========================================================
// ATUALIZAR UPLOAD
// =========================================================

export function updateUploadProgress(
    bytesTransferidos,
    totalBytes
) {

    if (
        !totalBytes ||
        totalBytes <= 0
    ) {

        return;

    }

    const porcentagem =
        (
            bytesTransferidos /
            totalBytes
        ) * 100;

    setLoadingText(
        "Enviando arquivo..."
    );

    setLoadingProgress(
        porcentagem
    );

}


// =========================================================
// FINALIZAR UPLOAD
// =========================================================

export async function finishUpload() {

    setLoadingText(
        "Upload concluído."
    );

    setLoadingProgress(
        100
    );

    await esperar(
        250
    );

    await hideLoading();

}


// =========================================================
// ERRO NO UPLOAD
// =========================================================

export async function failUpload(
    mensagem = "Erro no upload."
) {

    setLoadingText(
        mensagem
    );

    await esperar(
        600
    );

    await hideLoading();

}


// =========================================================
// LOADING PARA FETCH
// =========================================================

export async function loadingFetch(
    url,
    options = {},
    texto = "Carregando dados..."
) {

    try {

        showLoading(
            texto
        );

        await loadingStep(
            "Conectando...",
            15
        );

        const resposta =
            await fetch(
                url,
                options
            );

        await loadingStep(
            "Recebendo dados...",
            65
        );

        if (
            !resposta.ok
        ) {

            throw new Error(
                `Erro HTTP ${resposta.status}`
            );

        }

        await loadingStep(
            "Processando...",
            90
        );

        await hideLoading();

        return resposta;

    } catch (erro) {

        await hideLoading();

        throw erro;

    }

}


// =========================================================
// LOADING PARA JSON
// =========================================================

export async function loadingFetchJSON(
    url,
    options = {},
    texto = "Carregando dados..."
) {

    const resposta =
        await loadingFetch(
            url,
            options,
            texto
        );

    return resposta.json();

}


// =========================================================
// LOADING DE TROCA DE PÁGINA
// =========================================================

export function loadingPage(
    destino,
    texto = "Abrindo página..."
) {

    showLoading(
        texto
    );

    animateLoading(
        80,
        12
    );

    setTimeout(
        () => {

            window.location.href =
                destino;

        },
        350
    );

}


// =========================================================
// LINKS COM LOADING
// =========================================================

export function enableLoadingLinks() {

    document
        .querySelectorAll(
            "a[data-loading]"
        )
        .forEach(
            link => {

                if (
                    link.dataset
                        .loadingConfigured ===
                    "true"
                ) {

                    return;

                }

                link.dataset
                    .loadingConfigured =
                    "true";

                link.addEventListener(
                    "click",
                    evento => {

                        const href =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !href ||
                            href === "#" ||
                            href.startsWith(
                                "javascript:"
                            ) ||
                            href.startsWith(
                                "mailto:"
                            ) ||
                            href.startsWith(
                                "tel:"
                            ) ||
                            link.target ===
                                "_blank"
                        ) {

                            return;

                        }

                        evento.preventDefault();

                        loadingPage(
                            href,
                            link.dataset
                                .loadingText ||
                            "Abrindo página..."
                        );

                    }
                );

            }
        );

}


// =========================================================
// LOADING DE BOTÃO
// =========================================================

export function setButtonLoading(
    button,
    ativo = true,
    texto = "Carregando..."
) {

    if (!button) {

        return;

    }

    if (ativo) {

        if (
            !button.dataset
                .originalHtml
        ) {

            button.dataset
                .originalHtml =
                button.innerHTML;

        }

        button.disabled =
            true;

        button.classList.add(
            "is-loading"
        );

        button.innerHTML = `

            <span
                style="
                    width:15px;
                    height:15px;
                    border:2px solid rgba(255,255,255,.25);
                    border-top-color:currentColor;
                    border-radius:50%;
                    animation:loadingRotate .7s linear infinite;
                    display:inline-block;
                    flex-shrink:0;
                "
            ></span>

            <span>
                ${escaparHTML(texto)}
            </span>

        `;

    } else {

        button.disabled =
            false;

        button.classList.remove(
            "is-loading"
        );

        if (
            button.dataset
                .originalHtml
        ) {

            button.innerHTML =
                button.dataset
                    .originalHtml;

            delete button.dataset
                .originalHtml;

        }

    }

}


// =========================================================
// LOADING DE VÁRIOS BOTÕES
// =========================================================

export function disableButtons(
    seletor = "button"
) {

    document
        .querySelectorAll(
            seletor
        )
        .forEach(
            botao => {

                if (
                    botao.disabled
                ) {

                    botao.dataset
                        .wasDisabled =
                        "true";

                }

                botao.disabled =
                    true;

            }
        );

}


// =========================================================
// REATIVAR BOTÕES
// =========================================================

export function enableButtons(
    seletor = "button"
) {

    document
        .querySelectorAll(
            seletor
        )
        .forEach(
            botao => {

                if (
                    botao.dataset
                        .wasDisabled ===
                    "true"
                ) {

                    delete botao.dataset
                        .wasDisabled;

                    return;

                }

                botao.disabled =
                    false;

            }
        );

}


// =========================================================
// LOADING DE TABELA
// =========================================================

export function tableLoading(
    tbody,
    colunas = 5,
    texto = "Carregando registros..."
) {

    if (!tbody) {

        return;

    }

    tbody.innerHTML = `

        <tr>

            <td
                colspan="${Number(colunas) || 1}"
            >

                <div
                    class="empty-state"
                    style="
                        min-height:110px;
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                        justify-content:center;
                        gap:12px;
                    "
                >

                    <span
                        style="
                            width:28px;
                            height:28px;
                            display:block;
                            border:3px solid rgba(212,175,55,.12);
                            border-top-color:#d4af37;
                            border-radius:50%;
                            animation:loadingRotate .75s linear infinite;
                        "
                    ></span>

                    <span>
                        ${escaparHTML(texto)}
                    </span>

                </div>

            </td>

        </tr>

    `;

}


// =========================================================
// LOADING DE CONTAINER
// =========================================================

export function containerLoading(
    container,
    texto = "Carregando..."
) {

    if (!container) {

        return;

    }

    container.innerHTML = `

        <div
            style="
                min-height:150px;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction:column;
                gap:12px;
                color:#64748b;
                font-size:11px;
            "
        >

            <span
                style="
                    width:30px;
                    height:30px;
                    border:3px solid rgba(212,175,55,.12);
                    border-top-color:#d4af37;
                    border-radius:50%;
                    animation:loadingRotate .75s linear infinite;
                "
            ></span>

            <span>
                ${escaparHTML(texto)}
            </span>

        </div>

    `;

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
// UTILITÁRIO: ESPERAR
// =========================================================

export function esperar(
    milissegundos = 0
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                Math.max(
                    0,
                    Number(
                        milissegundos
                    ) || 0
                )
            );

        }
    );

}


// =========================================================
// VERIFICAR SE LOADING ESTÁ ATIVO
// =========================================================

export function isLoading() {

    return loadingAtivo;

}


// =========================================================
// OBTER PROGRESSO ATUAL
// =========================================================

export function getLoadingProgress() {

    return progress;

}


// =========================================================
// FORÇAR FECHAMENTO
// =========================================================

export function forceHideLoading() {

    if (
        !loadingElement
    ) {

        loadingAtivo =
            false;

        return;

    }


    loadingElement.classList.remove(
        "active"
    );


    loadingElement.style.display =
        "none";


    document.body.classList.remove(
        "loading"
    );


    loadingAtivo =
        false;


    progress =
        0;

}


// =========================================================
// TROCAR TEXTO E PROGRESSO
// =========================================================

export function updateLoading(
    texto,
    porcentagem = null
) {

    if (
        typeof texto ===
        "string"
    ) {

        setLoadingText(
            texto
        );

    }


    if (
        porcentagem !== null &&
        porcentagem !== undefined
    ) {

        setLoadingProgress(
            porcentagem
        );

    }

}


// =========================================================
// EXECUTAR TAREFA COM LOADING
// =========================================================

export async function withLoading(
    callback,
    {
        texto =
            "Carregando...",

        textoSucesso =
            "Concluído.",

        progressoInicial =
            10,

        progressoFinal =
            100,

        tempoSucesso =
            180
    } = {}
) {

    try {

        showLoading(
            texto
        );


        setLoadingProgress(
            progressoInicial
        );


        const resultado =
            await callback?.();


        setLoadingText(
            textoSucesso
        );


        setLoadingProgress(
            progressoFinal
        );


        await esperar(
            tempoSucesso
        );


        await hideLoading();


        return resultado;

    } catch (erro) {

        await hideLoading();


        throw erro;

    }

}


// =========================================================
// LOADING DE EXCLUSÃO
// =========================================================

export async function loadingDelete(
    callback,
    texto = "Excluindo registro..."
) {

    return withLoading(
        callback,
        {
            texto,

            textoSucesso:
                "Registro excluído.",

            progressoInicial:
                20,

            progressoFinal:
                100
        }
    );

}


// =========================================================
// LOADING DE ATUALIZAÇÃO
// =========================================================

export async function loadingUpdate(
    callback,
    texto = "Atualizando dados..."
) {

    return withLoading(
        callback,
        {
            texto,

            textoSucesso:
                "Dados atualizados.",

            progressoInicial:
                15,

            progressoFinal:
                100
        }
    );

}


// =========================================================
// LOADING DE CRIAÇÃO
// =========================================================

export async function loadingCreate(
    callback,
    texto = "Criando registro..."
) {

    return withLoading(
        callback,
        {
            texto,

            textoSucesso:
                "Registro criado.",

            progressoInicial:
                15,

            progressoFinal:
                100
        }
    );

}


// =========================================================
// LOADING DE PESQUISA
// =========================================================

export async function loadingSearch(
    callback,
    texto = "Pesquisando..."
) {

    return withLoading(
        callback,
        {
            texto,

            textoSucesso:
                "Pesquisa concluída.",

            progressoInicial:
                20,

            progressoFinal:
                100,

            tempoSucesso:
                100
        }
    );

}


// =========================================================
// LOADING DE GERAÇÃO DE PDF
// =========================================================

export async function loadingPDF(
    callback
) {

    try {

        showLoading(
            "Preparando documento..."
        );


        await loadingStep(
            "Organizando informações...",
            20
        );


        await loadingStep(
            "Montando páginas...",
            45
        );


        const resultado =
            await callback?.();


        await loadingStep(
            "Finalizando documento...",
            85
        );


        await loadingStep(
            "PDF pronto.",
            100
        );


        await esperar(
            200
        );


        await hideLoading();


        return resultado;

    } catch (erro) {

        await hideLoading();


        throw erro;

    }

}


// =========================================================
// LOADING DE ASSINATURA
// =========================================================

export async function loadingSignature(
    callback
) {

    return withLoading(
        callback,
        {
            texto:
                "Registrando assinatura...",

            textoSucesso:
                "Assinatura registrada.",

            progressoInicial:
                25,

            progressoFinal:
                100
        }
    );

}


// =========================================================
// LOADING DE AUTENTICAÇÃO
// =========================================================

export function showAuthLoading(
    texto =
        "Verificando autenticação..."
) {

    showLoading(
        texto
    );


    setLoadingProgress(
        25
    );

}


// =========================================================
// FINALIZAR AUTENTICAÇÃO
// =========================================================

export async function finishAuthLoading() {

    setLoadingText(
        "Acesso autorizado."
    );


    setLoadingProgress(
        100
    );


    await esperar(
        150
    );


    await hideLoading();

}


// =========================================================
// LOADING EM INPUT FILE
// =========================================================

export function bindFileLoading(
    input,
    callback
) {

    if (!input) {

        return;

    }


    if (
        input.dataset
            .loadingBound ===
        "true"
    ) {

        return;

    }


    input.dataset
        .loadingBound =
        "true";


    input.addEventListener(
        "change",
        async () => {

            const arquivo =
                input.files?.[0];


            if (!arquivo) {

                return;

            }


            try {

                loadingUpload(
                    `Preparando ${arquivo.name}...`
                );


                await callback?.(
                    arquivo
                );


                await finishUpload();

            } catch (erro) {

                console.error(
                    "Erro durante upload:",
                    erro
                );


                await failUpload(
                    "Não foi possível enviar o arquivo."
                );

            }

        }
    );

}


// =========================================================
// LOADING EM FORMULÁRIOS
// =========================================================

export function bindFormLoading(
    formulario,
    {
        texto =
            "Processando...",

        seletorBotao =
            'button[type="submit"]'
    } = {}
) {

    if (!formulario) {

        return;

    }


    if (
        formulario.dataset
            .loadingBound ===
        "true"
    ) {

        return;

    }


    formulario.dataset
        .loadingBound =
        "true";


    formulario.addEventListener(
        "submit",
        () => {

            const botao =
                formulario.querySelector(
                    seletorBotao
                );


            if (botao) {

                setButtonLoading(
                    botao,
                    true,
                    texto
                );

            }

        }
    );

}


// =========================================================
// REMOVER LOADING DE FORMULÁRIO
// =========================================================

export function resetFormLoading(
    formulario,
    seletorBotao =
        'button[type="submit"]'
) {

    if (!formulario) {

        return;

    }


    const botao =
        formulario.querySelector(
            seletorBotao
        );


    if (botao) {

        setButtonLoading(
            botao,
            false
        );

    }

}


// =========================================================
// ALIASES COMPATÍVEIS COM ui.js
//
// Já usamos estes nomes em outros arquivos:
//
// mostrarLoading()
// esconderLoading()
// =========================================================

export function mostrarLoading(
    texto = "Carregando..."
) {

    return showLoading(
        texto
    );

}


export function esconderLoading() {

    return hideLoading();

}


// =========================================================
// ALIAS DE TEXTO
// =========================================================

export function alterarTextoLoading(
    texto
) {

    return setLoadingText(
        texto
    );

}


// =========================================================
// ALIAS DE PROGRESSO
// =========================================================

export function alterarProgressoLoading(
    valor
) {

    return setLoadingProgress(
        valor
    );

}


// =========================================================
// EVENTO PERSONALIZADO: MOSTRAR LOADING
//
// Pode usar:
//
// window.dispatchEvent(
//     new CustomEvent(
//         "sigcor:loading:show",
//         { detail: { texto: "Carregando..." } }
//     )
// );
// =========================================================

window.addEventListener(
    "sigcor:loading:show",
    evento => {

        const texto =
            evento.detail?.texto ||
            "Carregando...";


        showLoading(
            texto
        );


        if (
            evento.detail
                ?.progresso !==
            undefined
        ) {

            setLoadingProgress(
                evento.detail
                    .progresso
            );

        }

    }
);


// =========================================================
// EVENTO PERSONALIZADO: ESCONDER
// =========================================================

window.addEventListener(
    "sigcor:loading:hide",
    () => {

        hideLoading();

    }
);


// =========================================================
// EVENTO PERSONALIZADO: ATUALIZAR
// =========================================================

window.addEventListener(
    "sigcor:loading:update",
    evento => {

        updateLoading(
            evento.detail?.texto,
            evento.detail?.progresso
        );

    }
);


// =========================================================
// REMOVER LOADING AO VOLTAR PELO NAVEGADOR
// =========================================================

window.addEventListener(
    "pageshow",
    evento => {

        if (
            evento.persisted
        ) {

            forceHideLoading();

        }

    }
);


// =========================================================
// GARANTIR DESBLOQUEIO EM ERRO GLOBAL
// =========================================================

window.addEventListener(
    "error",
    () => {

        if (
            loadingAtivo &&
            CONFIG.autoHide
        ) {

            forceHideLoading();

        }

    }
);


// =========================================================
// PROMISE REJECTION
// =========================================================

window.addEventListener(
    "unhandledrejection",
    () => {

        if (
            loadingAtivo &&
            CONFIG.autoHide
        ) {

            forceHideLoading();

        }

    }
);


// =========================================================
// INICIALIZAÇÃO AUTOMÁTICA
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        criarLoading();


        enableLoadingLinks();


        // Loading fica escondido
        // até alguma função chamá-lo.

        forceHideLoading();

    }
);


// =========================================================
// EXPOR API GLOBAL OPCIONAL
//
// Permite usar no console ou em scripts comuns:
//
// SIGCORLoading.show()
// SIGCORLoading.hide()
// =========================================================

window.SIGCORLoading = {

    show:
        showLoading,

    hide:
        hideLoading,

    forceHide:
        forceHideLoading,

    setText:
        setLoadingText,

    setProgress:
        setLoadingProgress,

    update:
        updateLoading,

    reset:
        resetLoading,

    isLoading,

    getProgress:
        getLoadingProgress,

    page:
        loadingPage

};