// ==========================================================
// SIGCOR
// assets/js/auditoria.js
//
// Auditoria do sistema
// ==========================================================

import {
    auth
} from "../../firebase/firebase.js";


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

    apiBase:
        "https://corregedoriapf.discloud.app",

    registrosPorPagina:
        12

};


// ==========================================================
// ESTADO
// ==========================================================

let usuarioLogado =
    null;

let perfilLogado =
    null;

let logs =
    [];

let logsFiltrados =
    [];

let paginaAtual =
    1;


// ==========================================================
// ELEMENTOS
// ==========================================================

const elementos = {

    userAvatar:
        document.getElementById(
            "userAvatar"
        ),

    userName:
        document.getElementById(
            "userName"
        ),

    userRole:
        document.getElementById(
            "userRole"
        ),

    logoutButton:
        document.getElementById(
            "logoutButton"
        ),

    refreshAudit:
        document.getElementById(
            "refreshAudit"
        ),

    totalRegistros:
        document.getElementById(
            "totalRegistros"
        ),

    totalLogsUsuarios:
        document.getElementById(
            "totalLogsUsuarios"
        ),

    totalLogsInqueritos:
        document.getElementById(
            "totalLogsInqueritos"
        ),

    totalHoje:
        document.getElementById(
            "totalHoje"
        ),

    resultadoAuditoria:
        document.getElementById(
            "resultadoAuditoria"
        ),

    auditSearch:
        document.getElementById(
            "auditSearch"
        ),

    filtroModulo:
        document.getElementById(
            "filtroModulo"
        ),

    filtroAcao:
        document.getElementById(
            "filtroAcao"
        ),

    filtroUsuario:
        document.getElementById(
            "filtroUsuario"
        ),

    limparFiltros:
        document.getElementById(
            "limparFiltros"
        ),

    auditTableBody:
        document.getElementById(
            "auditTableBody"
        ),

    paginationStart:
        document.getElementById(
            "paginationStart"
        ),

    paginationEnd:
        document.getElementById(
            "paginationEnd"
        ),

    paginationTotal:
        document.getElementById(
            "paginationTotal"
        ),

    paginationCurrent:
        document.getElementById(
            "paginationCurrent"
        ),

    paginationPrevious:
        document.getElementById(
            "paginationPrevious"
        ),

    paginationNext:
        document.getElementById(
            "paginationNext"
        )

};


// ==========================================================
// INICIAR
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarPagina
);


async function iniciarPagina() {

    try {

        console.log(
            "SIGCOR: carregando auditoria..."
        );


        const sessao =
            await protegerPagina();


        if (!sessao) {

            return;

        }


        usuarioLogado =
            sessao.usuario;

        perfilLogado =
            sessao.perfil;


        preencherPerfilLogado();

        configurarEventos();

        await carregarAuditoria();


        window.lucide
            ?.createIcons();


        console.log(
            "SIGCOR: auditoria carregada."
        );

    } catch (erro) {

        console.error(
            "SIGCOR - Auditoria:",
            erro
        );


        mostrarErroTabela(
            "Não foi possível carregar a auditoria."
        );

    }

}


// ==========================================================
// PERFIL
// ==========================================================

function preencherPerfilLogado() {

    if (!perfilLogado) {

        return;

    }


    const nome =
        perfilLogado.nome ||
        usuarioLogado?.email ||
        "Usuário";


    if (
        elementos.userName
    ) {

        elementos.userName.textContent =
            nome;

    }


    if (
        elementos.userRole
    ) {

        elementos.userRole.textContent =
            nomeCargo(
                perfilLogado.cargo
            );

    }


    if (
        elementos.userAvatar
    ) {

        const foto =
            String(
                perfilLogado.foto ||
                ""
            ).trim();


        if (foto) {

            elementos.userAvatar.innerHTML = `

                <img
                    src="${escaparHTML(foto)}"
                    alt="Foto do usuário"
                >

            `;

        } else {

            elementos.userAvatar.textContent =
                gerarIniciais(
                    nome
                );

        }

    }

}


