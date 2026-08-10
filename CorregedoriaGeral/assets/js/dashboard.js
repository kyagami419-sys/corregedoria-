// ==========================================================
// SIGCOR
// assets/js/dashboard.js
//
// Dashboard principal
// ==========================================================

import {

    protegerPagina,
    atualizarUltimoAcesso,
    logout,
    gerarIniciais

} from "../../firebase/auth.js";


// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

const CONFIG = {

    apiBase:
        "https://corregedoriapf.discloud.app"

};


// ==========================================================
// ESTADO
// ==========================================================

let usuarioLogado =
    null;

let perfilLogado =
    null;


// ==========================================================
// INICIAR
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarDashboard
);


async function iniciarDashboard() {

    try {

        console.log(
            "SIGCOR: iniciando dashboard..."
        );


        // ==================================================
        // PROTEGER PÁGINA
        // ==================================================

        const sessao =
            await protegerPagina();


        if (!sessao) {

            return;

        }


        usuarioLogado =
            sessao.usuario;

        perfilLogado =
            sessao.perfil;


        console.log(
            "SIGCOR DASHBOARD LIBERADO",
            usuarioLogado.uid,
            perfilLogado
        );


        // ==================================================
        // PERFIL
        // ==================================================

        preencherPerfil(
            perfilLogado
        );


        configurarLogout();

        configurarAtualizar();


        // ==================================================
        // ÚLTIMO ACESSO
        // ==================================================

        atualizarUltimoAcesso()
            .catch(
                erro => {

                    console.warn(
                        "Não foi possível atualizar último acesso:",
                        erro
                    );

                }
            );


        // ==================================================
        // CARREGAR DASHBOARD
        // ==================================================

        await carregarDashboard();


        // ==================================================
        // ATIVIDADES
        // ==================================================

        await carregarAtividadesRecentes();


        window.lucide
            ?.createIcons();


        console.log(
            "SIGCOR: dashboard carregado."
        );


    } catch (erro) {

        console.error(
            "SIGCOR - erro ao iniciar dashboard:",
            erro
        );

    }

}


// ==========================================================
// PERFIL
// ==========================================================

function preencherPerfil(
    perfil
) {

    const nome =
        perfil.nome ||
        "Usuário";


    const nomeElemento =
        document.getElementById(
            "userName"
        );


    const cargoElemento =
        document.getElementById(
            "userRole"
        );


    const avatar =
        document.getElementById(
            "userAvatar"
        );


    const welcomeName =
        document.getElementById(
            "welcomeName"
        );


    if (
        nomeElemento
    ) {

        nomeElemento.textContent =
            nome;

    }


    if (
        cargoElemento
    ) {

        cargoElemento.textContent =
            formatarCargo(
                perfil.cargo
            );

    }


    if (
        welcomeName
    ) {

        welcomeName.textContent =
            primeiroNome(
                nome
            );

    }


    if (
        avatar
    ) {

        const foto =
            String(
                perfil.foto ||
                ""
            ).trim();


        if (
            foto
        ) {

            avatar.innerHTML = `

                <img
                    src="${escaparHTML(foto)}"
                    alt="${escaparHTML(nome)}"
                >

            `;

        } else {

            avatar.textContent =
                gerarIniciais(
                    nome
                );

        }

    }

}


// ==========================================================
// CARREGAR RESUMO
// ==========================================================

