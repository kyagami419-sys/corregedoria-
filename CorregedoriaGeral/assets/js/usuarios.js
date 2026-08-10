// ==========================================================
// SIGCOR
// assets/js/usuarios.js
//
// Gerenciamento de usuários
// ==========================================================

import {
    auth,
    db
} from "../../firebase/firebase.js";


import {
    protegerPagina,
    logout,
    gerarIniciais,
    possuiPermissao,
    normalizarCargo
} from "../../firebase/auth.js";


import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

const CONFIG = {

    colecao:
        "usuarios",

    usuariosPorPagina:
        8

};


// ==========================================================
// ESTADO
// ==========================================================

let usuarioLogado =
    null;

let perfilLogado =
    null;

let usuarios =
    [];

let usuariosFiltrados =
    [];

let paginaAtual =
    1;

let usuarioEditandoId =
    null;

let usuarioParaExcluir =
    null;


// ==========================================================
// ELEMENTOS
// ==========================================================

const elementos = {

    // Perfil sidebar

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


    // Estatísticas

    totalUsuarios:
        document.getElementById(
            "totalUsuarios"
        ),

    totalUsuariosAtivos:
        document.getElementById(
            "totalUsuariosAtivos"
        ),

    totalUsuariosInativos:
        document.getElementById(
            "totalUsuariosInativos"
        ),

    totalAdministradores:
        document.getElementById(
            "totalAdministradores"
        ),


    // Pesquisa / filtros

    pesquisa:
        document.getElementById(
            "usuariosSearch"
        ),

    filtroCargo:
        document.getElementById(
            "filtroCargo"
        ),

    filtroStatus:
        document.getElementById(
            "filtroStatus"
        ),

    filtroDepartamento:
        document.getElementById(
            "filtroDepartamento"
        ),

    limparFiltros:
        document.getElementById(
            "limparFiltros"
        ),


    // Tabela

    tabela:
        document.getElementById(
            "usuariosTableBody"
        ),

    resultadoTexto:
        document.getElementById(
            "usuariosResultadoTexto"
        ),

    vazio:
        document.getElementById(
            "usuariosEmpty"
        ),


    // Paginação

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
        ),


    // Atualizar

    refreshUsers:
        document.getElementById(
            "refreshUsers"
        ),


    // Modal usuário

    novoUsuarioButton:
        document.getElementById(
            "novoUsuarioButton"
        ),

    usuarioModal:
        document.getElementById(
            "usuarioModal"
        ),

    usuarioModalClose:
        document.getElementById(
            "usuarioModalClose"
        ),

    usuarioModalTitle:
        document.getElementById(
            "usuarioModalTitle"
        ),

    usuarioModalSubtitle:
        document.getElementById(
            "usuarioModalSubtitle"
        ),

    usuarioForm:
        document.getElementById(
            "usuarioForm"
        ),

    cancelarUsuarioButton:
        document.getElementById(
            "cancelarUsuarioButton"
        ),

    salvarUsuarioButton:
        document.getElementById(
            "salvarUsuarioButton"
        ),


    // Campos

    usuarioId:
        document.getElementById(
            "usuarioId"
        ),

    usuarioNome:
        document.getElementById(
            "usuarioNome"
        ),

    usuarioEmail:
        document.getElementById(
            "usuarioEmail"
        ),

usuarioSenha:
    document.getElementById(
        "usuarioSenha"
    ),

