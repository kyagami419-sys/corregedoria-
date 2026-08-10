// ==========================================================
// SIGCOR
// assets/js/visualizar.js
// Dossiê completo do Inquérito
// ==========================================================

import {
    protegerPagina,
    logout,
    gerarIniciais,
    normalizarCargo
} from "../../firebase/auth.js";

import {
    atualizarInquerito,
    buscarDocumento,
    uploadArquivo,
    COLECOES
} from "./api.js";

import {
    db
} from "../../firebase/firebase.js";

import {
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// ==========================================================
// ESTADO
// ==========================================================

let usuarioLogado =
    null;

let perfilLogado =
    null;

let inqueritoAtual =
    null;

let abaAtual =
    "resumo";


// ==========================================================
// INICIALIZAÇÃO
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

        configurarEventosFixos();

        garantirModais();


        const id =
            obterIdURL();


        if (!id) {

            mostrarErro(
                "O ID do inquérito não foi informado."
            );

            return;

        }


        await carregarInquerito(
            id
        );


    } catch (erro) {

        console.error(
            "SIGCOR - visualizar:",
            erro
        );


        mostrarErro(
            erro.message ||
            "Não foi possível carregar o inquérito."
        );

    }

}


// ==========================================================
// ID DA URL
// ==========================================================

function obterIdURL() {

    return new URLSearchParams(
        window.location.search
    ).get(
        "id"
    );

}


// ==========================================================
// PERFIL
// ==========================================================

function preencherPerfil() {

    const nome =
        perfilLogado?.nome ||
        usuarioLogado?.email ||
        "Usuário";


    const userName =
        document.getElementById(
            "userName"
        );


    const userRole =
        document.getElementById(
            "userRole"
        );


    const userAvatar =
        document.getElementById(
            "userAvatar"
        );


    if (userName) {

        userName.textContent =
            nome;

    }


    if (userRole) {

        userRole.textContent =
            formatarCargo(
                perfilLogado?.cargo
            );

    }


    if (userAvatar) {

        const foto =
            String(
                perfilLogado?.foto ||
                ""
            ).trim();


        if (foto) {

            userAvatar.innerHTML = `

                <img
                    src="${escaparHTML(foto)}"
                    alt="${escaparHTML(nome)}"
                >

            `;

        } else {

            userAvatar.textContent =
                gerarIniciais(
                    nome
                );

        }

    }

}


// ==========================================================
// API
// ==========================================================



   async function carregarInquerito(
    id
) {

    definirCarregando();



       try {

    const resultado = await buscarDocumento(
        COLECOES.INQUERITOS,
        id
    );

if (!resultado) {
    throw new Error(
        "Não foi possível carregar o inquérito."
    );
}

inqueritoAtual = resultado;

renderizarDossie();

} catch (erro) {

    console.error(
        "Erro ao carregar inquérito:",
        erro
    );

    alert(
        "Erro ao carregar o inquérito."
    );

}
}


// ==========================================================
// DOSSIÊ
// ==========================================================

function renderizarDossie() {

    const container =
        document.getElementById(
            "conteudoInquerito"
        );


    if (
        !container ||
        !inqueritoAtual
    ) {

        return;

    }


    const item =
        inqueritoAtual;


    const status =
        normalizarStatus(
            item.status ||
            "andamento"
        );


    const numero =
        obterNumeroInquerito(
            item
        );


    const titulo =
        item.titulo ||
        "Inquérito sem título";


    const responsavel =

        item.responsavelNome ||

        item.responsavel ||

        item.criadoPorNome ||

        "-";


    const sigilo =

        item.sigilo ||

        item.grauSigilo ||

        "Interno";


    container.innerHTML = `

        <section class="case-header">

            <div class="case-topline">

                <span class="case-number">

                    ${escaparHTML(numero)}

                </span>


                <span
                    class="badge status ${escaparHTML(status)}"
                >

                    ${escaparHTML(
                        nomeStatus(
                            status
                        )
                    )}

                </span>


                <span class="badge tipo">

                    ${escaparHTML(
                        formatarTipo(
                            item.tipo
                        )
                    )}

                </span>


                <span class="badge sigilo">

                    ${escaparHTML(sigilo)}

                </span>

            </div>


            <h2>

                ${escaparHTML(titulo)}

            </h2>


            <p>

                Procedimento investigativo registrado no Sistema
                Integrado de Gestão da Corregedoria.

            </p>


            <div class="case-meta">

                ${criarMeta(
                    "Responsável",
                    responsavel
                )}


                ${criarMeta(
                    "Abertura",
                    formatarDataHora(
                        item.criadoEm
                    )
                )}


                ${criarMeta(
                    "Última atualização",
                    formatarDataHora(
                        item.atualizadoEm
                    )
                )}


                ${criarMeta(
                    "Protocolo",
                    item.numeroExterno ||
                    "-"
                )}

            </div>

        </section>


        <nav class="tabs">

            ${criarBotaoAba(
                "resumo",
                "clipboard-list",
                "Resumo"
            )}

            ${criarBotaoAba(
                "envolvidos",
                "users",
                "Envolvidos"
            )}

            ${criarBotaoAba(
                "depoimentos",
                "messages-square",
                "Depoimentos"
            )}

            ${criarBotaoAba(
                "evidencias",
                "paperclip",
                "Evidências"
            )}

            ${criarBotaoAba(
                "diligencias",
                "list-checks",
                "Diligências"
            )}

            ${criarBotaoAba(
                "documentos",
                "files",
                "Documentos"
            )}

            ${criarBotaoAba(
                "historico",
                "history",
                "Histórico"
            )}

        </nav>


        <section class="workspace">

            <div>

                ${renderizarAbaResumo()}

                ${renderizarAbaEnvolvidos()}

                ${renderizarAbaDepoimentos()}

                ${renderizarAbaEvidencias()}

                ${renderizarAbaDiligencias()}

                ${renderizarAbaDocumentos()}

                ${renderizarAbaHistorico()}

            </div>


            <aside class="side-stack">


                <section class="panel">

                    <div class="panel-header">

                        <strong>
                            Dados do processo
                        </strong>

                    </div>


                    <div class="panel-body">

                        <div class="side-list">

                            ${criarSideItem(
                                "Número",
                                numero
                            )}

                            ${criarSideItem(
                                "Tipo",
                                formatarTipo(
                                    item.tipo
                                )
                            )}

                            ${criarSideItem(
                                "Responsável",
                                responsavel
                            )}

                            ${criarSideItem(
                                "Status",
                                nomeStatus(
                                    status
                                )
                            )}

                            ${criarSideItem(
                                "Sigilo",
                                sigilo
                            )}

                            ${criarSideItem(
                                "Criado por",

                                item.criadoPorNome ||

                                item.criadoPor ||

                                "-"
                            )}

                            ${criarSideItem(
                                "ID interno",
                                item.id
                            )}

                        </div>

                    </div>

                </section>


                <section class="panel">

                    <div class="panel-header">

                        <strong>
                            Ações rápidas
                        </strong>

                    </div>


                    <div class="panel-body">

                        <div class="quick-actions">


                            <button
                                type="button"
                                class="quick-action gold"
                                id="acaoEditar"
                            >

                                <i data-lucide="pencil"></i>

                                Editar inquérito

                            </button>


                            <button
                                type="button"
                                class="quick-action"
                                id="acaoFinalizar"
                            >

                                <i data-lucide="circle-check"></i>

                                Finalizar

                            </button>


                            <button
                                type="button"
                                class="quick-action"
                                id="acaoArquivar"
                            >

                                <i data-lucide="archive"></i>

                                Arquivar

                            </button>


                            <button
                                type="button"
                                class="quick-action"
                                id="acaoReabrir"
                            >

                                <i data-lucide="rotate-ccw"></i>

                                Reabrir

                            </button>


                            <button
                                type="button"
                                class="quick-action red"
                                id="acaoExcluir"
                            >

                                <i data-lucide="trash-2"></i>

                                Excluir

                            </button>

                        </div>

                    </div>

                </section>


                <section class="panel">

                    <div class="panel-header">

                        <strong>
                            Linha do tempo
                        </strong>

                    </div>


                    <div class="panel-body">

                        ${criarTimelineResumo()}

                    </div>

                </section>

            </aside>

        </section>

    `;


    configurarAbas();

    configurarAcoesDossie();

    window.lucide
        ?.createIcons();

}


