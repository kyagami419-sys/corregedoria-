// =========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// assets/js/inqueritos.js
//
// Responsável por:
// - Criar inquéritos
// - Editar inquéritos
// - Salvar rascunhos
// - Crimes
// - Vítimas
// - Autores
// - Evidências
// - Depoimentos
// - Conclusão
// - Assinaturas
// - Uploads
// - Navegação pelas 8 etapas
// =========================================================


// =========================================================
// API
// =========================================================

import {
    criarInquerito,
    buscarInquerito,
    atualizarInquerito,
    finalizarInquerito,
    uploadEvidencia,
    uploadFotoEnvolvido,
    uploadDepoimento,
    registrarLog,
    gerarNumeroInquerito,
    validarArquivo
} from "./api.js";


// =========================================================
// AUTENTICAÇÃO
// =========================================================

import {
    protegerPagina,
    obterPerfilAtual,
    possuiPermissao,
    formatarCargo
} from "../../firebase/auth.js";


// =========================================================
// UI
// =========================================================

import {
    mostrarToast,
    mostrarLoading,
    esconderLoading
} from "./ui.js";


// =========================================================
// ESTADO DO INQUÉRITO
// =========================================================

let etapaAtual = 1;

let inqueritoId = null;

let modoEdicao = false;

let salvando = false;

let perfilAtual = null;


// =========================================================
// DADOS DINÂMICOS
// =========================================================

let crimes = [];

let vitimas = [];

let autores = [];

let evidencias = [];

let depoimentos = [];

let assinaturas = [];


// =========================================================
// CONFIGURAÇÃO
// =========================================================

const TOTAL_ETAPAS = 8;


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await iniciarModuloInqueritos();

    }
);


// =========================================================
// INICIAR
// =========================================================

async function iniciarModuloInqueritos() {

    try {

        const autenticacao =
            await protegerPagina();


        if (!autenticacao) {

            return;

        }


        perfilAtual =
            autenticacao.perfil;


        configurarNavegacao();

        configurarCrimes();

        configurarEnvolvidos();

        configurarEvidencias();

        configurarDepoimentos();

        configurarAssinaturas();

        configurarSalvamento();

        definirDataPadrao();


        // =================================================
        // VERIFICAR MODO EDIÇÃO
        // =================================================

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const id =
            parametros.get("id");


        if (id) {

            inqueritoId = id;

            modoEdicao = true;

            await carregarInquerito(
                id
            );

        } else {

            await prepararNovoInquerito();

        }


        atualizarInterfaceEtapas();

        renderizarTudo();

        recriarIcones();

    } catch (erro) {

        console.error(
            "Erro ao iniciar módulo de inquéritos:",
            erro
        );


        mostrarToast(
            "Não foi possível iniciar o módulo de inquéritos.",
            "error"
        );

    }

}


// =========================================================
// PREPARAR NOVO INQUÉRITO
// =========================================================

async function prepararNovoInquerito() {

    const campoNumero =
        document.getElementById(
            "numeroInquerito"
        );


    if (
        campoNumero &&
        !campoNumero.value
    ) {

        try {

            campoNumero.value =
                await gerarNumeroInquerito();


            campoNumero.classList.add(
                "auto-field"
            );

        } catch (erro) {

            console.warn(
                "Não foi possível gerar número automático:",
                erro
            );

        }

    }


    // Preencher automaticamente quem estiver criando.

    if (perfilAtual) {

        const nome =
            perfilAtual.nome ||
            perfilAtual.nomeCompleto ||
            "";


        const cargo =
            String(
                perfilAtual.cargo || ""
            )
                .toLowerCase()
                .replace(
                    /[\s-]+/g,
                    "_"
                );


        if (
            cargo === "corregedor_geral"
        ) {

            preencherSeVazio(
                "corregedorGeralNome",
                nome
            );

        }


        if (
            cargo === "sub_corregedor" ||
            cargo === "subcorregedor"
        ) {

            preencherSeVazio(
                "subCorregedorNome",
                nome
            );

        }


        if (
            cargo === "investigador"
        ) {

            preencherSeVazio(
                "investigadorNome",
                nome
            );

        }


        if (
            cargo === "perito"
        ) {

            preencherSeVazio(
                "peritoNome",
                nome
            );

        }


        if (
            cargo === "escrivao"
        ) {

            preencherSeVazio(
                "escrivaoNome",
                nome
            );

        }

    }

}


// =========================================================
// CARREGAR INQUÉRITO
// =========================================================

async function carregarInquerito(
    id
) {

    try {

        mostrarLoading();


        const dados =
            await buscarInquerito(
                id
            );


        if (!dados) {

            mostrarToast(
                "Inquérito não encontrado.",
                "error"
            );


            return;

        }


        preencherCampo(
            "numeroInquerito",
            dados.numero
        );


        preencherCampo(
            "dataAbertura",
            dados.dataAbertura
        );


        preencherCampo(
            "localFatos",
            dados.localFatos
        );


        preencherCampo(
            "statusInquerito",
            dados.status ||
            "rascunho"
        );


        preencherCampo(
            "sigiloInquerito",
            dados.sigilo ||
            "interno"
        );


        preencherCampo(
            "encarregadoNome",
            dados.encarregado?.nome ||
            dados.encarregadoNome
        );


        preencherCampo(
            "corregedorGeralNome",
            dados.corregedorGeral?.nome ||
            dados.corregedorGeralNome
        );


        preencherCampo(
            "subCorregedorNome",
            dados.subCorregedor?.nome ||
            dados.subCorregedorNome
        );


        preencherCampo(
            "investigadorNome",
            dados.investigador?.nome ||
            dados.investigadorNome
        );


        preencherCampo(
            "peritoNome",
            dados.perito?.nome ||
            dados.peritoNome
        );


        preencherCampo(
            "escrivaoNome",
            dados.escrivao?.nome ||
            dados.escrivaoNome
        );


        preencherCampo(
            "relatoHistorico",
            dados.relatoHistorico
        );


        preencherCampo(
            "conclusaoInquerito",
            dados.conclusao
        );


        crimes =
            Array.isArray(
                dados.crimes
            )
                ?
                dados.crimes
                :
                [];


        vitimas =
            Array.isArray(
                dados.vitimas
            )
                ?
                dados.vitimas
                :
                [];


        autores =
            Array.isArray(
                dados.autores
            )
                ?
                dados.autores
                :
                [];


        evidencias =
            Array.isArray(
                dados.evidencias
            )
                ?
                dados.evidencias
                :
                [];


        depoimentos =
            Array.isArray(
                dados.depoimentos
            )
                ?
                dados.depoimentos
                :
                [];


        assinaturas =
            Array.isArray(
                dados.assinaturas
            )
                ?
                dados.assinaturas
                :
                [];


        normalizarIds();


        renderizarTudo();


        atualizarAssinaturas();


        mostrarToast(
            "Inquérito carregado.",
            "success"
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar inquérito:",
            erro
        );


        mostrarToast(
            "Não foi possível carregar o inquérito.",
            "error"
        );

    } finally {

        esconderLoading();

    }

}