usuarioConfirmarSenha:
    document.getElementById(
        "usuarioConfirmarSenha"
    ),


    usuarioMatricula:
        document.getElementById(
            "usuarioMatricula"
        ),

    usuarioFoto:
        document.getElementById(
            "usuarioFoto"
        ),

    usuarioDepartamento:
        document.getElementById(
            "usuarioDepartamento"
        ),

    usuarioCargo:
        document.getElementById(
            "usuarioCargo"
        ),

    usuarioStatus:
        document.getElementById(
            "usuarioStatus"
        ),

    usuarioPhotoPreview:
        document.getElementById(
            "usuarioPhotoPreview"
        ),


    // Permissões

    permGerenciarUsuarios:
        document.getElementById(
            "permGerenciarUsuarios"
        ),

    permCriarInquerito:
        document.getElementById(
            "permCriarInquerito"
        ),

    permEditarInquerito:
        document.getElementById(
            "permEditarInquerito"
        ),

    permFinalizarInquerito:
        document.getElementById(
            "permFinalizarInquerito"
        ),

    permAdicionarEvidencias:
        document.getElementById(
            "permAdicionarEvidencias"
        ),

    permVerLogs:
        document.getElementById(
            "permVerLogs"
        ),


    // Confirmação

    confirmModal:
        document.getElementById(
            "confirmUsuarioModal"
        ),

    confirmTitle:
        document.getElementById(
            "confirmUsuarioTitle"
        ),

    confirmMessage:
        document.getElementById(
            "confirmUsuarioMessage"
        ),

    confirmCancel:
        document.getElementById(
            "confirmUsuarioCancel"
        ),

    confirmAccept:
        document.getElementById(
            "confirmUsuarioAccept"
        ),


    // Toast

    toastContainer:
        document.getElementById(
            "toastContainer"
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
            "SIGCOR: carregando módulo de usuários..."
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


        preencherPerfilLogado();


        // ==================================================
        // PERMISSÃO
        // ==================================================

        if (
            !podeGerenciarUsuarios()
        ) {

            mostrarToast(
                "Você não possui permissão para gerenciar usuários.",
                "error"
            );


            elementos.novoUsuarioButton
                ?.setAttribute(
                    "disabled",
                    "disabled"
                );

        }


        configurarEventos();


        await carregarUsuarios();


        window.lucide
            ?.createIcons();


        console.log(
            "SIGCOR: módulo de usuários carregado."
        );

    } catch (erro) {

        console.error(
            "SIGCOR - Erro ao iniciar usuários:",
            erro
        );


        mostrarToast(
            "Não foi possível carregar o módulo de usuários.",
            "error"
        );

    }

}


// ==========================================================
// PERMISSÕES
// ==========================================================

function podeGerenciarUsuarios() {

    if (!perfilLogado) {

        return false;

    }


    const cargo =
        normalizarCargo(
            perfilLogado.cargo
        );


    if (
        cargo ===
        "administrador"
    ) {

        return true;

    }


    if (
        cargo ===
        "corregedor_geral"
    ) {

        return true;

    }


    return possuiPermissao(
        perfilLogado,
        "gerenciarUsuarios"
    );

}


// ==========================================================
// PERFIL DA SIDEBAR
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
// CARREGAR USUÁRIOS
// ==========================================================

async function carregarUsuarios() {

    definirCarregandoTabela();


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    CONFIG.colecao
                )
            );


        usuarios =
            snapshot.docs.map(
                documento => ({

                    id:
                        documento.id,

                    uid:
                        documento.id,

                    ...documento.data()

                })
            );


        usuarios.sort(
            (
                a,
                b
            ) => {

                return String(
                    a.nome ||
                    ""
                ).localeCompare(
                    String(
                        b.nome ||
                        ""
                    ),
                    "pt-BR"
                );

            }
        );


        atualizarEstatisticas();


        aplicarFiltros();


    } catch (erro) {

        console.error(
            "SIGCOR - Erro ao carregar usuários:",
            erro
        );


        elementos.tabela.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:50px;
                        color:#ff7370;
                    "
                >

                    Não foi possível carregar
                    os usuários do Firestore.

                </td>

            </tr>

        `;


        mostrarToast(
            "Erro ao consultar usuários.",
            "error"
        );

    }

}


// ==========================================================
// LOADING
// ==========================================================

function definirCarregandoTabela() {

    if (
        !elementos.tabela
    ) {

        return;

    }


    elementos.tabela.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="usuarios-loading-cell"
            >

                <div class="usuarios-loading">

                    <span class="loading-spinner"></span>

                    <span>
                        Carregando usuários...
                    </span>

                </div>

            </td>

        </tr>

    `;


    elementos.vazio.hidden =
        true;

}


// ==========================================================
// ESTATÍSTICAS
// ==========================================================

function atualizarEstatisticas() {

    const total =
        usuarios.length;


    const ativos =
        usuarios.filter(
            usuario =>
                normalizar(
                    usuario.status
                ) ===
                "ativo"
        ).length;


    const inativos =
        usuarios.filter(
            usuario => {

                const status =
                    normalizar(
                        usuario.status
                    );


                return (
                    status === "inativo" ||
                    status === "suspenso"
                );

            }
        ).length;


    const administradores =
        usuarios.filter(
            usuario =>
                normalizarCargo(
                    usuario.cargo
                ) ===
                "administrador"
        ).length;


    atualizarNumero(
        elementos.totalUsuarios,
        total
    );


    atualizarNumero(
        elementos.totalUsuariosAtivos,
        ativos
    );


    atualizarNumero(
        elementos.totalUsuariosInativos,
        inativos
    );


    atualizarNumero(
        elementos.totalAdministradores,
        administradores
    );

}