async function carregarDashboard() {

    try {

        definirCarregandoCards();


        const token =
            await obterToken();


        const resposta =
            await fetch(
                `${CONFIG.apiBase}/api/dashboard/resumo`,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const resultado =
            await resposta.json();


        if (
            !resposta.ok
        ) {

            throw new Error(
                resultado.erro ||
                "Não foi possível carregar o dashboard."
            );

        }


        const resumo =
            resultado.resumo ||
            {};


        // ==================================================
        // INQUÉRITOS
        // ==================================================

        definirNumero(
            "totalInqueritos",
            resumo.inqueritos
        );


        // ==================================================
        // EM ANDAMENTO
        // ==================================================

        definirNumero(
            "inqueritosAndamento",
            resumo.inqueritosEmAndamento
        );


        // ==================================================
        // USUÁRIOS ATIVOS
        // ==================================================

        definirNumero(
            "usuariosAtivos",
            resumo.usuariosAtivos
        );


        // ==================================================
        // EVIDÊNCIAS
        // ==================================================

        definirNumero(
            "totalEvidencias",
            resumo.evidencias
        );


    } catch (erro) {

        console.error(
            "SIGCOR - dashboard resumo:",
            erro
        );


        definirNumero(
            "totalInqueritos",
            0
        );

        definirNumero(
            "inqueritosAndamento",
            0
        );

        definirNumero(
            "usuariosAtivos",
            0
        );

        definirNumero(
            "totalEvidencias",
            0
        );

    }

}


// ==========================================================
// ATIVIDADES RECENTES
// ==========================================================

async function carregarAtividadesRecentes() {

    const container =
        document.getElementById(
            "recentActivity"
        );


    if (
        !container
    ) {

        return;

    }


    try {

        container.innerHTML = `

            <div class="empty-activity">
                Carregando atividades...
            </div>

        `;


        const token =
            await obterToken();


        const resposta =
            await fetch(
                `${CONFIG.apiBase}/api/auditoria?limit=5`,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        // Usuário pode não ter acesso à auditoria.
        if (
            !resposta.ok
        ) {

            container.innerHTML = `

                <div class="empty-activity">
                    Nenhuma atividade disponível.
                </div>

            `;

            return;

        }


        const resultado =
            await resposta.json();


        const atividades =
            Array.isArray(
                resultado.logs
            )
                ?
                resultado.logs
                :
                [];


        if (
            atividades.length ===
            0
        ) {

            container.innerHTML = `

                <div class="empty-activity">
                    Nenhuma atividade recente.
                </div>

            `;

            return;

        }


        container.innerHTML =
            atividades
                .slice(
                    0,
                    5
                )
                .map(
                    criarAtividade
                )
                .join(
                    ""
                );


    } catch (erro) {

        console.warn(
            "SIGCOR - atividades recentes:",
            erro
        );


        container.innerHTML = `

            <div class="empty-activity">
                Não foi possível carregar as atividades.
            </div>

        `;

    }

}


// ==========================================================
// CRIAR ATIVIDADE
// ==========================================================

function criarAtividade(
    atividade
) {

    const usuario =
        atividade.usuarioNome ||
        atividade.usuarioEmail ||
        "Usuário";


    const acao =
        formatarAcao(
            atividade.acao
        );


    const alvo =
        atividade.alvoNome ||
        "";


    let titulo =
        `${usuario} ${acao}`;


    if (
        alvo
    ) {

        titulo +=
            ` • ${alvo}`;

    }


    return `

        <div class="activity-item">

            <strong>
                ${escaparHTML(titulo)}
            </strong>

            <span>
                ${escaparHTML(
                    formatarDataHora(
                        atividade.criadoEm
                    )
                )}
            </span>

        </div>

    `;

}


// ==========================================================
// TOKEN
// ==========================================================

async function obterToken() {

    if (
        !usuarioLogado
    ) {

        throw new Error(
            "Sessão não encontrada."
        );

    }


    return await usuarioLogado
        .getIdToken();

}


// ==========================================================
// CARREGANDO CARDS
// ==========================================================

function definirCarregandoCards() {

    [

        "totalInqueritos",
        "inqueritosAndamento",
        "usuariosAtivos",
        "totalEvidencias"

    ].forEach(
        id => {

            const elemento =
                document.getElementById(
                    id
                );


            if (
                elemento
            ) {

                elemento.textContent =
                    "...";

            }

        }
    );

}


// ==========================================================
// DEFINIR NÚMERO
// ==========================================================

function definirNumero(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (
        !elemento
    ) {

        return;

    }


    elemento.textContent =
        Number(
            valor
        ) || 0;

}


// ==========================================================
// BOTÃO ATUALIZAR
// ==========================================================

function configurarAtualizar() {

    const botao =
        document.getElementById(
            "refreshDashboard"
        );


    if (
        !botao
    ) {

        return;

    }


    botao.addEventListener(
        "click",
        async () => {

            botao.disabled =
                true;


            try {

                await carregarDashboard();

                await carregarAtividadesRecentes();


            } finally {

                botao.disabled =
                    false;

            }

        }
    );

}


// ==========================================================
// LOGOUT
// ==========================================================

function configurarLogout() {

    const botao =
        document.getElementById(
            "logoutButton"
        );


    botao?.addEventListener(
        "click",
        async () => {

            await logout();

        }
    );

}


// ==========================================================
// FORMATAR CARGO
// ==========================================================

function formatarCargo(
    cargo
) {

    const chave =
        String(
            cargo ||
            ""
        )
            .trim()
            .toLowerCase()
            .replace(
                /[\s-]+/g,
                "_"
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
// AÇÕES
// ==========================================================

function formatarAcao(
    acao
) {

    const chave =
        String(
            acao ||
            ""
        )
            .trim()
            .toLowerCase();


    const mapa = {

        criar_usuario:
            "criou um usuário",

        editar_usuario:
            "editou um usuário",

        excluir_usuario:
            "removeu um usuário",

        alterar_senha_usuario:
            "alterou uma senha",

        criar_inquerito:
            "criou um inquérito",

        editar_inquerito:
            "editou um inquérito",

        excluir_inquerito:
            "removeu um inquérito",

        criar_evidencia:
            "adicionou uma evidência",

        excluir_evidencia:
            "removeu uma evidência"

    };


    return (
        mapa[chave] ||
        String(
            acao ||
            "realizou uma ação"
        )
            .replaceAll(
                "_",
                " "
            )
    );

}


// ==========================================================
// DATA
// ==========================================================

function formatarDataHora(
    valor
) {

    if (
        !valor
    ) {

        return "-";

    }


    try {

        let data;


        if (
            typeof valor ===
                "object"
            &&
            valor._seconds !==
                undefined
        ) {

            data =
                new Date(
                    Number(
                        valor._seconds
                    )
                    *
                    1000
                );

        } else if (
            typeof valor ===
                "object"
            &&
            valor.seconds !==
                undefined
        ) {

            data =
                new Date(
                    Number(
                        valor.seconds
                    )
                    *
                    1000
                );

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


    } catch {

        return "-";

    }

}


// ==========================================================
// PRIMEIRO NOME
// ==========================================================

function primeiroNome(
    nome
) {

    return String(
        nome ||
        "Usuário"
    )
        .trim()
        .split(
            /\s+/
        )[0];

}


// ==========================================================
// ESCAPAR HTML
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
// TESTES PELO CONSOLE
// ==========================================================

window.SIGCORDashboard = {

    atualizar:
        async () => {

            await carregarDashboard();

            await carregarAtividadesRecentes();

        },

    perfil:
        () =>
            perfilLogado

};