// ==========================================================
// META
// ==========================================================

function criarMeta(
    titulo,
    valor
) {

    return `

        <div class="case-meta-item">

            <span>

                ${escaparHTML(titulo)}

            </span>

            <strong>

                ${escaparHTML(
                    valor ||
                    "-"
                )}

            </strong>

        </div>

    `;

}


// ==========================================================
// ABAS
// ==========================================================

function criarBotaoAba(
    id,
    icone,
    titulo
) {

    return `

        <button
            type="button"
            class="tab-button ${abaAtual === id ? "active" : ""}"
            data-tab="${escaparHTML(id)}"
        >

            <i
                data-lucide="${escaparHTML(icone)}"
            ></i>

            ${escaparHTML(titulo)}

        </button>

    `;

}


function configurarAbas() {

    document
        .querySelectorAll(
            ".tab-button"
        )
        .forEach(

            botao => {

                botao.addEventListener(

                    "click",

                    () => {

                        abaAtual =
                            botao.dataset.tab;


                        document
                            .querySelectorAll(
                                ".tab-button"
                            )
                            .forEach(

                                item => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }

                            );


                        botao.classList.add(
                            "active"
                        );


                        document
                            .querySelectorAll(
                                ".tab-panel"
                            )
                            .forEach(

                                painel => {

                                    painel.classList.remove(
                                        "active"
                                    );

                                }

                            );


                        document
                            .getElementById(
                                `tab-${abaAtual}`
                            )
                            ?.classList
                            .add(
                                "active"
                            );

                    }

                );

            }

        );

}


// ==========================================================
// RESUMO
// ==========================================================

function renderizarAbaResumo() {

    const item =
        inqueritoAtual;


    return `

        <section
            class="panel tab-panel ${abaAtual === "resumo" ? "active" : ""}"
            id="tab-resumo"
        >

            <div class="panel-header">

                <strong>

                    Resumo do inquérito

                </strong>

                <span>

                    Visão geral

                </span>

            </div>


            <div class="panel-body">

                ${criarBlocoTexto(

                    "Resumo dos fatos",

                    item.descricao ||
                    "Nenhum resumo dos fatos informado."

                )}


                ${criarBlocoTexto(

                    "Objeto da investigação",

                    item.objetoInvestigacao ||

                    item.objeto ||

                    "Não informado."

                )}


                ${criarBlocoTexto(

                    "Observações internas",

                    item.observacoes ||

                    "Nenhuma observação interna registrada."

                )}

            </div>

        </section>

    `;

}


function criarBlocoTexto(
    titulo,
    texto
) {

    return `

        <div class="section-block">

            <h3>

                ${escaparHTML(titulo)}

            </h3>

            <p>

                ${escaparHTML(texto)}

            </p>

        </div>

    `;

}


// ==========================================================
// ENVOLVIDOS
// ==========================================================

function renderizarAbaEnvolvidos() {

    const envolvidos =
        Array.isArray(
            inqueritoAtual.envolvidos
        )

            ?

            inqueritoAtual.envolvidos

            :

            normalizarLista(
                inqueritoAtual.envolvidos
            ).map(

                nome => ({

                    nome,

                    tipo:
                        "",

                    matricula:
                        "",

                    departamento:
                        "",

                    observacoes:
                        ""

                })

            );


    const conteudo =
        envolvidos.length

            ?

            envolvidos
                .map(

                    (
                        envolvido,
                        index
                    ) =>

                        criarCardEnvolvido(
                            envolvido,
                            index
                        )

                )
                .join("")

            :

            `

                <div class="empty-state">

                    Nenhum envolvido registrado.

                </div>

            `;


    return `

        <section
            class="panel tab-panel ${abaAtual === "envolvidos" ? "active" : ""}"
            id="tab-envolvidos"
        >

            <div class="panel-header">

                <div>

                    <strong>

                        Envolvidos

                    </strong>

                    <span>

                        Pessoas relacionadas ao procedimento

                    </span>

                </div>


                <button
                    type="button"
                    class="action-button"
                    id="adicionarEnvolvidoButton"
                >

                    <i data-lucide="user-plus"></i>

                    Adicionar envolvido

                </button>

            </div>


            <div class="panel-body">

                <div class="records-list">

                    ${conteudo}

                </div>

            </div>

        </section>

    `;

}


function criarCardEnvolvido(
    envolvido,
    index
) {

    if (
        typeof envolvido ===
        "string"
    ) {

        envolvido = {

            nome:
                envolvido

        };

    }


    const nome =
        envolvido?.nome ||
        `Envolvido ${index + 1}`;


    const tipo =
        envolvido?.tipo ||
        "";


    const matricula =
        envolvido?.matricula ||
        "";


    const departamento =
        envolvido?.departamento ||
        "";


    const observacoes =
        envolvido?.observacoes ||
        "";


    return `

        <article class="record-card">

            <div class="record-card-top">

                <div>

                    <strong>

                        ${escaparHTML(nome)}

                    </strong>


                    ${

                        tipo

                            ?

                            `

                                <small
                                    style="
                                        display:block;
                                        margin-top:4px;
                                        color:var(--gold);
                                    "
                                >

                                    ${escaparHTML(
                                        formatarParticipacao(
                                            tipo
                                        )
                                    )}

                                </small>

                            `

                            :

                            ""

                    }

                </div>


                <small>

                    Envolvido ${index + 1}

                </small>

            </div>


            ${

                matricula ||
                departamento

                    ?

                    `

                        <p>

                            ${

                                matricula

                                    ?

                                    `<strong>Matrícula:</strong> ${escaparHTML(matricula)}`

                                    :

                                    ""

                            }


                            ${

                                matricula &&
                                departamento

                                    ?

                                    " • "

                                    :

                                    ""

                            }


                            ${

                                departamento

                                    ?

                                    `<strong>Departamento:</strong> ${escaparHTML(departamento)}`

                                    :

                                    ""

                            }

                        </p>

                    `

                    :

                    ""

            }


            ${

                observacoes

                    ?

                    `

                        <p>

                            ${escaparHTML(observacoes)}

                        </p>

                    `

                    :

                    ""

            }

        </article>

    `;

}


function formatarParticipacao(
    tipo
) {

    const mapa = {

        investigado:
            "Investigado",

        denunciante:
            "Denunciante",

        vitima:
            "Vítima",

        testemunha:
            "Testemunha",

        representante:
            "Representante",

        outro:
            "Outro"

    };


    return (

        mapa[
            normalizarPesquisa(
                tipo
            )
        ]

        ||

        tipo

        ||

        "-"

    );

}


// ==========================================================
// DEPOIMENTOS
// ==========================================================