// ==========================================================
// ATUALIZAR NÚMERO
// ==========================================================

function atualizarNumero(
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
// FILTROS
// ==========================================================

function aplicarFiltros() {

    const pesquisa =
        normalizarPesquisa(
            elementos.pesquisa?.value
        );


    const cargo =
        normalizarCargo(
            elementos.filtroCargo?.value
        );


    const status =
        normalizar(
            elementos.filtroStatus?.value
        );


    const departamento =
        normalizarPesquisa(
            elementos.filtroDepartamento?.value
        );


    usuariosFiltrados =
        usuarios.filter(
            usuario => {

                // ==========================================
                // PESQUISA
                // ==========================================

                const alvoPesquisa =
                    normalizarPesquisa(
                        [

                            usuario.nome,
                            usuario.email,
                            usuario.matricula,
                            usuario.departamento,
                            usuario.cargo

                        ].join(
                            " "
                        )
                    );


                if (
                    pesquisa &&
                    !alvoPesquisa.includes(
                        pesquisa
                    )
                ) {

                    return false;

                }


                // ==========================================
                // CARGO
                // ==========================================

                if (
                    cargo &&
                    normalizarCargo(
                        usuario.cargo
                    ) !==
                    cargo
                ) {

                    return false;

                }


                // ==========================================
                // STATUS
                // ==========================================

                if (
                    status &&
                    normalizar(
                        usuario.status
                    ) !==
                    status
                ) {

                    return false;

                }


                // ==========================================
                // DEPARTAMENTO
                // ==========================================

                if (
                    departamento &&
                    normalizarPesquisa(
                        usuario.departamento
                    ) !==
                    departamento
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
// RENDERIZAR
// ==========================================================

function renderizarTabela() {

    if (
        !elementos.tabela
    ) {

        return;

    }


    const total =
        usuariosFiltrados.length;


    if (
        elementos.resultadoTexto
    ) {

        elementos.resultadoTexto.textContent =
            total === 1
                ?
                "1 usuário encontrado"
                :
                `${total} usuários encontrados`;

    }


    if (
        total ===
        0
    ) {

        elementos.tabela.innerHTML =
            "";


        elementos.vazio.hidden =
            false;


        atualizarPaginacao(
            0,
            0,
            0
        );


        return;

    }


    elementos.vazio.hidden =
        true;


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                total /
                CONFIG.usuariosPorPagina
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
        ) *
        CONFIG.usuariosPorPagina;


    const fim =
        Math.min(
            inicio +
            CONFIG.usuariosPorPagina,
            total
        );


    const pagina =
        usuariosFiltrados.slice(
            inicio,
            fim
        );


    elementos.tabela.innerHTML =
        pagina
            .map(
                criarLinhaUsuario
            )
            .join(
                ""
            );


    configurarAcoesTabela();


    atualizarPaginacao(
        inicio + 1,
        fim,
        total
    );


    window.lucide
        ?.createIcons();

}


// ==========================================================
// LINHA
// ==========================================================

function criarLinhaUsuario(
    usuario
) {

    const nome =
        usuario.nome ||
        "Sem nome";


    const email =
        usuario.email ||
        "-";


    const foto =
        String(
            usuario.foto ||
            ""
        ).trim();


    const avatar =
        foto
            ?
            `

            <img
                src="${escaparHTML(foto)}"
                alt=""
            >

            `
            :
            escaparHTML(
                gerarIniciais(
                    nome
                )
            );


    const status =
        normalizar(
            usuario.status ||
            "inativo"
        );


    const podeEditar =
        podeGerenciarUsuarios();


    const ehProprioUsuario =
        usuario.id ===
        usuarioLogado?.uid;


    return `

        <tr>

            <td>

                <div class="usuario-table-profile">

                    <div class="usuario-table-avatar">

                        ${avatar}

                    </div>


                    <div class="usuario-table-info">

                        <strong>
                            ${escaparHTML(nome)}
                        </strong>

                        <span>
                            ${escaparHTML(email)}
                        </span>

                    </div>

                </div>

            </td>


            <td>

                ${escaparHTML(
                    usuario.matricula ||
                    "-"
                )}

            </td>


            <td>

                ${escaparHTML(
                    usuario.departamento ||
                    "-"
                )}

            </td>


            <td>

                <span class="usuario-badge usuario-badge-cargo">

                    ${escaparHTML(
                        nomeCargo(
                            usuario.cargo
                        )
                    )}

                </span>

            </td>


            <td>

                <span
                    class="
                        usuario-badge
                        usuario-badge-status
                        ${escaparHTML(status)}
                    "
                >

                    ${escaparHTML(
                        nomeStatus(
                            status
                        )
                    )}

                </span>

            </td>


            <td>

                ${formatarDataHora(
                    usuario.ultimoAcesso
                )}

            </td>


            <td>

                <div class="usuario-actions">

                    <button
                        type="button"
                        class="usuario-action editar-usuario"
                        data-id="${escaparHTML(usuario.id)}"
                        title="Editar usuário"
                        ${podeEditar ? "" : "disabled"}
                    >

                        <i data-lucide="pencil"></i>

                    </button>


                    <button
                        type="button"
                        class="usuario-action delete excluir-usuario"
                        data-id="${escaparHTML(usuario.id)}"
                        title="${
                            ehProprioUsuario
                                ?
                                "Você não pode excluir sua própria conta"
                                :
                                "Remover perfil"
                        }"
                        ${
                            !podeEditar ||
                            ehProprioUsuario
                                ?
                                "disabled"
                                :
                                ""
                        }
                    >

                        <i data-lucide="trash-2"></i>

                    </button>

                </div>

            </td>

        </tr>

    `;

}


// ==========================================================
// AÇÕES DA TABELA
// ==========================================================

function configurarAcoesTabela() {

    document
        .querySelectorAll(
            ".editar-usuario"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        abrirEditarUsuario(
                            botao.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".excluir-usuario"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        solicitarExclusao(
                            botao.dataset.id
                        );

                    }
                );

            }
        );

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
                CONFIG.usuariosPorPagina
            )
        );


    elementos.paginationCurrent.textContent =
        `Página ${paginaAtual}`;


    elementos.paginationPrevious.disabled =
        paginaAtual <= 1;


    elementos.paginationNext.disabled =
        paginaAtual >= totalPaginas ||
        total === 0;

}