// ==========================================================
// CARREGAR AUDITORIA
// ==========================================================

async function carregarAuditoria() {

    definirCarregando();


    try {

        const usuarioAtual =
            auth.currentUser;


        if (!usuarioAtual) {

            throw new Error(
                "Sua sessão expirou."
            );

        }


        const token =
            await usuarioAtual.getIdToken();


        const resposta =
            await fetch(
                `${CONFIG.apiBase}/api/auditoria?limit=250`,
                {
                    method:
                        "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        let resultado =
            null;


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
                resultado?.erro ||
                "Não foi possível consultar a auditoria."
            );

        }


        logs =
            Array.isArray(
                resultado.logs
            )
                ?
                resultado.logs
                :
                [];


        logs.sort(
            (
                a,
                b
            ) => {

                return (
                    obterTimestamp(
                        b.criadoEm
                    )
                    -
                    obterTimestamp(
                        a.criadoEm
                    )
                );

            }
        );


        preencherFiltroUsuarios();

        atualizarEstatisticas();

        aplicarFiltros();


    } catch (erro) {

        console.error(
            "SIGCOR - carregarAuditoria:",
            erro
        );


        mostrarErroTabela(
            erro.message ||
            "Não foi possível carregar a auditoria."
        );


        if (
            elementos.resultadoAuditoria
        ) {

            elementos.resultadoAuditoria.textContent =
                "Erro ao carregar registros.";

        }

    }

}


// ==========================================================
// LOADING
// ==========================================================

function definirCarregando() {

    if (
        !elementos.auditTableBody
    ) {

        return;

    }


    elementos.auditTableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="loading"
            >

                <div class="spinner"></div>

                Carregando auditoria...

            </td>

        </tr>

    `;


    if (
        elementos.resultadoAuditoria
    ) {

        elementos.resultadoAuditoria.textContent =
            "Carregando registros...";

    }

}


// ==========================================================
// ERRO
// ==========================================================

function mostrarErroTabela(
    mensagem
) {

    if (
        !elementos.auditTableBody
    ) {

        return;

    }


    elementos.auditTableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="empty"
                style="color:#ff7270;"
            >

                ${escaparHTML(mensagem)}

            </td>

        </tr>

    `;

}


// ==========================================================
// ESTATÍSTICAS
// ==========================================================

function atualizarEstatisticas() {

    const total =
        logs.length;


    const logsUsuarios =
        logs.filter(
            item =>
                normalizar(
                    item.modulo
                ) ===
                "usuarios"
        ).length;


    const logsInqueritos =
        logs.filter(
            item =>
                normalizar(
                    item.modulo
                ) ===
                "inqueritos"
        ).length;


    const hoje =
        logs.filter(
            item =>
                ehHoje(
                    item.criadoEm
                )
        ).length;


    definirNumero(
        elementos.totalRegistros,
        total
    );

    definirNumero(
        elementos.totalLogsUsuarios,
        logsUsuarios
    );

    definirNumero(
        elementos.totalLogsInqueritos,
        logsInqueritos
    );

    definirNumero(
        elementos.totalHoje,
        hoje
    );

}


function definirNumero(
    elemento,
    valor
) {

    if (!elemento) {

        return;

    }


    elemento.textContent =
        Number(
            valor
        ) || 0;

}


// ==========================================================
// FILTRO DE RESPONSÁVEIS
// ==========================================================