function renderizarAbaDepoimentos() {

    const depoimentos =
        Array.isArray(
            inqueritoAtual.depoimentos
        )

            ?

            inqueritoAtual.depoimentos

            :

            [];


    const conteudo =
        depoimentos.length

            ?

            depoimentos
                .map(

                    (
                        depoimento,
                        index
                    ) => `

                        <article class="record-card">

                            <div class="record-card-top">

                                <div>

                                    <strong>

                                        ${escaparHTML(

                                            depoimento.nome ||

                                            depoimento.depoente ||

                                            `Depoimento ${index + 1}`

                                        )}

                                    </strong>


                                    ${

                                        depoimento.tipo

                                            ?

                                            `

                                                <small
                                                    style="
                                                        display:block;
                                                        margin-top:4px;
                                                        color:var(--gold);
                                                    "
                                                >

                                                    ${escaparHTML(
                                                        depoimento.tipo
                                                    )}

                                                </small>

                                            `

                                            :

                                            ""

                                    }

                                </div>


                                <small>

                                    ${escaparHTML(

                                        formatarDataHora(

                                            depoimento.criadoEm ||

                                            depoimento.data

                                        )

                                    )}

                                </small>

                            </div>


                            ${

                                depoimento.documento ||

                                depoimento.identificacao

                                    ?

                                    `

                                        <p>

                                            <strong>
                                                Identificação:
                                            </strong>

                                            ${escaparHTML(

                                                depoimento.documento ||

                                                depoimento.identificacao

                                            )}

                                        </p>

                                    `

                                    :

                                    ""

                            }


                            <p>

                                ${escaparHTML(

                                    depoimento.texto ||

                                    depoimento.conteudo ||

                                    "Sem conteúdo registrado."

                                )}

                            </p>


                            ${

                                depoimento.registradoPor

                                    ?

                                    `

                                        <p>

                                            <strong>
                                                Registrado por:
                                            </strong>

                                            ${escaparHTML(
                                                depoimento.registradoPor
                                            )}

                                        </p>

                                    `

                                    :

                                    ""

                            }

                        </article>

                    `

                )
                .join("")

            :

            `

                <div class="empty-state">

                    Nenhum depoimento registrado.

                </div>

            `;


    return `

        <section
            class="panel tab-panel ${abaAtual === "depoimentos" ? "active" : ""}"
            id="tab-depoimentos"
        >

            <div class="panel-header">

                <div>

                    <strong>

                        Depoimentos

                    </strong>

                    <span>

                        Oitivas vinculadas ao procedimento

                    </span>

                </div>


                <button
                    type="button"
                    class="action-button"
                    id="adicionarDepoimentoButton"
                >

                    <i
                        data-lucide="message-square-plus"
                    ></i>

                    Registrar depoimento

                </button>

            </div>


            <div class="panel-body">

                <div class="records-list">

                    ${conteudo}

                </div>

            </div>

        </section>

    `;

}


// ==========================================================
// EVIDÊNCIAS
// ==========================================================

function renderizarAbaEvidencias() {

    const evidencias =
        Array.isArray(
            inqueritoAtual.evidencias
        )

            ?

            inqueritoAtual.evidencias

            :

            [];


    const conteudo =
        evidencias.length

            ?

            evidencias
                .map(

                    evidencia => `

                        <article class="evidence-card">

                            <div class="evidence-icon">

                                <i data-lucide="file"></i>

                            </div>

                            <strong>

                                ${escaparHTML(
                                    evidencia.nome ||
                                    "Evidência"
                                )}

                            </strong>

${evidencia.arquivoUrl ? `
    <a
        href="${escaparHTML(evidencia.arquivoUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="action-button"
    >
        <i data-lucide="external-link"></i>
        Abrir anexo
    </a>
` : `
    <span class="empty-state">
        Sem anexo disponível
    </span>
`}

                            <span>

                                ${escaparHTML(
                                    evidencia.tipo ||
                                    "Arquivo"
                                )}

                            </span>

                        </article>

                    `

                )
                .join("")

            :

            `

                <div class="empty-state">

                    Nenhuma evidência anexada.

                </div>

            `;


    return `

        <section
            class="panel tab-panel ${abaAtual === "evidencias" ? "active" : ""}"
            id="tab-evidencias"
        >

            <div class="panel-header">

                <div>

                    <strong>
                        Evidências
                    </strong>

                    <span>
                        Arquivos e provas vinculadas
                    </span>

                </div>


                <button
                    type="button"
                    class="action-button"
                    id="adicionarEvidenciaButton"
                >

                    <i data-lucide="paperclip"></i>

                    Adicionar evidência

                </button>

            </div>


            <div class="panel-body">

                <div class="evidence-grid">

                    ${conteudo}

                </div>

            </div>

        </section>

    `;

}


// ==========================================================
// DILIGÊNCIAS
// ==========================================================

function renderizarAbaDiligencias() {

    const diligencias =
        Array.isArray(
            inqueritoAtual.diligencias
        )

            ?

            inqueritoAtual.diligencias

            :

            [];


    const conteudo =
        diligencias.length

            ?

            diligencias
                .map(

                    diligencia => `

                        <article class="record-card">

                            <div class="record-card-top">

                                <strong>

                                    ${escaparHTML(

                                        diligencia.titulo ||

                                        "Diligência"

                                    )}

                                </strong>

                                <small>

                                    ${escaparHTML(
                                        diligencia.status ||
                                        ""
                                    )}

                                </small>

                            </div>

                            <p>

                                ${escaparHTML(
                                    diligencia.descricao ||
                                    ""
                                )}

                            </p>

                        </article>

                    `

                )
                .join("")

            :

            `

                <div class="empty-state">

                    Nenhuma diligência registrada.

                </div>

            `;


    return `

        <section
            class="panel tab-panel ${abaAtual === "diligencias" ? "active" : ""}"
            id="tab-diligencias"
        >

            <div class="panel-header">

                <div>

                    <strong>

                        Diligências

                    </strong>

                    <span>

                        Medidas investigativas

                    </span>

                </div>


                <button
                    type="button"
                    class="action-button"
                    id="adicionarDiligenciaButton"
                >

                    <i data-lucide="list-plus"></i>

                    Nova diligência

                </button>

            </div>


            <div class="panel-body">

                <div class="records-list">

                    ${conteudo}

                </div>

            </div>

        </section>

    `;

}


// ==========================================================
// DOCUMENTOS
// ==========================================================

function renderizarAbaDocumentos() {

    const documentos =
        Array.isArray(
            inqueritoAtual.documentos
        )

            ?

            inqueritoAtual.documentos

            :

            [];


    const conteudo =
        documentos.length

            ?

            documentos
                .map(

                    documento => `

                        <article class="record-card">

                            <div class="record-card-top">

                                <strong>

                                    ${escaparHTML(

                                        documento.nome ||

                                        documento.titulo ||

                                        "Documento"

                                    )}

                                </strong>

                                <small>

                                    ${escaparHTML(
                                        documento.tipo ||
                                        ""
                                    )}

                                </small>

                            </div>

                            <p>

                                ${escaparHTML(
                                    documento.descricao ||
                                    ""
                                )}

                            </p>

                        </article>

                    `

                )
                .join("")

            :

            `

                <div class="empty-state">

                    Nenhum documento vinculado.

                </div>

            `;


    return `

        <section
            class="panel tab-panel ${abaAtual === "documentos" ? "active" : ""}"
            id="tab-documentos"
        >

            <div class="panel-header">

                <div>

                    <strong>
                        Documentos
                    </strong>

                    <span>
                        Relatórios e peças do procedimento
                    </span>

                </div>


                <button
                    type="button"
                    class="action-button"
                    id="adicionarDocumentoButton"
                >

                    <i data-lucide="file-plus-2"></i>

                    Novo documento

                </button>

            </div>


            <div class="panel-body">

                <div class="records-list">

                    ${conteudo}

                </div>

            </div>

        </section>

    `;

}