// ==========================================================
// ABRIR NOVO
// ==========================================================

function abrirNovoUsuario() {

    if (
        !podeGerenciarUsuarios()
    ) {

        mostrarToast(
            "Você não possui permissão.",
            "error"
        );

        return;

    }


    usuarioEditandoId =
        null;


    limparFormulario();


    elementos.usuarioModalTitle.textContent =
        "Novo usuário";


    elementos.usuarioModalSubtitle.textContent =
        "Cadastre um novo perfil de acesso ao SIGCOR.";


    elementos.usuarioModal
        .classList
        .add(
            "show"
        );


    elementos.usuarioModal
        .setAttribute(
            "aria-hidden",
            "false"
        );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            elementos.usuarioNome
                ?.focus();

        },
        100
    );

}


// ==========================================================
// EDITAR
// ==========================================================

function abrirEditarUsuario(
    id
) {

    if (
        !podeGerenciarUsuarios()
    ) {

        return;

    }


    const usuario =
        usuarios.find(
            item =>
                item.id ===
                id
        );


    if (!usuario) {

        mostrarToast(
            "Usuário não encontrado.",
            "error"
        );

        return;

    }


    usuarioEditandoId =
        usuario.id;


    elementos.usuarioId.value =
        usuario.id;


        elementos.usuarioSenha.value =
    "";

elementos.usuarioConfirmarSenha.value =
    "";

    elementos.usuarioNome.value =
        usuario.nome ||
        "";


    elementos.usuarioEmail.value =
        usuario.email ||
        "";


    elementos.usuarioMatricula.value =
        usuario.matricula ||
        "";


    elementos.usuarioFoto.value =
        usuario.foto ||
        "";


    elementos.usuarioDepartamento.value =
        usuario.departamento ||
        "";


    elementos.usuarioCargo.value =
        normalizarCargo(
            usuario.cargo
        );


    elementos.usuarioStatus.value =
        normalizar(
            usuario.status ||
            "ativo"
        );


    const permissoes =
        usuario.permissoes ||
        {};


    elementos.permGerenciarUsuarios.checked =
        permissoes.gerenciarUsuarios ===
        true;


    elementos.permCriarInquerito.checked =
        permissoes.criarInquerito ===
        true;


    elementos.permEditarInquerito.checked =
        permissoes.editarInquerito ===
        true;


    elementos.permFinalizarInquerito.checked =
        permissoes.finalizarInquerito ===
        true;


    elementos.permAdicionarEvidencias.checked =
        permissoes.adicionarEvidencias ===
        true;


    elementos.permVerLogs.checked =
        permissoes.verLogs ===
        true;


    atualizarPreviewFoto();


    elementos.usuarioModalTitle.textContent =
        "Editar usuário";


    elementos.usuarioModalSubtitle.textContent =
        "Atualize os dados e permissões deste perfil.";


    elementos.usuarioModal
        .classList
        .add(
            "show"
        );


    elementos.usuarioModal
        .setAttribute(
            "aria-hidden",
            "false"
        );


    document.body.style.overflow =
        "hidden";


    window.lucide
        ?.createIcons();

}