function preencherFiltroUsuarios() {

    if (
        !elementos.filtroUsuario
    ) {

        return;

    }


    const nomes =
        [
            ...new Set(
                logs
                    .map(
                        item =>
                            String(
                                item.usuarioNome ||
                                item.usuarioEmail ||
                                ""
                            ).trim()
                    )
                    .filter(
                        Boolean
                    )
            )
        ]
            .sort(
                (
                    a,
                    b
                ) =>
                    a.localeCompare(
                        b,
                        "pt-BR"
                    )
            );


    elementos.filtroUsuario.innerHTML = `

        <option value="">
            Todos
        </option>

        ${
            nomes
                .map(
                    nome => `

                        <option
                            value="${escaparHTML(nome)}"
                        >
                            ${escaparHTML(nome)}
                        </option>

                    `
                )
                .join("")
        }

    `;

}


// ==========================================================
// FILTRAR
// ==========================================================

function aplicarFiltros() {

    const pesquisa =
        normalizarPesquisa(
            elementos.auditSearch?.value
        );


    const modulo =
        normalizar(
            elementos.filtroModulo?.value
        );


    const acao =
        normalizar(
            elementos.filtroAcao?.value
        );


    const usuario =
        normalizarPesquisa(
            elementos.filtroUsuario?.value
        );


    logsFiltrados =
        logs.filter(
            item => {

                const nomeResponsavel =
                    item.usuarioNome ||
                    item.usuarioEmail ||
                    "";


                const textoPesquisa =
                    normalizarPesquisa(
                        [
                            nomeResponsavel,
                            item.usuarioEmail,
                            item.acao,
                            nomeAcao(
                                item.acao
                            ),
                            item.modulo,
                            item.alvoNome,
                            item.alvoId,
                            item.ip
                        ].join(
                            " "
                        )
                    );


                if (
                    pesquisa &&
                    !textoPesquisa.includes(
                        pesquisa
                    )
                ) {

                    return false;

                }


                if (
                    modulo &&
                    normalizar(
                        item.modulo
                    ) !==
                    modulo
                ) {

                    return false;

                }


                if (acao) {

                    const acaoLog =
                        normalizar(
                            item.acao
                        );


                    if (
                        !acaoLog.includes(
                            acao
                        )
                    ) {

                        return false;

                    }

                }


                if (
                    usuario &&
                    normalizarPesquisa(
                        nomeResponsavel
                    ) !==
                    usuario
                ) {

                    return false;

                }


                return true;

            }
        );


    paginaAtual =
        1;


    renderizarTabela();

}


// ==========================================================
// RENDERIZAR TABELA
// ==========================================================