// ==========================================================
// HISTÓRICO
// ==========================================================

function renderizarAbaHistorico() {

    return `

        <section
            class="panel tab-panel ${abaAtual === "historico" ? "active" : ""}"
            id="tab-historico"
        >

            <div class="panel-header">

                <strong>

                    Histórico

                </strong>

                <span>

                    Movimentações do processo

                </span>

            </div>


            <div class="panel-body">

                ${criarTimelineCompleta()}

            </div>

        </section>

    `;

}


// ==========================================================
// TIMELINE
// ==========================================================

function criarTimelineResumo() {

    const item =
        inqueritoAtual;


    return `

        <div class="timeline">

            ${criarTimelineItem(

                "Inquérito instaurado",

                "Procedimento criado no SIGCOR.",

                item.criadoEm

            )}


            ${

                item.atualizadoEm

                    ?

                    criarTimelineItem(

                        "Última atualização",

                        "O procedimento recebeu alterações.",

                        item.atualizadoEm

                    )

                    :

                    ""

            }

        </div>

    `;

}


function criarTimelineCompleta() {

    const item =
        inqueritoAtual;


    const eventos = [

        {

            titulo:
                "Inquérito instaurado",

            descricao:
                `Procedimento criado por ${item.criadoPorNome || "usuário do SIGCOR"}.`,

            data:
                item.criadoEm

        }

    ];


    if (
        item.atualizadoEm
    ) {

        eventos.push({

            titulo:
                "Procedimento atualizado",

            descricao:
                "Dados do inquérito foram atualizados.",

            data:
                item.atualizadoEm

        });

    }


    const historico =
        Array.isArray(
            item.historico
        )

            ?

            item.historico

            :

            [];


    historico.forEach(

        evento =>
            eventos.push(
                evento
            )

    );


    return `

        <div class="timeline">

            ${

                eventos
                    .map(

                        evento =>

                            criarTimelineItem(

                                evento.titulo ||

                                evento.acao ||

                                "Movimentação",

                                evento.descricao ||

                                evento.detalhes ||

                                "",

                                evento.data ||

                                evento.criadoEm

                            )

                    )
                    .join("")

            }

        </div>

    `;

}


function criarTimelineItem(
    titulo,
    descricao,
    data
) {

    return `

        <div class="timeline-item">

            <span class="timeline-dot"></span>

            <strong>

                ${escaparHTML(titulo)}

            </strong>

            <p>

                ${escaparHTML(descricao)}

            </p>

            <time>

                ${escaparHTML(
                    formatarDataHora(
                        data
                    )
                )}

            </time>

        </div>

    `;

}


// ==========================================================
// MODAIS
// ==========================================================

function garantirModais() {
    criarModalEnvolvido();
    criarModalDepoimento();
    criarModalDiligencia();
    criarModalDocumento();
    criarModalEvidencia();
}