// ==========================================================
// FECHAR MODAL
// ==========================================================

function fecharModalUsuario() {

    elementos.usuarioModal
        ?.classList
        .remove(
            "show"
        );


    elementos.usuarioModal
        ?.setAttribute(
            "aria-hidden",
            "true"
        );


    document.body.style.overflow =
        "";


    usuarioEditandoId =
        null;

}


// ==========================================================
// LIMPAR FORM
// ==========================================================

function limparFormulario() {

    elementos.usuarioForm
        ?.reset();


    elementos.usuarioId.value =
        "";


    elementos.usuarioStatus.value =
        "ativo";


    elementos.usuarioPhotoPreview.textContent =
        "US";


    removerErrosFormulario();

}


// ==========================================================
// PREVIEW FOTO
// ==========================================================

function atualizarPreviewFoto() {

    const foto =
        String(
            elementos.usuarioFoto?.value ||
            ""
        ).trim();


    const nome =
        elementos.usuarioNome?.value ||
        "Usuário";


    if (!foto) {

        elementos.usuarioPhotoPreview.textContent =
            gerarIniciais(
                nome
            );

        return;

    }


    elementos.usuarioPhotoPreview.innerHTML = `

        <img
            src="${escaparHTML(foto)}"
            alt="Preview"
        >

    `;

}


// ==========================================================
// SALVAR
// ==========================================================

async function salvarUsuario(
    evento
) {

    evento.preventDefault();


    if (
        !podeGerenciarUsuarios()
    ) {

        mostrarToast(
            "Você não possui permissão.",
            "error"
        );

        return;

    }


    removerErrosFormulario();


    if (
        !validarFormulario()
    ) {

        mostrarToast(
            "Preencha os campos obrigatórios.",
            "warning"
        );

        return;

    }


    const dados = {

        nome:
            elementos.usuarioNome.value
                .trim(),

        email:
            elementos.usuarioEmail.value
                .trim()
                .toLowerCase(),

        matricula:
            elementos.usuarioMatricula.value
                .trim(),

        foto:
            elementos.usuarioFoto.value
                .trim(),

        departamento:
            elementos.usuarioDepartamento.value,

        cargo:
            elementos.usuarioCargo.value,

        status:
            elementos.usuarioStatus.value,

        permissoes: {

            gerenciarUsuarios:
                elementos
                    .permGerenciarUsuarios
                    .checked,

            criarInquerito:
                elementos
                    .permCriarInquerito
                    .checked,

            editarInquerito:
                elementos
                    .permEditarInquerito
                    .checked,

            finalizarInquerito:
                elementos
                    .permFinalizarInquerito
                    .checked,

            adicionarEvidencias:
                elementos
                    .permAdicionarEvidencias
                    .checked,

            verLogs:
                elementos
                    .permVerLogs
                    .checked

        },

        atualizadoEm:
            serverTimestamp()

    };


    definirSalvando(
        true
    );


    try {

        // ==================================================
        // EDITAR PERFIL EXISTENTE
        // ==================================================

        if (usuarioEditandoId) {

    const usuarioAtual =
        auth.currentUser;

    if (!usuarioAtual) {

        throw new Error(
            "Sua sessão expirou. Faça login novamente."
        );

    }


    const token =
        await usuarioAtual.getIdToken();


    const resposta =
        await fetch(
            `https://corregedoriapf.discloud.app/api/usuarios/${usuarioEditandoId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify({
                        nome:
                            dados.nome,

                        email:
                            dados.email,

                        matricula:
                            dados.matricula,

                        departamento:
                            dados.departamento,

                        cargo:
                            dados.cargo,

                        status:
                            dados.status,

                        foto:
                            dados.foto,

                        permissoes:
                            dados.permissoes
                    })
            }
        );


    const resultado =
        await resposta.json();


    if (!resposta.ok) {

        throw new Error(
            resultado.erro ||
            "Não foi possível atualizar o usuário."
        );

    }

// ==========================================================
// ALTERAR SENHA - SOMENTE SE FOI PREENCHIDA
// ==========================================================

const novaSenha =
    String(
        elementos.usuarioSenha?.value ||
        ""
    );

const confirmarNovaSenha =
    String(
        elementos.usuarioConfirmarSenha?.value ||
        ""
    );

if (
    novaSenha ||
    confirmarNovaSenha
) {

    if (novaSenha.length < 6) {

        throw new Error(
            "A nova senha precisa ter pelo menos 6 caracteres."
        );

    }

    if (
        novaSenha !== confirmarNovaSenha
    ) {

        throw new Error(
            "As senhas não coincidem."
        );

    }

    const respostaSenha =
        await fetch(
            `https://corregedoriapf.discloud.app/api/usuarios/${usuarioEditandoId}/senha`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify({
                        senha:
                            novaSenha
                    })
            }
        );

    const resultadoSenha =
        await respostaSenha.json();

    if (!respostaSenha.ok) {

        throw new Error(
            resultadoSenha.erro ||
            "Não foi possível alterar a senha."
        );

    }

}
    mostrarToast(
        "Usuário atualizado com sucesso.",
        "success"
    );


    fecharModalUsuario();

    await carregarUsuarios();

    return;
}


        // ==================================================
        // NOVO USUÁRIO
        // ==================================================
       
        const senha =
    elementos.usuarioSenha.value;

