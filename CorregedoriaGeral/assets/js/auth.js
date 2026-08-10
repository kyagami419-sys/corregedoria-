// =========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// firebase/auth.js
//
// Responsável por:
// - Verificar autenticação
// - Proteger páginas internas
// - Buscar perfil do usuário
// - Validar status da conta
// - Validar cargos
// - Validar permissões
// - Preencher dados do usuário na interface
// - Realizar logout
// =========================================================


// =========================================================
// FIREBASE
// =========================================================

import {
    auth,
    db
} from "./firebase.js";


// =========================================================
// FIREBASE AUTH
// =========================================================

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


// =========================================================
// FIRESTORE
// =========================================================

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// =========================================================
// CONFIGURAÇÕES
// =========================================================

const PAGINA_LOGIN =
    "../index.html";

const CHAVE_SESSAO =
    "sigcor_usuario";


// =========================================================
// CARGOS DO SIGCOR
// =========================================================

export const CARGOS = {

    ADMINISTRADOR:
        "administrador",

    CORREGEDOR_GERAL:
        "corregedor_geral",

    SUB_CORREGEDOR:
        "sub_corregedor",

    CORREGEDOR:
        "corregedor",

    INVESTIGADOR:
        "investigador",

    PERITO:
        "perito",

    ESCRIVAO:
        "escrivao",

    CONSULTA:
        "consulta"

};


// =========================================================
// HIERARQUIA DE CARGOS
//
// Quanto maior o valor, maior o nível de acesso.
// =========================================================

export const NIVEL_CARGOS = {

    consulta:
        10,

    escrivao:
        20,

    perito:
        30,

    investigador:
        40,

    corregedor:
        50,

    sub_corregedor:
        60,

    corregedor_geral:
        90,

    administrador:
        100

};


// =========================================================
// ESTADO INTERNO
// =========================================================

let usuarioFirebaseAtual =
    null;

let perfilAtual =
    null;

let autenticacaoResolvida =
    false;


// =========================================================
// NORMALIZAR TEXTO
// =========================================================