function criarModalEvidencia() {
    if (document.getElementById("modalEvidencia")) {
        return;
    }

    const hoje = new Date().toISOString().slice(0, 10);

    document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="sigcor-modal" id="modalEvidencia" hidden>
            <div class="modal-backdrop" data-fechar-modal="evidencia"></div>

            <div class="modal-box">
                <div class="modal-header">
                    <div>
                        <span class="modal-kicker">INQUÉRITO</span>
                        <h2>Adicionar evidência</h2>
                        <p>Vincule uma prova, arquivo, imagem ou registro ao procedimento.</p>
                    </div>

                    <button type="button" class="modal-close" id="fecharModalEvidencia">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <form id="formEvidencia">
                    <div class="modal-body">
                        <div class="modal-grid">
                            ${campoModal(
                                "evidenciaNome",
                                "Nome da evidência *",
                                "text",
                                "Ex.: Vídeo da câmera",
                                true,
                                true
                            )}

                            <div class="modal-field">
                                <label for="evidenciaTipo">Tipo *</label>
                                <select id="evidenciaTipo" required>
                                    <option value="">Selecionar</option>
                                    <option value="Foto">Foto</option>
                                    <option value="Vídeo">Vídeo</option>
                                    <option value="Áudio">Áudio</option>
                                    <option value="Documento">Documento</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div class="modal-field">
                                <label for="evidenciaData">Data</label>
                                <input type="date" id="evidenciaData" value="${hoje}">
                            </div>

                            ${campoModal(
                                "evidenciaResponsavel",
                                "Responsável",
                                "text",
                                "Responsável pela evidência"
                            )}

                            <div class="modal-field modal-field-full">
                                <label for="evidenciaArquivo">Arquivo</label>
                                <input type="file" id="evidenciaArquivo">
                            </div>

                            <div class="modal-field modal-field-full">
                                <label for="evidenciaDescricao">Descrição</label>
                                <textarea id="evidenciaDescricao" maxlength="5000" placeholder="Descreva a evidência..."></textarea>
                            </div>

                            <div class="modal-field modal-field-full">
                                <label for="evidenciaObservacoes">Observações internas</label>
                                <textarea id="evidenciaObservacoes" maxlength="5000" placeholder="Observações opcionais..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="action-button" id="cancelarEvidencia">Cancelar</button>
                        <button type="submit" class="action-button primary" id="salvarEvidencia">
                            <i data-lucide="save"></i>
                            Salvar evidência
                        </button>
                    </div>
                </form>
            </div>
        </div>
        `
    );
}


// ==========================================================
// MODAL ENVOLVIDO
// ==========================================================

function criarModalEnvolvido() {

    if (
        document.getElementById(
            "modalEnvolvido"
        )
    ) {

        return;

    }


    document.body.insertAdjacentHTML(

        "beforeend",

        `

        <div
            class="sigcor-modal"
            id="modalEnvolvido"
            hidden
        >

            <div
                class="modal-backdrop"
                data-fechar-modal="envolvido"
            ></div>


            <div class="modal-box">

                <div class="modal-header">

                    <div>

                        <span class="modal-kicker">

                            INQUÉRITO

                        </span>

                        <h2>

                            Adicionar envolvido

                        </h2>

                        <p>

                            Cadastre uma pessoa relacionada
                            ao procedimento investigativo.

                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        id="fecharModalEnvolvido"
                    >

                        <i data-lucide="x"></i>

                    </button>

                </div>


                <form id="formEnvolvido">

                    <div class="modal-body">

                        <div class="modal-grid">


                            ${campoModal(

                                "envolvidoNome",

                                "Nome completo *",

                                "text",

                                "Nome do envolvido",

                                true,

                                true

                            )}


                            <div class="modal-field">

                                <label for="envolvidoTipo">

                                    Participação *

                                </label>

                                <select
                                    id="envolvidoTipo"
                                    required
                                >

                                    <option value="">

                                        Selecione

                                    </option>

                                    <option value="investigado">

                                        Investigado

                                    </option>

                                    <option value="denunciante">

                                        Denunciante

                                    </option>

                                    <option value="vitima">

                                        Vítima

                                    </option>

                                    <option value="testemunha">

                                        Testemunha

                                    </option>

                                    <option value="representante">

                                        Representante

                                    </option>

                                    <option value="outro">

                                        Outro

                                    </option>

                                </select>

                            </div>


                            ${campoModal(

                                "envolvidoMatricula",

                                "Matrícula / identificação",

                                "text",

                                "Opcional"

                            )}


                            ${campoModal(

                                "envolvidoDepartamento",

                                "Departamento / órgão",

                                "text",

                                "Ex.: Polícia Federal",

                                false,

                                true

                            )}


                            <div class="modal-field modal-field-full">

                                <label for="envolvidoObservacoes">

                                    Observações

                                </label>

                                <textarea
                                    id="envolvidoObservacoes"
                                    maxlength="2000"
                                    placeholder="Informações relevantes..."
                                ></textarea>

                            </div>

                        </div>

                    </div>


                    ${rodapeModal(

                        "cancelarEnvolvidoButton",

                        "Adicionar envolvido",

                        "user-plus"

                    )}

                </form>

            </div>

        </div>

        `

    );

}


// ==========================================================
// MODAL DEPOIMENTO
// ==========================================================

function criarModalDepoimento() {

    if (
        document.getElementById(
            "modalDepoimento"
        )
    ) {

        return;

    }


    document.body.insertAdjacentHTML(

        "beforeend",

        `

        <div
            class="sigcor-modal"
            id="modalDepoimento"
            hidden
        >

            <div
                class="modal-backdrop"
                data-fechar-modal="depoimento"
            ></div>


            <div class="modal-box">

                <div class="modal-header">

                    <div>

                        <span class="modal-kicker">

                            INQUÉRITO

                        </span>

                        <h2>

                            Registrar depoimento

                        </h2>

                        <p>

                            Cadastre uma nova oitiva vinculada ao procedimento.

                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        id="fecharModalDepoimento"
                    >

                        <i data-lucide="x"></i>

                    </button>

                </div>


                <form id="formDepoimento">

                    <div class="modal-body">

                        <div class="modal-grid">


                            ${campoModal(

                                "depoimentoNome",

                                "Nome do depoente *",

                                "text",

                                "Nome completo",

                                true,

                                true

                            )}


                            <div class="modal-field">

                                <label for="depoimentoTipo">

                                    Qualificação

                                </label>

                                <select id="depoimentoTipo">

                                    <option value="">

                                        Selecione

                                    </option>

                                    <option value="Investigado">

                                        Investigado

                                    </option>

                                    <option value="Vítima">

                                        Vítima

                                    </option>

                                    <option value="Testemunha">

                                        Testemunha

                                    </option>

                                    <option value="Denunciante">

                                        Denunciante

                                    </option>

                                    <option value="Outro">

                                        Outro

                                    </option>

                                </select>

                            </div>


                            ${campoModal(

                                "depoimentoDocumento",

                                "Documento / matrícula",

                                "text",

                                "Opcional"

                            )}


                            <div class="modal-field modal-field-full">

                                <label for="depoimentoTexto">

                                    Depoimento *

                                </label>

                                <textarea
                                    id="depoimentoTexto"
                                    maxlength="10000"
                                    placeholder="Registre o conteúdo integral da oitiva..."
                                    required
                                ></textarea>

                            </div>

                        </div>

                    </div>


                    ${rodapeModal(

                        "cancelarDepoimentoButton",

                        "Registrar depoimento",

                        "save"

                    )}

                </form>

            </div>

        </div>

        `

    );

}


// ==========================================================
// MODAL DILIGÊNCIA
// ==========================================================

function criarModalDiligencia() {

    if (
        document.getElementById(
            "modalDiligencia"
        )
    ) {

        return;

    }


    document.body.insertAdjacentHTML(

        "beforeend",

        `

        <div
            class="sigcor-modal"
            id="modalDiligencia"
            hidden
        >

            <div
                class="modal-backdrop"
                data-fechar-modal="diligencia"
            ></div>


            <div class="modal-box">

                <div class="modal-header">

                    <div>

                        <span class="modal-kicker">

                            INQUÉRITO

                        </span>

                        <h2>

                            Nova diligência

                        </h2>

                        <p>

                            Registre uma medida investigativa.

                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        id="fecharModalDiligencia"
                    >

                        <i data-lucide="x"></i>

                    </button>

                </div>


                <form id="formDiligencia">

                    <div class="modal-body">

                        <div class="modal-grid">


                            ${campoModal(

                                "diligenciaTitulo",

                                "Título *",

                                "text",

                                "Ex.: Solicitar imagens",

                                true,

                                true

                            )}


                            <div class="modal-field">

                                <label for="diligenciaStatus">

                                    Status

                                </label>

                                <select id="diligenciaStatus">

                                    <option value="Pendente">

                                        Pendente

                                    </option>

                                    <option value="Em andamento">

                                        Em andamento

                                    </option>

                                    <option value="Concluída">

                                        Concluída

                                    </option>

                                </select>

                            </div>


                            ${campoModal(

                                "diligenciaResponsavel",

                                "Responsável",

                                "text",

                                "Nome do responsável"

                            )}


                            <div class="modal-field modal-field-full">

                                <label for="diligenciaDescricao">

                                    Descrição *

                                </label>

                                <textarea
                                    id="diligenciaDescricao"
                                    maxlength="5000"
                                    placeholder="Descreva a diligência..."
                                    required
                                ></textarea>

                            </div>

                        </div>

                    </div>


                    ${rodapeModal(

                        "cancelarDiligenciaButton",

                        "Adicionar diligência",

                        "list-plus"

                    )}

                </form>

            </div>

        </div>

        `

    );

}


// ==========================================================
// MODAL DOCUMENTO
// ==========================================================

function criarModalDocumento() {

    if (
        document.getElementById(
            "modalDocumento"
        )
    ) {

        return;

    }


    document.body.insertAdjacentHTML(

        "beforeend",

        `

        <div
            class="sigcor-modal"
            id="modalDocumento"
            hidden
        >

            <div
                class="modal-backdrop"
                data-fechar-modal="documento"
            ></div>


            <div class="modal-box">

                <div class="modal-header">

                    <div>

                        <span class="modal-kicker">

                            INQUÉRITO

                        </span>

                        <h2>

                            Novo documento

                        </h2>

                        <p>

                            Registre uma peça ou documento do procedimento.

                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-close"
                        id="fecharModalDocumento"
                    >

                        <i data-lucide="x"></i>

                    </button>

                </div>


                <form id="formDocumento">

                    <div class="modal-body">

                        <div class="modal-grid">


                            ${campoModal(

                                "documentoNome",

                                "Nome / título *",

                                "text",

                                "Ex.: Relatório preliminar",

                                true,

                                true

                            )}


                            ${campoModal(

                                "documentoTipo",

                                "Tipo",

                                "text",

                                "Ex.: Relatório"

                            )}


                            <div class="modal-field modal-field-full">

                                <label for="documentoDescricao">

                                    Descrição

                                </label>

                                <textarea
                                    id="documentoDescricao"
                                    maxlength="5000"
                                    placeholder="Descrição do documento..."
                                ></textarea>

                            </div>

                        </div>

                    </div>


                    ${rodapeModal(

                        "cancelarDocumentoButton",

                        "Adicionar documento",

                        "file-plus-2"

                    )}

                </form>

            </div>

        </div>

        `

    );

}


// ==========================================================
// CAMPOS DO MODAL
// ==========================================================

function campoModal(
    id,
    label,
    tipo = "text",
    placeholder = "",
    obrigatorio = false,
    full = false
) {

    return `

        <div
            class="modal-field ${full ? "modal-field-full" : ""}"
        >

            <label for="${id}">

                ${escaparHTML(label)}

            </label>

            <input
                type="${tipo}"
                id="${id}"
                placeholder="${escaparHTML(placeholder)}"
                ${obrigatorio ? "required" : ""}
            >

        </div>

    `;

}


function rodapeModal(
    idCancelar,
    textoSalvar,
    icone
) {

    return `

        <div class="modal-footer">

            <button
                type="button"
                class="action-button"
                id="${idCancelar}"
            >

                Cancelar

            </button>

            <button
                type="submit"
                class="action-button primary"
            >

                <i
                    data-lucide="${icone}"
                ></i>

                ${escaparHTML(textoSalvar)}

            </button>

        </div>

    `;

}


// ==========================================================
// ABRIR / FECHAR MODAIS
// ==========================================================

function abrirModal(
    id,
    foco
) {

    garantirModais();


    const modal =
        document.getElementById(
            id
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(

        () => {

            document
                .getElementById(
                    foco
                )
                ?.focus();

        },

        50

    );


    window.lucide
        ?.createIcons();

}


function fecharModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    const algumAberto =

        [
            ...document.querySelectorAll(
                ".sigcor-modal"
            )
        ]
            .some(

                item =>
                    !item.hidden

            );


    if (!algumAberto) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}



// ==========================================================
// PERSISTÊNCIA DAS ABAS
// ==========================================================

function criarHistoricoAtualizado(
    titulo,
    descricao,
    data = new Date().toISOString()
) {
    const historico =
        Array.isArray(inqueritoAtual?.historico)
            ? [...inqueritoAtual.historico]
            : [];

    historico.push({
        id: `historico-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        titulo,
        descricao,
        data,
        criadoEm: data,
        usuario:
            perfilLogado?.nome ||
            usuarioLogado?.email ||
            "Usuário"
    });

    return historico;
}