const confirmarSenha =
    elementos.usuarioConfirmarSenha.value;


// Confere novamente as senhas
if (senha !== confirmarSenha) {

    mostrarToast(
        "As senhas não coincidem.",
        "warning"
    );

    return;
}


// Pega o token da conta que está administrando o SIGCOR
const usuarioAtual =
    auth.currentUser;

if (!usuarioAtual) {

    throw new Error(
        "Sua sessão expirou. Faça login novamente."
    );

}

const token =
    await usuarioAtual.getIdToken();


// Envia o novo usuário para a API SIGCOR
const resposta =
    await fetch(
        "https://corregedoriapf.discloud.app/api/usuarios",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                nome: dados.nome,
                email: dados.email,
                senha: senha,
                matricula: dados.matricula,
                departamento: dados.departamento,
                cargo: dados.cargo,
                status: dados.status,
                foto: dados.foto,
                permissoes: dados.permissoes
            })
        }
    );


const resultado =
    await resposta.json();


if (!resposta.ok) {

    throw new Error(
        resultado.erro ||
        "Não foi possível criar o usuário."
    );

}


mostrarToast(
    "Usuário criado com sucesso.",
    "success"
);


fecharModalUsuario();

await carregarUsuarios();

return;

    } catch (erro) {

        console.error(
            "SIGCOR - Salvar usuário:",
            erro
        );


        mostrarToast(
            traduzirErro(
                erro
            ),
            "error"
        );

    } finally {

        definirSalvando(
            false
        );

    }

}


// ==========================================================
// SALVANDO
// ==========================================================

function definirSalvando(
    ativo
) {

    if (
        !elementos.salvarUsuarioButton
    ) {

        return;

    }


    elementos.salvarUsuarioButton.disabled =
        ativo;


    const texto =
        elementos.salvarUsuarioButton
            .querySelector(
                "span"
            );


    if (texto) {

        texto.textContent =
            ativo
                ?
                "Salvando..."
                :
                "Salvar usuário";

    }

}


// ==========================================================
// VALIDAR FORM
// ==========================================================

function validarFormulario() {

    const campos = [

        elementos.usuarioNome,
        elementos.usuarioEmail,
        elementos.usuarioMatricula,
        elementos.usuarioDepartamento,
        elementos.usuarioCargo,
        elementos.usuarioStatus

    ];


    let valido =
        true;


    campos.forEach(
        campo => {

            if (
                !String(
                    campo?.value ||
                    ""
                ).trim()
            ) {

                campo
                    ?.classList
                    .add(
                        "input-error"
                    );


                valido =
                    false;

            }

        }
    );


    const email =
        elementos.usuarioEmail.value
            .trim();


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(
                email
            )
    ) {

        elementos.usuarioEmail
            .classList
            .add(
                "input-error"
            );


        valido =
            false;

    }

// ==========================================================
// VALIDAR SENHA - SOMENTE NOVO USUÁRIO
// ==========================================================