export function normalizarCargo(
    cargo
) {

    if (!cargo) {

        return "";

    }


    return String(cargo)

        .normalize("NFD")

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
// BUSCAR PERFIL NO FIRESTORE
// =========================================================

export async function buscarPerfil(
    uid
) {

    if (!uid) {

        return null;

    }


    try {

        const referencia =
            doc(
                db,
                "usuarios",
                uid
            );


        const snapshot =
            await getDoc(
                referencia
            );


        if (
            !snapshot.exists()
        ) {

            return null;

        }


        return {

            id:
                snapshot.id,

            uid:
                snapshot.id,

            ...snapshot.data()

        };

    } catch (erro) {

        console.error(
            "Erro ao buscar perfil do usuário:",
            erro
        );


        throw erro;

    }

}


// =========================================================
// SALVAR SESSÃO LOCAL
// =========================================================

function salvarSessaoLocal(
    usuario,
    perfil
) {

    const dados = {

        uid:
            usuario.uid,

        email:
            usuario.email || "",

        nome:
            perfil.nome ||
            perfil.nomeCompleto ||
            "",

        matricula:
            perfil.matricula || "",

        cargo:
            perfil.cargo || "",

        departamento:
            perfil.departamento ||
            perfil.departamentoNome ||
            "",

        foto:
            perfil.foto ||
            perfil.fotoUrl ||
            "",

        status:
            perfil.status || ""

    };


    sessionStorage.setItem(
        CHAVE_SESSAO,
        JSON.stringify(dados)
    );

}


// =========================================================
// LIMPAR SESSÃO LOCAL
// =========================================================

export function limparSessaoLocal() {

    sessionStorage.removeItem(
        CHAVE_SESSAO
    );

}


// =========================================================
// OBTER SESSÃO LOCAL
// =========================================================

export function obterSessaoLocal() {

    const dados =
        sessionStorage.getItem(
            CHAVE_SESSAO
        );


    if (!dados) {

        return null;

    }


    try {

        return JSON.parse(
            dados
        );

    } catch {

        sessionStorage.removeItem(
            CHAVE_SESSAO
        );


        return null;

    }

}


// =========================================================
// USUÁRIO FIREBASE ATUAL
// =========================================================

export function obterUsuarioFirebase() {

    return (
        usuarioFirebaseAtual ||
        auth.currentUser ||
        null
    );

}


// =========================================================
// PERFIL ATUAL
// =========================================================

export function obterPerfilAtual() {

    return perfilAtual;

}


// =========================================================
// UID ATUAL
// =========================================================

export function obterUidAtual() {

    return (
        obterUsuarioFirebase()?.uid ||
        null
    );

}


// =========================================================
// VERIFICAR SE ESTÁ AUTENTICADO
// =========================================================

export function estaAutenticado() {

    return Boolean(
        obterUsuarioFirebase()
    );

}


// =========================================================
// VALIDAR STATUS DO PERFIL
// =========================================================

export function perfilEstaAtivo(
    perfil
) {

    if (!perfil) {

        return false;

    }


    return (
        String(
            perfil.status || ""
        )
            .trim()
            .toLowerCase() ===
        "ativo"
    );

}


// =========================================================
// AGUARDAR AUTENTICAÇÃO
//
// Resolve quando o Firebase termina de verificar a sessão.
// =========================================================

export function aguardarAutenticacao() {

    return new Promise(
        resolve => {

            // Se já resolveu anteriormente,
            // retorna imediatamente.

            if (
                autenticacaoResolvida
            ) {

                resolve({
                    usuario:
                        usuarioFirebaseAtual,

                    perfil:
                        perfilAtual
                });


                return;

            }


            const cancelar =
                onAuthStateChanged(
                    auth,
                    async usuario => {

                        usuarioFirebaseAtual =
                            usuario;


                        if (!usuario) {

                            perfilAtual =
                                null;

                            autenticacaoResolvida =
                                true;


                            cancelar();


                            resolve({
                                usuario: null,
                                perfil: null
                            });


                            return;

                        }


                        try {

                            perfilAtual =
                                await buscarPerfil(
                                    usuario.uid
                                );


                            if (
                                perfilAtual
                            ) {

                                salvarSessaoLocal(
                                    usuario,
                                    perfilAtual
                                );

                            }


                        } catch (erro) {

                            console.error(
                                "Erro ao carregar perfil:",
                                erro
                            );


                            perfilAtual =
                                null;

                        }


                        autenticacaoResolvida =
                            true;


                        cancelar();


                        resolve({
                            usuario,
                            perfil:
                                perfilAtual
                        });

                    }
                );

        }
    );

}


// =========================================================
// PROTEGER PÁGINA
//
// Uso:
//
// await protegerPagina();
//
// ou:
//
// await protegerPagina([
//     "corregedor_geral",
//     "administrador"
// ]);
// =========================================================

export async function protegerPagina(
    cargosPermitidos = null
) {

    const {
        usuario,
        perfil
    } =
        await aguardarAutenticacao();


    // =====================================================
    // NÃO ESTÁ LOGADO
    // =====================================================

    if (!usuario) {

        redirecionarLogin();

        return null;

    }


    // =====================================================
    // SEM PERFIL NO FIRESTORE
    // =====================================================

    if (!perfil) {

        console.warn(
            "Usuário autenticado sem perfil no Firestore."
        );


        await sair();


        return null;

    }


    // =====================================================
    // CONTA NÃO ATIVA
    // =====================================================

    if (
        !perfilEstaAtivo(
            perfil
        )
    ) {

        console.warn(
            "Usuário sem acesso ativo:",
            perfil.status
        );


        await sair();


        return null;

    }


    // =====================================================
    // VERIFICAR CARGO
    // =====================================================

    if (
        Array.isArray(
            cargosPermitidos
        ) &&
        cargosPermitidos.length > 0
    ) {

        const permitido =
            usuarioPossuiCargo(
                perfil,
                cargosPermitidos
            );


        if (!permitido) {

            paginaSemPermissao();


            return null;

        }

    }


    // =====================================================
    // ATUALIZAR INTERFACE
    // =====================================================

    aplicarUsuarioNaInterface(
        perfil,
        usuario
    );


    aplicarPermissoesVisuais(
        perfil
    );


    return {
        usuario,
        perfil
    };

}


// =========================================================
// VERIFICAR CARGO
// =========================================================

export function usuarioPossuiCargo(
    perfil,
    cargosPermitidos
) {

    if (
        !perfil ||
        !Array.isArray(
            cargosPermitidos
        )
    ) {

        return false;

    }


    const cargoAtual =
        normalizarCargo(
            perfil.cargo
        );


    const cargos =
        cargosPermitidos.map(
            normalizarCargo
        );


    return cargos.includes(
        cargoAtual
    );

}


// =========================================================
// VERIFICAR NÍVEL MÍNIMO
//
// Exemplo:
// possuiNivelMinimo(perfil, "corregedor")
// =========================================================

export function possuiNivelMinimo(
    perfil,
    cargoMinimo
) {

    if (!perfil) {

        return false;

    }


    const cargoAtual =
        normalizarCargo(
            perfil.cargo
        );


    const minimo =
        normalizarCargo(
            cargoMinimo
        );


    const nivelAtual =
        NIVEL_CARGOS[
            cargoAtual
        ] || 0;


    const nivelMinimo =
        NIVEL_CARGOS[
            minimo
        ] || 0;


    return (
        nivelAtual >=
        nivelMinimo
    );

}


// =========================================================
// VERIFICAR PERMISSÃO PERSONALIZADA
//
// No Firestore o usuário poderá ter:
//
// permissoes: {
//     criarInquerito: true,
//     excluirInquerito: false
// }
//
// =========================================================

export function possuiPermissao(
    perfil,
    permissao
) {

    if (
        !perfil ||
        !permissao
    ) {

        return false;

    }


    const cargo =
        normalizarCargo(
            perfil.cargo
        );


    // Administrador e Corregedor-Geral
    // recebem acesso geral.

    if (
        cargo ===
        CARGOS.ADMINISTRADOR
        ||
        cargo ===
        CARGOS.CORREGEDOR_GERAL
    ) {

        return true;

    }


    const permissoes =
        perfil.permissoes ||
        {};


    return (
        permissoes[
            permissao
        ] === true
    );

}


// =========================================================
// APLICAR DADOS NA SIDEBAR / NAVBAR
// =========================================================

export function aplicarUsuarioNaInterface(
    perfil,
    usuarioFirebase = null
) {

    if (!perfil) {

        return;

    }


    const nome =
        perfil.nome ||
        perfil.nomeCompleto ||
        "Usuário";


    const cargo =
        formatarCargo(
            perfil.cargo
        );


    const foto =
        perfil.foto ||
        perfil.fotoUrl ||
        "";


    const avatar =
        document.getElementById(
            "sidebarAvatar"
        );


    const nomeElemento =
        document.getElementById(
            "sidebarUserName"
        );


    const cargoElemento =
        document.getElementById(
            "sidebarUserRole"
        );


    if (nomeElemento) {

        nomeElemento.textContent =
            nome;

    }


    if (cargoElemento) {

        cargoElemento.textContent =
            cargo;

    }


    if (avatar) {

        if (foto) {

            avatar.innerHTML =
                `<img
                    src="${escaparAtributo(foto)}"
                    alt="Foto de ${escaparAtributo(nome)}"
                >`;

        } else {

            avatar.textContent =
                gerarIniciais(
                    nome
                );

        }

    }


    // Outros elementos opcionais.

    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    nome;

            }
        );


    document
        .querySelectorAll(
            "[data-user-role]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    cargo;

            }
        );


    document
        .querySelectorAll(
            "[data-user-email]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    perfil.email ||
                    usuarioFirebase?.email ||
                    "";

            }
        );


    document
        .querySelectorAll(
            "[data-user-matricula]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    perfil.matricula ||
                    "-";

            }
        );

}