async function adicionarRegistroPersistente(
    campo,
    registro,
    tituloHistorico,
    descricaoHistorico
) {
    if (!inqueritoAtual?.id) {
        throw new Error("O inquérito ainda não foi carregado.");
    }

    const listaAtual =
        Array.isArray(inqueritoAtual[campo])
            ? inqueritoAtual[campo]
            : [];

    const novaLista = [
        ...listaAtual,
        registro
    ];

    const agora = new Date().toISOString();

    const historico =
        criarHistoricoAtualizado(
            tituloHistorico,
            descricaoHistorico,
            agora
        );

    await atualizarInquerito(
        inqueritoAtual.id,
        {
            [campo]: novaLista,
            historico,
            atualizadoEm: agora
        }
    );

    inqueritoAtual = {
        ...inqueritoAtual,
        [campo]: novaLista,
        historico,
        atualizadoEm: agora
    };
}

// ==========================================================
// ENVOLVIDO TEMPORÁRIO
// ==========================================================

async function salvarEnvolvidoTemporario(
    evento
) {
    evento.preventDefault();

    const nome = valorCampo("envolvidoNome");
    const tipo = valorCampo("envolvidoTipo");
    const matricula = valorCampo("envolvidoMatricula");
    const departamento = valorCampo("envolvidoDepartamento");
    const observacoes = valorCampo("envolvidoObservacoes");

    if (!nome || !tipo) {
        alert("Informe o nome e a participação do envolvido.");
        return;
    }

    const envolvido = {
        id: `envolvido-${Date.now()}`,
        nome,
        tipo,
        matricula,
        departamento,
        observacoes,
        criadoEm: new Date().toISOString()
    };

    try {
        await adicionarRegistroPersistente(
            "envolvidos",
            envolvido,
            "Envolvido adicionado",
            `${nome} foi vinculado ao procedimento como ${formatarParticipacao(tipo)}.`
        );

        fecharModal("modalEnvolvido");
        document.getElementById("formEnvolvido")?.reset();
        abaAtual = "envolvidos";
        renderizarDossie();

    } catch (erro) {
        console.error("SIGCOR - salvar envolvido:", erro);
        alert(erro?.message || "Não foi possível salvar o envolvido.");
    }
}

// ==========================================================
// DEPOIMENTO TEMPORÁRIO
// ==========================================================

async function salvarDepoimentoTemporario(
    evento
) {
    evento.preventDefault();

    const nome = valorCampo("depoimentoNome");
    const tipo = valorCampo("depoimentoTipo");
    const documento = valorCampo("depoimentoDocumento");
    const texto = valorCampo("depoimentoTexto");

    if (!nome || !texto) {
        alert("Informe o nome do depoente e o depoimento.");
        return;
    }

    const depoimento = {
        id: `depoimento-${Date.now()}`,
        nome,
        tipo,
        documento,
        texto,
        registradoPor:
            perfilLogado?.nome ||
            usuarioLogado?.email ||
            "Usuário",
        criadoEm: new Date().toISOString()
    };

    try {
        await adicionarRegistroPersistente(
            "depoimentos",
            depoimento,
            "Depoimento registrado",
            `Foi registrado um depoimento de "${nome}".`
        );

        fecharModal("modalDepoimento");
        document.getElementById("formDepoimento")?.reset();
        abaAtual = "depoimentos";
        renderizarDossie();

    } catch (erro) {
        console.error("SIGCOR - salvar depoimento:", erro);
        alert(erro?.message || "Não foi possível salvar o depoimento.");
    }
}

// ==========================================================
// DILIGÊNCIA TEMPORÁRIA
// ==========================================================

async function salvarDiligenciaTemporaria(
    evento
) {
    evento.preventDefault();

    const titulo = valorCampo("diligenciaTitulo");
    const status = valorCampo("diligenciaStatus") || "Pendente";
    const responsavel = valorCampo("diligenciaResponsavel");
    const descricao = valorCampo("diligenciaDescricao");

    if (!titulo || !descricao) {
        alert("Informe o título e a descrição da diligência.");
        return;
    }

    const diligencia = {
        id: `diligencia-${Date.now()}`,
        titulo,
        status,
        responsavel,
        descricao,
        criadoEm: new Date().toISOString()
    };

    try {
        await adicionarRegistroPersistente(
            "diligencias",
            diligencia,
            "Diligência adicionada",
            `A diligência "${titulo}" foi registrada.`
        );

        fecharModal("modalDiligencia");
        document.getElementById("formDiligencia")?.reset();
        abaAtual = "diligencias";
        renderizarDossie();

    } catch (erro) {
        console.error("SIGCOR - salvar diligência:", erro);
        alert(erro?.message || "Não foi possível salvar a diligência.");
    }
}

// ==========================================================
// DOCUMENTO TEMPORÁRIO
// ==========================================================

async function salvarDocumentoTemporario(
    evento
) {
    evento.preventDefault();

    const nome = valorCampo("documentoNome");
    const tipo = valorCampo("documentoTipo");
    const descricao = valorCampo("documentoDescricao");

    if (!nome) {
        alert("Informe o nome do documento.");
        return;
    }

    const documento = {
        id: `documento-${Date.now()}`,
        nome,
        tipo,
        descricao,
        criadoPor:
            perfilLogado?.nome ||
            usuarioLogado?.email ||
            "Usuário",
        criadoEm: new Date().toISOString()
    };

    try {
        await adicionarRegistroPersistente(
            "documentos",
            documento,
            "Documento adicionado",
            `O documento "${nome}" foi vinculado ao procedimento.`
        );

        fecharModal("modalDocumento");
        document.getElementById("formDocumento")?.reset();
        abaAtual = "documentos";
        renderizarDossie();

    } catch (erro) {
        console.error("SIGCOR - salvar documento:", erro);
        alert(erro?.message || "Não foi possível salvar o documento.");
    }
}

// ==========================================================
// VALOR DE CAMPO
// ==========================================================

function valorCampo(
    id
) {

    return (

        document
            .getElementById(
                id
            )
            ?.value
            ?.trim?.()

        ||

        ""

    );

}


// ==========================================================
// AÇÕES DO DOSSIÊ
// ==========================================================