if (!usuarioEditandoId) {

    const senha =
        String(
            elementos.usuarioSenha?.value || ""
        );

    const confirmarSenha =
        String(
            elementos.usuarioConfirmarSenha?.value || ""
        );


    // Mínimo de 6 caracteres
    if (senha.length < 6) {

        elementos.usuarioSenha
            ?.classList
            .add("input-error");

        valido = false;

    }


    // Confirmação obrigatória
    if (confirmarSenha.length < 6) {

        elementos.usuarioConfirmarSenha
            ?.classList
            .add("input-error");

        valido = false;

    }


    // Senhas precisam ser iguais
    if (
        senha &&
        confirmarSenha &&
        senha !== confirmarSenha
    ) {

        elementos.usuarioSenha
            ?.classList
            .add("input-error");

        elementos.usuarioConfirmarSenha
            ?.classList
            .add("input-error");

        valido = false;

    }

}
    return valido;

}


// ==========================================================
// REMOVER ERROS
// ==========================================================

function removerErrosFormulario() {

    elementos.usuarioForm
        ?.querySelectorAll(
            ".input-error"
        )
        .forEach(
            elemento => {

                elemento.classList.remove(
                    "input-error"
                );

            }
        );

}


// ==========================================================
// SOLICITAR EXCLUSÃO
// ==========================================================

function solicitarExclusao(
    id
) {

    if (
        !podeGerenciarUsuarios()
    ) {

        return;

    }


    if (
        id ===
        usuarioLogado?.uid
    ) {

        mostrarToast(
            "Você não pode remover seu próprio perfil.",
            "warning"
        );

        return;

    }


    const usuario =
        usuarios.find(
            item =>
                item.id ===
                id
        );


    if (!usuario) {

        return;

    }


    usuarioParaExcluir =
        usuario;


    elementos.confirmTitle.textContent =
        "Remover perfil";


    elementos.confirmMessage.textContent =
        `Deseja remover o perfil de ${usuario.nome || "este usuário"} do SIGCOR?`;


    elementos.confirmModal
        .classList
        .add(
            "show"
        );


    elementos.confirmModal
        .setAttribute(
            "aria-hidden",
            "false"
        );

}


// ==========================================================
// CANCELAR EXCLUSÃO
// ==========================================================

function cancelarExclusao() {

    usuarioParaExcluir =
        null;


    elementos.confirmModal
        .classList
        .remove(
            "show"
        );


    elementos.confirmModal
        .setAttribute(
            "aria-hidden",
            "true"
        );

}


// ==========================================================
// CONFIRMAR EXCLUSÃO
// ==========================================================