// =========================================================
// PERMISSÕES VISUAIS
//
// Exemplos HTML:
//
// data-cargos="administrador,corregedor_geral"
//
// data-permissao="excluirInquerito"
//
// data-nivel-minimo="corregedor"
// =========================================================

export function aplicarPermissoesVisuais(
    perfil
) {

    if (!perfil) {

        return;

    }


    // =====================================================
    // POR CARGO
    // =====================================================

    document
        .querySelectorAll(
            "[data-cargos]"
        )
        .forEach(
            elemento => {

                const cargos =
                    elemento
                        .dataset
                        .cargos
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean);


                const permitido =
                    usuarioPossuiCargo(
                        perfil,
                        cargos
                    );


                elemento.classList.toggle(
                    "hidden",
                    !permitido
                );

            }
        );


    // =====================================================
    // POR NÍVEL
    // =====================================================

    document
        .querySelectorAll(
            "[data-nivel-minimo]"
        )
        .forEach(
            elemento => {

                const nivel =
                    elemento
                        .dataset
                        .nivelMinimo;


                const permitido =
                    possuiNivelMinimo(
                        perfil,
                        nivel
                    );


                elemento.classList.toggle(
                    "hidden",
                    !permitido
                );

            }
        );


    // =====================================================
    // POR PERMISSÃO
    // =====================================================

    document
        .querySelectorAll(
            "[data-permissao]"
        )
        .forEach(
            elemento => {

                const permissao =
                    elemento
                        .dataset
                        .permissao;


                const permitido =
                    possuiPermissao(
                        perfil,
                        permissao
                    );


                elemento.classList.toggle(
                    "hidden",
                    !permitido
                );

            }
        );

}


// =========================================================
// CONFIGURAR LOGOUT
// =========================================================