// =========================================================
// NORMALIZAR IDS
// =========================================================

function normalizarIds() {

    crimes =
        crimes.map(
            item => ({
                id:
                    item.id ||
                    gerarId(),

                crime:
                    item.crime ||
                    "",

                artigo:
                    item.artigo ||
                    "",

                legislacao:
                    item.legislacao ||
                    "",

                descricao:
                    item.descricao ||
                    ""
            })
        );


    vitimas =
        vitimas.map(
            item => ({
                ...item,

                id:
                    item.id ||
                    gerarId(),

                tipo:
                    "vitima"
            })
        );


    autores =
        autores.map(
            item => ({
                ...item,

                id:
                    item.id ||
                    gerarId(),

                tipo:
                    "autor"
            })
        );


    evidencias =
        evidencias.map(
            item => ({
                ...item,

                id:
                    item.id ||
                    gerarId()
            })
        );


    depoimentos =
        depoimentos.map(
            item => ({
                ...item,

                id:
                    item.id ||
                    gerarId()
            })
        );

}


// =========================================================
// NAVEGAÇÃO
// =========================================================

function configurarNavegacao() {

    document
        .querySelectorAll(
            ".step-item"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        irParaEtapa(
                            Number(
                                botao.dataset.step
                            )
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "btnEtapaAnterior"
        )
        ?.addEventListener(
            "click",
            () => {

                irParaEtapa(
                    etapaAtual - 1
                );

            }
        );


    document
        .getElementById(
            "btnProximaEtapa"
        )
        ?.addEventListener(
            "click",
            () => {

                irParaEtapa(
                    etapaAtual + 1
                );

            }
        );

}


// =========================================================
// IR PARA ETAPA
// =========================================================

function irParaEtapa(
    numero
) {

    if (
        numero < 1 ||
        numero > TOTAL_ETAPAS
    ) {

        return;

    }


    etapaAtual =
        numero;


    atualizarInterfaceEtapas();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =========================================================
// ATUALIZAR ETAPAS
// =========================================================

function atualizarInterfaceEtapas() {

    document
        .querySelectorAll(
            ".step-item"
        )
        .forEach(
            item => {

                item.classList.toggle(
                    "active",
                    Number(
                        item.dataset.step
                    ) === etapaAtual
                );

            }
        );


    document
        .querySelectorAll(
            ".form-step"
        )
        .forEach(
            item => {

                item.classList.toggle(
                    "active",
                    Number(
                        item.dataset.stepContent
                    ) === etapaAtual
                );

            }
        );


    const anterior =
        document.getElementById(
            "btnEtapaAnterior"
        );


    const proximo =
        document.getElementById(
            "btnProximaEtapa"
        );


    if (anterior) {

        anterior.disabled =
            etapaAtual === 1;

    }


    if (proximo) {

        proximo.style.display =
            etapaAtual === TOTAL_ETAPAS
                ?
                "none"
                :
                "inline-flex";

    }


    const barra =
        document.querySelector(
            ".form-progress-bar"
        );


    if (barra) {

        barra.style.width =
            `${
                (
                    etapaAtual /
                    TOTAL_ETAPAS
                ) * 100
            }%`;

    }


    const contador =
        document.querySelector(
            "[data-step-progress]"
        );


    if (contador) {

        contador.textContent =
            `Etapa ${etapaAtual} de ${TOTAL_ETAPAS}`;

    }


    recriarIcones();

}


// =========================================================
// CRIMES
// =========================================================

function configurarCrimes() {

    document
        .getElementById(
            "btnAdicionarCrime"
        )
        ?.addEventListener(
            "click",
            () => {

                crimes.push({
                    id:
                        gerarId(),

                    crime:
                        "",

                    artigo:
                        "",

                    legislacao:
                        "",

                    descricao:
                        ""
                });


                renderizarCrimes();

            }
        );

}


// =========================================================
// RENDERIZAR CRIMES
// =========================================================

function renderizarCrimes() {

    const container =
        document.getElementById(
            "listaCrimes"
        );


    if (!container) {

        return;

    }


    if (
        crimes.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                Nenhum crime ou artigo adicionado.

            </div>

        `;


        return;

    }


    container.innerHTML = "";


    crimes.forEach(
        (
            item,
            indice
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "dynamic-card crime-card";


            card.innerHTML = `

                <div class="dynamic-card-header">

                    <span class="dynamic-card-title">

                        Crime ${indice + 1}

                    </span>


                    <button
                        type="button"
                        class="dynamic-remove"
                        data-remover-crime="${item.id}"
                        title="Remover crime"
                    >
                        ×
                    </button>

                </div>


                <div class="form-grid form-grid-2">


                    <div class="form-group">

                        <label class="form-label">
                            Crime
                        </label>

                        <input
                            type="text"
                            class="form-input crime-field"
                            data-id="${item.id}"
                            data-field="crime"
                            value="${escaparAtributo(item.crime)}"
                            placeholder="Ex.: Abuso de autoridade"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Artigo
                        </label>

                        <input
                            type="text"
                            class="form-input crime-field"
                            data-id="${item.id}"
                            data-field="artigo"
                            value="${escaparAtributo(item.artigo)}"
                            placeholder="Ex.: Art. 15"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Legislação
                        </label>

                        <input
                            type="text"
                            class="form-input crime-field"
                            data-id="${item.id}"
                            data-field="legislacao"
                            value="${escaparAtributo(item.legislacao)}"
                            placeholder="Código / legislação"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Observação
                        </label>

                        <input
                            type="text"
                            class="form-input crime-field"
                            data-id="${item.id}"
                            data-field="descricao"
                            value="${escaparAtributo(item.descricao)}"
                            placeholder="Descrição ou observação"
                        >

                    </div>


                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    container
        .querySelectorAll(
            ".crime-field"
        )
        .forEach(
            campo => {

                campo.addEventListener(
                    "input",
                    () => {

                        const item =
                            crimes.find(
                                crime =>
                                    crime.id ===
                                    campo.dataset.id
                            );


                        if (item) {

                            item[
                                campo.dataset.field
                            ] =
                                campo.value;

                        }

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-remover-crime]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        crimes =
                            crimes.filter(
                                item =>
                                    item.id !==
                                    botao.dataset.removerCrime
                            );


                        renderizarCrimes();

                    }
                );

            }
        );

}


// =========================================================
// ENVOLVIDOS
// =========================================================

function configurarEnvolvidos() {

    document
        .getElementById(
            "btnAdicionarVitima"
        )
        ?.addEventListener(
            "click",
            () => {

                adicionarEnvolvido(
                    "vitima"
                );

            }
        );


    document
        .getElementById(
            "btnAdicionarAutor"
        )
        ?.addEventListener(
            "click",
            () => {

                adicionarEnvolvido(
                    "autor"
                );

            }
        );

}


// =========================================================
// ADICIONAR ENVOLVIDO
// =========================================================

function adicionarEnvolvido(
    tipo
) {

    const item = {

        id:
            gerarId(),

        tipo,

        nome:
            "",

        rg:
            "",

        telefone:
            "",

        naturalidade:
            "",

        departamento:
            "",

        cargo:
            "",

        observacoes:
            "",

        fotoUrl:
            "",

        fotoArquivo:
            null

    };


    if (
        tipo === "vitima"
    ) {

        vitimas.push(
            item
        );

    } else {

        autores.push(
            item
        );

    }


    renderizarEnvolvidos();

}


// =========================================================
// RENDERIZAR ENVOLVIDOS
// =========================================================

function renderizarEnvolvidos() {

    renderizarListaEnvolvidos(
        "listaVitimas",
        vitimas,
        "Vítima"
    );


    renderizarListaEnvolvidos(
        "listaAutores",
        autores,
        "Autor do fato"
    );

}


// =========================================================
// LISTA ENVOLVIDOS
// =========================================================

function renderizarListaEnvolvidos(
    idContainer,
    lista,
    titulo
) {

    const container =
        document.getElementById(
            idContainer
        );


    if (!container) {

        return;

    }


    if (
        lista.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                Nenhum registro adicionado.

            </div>

        `;


        return;

    }


    container.innerHTML = "";


    lista.forEach(
        (
            item,
            indice
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "dynamic-card";


            card.innerHTML = `

                <div class="dynamic-card-header">

                    <span class="dynamic-card-title">

                        ${titulo} ${indice + 1}

                    </span>


                    <button
                        type="button"
                        class="dynamic-remove"
                        data-remover-envolvido="${item.id}"
                        data-tipo="${item.tipo}"
                    >
                        ×
                    </button>

                </div>


                ${
                    item.fotoUrl
                        ?
                        `
                        <div class="envolvido-foto-wrapper">

                            <div class="envolvido-foto-preview">

                                <img
                                    src="${escaparAtributo(item.fotoUrl)}"
                                    alt="Foto do envolvido"
                                >

                            </div>

                        </div>
                        `
                        :
                        ""
                }


                <div class="form-group">

                    <label class="form-label">
                        Nome completo
                    </label>

                    <input
                        type="text"
                        class="form-input envolvido-field"
                        data-id="${item.id}"
                        data-tipo="${item.tipo}"
                        data-field="nome"
                        value="${escaparAtributo(item.nome)}"
                    >

                </div>


                <div class="form-grid form-grid-2">


                    <div class="form-group">

                        <label class="form-label">
                            RG
                        </label>

                        <input
                            type="text"
                            class="form-input envolvido-field"
                            data-id="${item.id}"
                            data-tipo="${item.tipo}"
                            data-field="rg"
                            value="${escaparAtributo(item.rg)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Telefone
                        </label>

                        <input
                            type="text"
                            class="form-input envolvido-field"
                            data-id="${item.id}"
                            data-tipo="${item.tipo}"
                            data-field="telefone"
                            value="${escaparAtributo(item.telefone)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Naturalidade
                        </label>

                        <input
                            type="text"
                            class="form-input envolvido-field"
                            data-id="${item.id}"
                            data-tipo="${item.tipo}"
                            data-field="naturalidade"
                            value="${escaparAtributo(item.naturalidade)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Departamento
                        </label>

                        <input
                            type="text"
                            class="form-input envolvido-field"
                            data-id="${item.id}"
                            data-tipo="${item.tipo}"
                            data-field="departamento"
                            value="${escaparAtributo(item.departamento)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Cargo / Patente
                        </label>

                        <input
                            type="text"
                            class="form-input envolvido-field"
                            data-id="${item.id}"
                            data-tipo="${item.tipo}"
                            data-field="cargo"
                            value="${escaparAtributo(item.cargo)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Foto
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            class="form-input envolvido-foto"
                            data-id="${item.id}"
                            data-tipo="${item.tipo}"
                        >

                    </div>


                </div>


                <div class="form-group">

                    <label class="form-label">
                        Observações
                    </label>

                    <textarea
                        class="form-textarea envolvido-field"
                        data-id="${item.id}"
                        data-tipo="${item.tipo}"
                        data-field="observacoes"
                    >${escaparHTML(item.observacoes)}</textarea>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    container
        .querySelectorAll(
            ".envolvido-field"
        )
        .forEach(
            campo => {

                campo.addEventListener(
                    "input",
                    () => {

                        atualizarEnvolvido(
                            campo.dataset.tipo,
                            campo.dataset.id,
                            campo.dataset.field,
                            campo.value
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(
            ".envolvido-foto"
        )
        .forEach(
            campo => {

                campo.addEventListener(
                    "change",
                    () => {

                        atualizarEnvolvido(
                            campo.dataset.tipo,
                            campo.dataset.id,
                            "fotoArquivo",
                            campo.files?.[0] ||
                            null
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-remover-envolvido]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        removerEnvolvido(
                            botao.dataset.tipo,
                            botao.dataset.removerEnvolvido
                        );

                    }
                );

            }
        );

}


// =========================================================
// ATUALIZAR ENVOLVIDO
// =========================================================

function atualizarEnvolvido(
    tipo,
    id,
    campo,
    valor
) {

    const lista =
        tipo === "vitima"
            ?
            vitimas
            :
            autores;


    const item =
        lista.find(
            envolvido =>
                envolvido.id === id
        );


    if (item) {

        item[campo] =
            valor;

    }

}


// =========================================================
// REMOVER ENVOLVIDO
// =========================================================

function removerEnvolvido(
    tipo,
    id
) {

    if (
        tipo === "vitima"
    ) {

        vitimas =
            vitimas.filter(
                item =>
                    item.id !== id
            );

    } else {

        autores =
            autores.filter(
                item =>
                    item.id !== id
            );

    }


    renderizarEnvolvidos();

}


// =========================================================
// EVIDÊNCIAS
// =========================================================

function configurarEvidencias() {

    document
        .getElementById(
            "btnAdicionarEvidencia"
        )
        ?.addEventListener(
            "click",
            () => {

                evidencias.push({

                    id:
                        gerarId(),

                    titulo:
                        "",

                    descricao:
                        "",

                    tipo:
                        "",

                    dataColeta:
                        "",

                    responsavel:
                        "",

                    localColeta:
                        "",

                    sigilo:
                        "restrito",

                    arquivo:
                        null,

                    arquivoUrl:
                        "",

                    arquivoNome:
                        "",

                    caminho:
                        ""

                });


                renderizarEvidencias();

            }
        );

}


// =========================================================
// RENDERIZAR EVIDÊNCIAS
// =========================================================

function renderizarEvidencias() {

    const container =
        document.getElementById(
            "listaEvidencias"
        );


    if (!container) {

        return;

    }


    if (
        evidencias.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                Nenhuma evidência adicionada.

            </div>

        `;


        return;

    }


    container.innerHTML = "";


    evidencias.forEach(
        (
            item,
            indice
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "dynamic-card evidence-card";


            card.innerHTML = `

                <div class="dynamic-card-header">

                    <span class="dynamic-card-title">

                        Evidência ${indice + 1}

                    </span>


                    <button
                        type="button"
                        class="dynamic-remove"
                        data-remover-evidencia="${item.id}"
                    >
                        ×
                    </button>

                </div>


                <div class="form-grid form-grid-2">


                    <div class="form-group">

                        <label class="form-label">
                            Título
                        </label>

                        <input
                            type="text"
                            class="form-input evidencia-field"
                            data-id="${item.id}"
                            data-field="titulo"
                            value="${escaparAtributo(item.titulo)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Tipo
                        </label>

                        <select
                            class="form-select evidencia-field"
                            data-id="${item.id}"
                            data-field="tipo"
                        >
                            ${opcoesTipoEvidencia(item.tipo)}
                        </select>

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Data da coleta
                        </label>

                        <input
                            type="datetime-local"
                            class="form-input evidencia-field"
                            data-id="${item.id}"
                            data-field="dataColeta"
                            value="${escaparAtributo(item.dataColeta)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Responsável pela coleta
                        </label>

                        <input
                            type="text"
                            class="form-input evidencia-field"
                            data-id="${item.id}"
                            data-field="responsavel"
                            value="${escaparAtributo(item.responsavel)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Local da coleta
                        </label>

                        <input
                            type="text"
                            class="form-input evidencia-field"
                            data-id="${item.id}"
                            data-field="localColeta"
                            value="${escaparAtributo(item.localColeta)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Sigilo
                        </label>

                        <select
                            class="form-select evidencia-field"
                            data-id="${item.id}"
                            data-field="sigilo"
                        >

                            <option
                                value="interno"
                                ${item.sigilo === "interno" ? "selected" : ""}
                            >
                                Interno
                            </option>

                            <option
                                value="restrito"
                                ${item.sigilo === "restrito" ? "selected" : ""}
                            >
                                Restrito
                            </option>

                            <option
                                value="sigiloso"
                                ${item.sigilo === "sigiloso" ? "selected" : ""}
                            >
                                Sigiloso
                            </option>

                        </select>

                    </div>


                </div>


                <div class="form-group">

                    <label class="form-label">
                        Descrição
                    </label>

                    <textarea
                        class="form-textarea evidencia-field"
                        data-id="${item.id}"
                        data-field="descricao"
                    >${escaparHTML(item.descricao)}</textarea>

                </div>


                <div class="form-group">

                    <label class="form-label">
                        Arquivo
                    </label>

                    <input
                        type="file"
                        class="form-input evidencia-arquivo"
                        data-id="${item.id}"
                        accept="image/*,video/*,audio/*,.pdf"
                    >

                </div>


                ${
                    item.arquivoUrl
                        ?
                        `
                        <div class="file-preview">

                            <i data-lucide="paperclip"></i>

                            <a
                                href="${escaparAtributo(item.arquivoUrl)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${
                                    escaparHTML(
                                        item.arquivoNome ||
                                        "Visualizar arquivo"
                                    )
                                }
                            </a>

                        </div>
                        `
                        :
                        ""
                }

            `;


            container.appendChild(
                card
            );

        }
    );


    configurarCamposEvidencias();


    recriarIcones();

}


// =========================================================
// EVENTOS DAS EVIDÊNCIAS
// =========================================================

function configurarCamposEvidencias() {

    const container =
        document.getElementById(
            "listaEvidencias"
        );


    if (!container) {

        return;

    }


    container
        .querySelectorAll(
            ".evidencia-field"
        )
        .forEach(
            campo => {

                campo.addEventListener(
                    "input",
                    () => {

                        const item =
                            evidencias.find(
                                evidencia =>
                                    evidencia.id ===
                                    campo.dataset.id
                            );


                        if (item) {

                            item[
                                campo.dataset.field
                            ] =
                                campo.value;

                        }

                    }
                );


                campo.addEventListener(
                    "change",
                    () => {

                        const item =
                            evidencias.find(
                                evidencia =>
                                    evidencia.id ===
                                    campo.dataset.id
                            );


                        if (item) {

                            item[
                                campo.dataset.field
                            ] =
                                campo.value;

                        }

                    }
                );

            }
        );


    container
        .querySelectorAll(
            ".evidencia-arquivo"
        )
        .forEach(
            campo => {

                campo.addEventListener(
                    "change",
                    () => {

                        const item =
                            evidencias.find(
                                evidencia =>
                                    evidencia.id ===
                                    campo.dataset.id
                            );


                        if (item) {

                            item.arquivo =
                                campo.files?.[0] ||
                                null;

                        }

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-remover-evidencia]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        evidencias =
                            evidencias.filter(
                                item =>
                                    item.id !==
                                    botao.dataset.removerEvidencia
                            );


                        renderizarEvidencias();

                    }
                );

            }
        );

}


// =========================================================
// TIPOS DE EVIDÊNCIA
// =========================================================

function opcoesTipoEvidencia(
    atual
) {

    const tipos = [

        ["imagem", "Imagem"],

        ["video", "Vídeo"],

        ["audio", "Áudio"],

        ["documento", "Documento"],

        ["pdf", "PDF"],

        ["captura", "Captura de tela"],

        ["outro", "Outro"]

    ];


    return tipos.map(
        ([valor, texto]) => `

            <option
                value="${valor}"
                ${atual === valor ? "selected" : ""}
            >
                ${texto}
            </option>

        `
    ).join("");

}


// =========================================================
// DEPOIMENTOS
// =========================================================

function configurarDepoimentos() {

    document
        .getElementById(
            "btnAdicionarDepoimento"
        )
        ?.addEventListener(
            "click",
            () => {

                depoimentos.push({

                    id:
                        gerarId(),

                    depoente:
                        "",

                    tipoDepoente:
                        "testemunha",

                    dataDepoimento:
                        "",

                    responsavelOitiva:
                        "",

                    texto:
                        "",

                    observacoes:
                        "",

                    arquivo:
                        null,

                    arquivoUrl:
                        "",

                    arquivoNome:
                        ""

                });


                renderizarDepoimentos();

            }
        );

}


// =========================================================
// RENDERIZAR DEPOIMENTOS
// =========================================================

function renderizarDepoimentos() {

    const container =
        document.getElementById(
            "listaDepoimentos"
        );


    if (!container) {

        return;

    }


    if (
        depoimentos.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                Nenhum depoimento adicionado.

            </div>

        `;


        return;

    }


    container.innerHTML = "";


    depoimentos.forEach(
        (
            item,
            indice
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "dynamic-card";


            card.innerHTML = `

                <div class="dynamic-card-header">

                    <span class="dynamic-card-title">

                        Depoimento ${indice + 1}

                    </span>


                    <button
                        type="button"
                        class="dynamic-remove"
                        data-remover-depoimento="${item.id}"
                    >
                        ×
                    </button>

                </div>


                <div class="form-grid form-grid-2">


                    <div class="form-group">

                        <label class="form-label">
                            Nome do depoente
                        </label>

                        <input
                            type="text"
                            class="form-input depoimento-field"
                            data-id="${item.id}"
                            data-field="depoente"
                            value="${escaparAtributo(item.depoente)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Tipo do depoente
                        </label>

                        <select
                            class="form-select depoimento-field"
                            data-id="${item.id}"
                            data-field="tipoDepoente"
                        >
                            ${opcoesTipoDepoente(item.tipoDepoente)}
                        </select>

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Data e horário
                        </label>

                        <input
                            type="datetime-local"
                            class="form-input depoimento-field"
                            data-id="${item.id}"
                            data-field="dataDepoimento"
                            value="${escaparAtributo(item.dataDepoimento)}"
                        >

                    </div>


                    <div class="form-group">

                        <label class="form-label">
                            Responsável pela oitiva
                        </label>

                        <input
                            type="text"
                            class="form-input depoimento-field"
                            data-id="${item.id}"
                            data-field="responsavelOitiva"
                            value="${escaparAtributo(item.responsavelOitiva)}"
                        >

                    </div>


                </div>


                <div class="form-group">

                    <label class="form-label">
                        Depoimento
                    </label>

                    <textarea
                        class="form-textarea editor-medium depoimento-field"
                        data-id="${item.id}"
                        data-field="texto"
                    >${escaparHTML(item.texto)}</textarea>

                </div>


                <div class="form-group">

                    <label class="form-label">
                        Observações
                    </label>

                    <textarea
                        class="form-textarea depoimento-field"
                        data-id="${item.id}"
                        data-field="observacoes"
                    >${escaparHTML(item.observacoes)}</textarea>

                </div>


                <div class="form-group">

                    <label class="form-label">
                        Vídeo ou áudio
                    </label>

                    <input
                        type="file"
                        class="form-input depoimento-arquivo"
                        data-id="${item.id}"
                        accept="video/*,audio/*"
                    >

                </div>


                ${
                    item.arquivoUrl
                        ?
                        `
                        <div class="file-preview">

                            <i data-lucide="play-circle"></i>

                            <a
                                href="${escaparAtributo(item.arquivoUrl)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${
                                    escaparHTML(
                                        item.arquivoNome ||
                                        "Abrir depoimento"
                                    )
                                }
                            </a>

                        </div>
                        `
                        :
                        ""
                }

            `;


            container.appendChild(
                card
            );

        }
    );


    configurarCamposDepoimentos();


    recriarIcones();

}


// =========================================================
// EVENTOS DOS DEPOIMENTOS
// =========================================================

function configurarCamposDepoimentos() {

    const container =
        document.getElementById(
            "listaDepoimentos"
        );


    if (!container) {

        return;

    }


    container
        .querySelectorAll(
            ".depoimento-field"
        )
        .forEach(
            campo => {

                const atualizar =
                    () => {

                        const item =
                            depoimentos.find(
                                depoimento =>
                                    depoimento.id ===
                                    campo.dataset.id
                            );


                        if (item) {

                            item[
                                campo.dataset.field
                            ] =
                                campo.value;

                        }

                    };


                campo.addEventListener(
                    "input",
                    atualizar
                );


                campo.addEventListener(
                    "change",
                    atualizar
                );

            }
        );


    container
        .querySelectorAll(
            ".depoimento-arquivo"
        )
        .forEach(
            campo => {

                campo.addEventListener(
                    "change",
                    () => {

                        const item =
                            depoimentos.find(
                                depoimento =>
                                    depoimento.id ===
                                    campo.dataset.id
                            );


                        if (item) {

                            item.arquivo =
                                campo.files?.[0] ||
                                null;

                        }

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-remover-depoimento]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        depoimentos =
                            depoimentos.filter(
                                item =>
                                    item.id !==
                                    botao.dataset.removerDepoimento
                            );


                        renderizarDepoimentos();

                    }
                );

            }
        );

}


// =========================================================
// TIPOS DE DEPOENTE
// =========================================================

function opcoesTipoDepoente(
    atual
) {

    const tipos = [

        ["vitima", "Vítima"],

        ["autor", "Autor"],

        ["testemunha", "Testemunha"],

        ["agente", "Agente policial"],

        ["perito", "Perito"],

        ["outro", "Outro"]

    ];


    return tipos.map(
        ([valor, texto]) => `

            <option
                value="${valor}"
                ${atual === valor ? "selected" : ""}
            >
                ${texto}
            </option>

        `
    ).join("");

}


// =========================================================
// ASSINATURAS
// =========================================================

function configurarAssinaturas() {

    document
        .querySelectorAll(
            ".btnAssinar"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        registrarAssinatura(
                            botao.dataset.cargo
                        );

                    }
                );

            }
        );

}


// =========================================================
// REGISTRAR ASSINATURA
// =========================================================

function registrarAssinatura(
    cargoAssinatura
) {

    if (!perfilAtual) {

        mostrarToast(
            "Usuário não identificado.",
            "error"
        );


        return;

    }


    if (
        !usuarioPodeAssinar(
            cargoAssinatura
        )
    ) {

        mostrarToast(
            "Seu cargo não pode realizar esta assinatura.",
            "error"
        );


        return;

    }


    const nome =
        perfilAtual.nome ||
        perfilAtual.nomeCompleto ||
        "Usuário";


    const assinatura = {

        cargo:
            cargoAssinatura,

        usuarioId:
            perfilAtual.uid ||
            perfilAtual.id ||
            "",

        nome,

        matricula:
            perfilAtual.matricula ||
            "",

        cargoUsuario:
            perfilAtual.cargo ||
            "",

        assinadoEm:
            new Date()
                .toISOString()

    };


    assinaturas =
        assinaturas.filter(
            item =>
                item.cargo !==
                cargoAssinatura
        );


    assinaturas.push(
        assinatura
    );


    atualizarAssinaturas();


    mostrarToast(
        "Assinatura registrada.",
        "success"
    );

}


// =========================================================
// PERMISSÃO DE ASSINATURA
// =========================================================

function usuarioPodeAssinar(
    cargoAssinatura
) {

    const cargoUsuario =
        String(
            perfilAtual?.cargo || ""
        )
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .replace(
                /[\s-]+/g,
                "_"
            );


    if (
        cargoUsuario === "administrador"
    ) {

        return true;

    }


    if (
        cargoUsuario === "corregedor_geral"
    ) {

        return true;

    }


    const equivalencias = {

        encarregado:
            [
                "corregedor",
                "investigador",
                "sub_corregedor"
            ],

        corregedor_geral:
            [
                "corregedor_geral"
            ],

        sub_corregedor:
            [
                "sub_corregedor",
                "subcorregedor"
            ],

        investigador:
            [
                "investigador"
            ],

        perito:
            [
                "perito"
            ],

        escrivao:
            [
                "escrivao"
            ]

    };


    return (
        equivalencias[
            cargoAssinatura
        ] || []
    ).includes(
        cargoUsuario
    );

}


// =========================================================
// ATUALIZAR ASSINATURAS
// =========================================================

function atualizarAssinaturas() {

    const mapa = {

        encarregado:
            "assinaturaEncarregado",

        corregedor_geral:
            "assinaturaCorregedorGeral",

        sub_corregedor:
            "assinaturaSubCorregedor",

        investigador:
            "assinaturaInvestigador",

        perito:
            "assinaturaPerito",

        escrivao:
            "assinaturaEscrivao"

    };


    Object.entries(
        mapa
    ).forEach(
        ([cargo, id]) => {

            const elemento =
                document.getElementById(
                    id
                );


            if (!elemento) {

                return;

            }


            const assinatura =
                assinaturas.find(
                    item =>
                        item.cargo === cargo
                );


            if (!assinatura) {

                elemento.textContent =
                    "Não assinado";


                elemento
                    .closest(
                        ".signature-card"
                    )
                    ?.classList
                    .remove(
                        "signed"
                    );


                return;

            }


            const data =
                new Date(
                    assinatura.assinadoEm
                );


            elemento.textContent =
                `${assinatura.nome} • ${formatarDataHora(data)}`;


            elemento
                .closest(
                    ".signature-card"
                )
                ?.classList
                .add(
                    "signed"
                );

        }
    );

}


// =========================================================
// SALVAMENTO
// =========================================================

function configurarSalvamento() {

    document
        .getElementById(
            "btnSalvarRascunho"
        )
        ?.addEventListener(
            "click",
            async () => {

                await salvar(
                    false
                );

            }
        );


    document
        .getElementById(
            "btnFinalizarInquerito"
        )
        ?.addEventListener(
            "click",
            async () => {

                const confirmar =
                    window.confirm(
                        "Deseja finalizar este inquérito? Revise todas as informações antes de continuar."
                    );


                if (!confirmar) {

                    return;

                }


                await salvar(
                    true
                );

            }
        );

}


// =========================================================
// SALVAR
// =========================================================

async function salvar(
    finalizar
) {

    if (salvando) {

        return;

    }


    if (
        !validarDadosBasicos()
    ) {

        return;

    }


    try {

        salvando = true;


        alterarStatusSalvamento(
            "saving",
            "Salvando..."
        );


        mostrarLoading();


        // =================================================
        // PRIMEIRO SALVAMENTO
        // =================================================

        if (!inqueritoId) {

            const dadosIniciais =
                montarDadosInquerito(
                    false
                );


            // Cria primeiro para termos um ID
            // correto para as pastas do Storage.

            inqueritoId =
                await criarInquerito(
                    {
                        ...dadosIniciais,

                        evidencias:
                            [],

                        vitimas:
                            prepararEnvolvidosSemArquivo(
                                vitimas
                            ),

                        autores:
                            prepararEnvolvidosSemArquivo(
                                autores
                            ),

                        depoimentos:
                            prepararDepoimentosSemArquivo(
                                depoimentos
                            )
                    }
                );


            modoEdicao =
                true;


            atualizarUrlComId(
                inqueritoId
            );

        }


        // =================================================
        // UPLOADS
        // =================================================

        await processarFotos(
            vitimas
        );


        await processarFotos(
            autores
        );


        await processarEvidencias();


        await processarDepoimentos();


        // =================================================
        // DADOS FINAIS
        // =================================================

        const dados =
            montarDadosInquerito(
                finalizar
            );


        await atualizarInquerito(
            inqueritoId,
            dados
        );


        // =================================================
        // FINALIZAR
        // =================================================

        if (finalizar) {

            await finalizarInquerito(
                inqueritoId
            );


            preencherCampo(
                "statusInquerito",
                "concluido"
            );

        }


        alterarStatusSalvamento(
            "saved",
            "Salvo"
        );


        mostrarToast(
            finalizar
                ?
                "Inquérito finalizado com sucesso."
                :
                "Inquérito salvo com sucesso.",
            "success"
        );


        renderizarTudo();

    } catch (erro) {

        console.error(
            "Erro ao salvar inquérito:",
            erro
        );


        alterarStatusSalvamento(
            "error",
            "Erro ao salvar"
        );


        mostrarToast(
            "Não foi possível salvar o inquérito.",
            "error"
        );

    } finally {

        salvando =
            false;


        esconderLoading();

    }

}


// =========================================================
// MONTAR DADOS
// =========================================================

function montarDadosInquerito(
    finalizar = false
) {

    return {

        numero:
            valor(
                "numeroInquerito"
            ),

        dataAbertura:
            valor(
                "dataAbertura"
            ),

        localFatos:
            valor(
                "localFatos"
            ),

        status:
            finalizar
                ?
                "concluido"
                :
                valor(
                    "statusInquerito"
                ) ||
                "rascunho",

        sigilo:
            valor(
                "sigiloInquerito"
            ) ||
            "interno",

        encarregado: {

            nome:
                valor(
                    "encarregadoNome"
                )

        },

        corregedorGeral: {

            nome:
                valor(
                    "corregedorGeralNome"
                )

        },

        subCorregedor: {

            nome:
                valor(
                    "subCorregedorNome"
                )

        },

        investigador: {

            nome:
                valor(
                    "investigadorNome"
                )

        },

        perito: {

            nome:
                valor(
                    "peritoNome"
                )

        },

        escrivao: {

            nome:
                valor(
                    "escrivaoNome"
                )

        },

        crimes:
            crimes.map(
                item => ({
                    id:
                        item.id,

                    crime:
                        item.crime ||
                        "",

                    artigo:
                        item.artigo ||
                        "",

                    legislacao:
                        item.legislacao ||
                        "",

                    descricao:
                        item.descricao ||
                        ""
                })
            ),

        vitimas:
            prepararEnvolvidosSemArquivo(
                vitimas
            ),

        autores:
            prepararEnvolvidosSemArquivo(
                autores
            ),

        relatoHistorico:
            valor(
                "relatoHistorico"
            ),

        evidencias:
            prepararEvidenciasSemArquivo(),

        depoimentos:
            prepararDepoimentosSemArquivo(
                depoimentos
            ),

        conclusao:
            valor(
                "conclusaoInquerito"
            ),

        assinaturas:
            assinaturas.map(
                item => ({
                    ...item
                })
            )

    };

}


// =========================================================
// REMOVER FILE DOS ENVOLVIDOS
// =========================================================

function prepararEnvolvidosSemArquivo(
    lista
) {

    return lista.map(
        item => ({

            id:
                item.id,

            tipo:
                item.tipo,

            nome:
                item.nome ||
                "",

            rg:
                item.rg ||
                "",

            telefone:
                item.telefone ||
                "",

            naturalidade:
                item.naturalidade ||
                "",

            departamento:
                item.departamento ||
                "",

            cargo:
                item.cargo ||
                "",

            observacoes:
                item.observacoes ||
                "",

            fotoUrl:
                item.fotoUrl ||
                "",

            fotoCaminho:
                item.fotoCaminho ||
                ""

        })
    );

}


// =========================================================
// EVIDÊNCIAS SEM FILE
// =========================================================

function prepararEvidenciasSemArquivo() {

    return evidencias.map(
        item => ({

            id:
                item.id,

            titulo:
                item.titulo ||
                "",

            descricao:
                item.descricao ||
                "",

            tipo:
                item.tipo ||
                "",

            dataColeta:
                item.dataColeta ||
                "",

            responsavel:
                item.responsavel ||
                "",

            localColeta:
                item.localColeta ||
                "",

            sigilo:
                item.sigilo ||
                "restrito",

            arquivoUrl:
                item.arquivoUrl ||
                "",

            arquivoNome:
                item.arquivoNome ||
                "",

            caminho:
                item.caminho ||
                ""

        })
    );

}


// =========================================================
// DEPOIMENTOS SEM FILE
// =========================================================

function prepararDepoimentosSemArquivo(
    lista
) {

    return lista.map(
        item => ({

            id:
                item.id,

            depoente:
                item.depoente ||
                "",

            tipoDepoente:
                item.tipoDepoente ||
                "testemunha",

            dataDepoimento:
                item.dataDepoimento ||
                "",

            responsavelOitiva:
                item.responsavelOitiva ||
                "",

            texto:
                item.texto ||
                "",

            observacoes:
                item.observacoes ||
                "",

            arquivoUrl:
                item.arquivoUrl ||
                "",

            arquivoNome:
                item.arquivoNome ||
                "",

            caminho:
                item.caminho ||
                ""

        })
    );

}


// =========================================================
// UPLOAD DAS FOTOS
// =========================================================

async function processarFotos(
    lista
) {

    for (
        const item
        of lista
    ) {

        if (
            !item.fotoArquivo
        ) {

            continue;

        }


        const validacao =
            validarArquivo(
                item.fotoArquivo,
                {
                    tamanhoMaximoMB:
                        8,

                    tiposPermitidos:
                        [
                            "image/jpeg",
                            "image/png",
                            "image/webp"
                        ]
                }
            );


        if (
            !validacao.valido
        ) {

            throw new Error(
                `${item.nome || "Envolvido"}: ${validacao.erro}`
            );

        }


        const upload =
            await uploadFotoEnvolvido(
                item.fotoArquivo,
                inqueritoId,
                item.id
            );


        item.fotoUrl =
            upload.url;


        item.fotoCaminho =
            upload.caminho;


        item.fotoArquivo =
            null;

    }

}


// =========================================================
// UPLOAD DAS EVIDÊNCIAS
// =========================================================

async function processarEvidencias() {

    for (
        const item
        of evidencias
    ) {

        if (
            !item.arquivo
        ) {

            continue;

        }


        const validacao =
            validarArquivo(
                item.arquivo,
                {
                    tamanhoMaximoMB:
                        100
                }
            );


        if (
            !validacao.valido
        ) {

            throw new Error(
                `${item.titulo || "Evidência"}: ${validacao.erro}`
            );

        }


        const upload =
            await uploadEvidencia(
                item.arquivo,
                inqueritoId
            );


        item.arquivoUrl =
            upload.url;


        item.arquivoNome =
            upload.nomeOriginal;


        item.caminho =
            upload.caminho;


        item.arquivo =
            null;

    }

}


// =========================================================
// UPLOAD DOS DEPOIMENTOS
// =========================================================

async function processarDepoimentos() {

    for (
        const item
        of depoimentos
    ) {

        if (
            !item.arquivo
        ) {

            continue;

        }


        const validacao =
            validarArquivo(
                item.arquivo,
                {
                    tamanhoMaximoMB:
                        150
                }
            );


        if (
            !validacao.valido
        ) {

            throw new Error(
                `${item.depoente || "Depoimento"}: ${validacao.erro}`
            );

        }


        const upload =
            await uploadDepoimento(
                item.arquivo,
                inqueritoId
            );


        item.arquivoUrl =
            upload.url;


        item.arquivoNome =
            upload.nomeOriginal;


        item.caminho =
            upload.caminho;


        item.arquivo =
            null;

    }

}


// =========================================================
// VALIDAÇÕES
// =========================================================

function validarDadosBasicos() {

    const numero =
        valor(
            "numeroInquerito"
        );


    if (!numero) {

        mostrarToast(
            "Informe o número do inquérito.",
            "warning"
        );


        irParaEtapa(
            1
        );


        return false;

    }


    const data =
        valor(
            "dataAbertura"
        );


    if (!data) {

        mostrarToast(
            "Informe a data de abertura.",
            "warning"
        );


        irParaEtapa(
            1
        );


        return false;

    }


    return true;

}


// =========================================================
// RENDERIZAR TUDO
// =========================================================

function renderizarTudo() {

    renderizarCrimes();

    renderizarEnvolvidos();

    renderizarEvidencias();

    renderizarDepoimentos();

    atualizarAssinaturas();

}


// =========================================================
// DATA PADRÃO
// =========================================================

function definirDataPadrao() {

    const campo =
        document.getElementById(
            "dataAbertura"
        );


    if (
        !campo ||
        campo.value
    ) {

        return;

    }


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );


    campo.value =
        `${ano}-${mes}-${dia}`;

}


// =========================================================
// STATUS DE SALVAMENTO
// =========================================================

function alterarStatusSalvamento(
    tipo,
    texto
) {

    const elemento =
        document.querySelector(
            ".save-status"
        );


    if (!elemento) {

        return;

    }


    elemento.classList.remove(
        "saving",
        "saved",
        "error"
    );


    if (tipo) {

        elemento.classList.add(
            tipo
        );

    }


    elemento.textContent =
        texto;

}


// =========================================================
// URL COM ID
// =========================================================

function atualizarUrlComId(
    id
) {

    const url =
        new URL(
            window.location.href
        );


    url.searchParams.set(
        "id",
        id
    );


    window.history.replaceState(
        {},
        "",
        url
    );

}


// =========================================================
// VALOR DO CAMPO
// =========================================================

function valor(
    id
) {

    return (
        document
            .getElementById(id)
            ?.value
            ?.trim()
        ||
        ""
    );

}


// =========================================================
// PREENCHER CAMPO
// =========================================================

function preencherCampo(
    id,
    valorCampo
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        return;

    }


    elemento.value =
        valorCampo ??
        "";

}


// =========================================================
// PREENCHER SE VAZIO
// =========================================================

function preencherSeVazio(
    id,
    texto
) {

    const campo =
        document.getElementById(
            id
        );


    if (
        campo &&
        !campo.value
    ) {

        campo.value =
            texto ||
            "";

    }

}


// =========================================================
// ID ÚNICO
// =========================================================

function gerarId() {

    if (
        window.crypto?.randomUUID
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now()
            .toString(36)
        +
        Math.random()
            .toString(36)
            .substring(2)
    );

}


// =========================================================
// FORMATAR DATA / HORA
// =========================================================

function formatarDataHora(
    data
) {

    if (
        !(data instanceof Date) ||
        Number.isNaN(
            data.getTime()
        )
    ) {

        return "-";

    }


    return data.toLocaleString(
        "pt-BR",
        {
            dateStyle:
                "short",

            timeStyle:
                "short"
        }
    );

}


// =========================================================
// ESCAPAR HTML
// =========================================================

function escaparHTML(
    valor
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            valor ?? ""
        );


    return div.innerHTML;

}


// =========================================================
// ESCAPAR ATRIBUTOS
// =========================================================

function escaparAtributo(
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
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
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
// LUCIDE
// =========================================================

function recriarIcones() {

    if (
        typeof lucide !==
        "undefined"
    ) {

        lucide.createIcons();

    }

}