function configurarAcoesDossie() {

    document
        .getElementById(
            "acaoEditar"
        )
        ?.addEventListener(

            "click",

            editarInquerito

        );


    document
        .getElementById(
            "editarInqueritoButton"
        )
        ?.addEventListener(

            "click",

            editarInquerito

        );


    document
        .getElementById(
            "acaoFinalizar"
        )
        ?.addEventListener(

            "click",

            () =>
                alterarStatus(
                    "concluido"
                )

        );


    document
        .getElementById(
            "acaoArquivar"
        )
        ?.addEventListener(

            "click",

            () =>
                alterarStatus(
                    "arquivado"
                )

        );


    document
        .getElementById(
            "acaoReabrir"
        )
        ?.addEventListener(

            "click",

            () =>
                alterarStatus(
                    "andamento"
                )

        );


    document
        .getElementById(
            "acaoExcluir"
        )
        ?.addEventListener(

            "click",

            excluirInquerito

        );


    document
        .getElementById(
            "adicionarEnvolvidoButton"
        )
        ?.addEventListener(

            "click",

            () => {

                abrirModal(
                    "modalEnvolvido",
                    "envolvidoNome"
                );

            }

        );


    document
        .getElementById(
            "adicionarDepoimentoButton"
        )
        ?.addEventListener(

            "click",

            () => {

                abrirModal(
                    "modalDepoimento",
                    "depoimentoNome"
                );

            }

        );


    document
        .getElementById(
            "adicionarDiligenciaButton"
        )
        ?.addEventListener(

            "click",

            () => {

                abrirModal(
                    "modalDiligencia",
                    "diligenciaTitulo"
                );

            }

        );


    document
        .getElementById(
            "adicionarDocumentoButton"
        )
        ?.addEventListener(

            "click",

            () => {

                abrirModal(
                    "modalDocumento",
                    "documentoNome"
                );

            }

        );


    document
    .getElementById(
        "adicionarEvidenciaButton"
    )
    ?.addEventListener(
        "click",
        () => {

            const modal =
                document.getElementById(
                    "modalEvidencia"
                );

            if (!modal) {
                return;
            }

            modal.hidden = false;

            document.body.classList.add(
                "modal-open"
            );

            setTimeout(
                () => {
                    document
                        .getElementById(
                            "evidenciaNome"
                        )
                        ?.focus();
                },
                50
            );

        }
    );

}


// ==========================================================
// EDITAR
// ==========================================================

function editarInquerito() {

    const id =
        obterIdURL();


    if (!id) {

        return;

    }


    window.location.href =

        `./novo-inquerito.html?id=${encodeURIComponent(id)}`;

}


// ==========================================================
// ALTERAR STATUS
// ==========================================================

async function alterarStatus(
    status
) {
    const id = obterIdURL();

    if (!id) {
        return;
    }

    if (
        !window.confirm(
            `Deseja alterar o status para "${nomeStatus(status)}"?`
        )
    ) {
        return;
    }

    try {
        const agora =
            new Date().toISOString();

        const historico =
            criarHistoricoAtualizado(
                "Status alterado",
                `Status alterado para "${nomeStatus(status)}".`,
                agora
            );

        await atualizarInquerito(
            id,
            {
                status,
                historico,
                atualizadoEm: agora
            }
        );

        inqueritoAtual = {
            ...inqueritoAtual,
            status,
            historico,
            atualizadoEm: agora
        };

        renderizarDossie();

    } catch (erro) {
        console.error(
            "SIGCOR - alterar status:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível alterar o status."
        );
    }
}

// ==========================================================
// EXCLUIR
// ==========================================================

async function excluirInquerito() {
    const id = obterIdURL();

    if (!id) {
        return;
    }

    if (
        !window.confirm(
            "Tem certeza que deseja excluir este inquérito? Esta ação não pode ser desfeita."
        )
    ) {
        return;
    }

    try {
        await deleteDoc(
            doc(
                db,
                COLECOES.INQUERITOS,
                id
            )
        );

        window.location.href =
            "./inqueritos.html";

    } catch (erro) {
        console.error(
            "SIGCOR - excluir inquérito:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível excluir o inquérito."
        );
    }
}

// ==========================================================
// EVENTOS FIXOS
// ==========================================================

function configurarEventosFixos() {
    document
        .getElementById("logoutButton")
        ?.addEventListener(
            "click",
            logout
        );

    document
        .getElementById("refreshInquerito")
        ?.addEventListener(
            "click",
            async () => {
                const id = obterIdURL();

                if (id) {
                    await carregarInquerito(id);
                }
            }
        );

    document.addEventListener(
        "click",
        async evento => {
            const fecharPorBackdrop =
                evento.target.closest(
                    "[data-fechar-modal]"
                );

            if (fecharPorBackdrop) {
                const tipo =
                    fecharPorBackdrop.dataset.fecharModal;

                const mapa = {
                    envolvido: "modalEnvolvido",
                    depoimento: "modalDepoimento",
                    diligencia: "modalDiligencia",
                    documento: "modalDocumento",
                    evidencia: "modalEvidencia"
                };

                if (mapa[tipo]) {
                    fecharModal(mapa[tipo]);
                    return;
                }
            }

            const botao =
                evento.target.closest("button");

            if (!botao) {
                return;
            }

            const mapaFechar = {
                fecharModalEnvolvido: "modalEnvolvido",
                cancelarEnvolvidoButton: "modalEnvolvido",
                fecharModalDepoimento: "modalDepoimento",
                cancelarDepoimentoButton: "modalDepoimento",
                fecharModalDiligencia: "modalDiligencia",
                cancelarDiligenciaButton: "modalDiligencia",
                fecharModalDocumento: "modalDocumento",
                cancelarDocumentoButton: "modalDocumento",
                fecharModalEvidencia: "modalEvidencia",
                cancelarEvidencia: "modalEvidencia"
            };

            if (mapaFechar[botao.id]) {
                evento.preventDefault();
                fecharModal(mapaFechar[botao.id]);
                return;
            }

            if (botao.id === "salvarEvidencia") {
                evento.preventDefault();
                await salvarEvidenciaTemporaria();
            }
        }
    );

    document.addEventListener(
        "submit",
        async evento => {
            const id = evento.target.id;

            if (id === "formEnvolvido") {
                await salvarEnvolvidoTemporario(evento);
                return;
            }

            if (id === "formDepoimento") {
                await salvarDepoimentoTemporario(evento);
                return;
            }

            if (id === "formDiligencia") {
                await salvarDiligenciaTemporaria(evento);
                return;
            }

            if (id === "formDocumento") {
                await salvarDocumentoTemporario(evento);
                return;
            }

            if (id === "formEvidencia") {
                evento.preventDefault();
            }
        }
    );

    document.addEventListener(
        "keydown",
        evento => {
            if (evento.key !== "Escape") {
                return;
            }

            document
                .querySelectorAll(".sigcor-modal")
                .forEach(modal => {
                    if (!modal.hidden) {
                        modal.hidden = true;
                    }
                });

            document.body.classList.remove(
                "modal-open"
            );
        }
    );
}


function fecharModalEvidencia() {
    fecharModal("modalEvidencia");
}

function limparFormularioEvidencia() {
    [
        "evidenciaNome",
        "evidenciaTipo",
        "evidenciaData",
        "evidenciaResponsavel",
        "evidenciaDescricao",
        "evidenciaObservacoes",
        "evidenciaArquivo"
    ].forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = "";
        }
    });
}


// ==========================================================
// SALVAR EVIDÊNCIA
// ==========================================================

