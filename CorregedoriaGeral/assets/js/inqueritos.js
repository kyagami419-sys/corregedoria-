// ==========================================================
// SIGCOR
// assets/js/inqueritos.js
// ==========================================================

import {
    protegerPagina,
    logout,
    gerarIniciais,
    normalizarCargo
} from "../../firebase/auth.js";

import {
    listarInqueritos
} from "./api.js";

// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

const CONFIG = {
    porPagina: 10
};


// ==========================================================
// ESTADO
// ==========================================================

let usuarioLogado = null;
let perfilLogado = null;

let inqueritos = [];
let filtrados = [];

let paginaAtual = 1;


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

    refreshInqueritos:
        document.getElementById("refreshInqueritos"),

    totalInqueritos:
        document.getElementById("totalInqueritos"),

    totalAndamento:
        document.getElementById("totalAndamento"),

    totalConcluidos:
        document.getElementById("totalConcluidos"),

    totalArquivados:
        document.getElementById("totalArquivados"),

    resultadoInqueritos:
        document.getElementById("resultadoInqueritos"),

    pesquisa:
        document.getElementById("inqueritoSearch"),

    filtroStatus:
        document.getElementById("filtroStatus"),

    filtroResponsavel:
        document.getElementById("filtroResponsavel"),

    filtroTipo:
        document.getElementById("filtroTipo"),

    limparFiltros:
        document.getElementById("limparFiltros"),

    tabela:
        document.getElementById("inqueritosTableBody"),

    paginationStart:
        document.getElementById("paginationStart"),

    paginationEnd:
        document.getElementById("paginationEnd"),

    paginationTotal:
        document.getElementById("paginationTotal"),

    paginationCurrent:
        document.getElementById("paginationCurrent"),

    paginationPrevious:
        document.getElementById("paginationPrevious"),

    paginationNext:
        document.getElementById("paginationNext")

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

        configurarEventos();

        await carregarInqueritos();

        window.lucide?.createIcons();

    } catch (erro) {

        console.error(
            "SIGCOR - Inquéritos:",
            erro
        );

        mostrarErro(
            "Não foi possível carregar os inquéritos."
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
// CARREGAR
// ==========================================================

async function carregarInqueritos() {

    definirCarregando();

    try {

        const token =
            await usuarioLogado.getIdToken();

      const resultado = await listarInqueritos(500);

       if (!resultado) {

    throw new Error(
        "Não foi possível consultar os inquéritos."
    );
}

       inqueritos =
    Array.isArray(resultado)
        ? resultado
        : [];

        ordenarInqueritos();

        preencherFiltroResponsaveis();

        atualizarEstatisticas();

        aplicarFiltros();

    } catch (erro) {

        console.error(
            "SIGCOR - carregarInqueritos:",
            erro
        );

        mostrarErro(
            erro.message ||
            "Erro ao carregar inquéritos."
        );

    }

}


// ==========================================================
// ORDENAR
// ==========================================================

function ordenarInqueritos() {

    inqueritos.sort(
        (a, b) =>
            obterTimestamp(
                b.atualizadoEm ||
                b.criadoEm
            )
            -
            obterTimestamp(
                a.atualizadoEm ||
                a.criadoEm
            )
    );

}


// ==========================================================
// ESTATÍSTICAS
// ==========================================================

function atualizarEstatisticas() {

    const total =
        inqueritos.length;

    const andamento =
        inqueritos.filter(
            item => {

                const status =
                    normalizarStatus(
                        item.status
                    );

                return (
                    status === "andamento" ||
                    status === "aberto"
                );

            }
        ).length;

    const concluidos =
        inqueritos.filter(
            item =>
                normalizarStatus(
                    item.status
                ) ===
                "concluido"
        ).length;

    const arquivados =
        inqueritos.filter(
            item =>
                normalizarStatus(
                    item.status
                ) ===
                "arquivado"
        ).length;

    definirNumero(
        elementos.totalInqueritos,
        total
    );

    definirNumero(
        elementos.totalAndamento,
        andamento
    );

    definirNumero(
        elementos.totalConcluidos,
        concluidos
    );

    definirNumero(
        elementos.totalArquivados,
        arquivados
    );

}


// ==========================================================
// FILTRO RESPONSÁVEL
// ==========================================================

function preencherFiltroResponsaveis() {

    if (!elementos.filtroResponsavel) {
        return;
    }

    const responsaveis =
        [
            ...new Set(
                inqueritos
                    .map(
                        item =>
                            String(
                                item.responsavelNome ||
                                item.responsavel ||
                                item.criadoPorNome ||
                                ""
                            ).trim()
                    )
                    .filter(Boolean)
            )
        ]
            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "pt-BR"
                    )
            );

    elementos.filtroResponsavel.innerHTML = `

        <option value="">
            Todos
        </option>

        ${
            responsaveis
                .map(
                    nome => `
                        <option value="${escaparHTML(nome)}">
                            ${escaparHTML(nome)}
                        </option>
                    `
                )
                .join("")
        }

    `;

}