async function confirmarExclusao() {

    if (
        !usuarioParaExcluir
    ) {

        return;

    }


    if (
        usuarioParaExcluir.id ===
        usuarioLogado?.uid
    ) {

        cancelarExclusao();

        return;

    }


    const usuario =
        usuarioParaExcluir;


    elementos.confirmAccept.disabled =
        true;


    try {

        // ==================================================
        // IMPORTANTE
        // ==================================================
        //
        // Aqui removemos o PERFIL do Firestore.
        //
        // A conta Firebase Authentication será removida
        // pela função administrativa que faremos depois.
        // ==================================================

        const usuarioAtual =
    auth.currentUser;

if (!usuarioAtual) {

    throw new Error(
        "Sua sessão expirou. Faça login novamente."
    );

}


const token =
    await usuarioAtual.getIdToken();


const resposta =
    await fetch(
        `https://corregedoriapf.discloud.app/api/usuarios/${usuario.id}`,
        {
            method: "DELETE",

            headers: {
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );


const resultado =
    await resposta.json();


if (!resposta.ok) {

    throw new Error(
        resultado.erro ||
        "Não foi possível excluir o usuário."
    );

}


        mostrarToast(
            "Perfil removido do SIGCOR.",
            "success"
        );


        cancelarExclusao();


        await carregarUsuarios();


    } catch (erro) {

        console.error(
            "SIGCOR - Excluir usuário:",
            erro
        );


        mostrarToast(
            traduzirErro(
                erro
            ),
            "error"
        );

    } finally {

        elementos.confirmAccept.disabled =
            false;

    }

}


// ==========================================================
// CONFIGURAR EVENTOS
// ==========================================================

function configurarEventos() {

    // Logout

    elementos.logoutButton
        ?.addEventListener(
            "click",
            logout
        );


    // Novo usuário

    elementos.novoUsuarioButton
        ?.addEventListener(
            "click",
            abrirNovoUsuario
        );


    // Fechar modal

    elementos.usuarioModalClose
        ?.addEventListener(
            "click",
            fecharModalUsuario
        );


    elementos.cancelarUsuarioButton
        ?.addEventListener(
            "click",
            fecharModalUsuario
        );


    // Formulário

    elementos.usuarioForm
        ?.addEventListener(
            "submit",
            salvarUsuario
        );


    // Preview

    elementos.usuarioFoto
        ?.addEventListener(
            "input",
            atualizarPreviewFoto
        );


    elementos.usuarioNome
        ?.addEventListener(
            "input",
            () => {

                if (
                    !elementos.usuarioFoto
                        .value
                        .trim()
                ) {

                    atualizarPreviewFoto();

                }

            }
        );


    // Pesquisa

    elementos.pesquisa
        ?.addEventListener(
            "input",
            aplicarFiltros
        );


    // Filtros

    elementos.filtroCargo
        ?.addEventListener(
            "change",
            aplicarFiltros
        );


    elementos.filtroStatus
        ?.addEventListener(
            "change",
            aplicarFiltros
        );


    elementos.filtroDepartamento
        ?.addEventListener(
            "change",
            aplicarFiltros
        );


    // Limpar

    elementos.limparFiltros
        ?.addEventListener(
            "click",
            () => {

                elementos.pesquisa.value =
                    "";

                elementos.filtroCargo.value =
                    "";

                elementos.filtroStatus.value =
                    "";

                elementos.filtroDepartamento.value =
                    "";


                aplicarFiltros();

            }
        );


    // Atualizar

    elementos.refreshUsers
        ?.addEventListener(
            "click",
            carregarUsuarios
        );


    // Paginação anterior

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


    // Paginação próxima

    elementos.paginationNext
        ?.addEventListener(
            "click",
            () => {

                const totalPaginas =
                    Math.ceil(
                        usuariosFiltrados.length /
                        CONFIG.usuariosPorPagina
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


    // Confirmação

    elementos.confirmCancel
        ?.addEventListener(
            "click",
            cancelarExclusao
        );


    elementos.confirmAccept
        ?.addEventListener(
            "click",
            confirmarExclusao
        );


    // Clicar fora do modal

    elementos.usuarioModal
        ?.addEventListener(
            "click",
            evento => {

                if (
                    evento.target ===
                    elementos.usuarioModal
                ) {

                    fecharModalUsuario();

                }

            }
        );


    elementos.confirmModal
        ?.addEventListener(
            "click",
            evento => {

                if (
                    evento.target ===
                    elementos.confirmModal
                ) {

                    cancelarExclusao();

                }

            }
        );


    // ESC

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key !==
                "Escape"
            ) {

                return;

            }


            fecharModalUsuario();

            cancelarExclusao();

        }
    );

}


// ==========================================================
// NOME DO CARGO
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
// STATUS
// ==========================================================

function nomeStatus(
    status
) {

    const mapa = {

        ativo:
            "Ativo",

        inativo:
            "Inativo",

        suspenso:
            "Suspenso",

        pendente:
            "Pendente"

    };


    return (
        mapa[
            normalizar(
                status
            )
        ] ||
        status ||
        "-"
    );

}


// ==========================================================
// DATA
// ==========================================================

function formatarDataHora(
    valor
) {

    if (!valor) {

        return "-";

    }


    try {

        let data;


        if (
            typeof valor.toDate ===
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
// NORMALIZAR
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


// ==========================================================
// NORMALIZAR PESQUISA
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
// TOAST
// ==========================================================

function mostrarToast(
    mensagem,
    tipo = "success"
) {

    if (
        !elementos.toastContainer
    ) {

        console.log(
            mensagem
        );

        return;

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `usuario-toast ${tipo}`;


    const icone =
        tipo === "success"
            ?
            "circle-check"
            :
            tipo === "warning"
                ?
                "triangle-alert"
                :
                "circle-x";


    toast.innerHTML = `

        <i data-lucide="${icone}"></i>

        <span>
            ${escaparHTML(mensagem)}
        </span>

    `;


    elementos.toastContainer
        .appendChild(
            toast
        );


    window.lucide
        ?.createIcons();


    setTimeout(
        () => {

            toast.remove();

        },
        4000
    );

}


// ==========================================================
// TRADUZIR ERRO FIREBASE
// ==========================================================

function traduzirErro(
    erro
) {

    const codigo =
        erro?.code ||
        "";


    const mapa = {

        "permission-denied":
            "Você não possui permissão para realizar esta operação.",

        "firestore/permission-denied":
            "O Firestore recusou esta operação.",

        "unavailable":
            "O Firebase está temporariamente indisponível."

    };


    return (
        mapa[codigo] ||
        erro?.message ||
        "Ocorreu um erro inesperado."
    );

}


// ==========================================================
// API PARA TESTES NO CONSOLE
// ==========================================================

window.SIGCORUsuarios = {

    carregar:
        carregarUsuarios,

    listar:
        () => usuarios,

    perfil:
        () => perfilLogado

};