async function salvarEvidenciaTemporaria() {
    if (!inqueritoAtual?.id) {
        alert("O inquérito ainda não foi carregado.");
        return;
    }

    const nome =
        document.getElementById("evidenciaNome")
            ?.value
            ?.trim() || "";

    const tipo =
        document.getElementById("evidenciaTipo")
            ?.value || "";

    const data =
        document.getElementById("evidenciaData")
            ?.value || "";

    const responsavel =
        document.getElementById("evidenciaResponsavel")
            ?.value
            ?.trim() || "";

    const descricao =
        document.getElementById("evidenciaDescricao")
            ?.value
            ?.trim() || "";

    const observacoes =
        document.getElementById("evidenciaObservacoes")
            ?.value
            ?.trim() || "";

    const arquivoInput =
        document.getElementById("evidenciaArquivo");

    const arquivo =
        arquivoInput?.files?.[0] || null;

    if (!nome) {
        alert("Informe o nome da evidência.");
        return;
    }

    if (!tipo) {
        alert("Selecione o tipo da evidência.");
        return;
    }

    const botaoSalvar =
        document.getElementById("salvarEvidencia");

    const textoAnterior =
        botaoSalvar?.innerHTML || "";

    if (botaoSalvar) {
        botaoSalvar.disabled = true;
        botaoSalvar.textContent =
            arquivo ? "Enviando anexo..." : "Salvando...";
    }

    try {
        let arquivoEnviado = null;

        if (arquivo) {
            arquivoEnviado = await uploadArquivo(
                arquivo,
                `inqueritos/${inqueritoAtual.id}/evidencias`
            );

            if (!arquivoEnviado?.url) {
                throw new Error(
                    "O upload foi concluído, mas nenhuma URL do arquivo foi retornada."
                );
            }
        }

        const evidencia = {
            id: `evidencia-${Date.now()}`,
            nome,
            tipo,
            descricao,
            observacoes,
            responsavel:
                responsavel ||
                perfilLogado?.nome ||
                usuarioLogado?.email ||
                "Usuário",
            data:
                data ||
                new Date().toISOString(),
            arquivoNome:
                arquivoEnviado?.nomeOriginal ||
                arquivo?.name ||
                "",
            arquivoTipo:
                arquivoEnviado?.tipo ||
                arquivo?.type ||
                "",
            arquivoTamanho:
                arquivoEnviado?.tamanho ||
                arquivo?.size ||
                0,
            arquivoUrl:
                arquivoEnviado?.url ||
                "",
            arquivoCaminho:
                arquivoEnviado?.caminho ||
                "",
            criadoEm:
                new Date().toISOString()
        };

        await adicionarRegistroPersistente(
            "evidencias",
            evidencia,
            "Evidência adicionada",
            `A evidência "${nome}" foi vinculada ao procedimento.`
        );

        limparFormularioEvidencia();
        fecharModalEvidencia();

        abaAtual = "evidencias";
        renderizarDossie();

    } catch (erro) {
        console.error(
            "SIGCOR - salvar evidência:",
            erro
        );

        alert(
            erro?.message ||
            "Não foi possível salvar a evidência."
        );

    } finally {
        if (botaoSalvar) {
            botaoSalvar.disabled = false;
            botaoSalvar.innerHTML = textoAnterior;
        }
    }
}

// ==========================================================
// COMPONENTES
// ==========================================================

function criarSideItem(
    titulo,
    valor
) {

    return `

        <div class="side-item">

            <span>

                ${escaparHTML(titulo)}

            </span>

            <strong>

                ${escaparHTML(
                    valor ||
                    "-"
                )}

            </strong>

        </div>

    `;

}


// ==========================================================
// NÚMERO
// ==========================================================

function obterNumeroInquerito(
    item
) {

    if (
        item.numero
    ) {

        return item.numero;

    }


    if (
        item.numeroInquerito
    ) {

        return item.numeroInquerito;

    }


    if (
        item.numeroExterno
    ) {

        return item.numeroExterno;

    }


    return gerarNumeroVisual(
        item.id
    );

}


function gerarNumeroVisual(
    id
) {

    if (!id) {

        return "-";

    }


    return `IPF-${new Date().getFullYear()}-${String(id)
        .slice(0, 6)
        .toUpperCase()}`;

}


// ==========================================================
// LISTAS
// ==========================================================

function normalizarLista(
    valor
) {

    if (
        Array.isArray(
            valor
        )
    ) {

        return valor
            .map(

                item =>

                    typeof item ===
                    "string"

                        ?

                        item

                        :

                        item?.nome ||

                        JSON.stringify(
                            item
                        )

            )
            .filter(
                Boolean
            );

    }


    const texto =
        String(
            valor ||
            ""
        ).trim();


    if (!texto) {

        return [];

    }


    return texto
        .split(
            /\n|,/
        )
        .map(

            item =>
                item.trim()

        )
        .filter(
            Boolean
        );

}


// ==========================================================
// STATUS
// ==========================================================

function nomeStatus(
    status
) {

    const mapa = {

        aberto:
            "Em andamento",

        andamento:
            "Em andamento",

        concluido:
            "Concluído",

        arquivado:
            "Arquivado",

        suspenso:
            "Suspenso"

    };


    return (

        mapa[
            normalizarStatus(
                status
            )
        ]

        ||

        status

        ||

        "-"

    );

}


function normalizarStatus(
    valor
) {

    const status =
        normalizarPesquisa(
            valor
        )
            .replaceAll(
                " ",
                "_"
            );


    return (
        status ===
        "em_andamento"
    )

        ?

        "andamento"

        :

        status;

}


// ==========================================================
// TIPO
// ==========================================================

function formatarTipo(
    tipo
) {

    const chave =
        normalizarPesquisa(
            tipo
        );


    const mapa = {

        administrativo:
            "Administrativo",

        disciplinar:
            "Disciplinar",

        criminal:
            "Criminal",

        interno:
            "Interno"

    };


    return (

        mapa[chave]

        ||

        tipo

        ||

        "-"

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

        mapa[chave]

        ||

        cargo

        ||

        "-"

    );

}


// ==========================================================
// DATAS
// ==========================================================

function obterData(
    valor
) {

    if (!valor) {

        return null;

    }


    try {

        if (

            typeof valor ===
            "object"

            &&

            valor._seconds !==
            undefined

        ) {

            return new Date(

                Number(
                    valor._seconds
                )
                *
                1000

            );

        }


        if (

            typeof valor ===
            "object"

            &&

            valor.seconds !==
            undefined

        ) {

            return new Date(

                Number(
                    valor.seconds
                )
                *
                1000

            );

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


    } catch {

        return null;

    }

}


function formatarDataHora(
    valor
) {

    const data =
        obterData(
            valor
        );


    if (!data) {

        return "-";

    }


    return new Intl.DateTimeFormat(

        "pt-BR",

        {

            dateStyle:
                "short",

            timeStyle:
                "short"

        }

    ).format(
        data
    );

}


// ==========================================================
// LOADING / ERRO
// ==========================================================

// ==========================================================
// LOADING
// ==========================================================

function definirCarregando() {

    const container =
        document.getElementById(
            "conteudoInquerito"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="loading-state">

            <div>

                <div class="spinner"></div>

                Carregando dossiê...

            </div>

        </div>

    `;

}


// ==========================================================
// ERRO
// ==========================================================

function mostrarErro(
    mensagem
) {

    const container =
        document.getElementById(
            "conteudoInquerito"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="error-state">

            ${escaparHTML(mensagem)}

        </div>

    `;

}


// ==========================================================
// NORMALIZAÇÃO
// ==========================================================

function normalizarPesquisa(
    valor
) {

    return String(
        valor ||
        ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim()
        .toLowerCase();

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


// ==========================================================
// DEBUG
// ==========================================================

window.SIGCORVisualizar = {

    atualizar:
        async () => {

            const id =
                obterIdURL();


            if (id) {

                await carregarInquerito(
                    id
                );

            }

        },


    dados:
        () =>
            inqueritoAtual

};