function renderizarTabela() {

    if (
        !elementos.auditTableBody
    ) {

        return;

    }


    const total =
        logsFiltrados.length;


    if (
        elementos.resultadoAuditoria
    ) {

        elementos.resultadoAuditoria.textContent =
            total === 1
                ?
                "1 registro encontrado"
                :
                `${total} registros encontrados`;

    }


    if (
        total ===
        0
    ) {

        elementos.auditTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    Nenhum registro encontrado.
                </td>

            </tr>

        `;


        atualizarPaginacao(
            0,
            0,
            0
        );


        return;

    }


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                total /
                CONFIG.registrosPorPagina
            )
        );


    if (
        paginaAtual >
        totalPaginas
    ) {

        paginaAtual =
            totalPaginas;

    }


    const inicio =
        (
            paginaAtual -
            1
        )
        *
        CONFIG.registrosPorPagina;


    const fim =
        Math.min(
            inicio +
            CONFIG.registrosPorPagina,
            total
        );


    const pagina =
        logsFiltrados.slice(
            inicio,
            fim
        );


    elementos.auditTableBody.innerHTML =
        pagina
            .map(
                criarLinha
            )
            .join(
                ""
            );


    atualizarPaginacao(
        inicio + 1,
        fim,
        total
    );


    window.lucide
        ?.createIcons();

}


// ==========================================================
// LINHA DA TABELA
// ==========================================================

function criarLinha(
    item
) {

    const responsavel =
        item.usuarioNome ||
        item.usuarioEmail ||
        "Usuário";


    const email =
        item.usuarioEmail ||
        "-";


    const iniciais =
        gerarIniciais(
            responsavel
        );


    const modulo =
        normalizar(
            item.modulo
        );


    const classeModulo =
        modulo === "usuarios"
            ?
            "usuario"
            :
            modulo === "inqueritos"
                ?
                "inquerito"
                :
                modulo === "evidencias"
                    ?
                    "evidencia"
                    :
                    "";


    const alvo =
        item.alvoNome ||
        item.alvoId ||
        "-";


    return `

        <tr>

            <td>

                <div class="audit-user">

                    <div class="audit-avatar">
                        ${escaparHTML(iniciais)}
                    </div>

                    <div class="audit-user-info">

                        <strong>
                            ${escaparHTML(responsavel)}
                        </strong>

                        <span>
                            ${escaparHTML(email)}
                        </span>

                    </div>

                </div>

            </td>


            <td>

                <span class="badge">
                    ${escaparHTML(
                        nomeAcao(
                            item.acao
                        )
                    )}
                </span>

            </td>


            <td>

                <span
                    class="badge ${classeModulo}"
                >
                    ${escaparHTML(
                        nomeModulo(
                            item.modulo
                        )
                    )}
                </span>

            </td>


            <td>

                ${escaparHTML(alvo)}

            </td>


            <td>

                ${escaparHTML(
                    item.ip ||
                    "-"
                )}

            </td>


            <td>

                ${escaparHTML(
                    formatarDataHora(
                        item.criadoEm
                    )
                )}

            </td>

        </tr>

    `;

}


// ==========================================================
// PAGINAÇÃO
// ==========================================================

function atualizarPaginacao(
    inicio,
    fim,
    total
) {

    if (
        elementos.paginationStart
    ) {

        elementos.paginationStart.textContent =
            inicio;

    }


    if (
        elementos.paginationEnd
    ) {

        elementos.paginationEnd.textContent =
            fim;

    }


    if (
        elementos.paginationTotal
    ) {

        elementos.paginationTotal.textContent =
            total;

    }


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                total /
                CONFIG.registrosPorPagina
            )
        );


    if (
        elementos.paginationCurrent
    ) {

        elementos.paginationCurrent.textContent =
            `Página ${paginaAtual}`;

    }


    if (
        elementos.paginationPrevious
    ) {

        elementos.paginationPrevious.disabled =
            paginaAtual <= 1;

    }


    if (
        elementos.paginationNext
    ) {

        elementos.paginationNext.disabled =
            total === 0 ||
            paginaAtual >= totalPaginas;

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


    elementos.refreshAudit
        ?.addEventListener(
            "click",
            async () => {

                elementos.refreshAudit.disabled =
                    true;


                try {

                    await carregarAuditoria();

                } finally {

                    elementos.refreshAudit.disabled =
                        false;

                }

            }
        );


    elementos.auditSearch
        ?.addEventListener(
            "input",
            aplicarFiltros
        );


    elementos.filtroModulo
        ?.addEventListener(
            "change",
            aplicarFiltros
        );


    elementos.filtroAcao
        ?.addEventListener(
            "change",
            aplicarFiltros
        );


    elementos.filtroUsuario
        ?.addEventListener(
            "change",
            aplicarFiltros
        );


    elementos.limparFiltros
        ?.addEventListener(
            "click",
            () => {

                if (
                    elementos.auditSearch
                ) {

                    elementos.auditSearch.value =
                        "";

                }


                if (
                    elementos.filtroModulo
                ) {

                    elementos.filtroModulo.value =
                        "";

                }


                if (
                    elementos.filtroAcao
                ) {

                    elementos.filtroAcao.value =
                        "";

                }


                if (
                    elementos.filtroUsuario
                ) {

                    elementos.filtroUsuario.value =
                        "";

                }


                aplicarFiltros();

            }
        );


    elementos.paginationPrevious
        ?.addEventListener(
            "click",
            () => {

                if (
                    paginaAtual >
                    1
                ) {

                    paginaAtual--;

                    renderizarTabela();

                }

            }
        );


    elementos.paginationNext
        ?.addEventListener(
            "click",
            () => {

                const totalPaginas =
                    Math.ceil(
                        logsFiltrados.length /
                        CONFIG.registrosPorPagina
                    );


                if (
                    paginaAtual <
                    totalPaginas
                ) {

                    paginaAtual++;

                    renderizarTabela();

                }

            }
        );

}


// ==========================================================
// NOMES DE AÇÕES
// ==========================================================

function nomeAcao(
    acao
) {

    const chave =
        normalizar(
            acao
        );


    const mapa = {

        criar_usuario:
            "Criou usuário",

        editar_usuario:
            "Editou usuário",

        excluir_usuario:
            "Excluiu usuário",

        alterar_senha_usuario:
            "Alterou senha",

        criar_inquerito:
            "Criou inquérito",

        editar_inquerito:
            "Editou inquérito",

        excluir_inquerito:
            "Excluiu inquérito",

        criar_evidencia:
            "Adicionou evidência",

        excluir_evidencia:
            "Excluiu evidência"

    };


    return (
        mapa[chave] ||
        formatarTexto(
            chave
        )
    );

}


// ==========================================================
// MÓDULOS
// ==========================================================

function nomeModulo(
    modulo
) {

    const chave =
        normalizar(
            modulo
        );


    const mapa = {

        usuarios:
            "Usuários",

        inqueritos:
            "Inquéritos",

        evidencias:
            "Evidências",

        autenticacao:
            "Autenticação",

        sistema:
            "Sistema"

    };


    return (
        mapa[chave] ||
        formatarTexto(
            chave
        )
    );

}


// ==========================================================
// CARGO
// ==========================================================

function nomeCargo(
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
// DATA
// ==========================================================

function obterData(
    valor
) {

    if (!valor) {

        return null;

    }


    try {

        if (
            typeof valor.toDate ===
            "function"
        ) {

            return valor.toDate();

        }


        if (
            typeof valor ===
            "object" &&
            valor._seconds !== undefined
        ) {

            return new Date(
                Number(
                    valor._seconds
                ) * 1000
            );

        }


        if (
            typeof valor ===
            "object" &&
            valor.seconds !== undefined
        ) {

            return new Date(
                Number(
                    valor.seconds
                ) * 1000
            );

        }


        const data =
            new Date(
                valor
            );


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            return null;

        }


        return data;


    } catch {

        return null;

    }

}


function obterTimestamp(
    valor
) {

    const data =
        obterData(
            valor
        );


    return data
        ?
        data.getTime()
        :
        0;

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
                "medium"
        }
    ).format(
        data
    );

}


function ehHoje(
    valor
) {

    const data =
        obterData(
            valor
        );


    if (!data) {

        return false;

    }


    const agora =
        new Date();


    return (
        data.getDate() ===
            agora.getDate()
        &&
        data.getMonth() ===
            agora.getMonth()
        &&
        data.getFullYear() ===
            agora.getFullYear()
    );

}


// ==========================================================
// UTILIDADES
// ==========================================================

function normalizar(
    valor
) {

    return String(
        valor ||
        ""
    )
        .trim()
        .toLowerCase();

}


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


function formatarTexto(
    valor
) {

    const texto =
        String(
            valor ||
            ""
        )
            .replaceAll(
                "_",
                " "
            )
            .trim();


    if (!texto) {

        return "-";

    }


    return texto
        .charAt(0)
        .toUpperCase()
        +
        texto.slice(1);

}


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
// CONSOLE / TESTES
// ==========================================================

window.SIGCORAuditoria = {

    carregar:
        carregarAuditoria,

    listar:
        () => logs,

    filtrados:
        () => logsFiltrados

};