// ==========================================================
// FILTROS
// ==========================================================

function aplicarFiltros() {

    const pesquisa =
        normalizarPesquisa(
            elementos.pesquisa?.value
        );

    const status =
        normalizarStatus(
            elementos.filtroStatus?.value
        );

    const responsavel =
        normalizarPesquisa(
            elementos.filtroResponsavel?.value
        );

    const tipo =
        normalizarPesquisa(
            elementos.filtroTipo?.value
        );

    filtrados =
        inqueritos.filter(
            item => {

                const numero =
                    item.numero ||
                    item.numeroInquerito ||
                    item.id ||
                    "";

                const responsavelNome =
                    item.responsavelNome ||
                    item.responsavel ||
                    item.criadoPorNome ||
                    "";

                const alvoPesquisa =
                    normalizarPesquisa(
                        [
                            numero,
                            item.titulo,
                            item.descricao,
                            responsavelNome,
                            item.tipo,
                            item.status
                        ].join(" ")
                    );

                if (
                    pesquisa &&
                    !alvoPesquisa.includes(
                        pesquisa
                    )
                ) {
                    return false;
                }

                if (
                    status &&
                    normalizarStatus(
                        item.status
                    ) !== status
                ) {
                    return false;
                }

                if (
                    responsavel &&
                    normalizarPesquisa(
                        responsavelNome
                    ) !== responsavel
                ) {
                    return false;
                }

                if (
                    tipo &&
                    normalizarPesquisa(
                        item.tipo
                    ) !== tipo
                ) {
                    return false;
                }

                return true;

            }
        );

    paginaAtual = 1;

    renderizar();

}


// ==========================================================
// RENDERIZAR
// ==========================================================

function renderizar() {

    const total =
        filtrados.length;

    if (
        elementos.resultadoInqueritos
    ) {

        elementos.resultadoInqueritos.textContent =
            total === 1
                ? "1 inquérito encontrado"
                : `${total} inquéritos encontrados`;

    }

    if (total === 0) {

        elementos.tabela.innerHTML = `

            <tr>
                <td
                    colspan="7"
                    class="empty"
                >
                    Nenhum inquérito registrado.
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
                CONFIG.porPagina
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
        CONFIG.porPagina;

    const fim =
        Math.min(
            inicio +
            CONFIG.porPagina,
            total
        );

    const pagina =
        filtrados.slice(
            inicio,
            fim
        );

    elementos.tabela.innerHTML =
        pagina
            .map(criarLinha)
            .join("");

    atualizarPaginacao(
        inicio + 1,
        fim,
        total
    );

    window.lucide?.createIcons();

}


// ==========================================================
// LINHA
// ==========================================================

function criarLinha(
    item
) {

    const numero =
        item.numero ||
        item.numeroInquerito ||
        gerarNumeroVisual(
            item.id
        );

    const titulo =
        item.titulo ||
        "Inquérito sem título";

    const descricao =
        item.descricao ||
        item.resumo ||
        "";

    const tipo =
        formatarTipo(
            item.tipo
        );

    const responsavel =
        item.responsavelNome ||
        item.responsavel ||
        item.criadoPorNome ||
        "-";

    const status =
        normalizarStatus(
            item.status ||
            "andamento"
        );

    const id =
        item.id;

    return `

        <tr>

            <td>
                <span class="numero-inquerito">
                    ${escaparHTML(numero)}
                </span>
            </td>


            <td>

                <div class="inquerito-info">

                    <strong>
                        ${escaparHTML(titulo)}
                    </strong>

                    <span>
                        ${escaparHTML(descricao)}
                    </span>

                </div>

            </td>


            <td>
                ${escaparHTML(tipo)}
            </td>


            <td>
                ${escaparHTML(responsavel)}
            </td>


            <td>

                <span class="status ${escaparHTML(status)}">

                    ${escaparHTML(
                        nomeStatus(
                            status
                        )
                    )}

                </span>

            </td>


            <td>

                ${escaparHTML(
                    formatarDataHora(
                        item.atualizadoEm ||
                        item.criadoEm
                    )
                )}

            </td>


            <td>

                <a
                    class="action-button"
                    href="./visualizar.html?id=${encodeURIComponent(id)}"
                    title="Visualizar inquérito"
                >
                    <i data-lucide="eye"></i>
                </a>

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

    elementos.paginationStart.textContent =
        inicio;

    elementos.paginationEnd.textContent =
        fim;

    elementos.paginationTotal.textContent =
        total;

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                total /
                CONFIG.porPagina
            )
        );

    elementos.paginationCurrent.textContent =
        `Página ${paginaAtual}`;

    elementos.paginationPrevious.disabled =
        paginaAtual <= 1;

    elementos.paginationNext.disabled =
        total === 0 ||
        paginaAtual >= totalPaginas;

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

    elementos.refreshInqueritos
        ?.addEventListener(
            "click",
            carregarInqueritos
        );

    elementos.pesquisa
        ?.addEventListener(
            "input",
            aplicarFiltros
        );

    elementos.filtroStatus
        ?.addEventListener(
            "change",
            aplicarFiltros
        );

    elementos.filtroResponsavel
        ?.addEventListener(
            "change",
            aplicarFiltros
        );

    elementos.filtroTipo
        ?.addEventListener(
            "change",
            aplicarFiltros
        );

    elementos.limparFiltros
        ?.addEventListener(
            "click",
            () => {

                elementos.pesquisa.value = "";
                elementos.filtroStatus.value = "";
                elementos.filtroResponsavel.value = "";
                elementos.filtroTipo.value = "";

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

                    renderizar();

                }

            }
        );

    elementos.paginationNext
        ?.addEventListener(
            "click",
            () => {

                const totalPaginas =
                    Math.ceil(
                        filtrados.length /
                        CONFIG.porPagina
                    );

                if (
                    paginaAtual <
                    totalPaginas
                ) {

                    paginaAtual++;

                    renderizar();

                }

            }
        );

}