export function configurarLogout() {

    const botao =
        document.getElementById(
            "logoutButton"
        );


    if (!botao) {

        return;

    }


    // Evita registrar o evento várias vezes.

    if (
        botao.dataset
            .logoutConfigurado ===
        "true"
    ) {

        return;

    }


    botao.dataset
        .logoutConfigurado =
        "true";


    botao.addEventListener(
        "click",
        async () => {

            const confirmar =
                window.confirm(
                    "Deseja realmente sair do SIGCOR?"
                );


            if (!confirmar) {

                return;

            }


            await sair();

        }
    );

}


// =========================================================
// LOGOUT
// =========================================================

export async function sair() {

    try {

        await signOut(
            auth
        );

    } catch (erro) {

        console.error(
            "Erro ao realizar logout:",
            erro
        );

    } finally {

        usuarioFirebaseAtual =
            null;

        perfilAtual =
            null;

        autenticacaoResolvida =
            false;


        limparSessaoLocal();


        redirecionarLogin();

    }

}


// =========================================================
// REDIRECIONAR PARA LOGIN
// =========================================================

export function redirecionarLogin() {

    // Impede loop caso o arquivo seja
    // usado acidentalmente no index.html.

    const pagina =
        window.location.pathname
            .split("/")
            .pop();


    if (
        pagina === "" ||
        pagina === "index.html"
    ) {

        return;

    }


    window.location.replace(
        PAGINA_LOGIN
    );

}


// =========================================================
// SEM PERMISSÃO
// =========================================================

function paginaSemPermissao() {

    document.body.innerHTML = `

        <main
            style="
                min-height:100vh;
                display:grid;
                place-items:center;
                padding:25px;
                background:#080c14;
                color:#f8fafc;
                font-family:Inter,Arial,sans-serif;
            "
        >

            <div
                style="
                    width:min(470px,100%);
                    padding:30px;
                    text-align:center;
                    background:#121b2a;
                    border:1px solid rgba(148,163,184,.11);
                    border-radius:18px;
                "
            >

                <div
                    style="
                        width:58px;
                        height:58px;
                        display:grid;
                        place-items:center;
                        margin:0 auto 16px;
                        color:#d4af37;
                        background:rgba(212,175,55,.08);
                        border:1px solid rgba(212,175,55,.2);
                        border-radius:15px;
                        font-size:22px;
                    "
                >
                    !
                </div>

                <h1
                    style="
                        margin-bottom:8px;
                        font-size:21px;
                    "
                >
                    Acesso não autorizado
                </h1>

                <p
                    style="
                        margin-bottom:20px;
                        color:#94a3b8;
                        font-size:12px;
                        line-height:1.6;
                    "
                >
                    Seu cargo não possui autorização
                    para acessar esta área do SIGCOR.
                </p>

                <a
                    href="./dashboard.html"
                    style="
                        min-height:42px;
                        padding:0 17px;
                        display:inline-flex;
                        align-items:center;
                        justify-content:center;
                        color:#111;
                        background:#d4af37;
                        border-radius:9px;
                        font-size:11px;
                        font-weight:700;
                        text-decoration:none;
                    "
                >
                    Voltar ao Dashboard
                </a>

            </div>

        </main>

    `;

}


// =========================================================
// FORMATAR CARGO
// =========================================================

export function formatarCargo(
    cargo
) {

    const cargoNormalizado =
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
        mapa[cargoNormalizado] ||
        cargo ||
        "Usuário"
    );

}


// =========================================================
// GERAR INICIAIS
// =========================================================

export function gerarIniciais(
    nome
) {

    if (!nome) {

        return "CG";

    }


    const partes =
        String(nome)

            .trim()

            .split(/\s+/)

            .filter(Boolean);


    if (
        partes.length === 0
    ) {

        return "CG";

    }


    if (
        partes.length === 1
    ) {

        return partes[0]
            .substring(
                0,
                2
            )
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[
            partes.length - 1
        ][0]
    ).toUpperCase();

}


// =========================================================
// ESCAPAR ATRIBUTO HTML
// =========================================================

function escaparAtributo(
    valor
) {

    return String(
        valor || ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        );

}


// =========================================================
// INICIALIZAÇÃO AUTOMÁTICA
//
// Pode ser desativada colocando:
//
// data-auth-auto="false"
//
// no <body>.
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            document.body
                ?.dataset
                ?.authAuto ===
            "false"
        ) {

            return;

        }


        // Não protege automaticamente
        // a tela de login.

        const pagina =
            window.location.pathname
                .split("/")
                .pop();


        if (
            pagina === "" ||
            pagina ===
                "index.html"
        ) {

            return;

        }


        const resultado =
            await protegerPagina();


        if (!resultado) {

            return;

        }


        configurarLogout();

    }
);