// ==========================================================
// LOADING / ERRO
// ==========================================================

function definirCarregando() {

    if (!elementos.tabela) {
        return;
    }

    elementos.tabela.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="loading"
            >

                <div class="spinner"></div>

                Carregando inquéritos...

            </td>

        </tr>

    `;

}


function mostrarErro(
    mensagem
) {

    if (!elementos.tabela) {
        return;
    }

    elementos.tabela.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="empty"
                style="color:#ff7270;"
            >
                ${escaparHTML(mensagem)}
            </td>

        </tr>

    `;

}


// ==========================================================
// FORMATADORES
// ==========================================================

function nomeStatus(
    status
) {

    const mapa = {
        aberto: "Em andamento",
        andamento: "Em andamento",
        concluido: "Concluído",
        arquivado: "Arquivado",
        suspenso: "Suspenso"
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


function formatarTipo(
    tipo
) {

    const chave =
        normalizarPesquisa(
            tipo
        );

    const mapa = {
        administrativo: "Administrativo",
        disciplinar: "Disciplinar",
        criminal: "Criminal",
        interno: "Interno"
    };

    return (
        mapa[chave] ||
        tipo ||
        "-"
    );

}


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
            typeof valor === "object" &&
            valor._seconds !== undefined
        ) {

            return new Date(
                Number(
                    valor._seconds
                ) * 1000
            );

        }

        if (
            typeof valor === "object" &&
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

        return Number.isNaN(
            data.getTime()
        )
            ? null
            : data;

    } catch {

        return null;

    }

}


function obterTimestamp(
    valor
) {

    return (
        obterData(
            valor
        )?.getTime()
        ||
        0
    );

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
            dateStyle: "short",
            timeStyle: "short"
        }
    ).format(
        data
    );

}


// ==========================================================
// NORMALIZAÇÃO
// ==========================================================

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

    if (
        status === "em_andamento"
    ) {
        return "andamento";
    }

    if (
        status === "concluído"
    ) {
        return "concluido";
    }

    return status;

}


function normalizarPesquisa(
    valor
) {

    return String(
        valor ||
        ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim()
        .toLowerCase();

}


// ==========================================================
// NÚMERO VISUAL
// ==========================================================

function gerarNumeroVisual(
    id
) {

    if (!id) {
        return "-";
    }

    return `IP-${String(id)
        .slice(0, 8)
        .toUpperCase()}`;

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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

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
// TESTES
// ==========================================================

window.SIGCORInqueritos = {

    carregar:
        carregarInqueritos,

    listar:
        () => inqueritos,

    filtrados:
        () => filtrados

};