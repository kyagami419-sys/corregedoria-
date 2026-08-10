// ==========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// Arquivo: assets/js/api.js
//
// API central de dados do sistema.
//
// Responsável por:
// - Usuários
// - Inquéritos
// - Departamentos
// - Processos
// - Evidências
// - Depoimentos
// - Uploads
// - Logs / Auditoria
// - Configurações
// - Numeração automática
// ==========================================================


// ==========================================================
// FIREBASE CENTRAL
// ==========================================================

import {

    auth,
    db,

    obterUidAtual,

    obterDocumento,
    obterColecao,

    adicionarDocumento,
    salvarDocumento,
    atualizarDocumentoFirebase,
    removerDocumento,

    enviarArquivo,
    enviarArquivoComProgresso,
    removerArquivo,

    gerarCaminhoArquivo,

    serverTimestamp

} from "../../firebase/firebase.js";


// ==========================================================
// FIRESTORE - RECURSOS ADICIONAIS
// ==========================================================

import {

    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,

    query,
    where,
    orderBy,
    limit,

    runTransaction

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// ==========================================================
// COLEÇÕES
// ==========================================================

export const COLECOES = {

    USUARIOS:
        "usuarios",

    INQUERITOS:
        "inqueritos",

    DEPARTAMENTOS:
        "departamentos",

    PROCESSOS:
        "processos",

    EVIDENCIAS:
        "evidencias",

    LOGS:
        "logs",

    CONFIGURACOES:
        "configuracoes",

    NOTIFICACOES:
        "notificacoes"

};


// ==========================================================
// UTILIDADES
// ==========================================================

function validarId(
    id,
    nome = "ID"
) {

    if (
        id === null ||
        id === undefined ||
        !String(id).trim()
    ) {

        throw new Error(
            `${nome} inválido.`
        );

    }


    return String(
        id
    ).trim();

}


// ==========================================================
// LIMPAR OBJETO
// ==========================================================

function limparObjeto(
    objeto
) {

    if (
        objeto === null ||
        objeto === undefined
    ) {

        return objeto;

    }


    if (
        Array.isArray(
            objeto
        )
    ) {

        return objeto
            .filter(
                item =>
                    item !==
                    undefined
            )
            .map(
                limparObjeto
            );

    }


    if (
        objeto instanceof Date
    ) {

        return objeto;

    }


    if (
        typeof objeto !==
        "object"
    ) {

        return objeto;

    }


    const resultado =
        {};


    Object.entries(
        objeto
    ).forEach(
        (
            [
                chave,
                valor
            ]
        ) => {

            if (
                valor ===
                undefined
            ) {

                return;

            }


            resultado[
                chave
            ] =
                limparObjeto(
                    valor
                );

        }
    );


    return resultado;

}


// ==========================================================
// USUÁRIO AUTENTICADO
// ==========================================================

export function obterUsuarioAutenticado() {

    return (
        auth.currentUser ||
        null
    );

}


// ==========================================================
// UID
// ==========================================================

export function uidAtual() {

    return (
        obterUidAtual() ||
        null
    );

}


// ==========================================================
// NORMALIZAR TEXTO
// ==========================================================

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


// ==========================================================
// TIMESTAMP -> DATE
// ==========================================================

export function timestampParaData(
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
        typeof valor.toDate ===
        "function"
    ) {

        return valor.toDate();

    }


    if (
        valor.seconds !==
        undefined
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
        ?
        null
        :
        data;

}


// ==========================================================
// CRUD GENÉRICO
// ==========================================================

export async function criarDocumento(
    nomeColecao,
    dados = {}
) {

    return adicionarDocumento(
        nomeColecao,
        limparObjeto(
            dados
        )
    );

}


// ==========================================================
// CRIAR COM ID
// ==========================================================

export async function criarDocumentoComId(
    nomeColecao,
    id,
    dados = {},
    merge = true
) {

    validarId(
        id
    );


    await salvarDocumento(
        nomeColecao,
        id,
        limparObjeto(
            dados
        ),
        merge
    );


    return String(
        id
    );

}


// ==========================================================
// BUSCAR DOCUMENTO
// ==========================================================

export async function buscarDocumento(
    nomeColecao,
    id
) {

    validarId(
        id
    );


    return obterDocumento(
        nomeColecao,
        id
    );

}


// ==========================================================
// LISTAR DOCUMENTOS
// ==========================================================

export async function listarDocumentos(
    nomeColecao
) {

    return obterColecao(
        nomeColecao
    );

}


// ==========================================================
// ATUALIZAR DOCUMENTO
// ==========================================================

export async function atualizarDocumento(
    nomeColecao,
    id,
    dados = {}
) {

    validarId(
        id
    );


    await atualizarDocumentoFirebase(
        nomeColecao,
        id,
        limparObjeto(
            dados
        )
    );


    return true;

}


// ==========================================================
// EXCLUIR DOCUMENTO
// ==========================================================

export async function excluirDocumento(
    nomeColecao,
    id
) {

    validarId(
        id
    );


    await removerDocumento(
        nomeColecao,
        id
    );


    return true;

}


// ==========================================================
// USUÁRIOS
// ==========================================================

export async function buscarUsuario(
    uid
) {

    validarId(
        uid,
        "UID"
    );


    return buscarDocumento(
        COLECOES.USUARIOS,
        uid
    );

}


// ==========================================================
// USUÁRIO ATUAL
// ==========================================================

export async function buscarUsuarioAtual() {

    const uid =
        obterUidAtual();


    if (!uid) {

        return null;

    }


    return buscarUsuario(
        uid
    );

}


// ==========================================================
// LISTAR USUÁRIOS
// ==========================================================

export async function listarUsuarios() {

    try {

        const consulta =
            query(
                collection(
                    db,
                    COLECOES.USUARIOS
                ),

                orderBy(
                    "nome",
                    "asc"
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        return snapshot.docs.map(
            documento => ({

                id:
                    documento.id,

                ...documento.data()

            })
        );

    } catch (erro) {

        console.warn(
            "SIGCOR: não foi possível ordenar usuários. Usando listagem simples.",
            erro
        );


        return listarDocumentos(
            COLECOES.USUARIOS
        );

    }

}


// ==========================================================
// SALVAR USUÁRIO
// ==========================================================

export async function salvarUsuario(
    uid,
    dados
) {

    validarId(
        uid,
        "UID"
    );


    await criarDocumentoComId(
        COLECOES.USUARIOS,
        uid,
        {

            ...dados,

            uid

        },
        true
    );


    return uid;

}


// ==========================================================
// ATUALIZAR USUÁRIO
// ==========================================================

export async function atualizarUsuario(
    uid,
    dados
) {

    return atualizarDocumento(
        COLECOES.USUARIOS,
        uid,
        dados
    );

}


// ==========================================================
// USUÁRIOS POR STATUS
// ==========================================================

export async function listarUsuariosPorStatus(
    status
) {

    const consulta =
        query(
            collection(
                db,
                COLECOES.USUARIOS
            ),

            where(
                "status",
                "==",
                status
            )
        );


    const snapshot =
        await getDocs(
            consulta
        );


    return snapshot.docs.map(
        documento => ({

            id:
                documento.id,

            ...documento.data()

        })
    );

}


// ==========================================================
// USUÁRIOS POR CARGO
// ==========================================================

export async function listarUsuariosPorCargo(
    cargo
) {

    const consulta =
        query(
            collection(
                db,
                COLECOES.USUARIOS
            ),

            where(
                "cargo",
                "==",
                cargo
            )
        );


    const snapshot =
        await getDocs(
            consulta
        );


    return snapshot.docs.map(
        documento => ({

            id:
                documento.id,

            ...documento.data()

        })
    );

}


// ==========================================================
// NOME DO CARGO
// ==========================================================

export function nomeCargo(
    cargo
) {

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


    const normalizado =
        normalizarTexto(
            cargo
        );


    return (
        mapa[
            normalizado
        ] ||
        cargo ||
        "-"
    );

}


// ==========================================================
// VERIFICAR CARGO
// ==========================================================

export async function usuarioPossuiCargo(
    cargosPermitidos = []
) {

    const perfil =
        await buscarUsuarioAtual();


    if (!perfil) {

        return false;

    }


    const atual =
        normalizarTexto(
            perfil.cargo
        );


    const permitidos =
        cargosPermitidos.map(
            normalizarTexto
        );


    return permitidos.includes(
        atual
    );

}


// ==========================================================
// NUMERAÇÃO DO INQUÉRITO
//
// Exemplo:
// IP-CG/0001/2026
//
// Usa transaction para evitar dois usuários
// receberem o mesmo número.
// ==========================================================

export async function gerarNumeroInquerito() {

    const ano =
        new Date()
            .getFullYear();


    const referencia =
        doc(
            db,
            COLECOES.CONFIGURACOES,
            "numeracao"
        );


    const sequencial =
        await runTransaction(
            db,
            async transaction => {

                const snapshot =
                    await transaction.get(
                        referencia
                    );


                let proximo =
                    1;


                if (
                    snapshot.exists()
                ) {

                    const dados =
                        snapshot.data();


                    if (
                        Number(
                            dados.ano
                        ) ===
                        ano
                    ) {

                        proximo =
                            Number(
                                dados.ultimoInquerito ||
                                0
                            ) + 1;

                    }

                }


                transaction.set(
                    referencia,
                    {

                        ano,

                        ultimoInquerito:
                            proximo,

                        atualizadoEm:
                            serverTimestamp()

                    },
                    {
                        merge:
                            true
                    }
                );


                return proximo;

            }
        );


    return (
        `IP-CG/${String(sequencial).padStart(4, "0")}/${ano}`
    );

}


// ==========================================================
// INQUÉRITOS
// ==========================================================

export async function criarInquerito(
    dados = {}
) {

    const uid =
        obterUidAtual();


    if (!uid) {

        throw new Error(
            "Usuário não autenticado."
        );

    }


    const numero =
        dados.numero ||
        await gerarNumeroInquerito();


    const id =
        await criarDocumento(
            COLECOES.INQUERITOS,
            {

                ...dados,

                numero,

                status:
                    dados.status ||
                    "rascunho",

                criadoPor:
                    uid,

                atualizadoPor:
                    uid

            }
        );


    await registrarLog({

        acao:
            "INQUERITO_CRIADO",

        descricao:
            `Inquérito ${numero} criado.`,

        inqueritoId:
            id,

        numeroInquerito:
            numero

    });


    return id;

}


// ==========================================================
// BUSCAR INQUÉRITO
// ==========================================================

export async function buscarInquerito(
    id
) {

    return buscarDocumento(
        COLECOES.INQUERITOS,
        id
    );

}


// ==========================================================
// LISTAR INQUÉRITOS
// ==========================================================

export async function listarInqueritos(
    quantidade = 500
) {

    try {

        const consulta =
            query(
                collection(
                    db,
                    COLECOES.INQUERITOS
                ),

                orderBy(
                    "criadoEm",
                    "desc"
                ),

                limit(
                    Math.max(
                        1,
                        Number(
                            quantidade
                        ) || 500
                    )
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        return snapshot.docs.map(
            documento => ({

                id:
                    documento.id,

                ...documento.data()

            })
        );

    } catch (erro) {

        console.warn(
            "SIGCOR: consulta ordenada de inquéritos falhou. Usando consulta simples.",
            erro
        );


        return listarDocumentos(
            COLECOES.INQUERITOS
        );

    }

}


// ==========================================================
// ÚLTIMOS INQUÉRITOS
// ==========================================================

export async function listarUltimosInqueritos(
    quantidade = 5
) {

    try {

        const consulta =
            query(
                collection(
                    db,
                    COLECOES.INQUERITOS
                ),

                orderBy(
                    "criadoEm",
                    "desc"
                ),

                limit(
                    Math.max(
                        1,
                        Number(
                            quantidade
                        ) || 5
                    )
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        return snapshot.docs.map(
            documento => ({

                id:
                    documento.id,

                ...documento.data()

            })
        );

    } catch {

        const todos =
            await listarInqueritos();


        return todos
            .sort(
                (
                    a,
                    b
                ) => {

                    const dataA =
                        timestampParaData(
                            a.criadoEm
                        )
                            ?.getTime() ||
                        0;


                    const dataB =
                        timestampParaData(
                            b.criadoEm
                        )
                            ?.getTime() ||
                        0;


                    return (
                        dataB -
                        dataA
                    );

                }
            )
            .slice(
                0,
                quantidade
            );

    }

}


// ==========================================================
// INQUÉRITOS POR STATUS
// ==========================================================

export async function listarInqueritosPorStatus(
    status
) {

    const consulta =
        query(
            collection(
                db,
                COLECOES.INQUERITOS
            ),

            where(
                "status",
                "==",
                status
            )
        );


    const snapshot =
        await getDocs(
            consulta
        );


    return snapshot.docs.map(
        documento => ({

            id:
                documento.id,

            ...documento.data()

        })
    );

}


// ==========================================================
// ATUALIZAR INQUÉRITO
// ==========================================================

export async function atualizarInquerito(
    id,
    dados = {}
) {

    const uid =
        obterUidAtual();


    await atualizarDocumento(
        COLECOES.INQUERITOS,
        id,
        {

            ...dados,

            atualizadoPor:
                uid

        }
    );


    await registrarLog({

        acao:
            "INQUERITO_ATUALIZADO",

        descricao:
            "Dados do inquérito atualizados.",

        inqueritoId:
            id

    });


    return true;

}


// ==========================================================
// FINALIZAR INQUÉRITO
// ==========================================================

export async function finalizarInquerito(
    id
) {

    const uid =
        obterUidAtual();


    await atualizarDocumento(
        COLECOES.INQUERITOS,
        id,
        {

            status:
                "concluido",

            finalizadoEm:
                serverTimestamp(),

            finalizadoPor:
                uid

        }
    );


    await registrarLog({

        acao:
            "INQUERITO_FINALIZADO",

        descricao:
            "Inquérito finalizado.",

        inqueritoId:
            id

    });


    return true;

}


// ==========================================================
// ARQUIVAR
// ==========================================================

export async function arquivarInquerito(
    id
) {

    await atualizarDocumento(
        COLECOES.INQUERITOS,
        id,
        {

            status:
                "arquivado",

            arquivadoEm:
                serverTimestamp(),

            arquivadoPor:
                obterUidAtual()

        }
    );


    await registrarLog({

        acao:
            "INQUERITO_ARQUIVADO",

        descricao:
            "Inquérito arquivado.",

        inqueritoId:
            id

    });


    return true;

}


// ==========================================================
// EXCLUIR INQUÉRITO
// ==========================================================

export async function excluirInquerito(
    id
) {

    const inquerito =
        await buscarInquerito(
            id
        );


    await excluirDocumento(
        COLECOES.INQUERITOS,
        id
    );


    await registrarLog({

        acao:
            "INQUERITO_EXCLUIDO",

        descricao:
            `Inquérito ${inquerito?.numero || id} excluído.`,

        inqueritoId:
            id,

        numeroInquerito:
            inquerito?.numero ||
            null

    });


    return true;

}


// ==========================================================
// STATUS
// ==========================================================

export function nomeStatus(
    status
) {

    const mapa = {

        rascunho:
            "Rascunho",

        em_andamento:
            "Em andamento",

        em_analise:
            "Em análise",

        em_investigacao:
            "Em investigação",

        aguardando_decisao:
            "Aguardando decisão",

        concluido:
            "Concluído",

        arquivado:
            "Arquivado"

    };


    const normalizado =
        normalizarTexto(
            status
        );


    return (
        mapa[
            normalizado
        ] ||
        status ||
        "-"
    );

}


// ==========================================================
// DEPARTAMENTOS
// ==========================================================

export async function listarDepartamentos() {

    try {

        const consulta =
            query(
                collection(
                    db,
                    COLECOES.DEPARTAMENTOS
                ),

                orderBy(
                    "nome",
                    "asc"
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        return snapshot.docs.map(
            documento => ({

                id:
                    documento.id,

                ...documento.data()

            })
        );

    } catch {

        return listarDocumentos(
            COLECOES.DEPARTAMENTOS
        );

    }

}


// ==========================================================
// BUSCAR DEPARTAMENTO
// ==========================================================

export async function buscarDepartamento(
    id
) {

    return buscarDocumento(
        COLECOES.DEPARTAMENTOS,
        id
    );

}


// ==========================================================
// CRIAR DEPARTAMENTO
// ==========================================================

export async function criarDepartamento(
    dados
) {

    const id =
        await criarDocumento(
            COLECOES.DEPARTAMENTOS,
            {

                ...dados,

                ativo:
                    dados.ativo ??
                    true,

                criadoPor:
                    obterUidAtual()

            }
        );


    await registrarLog({

        acao:
            "DEPARTAMENTO_CRIADO",

        descricao:
            `Departamento ${dados.nome || id} criado.`,

        departamentoId:
            id

    });


    return id;

}


// ==========================================================
// ATUALIZAR DEPARTAMENTO
// ==========================================================

export async function atualizarDepartamento(
    id,
    dados
) {

    await atualizarDocumento(
        COLECOES.DEPARTAMENTOS,
        id,
        dados
    );


    await registrarLog({

        acao:
            "DEPARTAMENTO_ATUALIZADO",

        descricao:
            `Departamento ${dados.nome || id} atualizado.`,

        departamentoId:
            id

    });


    return true;

}


// ==========================================================
// PROCESSOS
// ==========================================================

export async function criarProcesso(
    dados
) {

    const id =
        await criarDocumento(
            COLECOES.PROCESSOS,
            {

                ...dados,

                criadoPor:
                    obterUidAtual(),

                status:
                    dados.status ||
                    "aberto"

            }
        );


    await registrarLog({

        acao:
            "PROCESSO_CRIADO",

        descricao:
            `Processo ${dados.numero || id} criado.`,

        processoId:
            id

    });


    return id;

}


// ==========================================================
// LISTAR PROCESSOS
// ==========================================================

export async function listarProcessos() {

    try {

        const consulta =
            query(
                collection(
                    db,
                    COLECOES.PROCESSOS
                ),

                orderBy(
                    "criadoEm",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        return snapshot.docs.map(
            documento => ({

                id:
                    documento.id,

                ...documento.data()

            })
        );

    } catch {

        return listarDocumentos(
            COLECOES.PROCESSOS
        );

    }

}


// ==========================================================
// BUSCAR PROCESSO
// ==========================================================

export async function buscarProcesso(
    id
) {

    return buscarDocumento(
        COLECOES.PROCESSOS,
        id
    );

}


// ==========================================================
// ATUALIZAR PROCESSO
// ==========================================================

export async function atualizarProcesso(
    id,
    dados
) {

    return atualizarDocumento(
        COLECOES.PROCESSOS,
        id,
        {

            ...dados,

            atualizadoPor:
                obterUidAtual()

        }
    );

}


// ==========================================================
// LOGS / AUDITORIA
// ==========================================================

export async function registrarLog(
    dados = {}
) {

    try {

        const usuario =
            auth.currentUser;


        let perfil =
            null;


        if (
            usuario?.uid
        ) {

            try {

                perfil =
                    await buscarUsuario(
                        usuario.uid
                    );

            } catch {

                perfil =
                    null;

            }

        }


        await adicionarDocumento(
            COLECOES.LOGS,
            {

                acao:
                    dados.acao ||
                    "ACAO",

                descricao:
                    dados.descricao ||
                    "",

                usuarioId:
                    usuario?.uid ||
                    null,

                usuarioNome:
                    perfil?.nome ||
                    perfil?.nomeCompleto ||
                    usuario?.email ||
                    "Sistema",

                usuarioEmail:
                    usuario?.email ||
                    "",

                cargo:
                    perfil?.cargo ||
                    "",

                departamento:
                    perfil?.departamento ||
                    "",

                inqueritoId:
                    dados.inqueritoId ||
                    null,

                processoId:
                    dados.processoId ||
                    null,

                departamentoId:
                    dados.departamentoId ||
                    null,

                numeroInquerito:
                    dados.numeroInquerito ||
                    null,

                detalhes:
                    limparObjeto(
                        dados.detalhes ||
                        null
                    )

            }
        );


        return true;

    } catch (erro) {

        // Auditoria não deve derrubar
        // a operação principal.

        console.warn(
            "SIGCOR: não foi possível registrar log.",
            erro
        );


        return false;

    }

}


// ==========================================================
// LISTAR LOGS
// ==========================================================

export async function listarLogs(
    quantidade = 50
) {

    try {

        const consulta =
            query(
                collection(
                    db,
                    COLECOES.LOGS
                ),

                orderBy(
                    "criadoEm",
                    "desc"
                ),

                limit(
                    Math.max(
                        1,
                        Number(
                            quantidade
                        ) || 50
                    )
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        return snapshot.docs.map(
            documento => ({

                id:
                    documento.id,

                ...documento.data()

            })
        );

    } catch (erro) {

        console.error(
            "SIGCOR: erro ao listar logs:",
            erro
        );


        throw erro;

    }

}


// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

export async function buscarConfiguracao(
    id
) {

    return buscarDocumento(
        COLECOES.CONFIGURACOES,
        id
    );

}


// ==========================================================
// SALVAR CONFIGURAÇÃO
// ==========================================================

export async function salvarConfiguracao(
    id,
    dados
) {

    return criarDocumentoComId(
        COLECOES.CONFIGURACOES,
        id,
        dados,
        true
    );

}


// ==========================================================
// VALIDAÇÃO DE ARQUIVOS
// ==========================================================

export function validarArquivo(
    arquivo,
    {
        tamanhoMaximoMB = 50,
        tiposPermitidos = []
    } = {}
) {

    if (!arquivo) {

        return {

            valido:
                false,

            erro:
                "Nenhum arquivo selecionado."

        };

    }


    const limite =
        Number(
            tamanhoMaximoMB
        ) *
        1024 *
        1024;


    if (
        arquivo.size >
        limite
    ) {

        return {

            valido:
                false,

            erro:
                `O arquivo ultrapassa ${tamanhoMaximoMB} MB.`

        };

    }


    if (
        Array.isArray(
            tiposPermitidos
        ) &&
        tiposPermitidos.length > 0 &&
        !tiposPermitidos.includes(
            arquivo.type
        )
    ) {

        return {

            valido:
                false,

            erro:
                "Este tipo de arquivo não é permitido."

        };

    }


    return {

        valido:
            true,

        erro:
            null

    };

}


// ==========================================================
// UPLOAD GENÉRICO
// ==========================================================

export async function uploadArquivo(
    arquivo,
    pasta = "uploads"
) {

    if (!arquivo) {

        throw new Error(
            "Nenhum arquivo selecionado."
        );

    }


    const caminho =
        gerarCaminhoArquivo(
            pasta,
            arquivo
        );


    const resultado =
        await enviarArquivo(
            arquivo,
            caminho
        );


    return {

        nomeOriginal:
            arquivo.name,

        nomeArquivo:
            caminho
                .split("/")
                .pop(),

        caminho:
            resultado.caminho,

        url:
            resultado.url,

        tipo:
            arquivo.type,

        tamanho:
            arquivo.size

    };

}


// ==========================================================
// UPLOAD COM PROGRESSO
// ==========================================================

export async function uploadArquivoComProgresso(
    arquivo,
    pasta = "uploads",
    callbackProgresso = null
) {

    if (!arquivo) {

        throw new Error(
            "Nenhum arquivo selecionado."
        );

    }


    const caminho =
        gerarCaminhoArquivo(
            pasta,
            arquivo
        );


    const resultado =
        await enviarArquivoComProgresso(
            arquivo,
            caminho,
            callbackProgresso
        );


    return {

        nomeOriginal:
            arquivo.name,

        nomeArquivo:
            caminho
                .split("/")
                .pop(),

        caminho:
            resultado.caminho,

        url:
            resultado.url,

        tipo:
            arquivo.type,

        tamanho:
            arquivo.size

    };

}


// ==========================================================
// UPLOAD DE EVIDÊNCIA
// ==========================================================

export async function uploadEvidencia(
    arquivo,
    inqueritoId
) {

    validarId(
        inqueritoId,
        "ID do inquérito"
    );


    return uploadArquivo(
        arquivo,
        `inqueritos/${inqueritoId}/evidencias`
    );

}


// ==========================================================
// FOTO DO ENVOLVIDO
// ==========================================================

export async function uploadFotoEnvolvido(
    arquivo,
    inqueritoId,
    envolvidoId
) {

    validarId(
        inqueritoId,
        "ID do inquérito"
    );


    validarId(
        envolvidoId,
        "ID do envolvido"
    );


    return uploadArquivo(
        arquivo,
        `inqueritos/${inqueritoId}/envolvidos/${envolvidoId}`
    );

}


// ==========================================================
// DEPOIMENTO
// ==========================================================

export async function uploadDepoimento(
    arquivo,
    inqueritoId
) {

    validarId(
        inqueritoId,
        "ID do inquérito"
    );


    return uploadArquivo(
        arquivo,
        `inqueritos/${inqueritoId}/depoimentos`
    );

}


// ==========================================================
// ASSINATURA
// ==========================================================

export async function uploadAssinatura(
    arquivo,
    inqueritoId,
    cargo = "assinatura"
) {

    validarId(
        inqueritoId,
        "ID do inquérito"
    );


    return uploadArquivo(
        arquivo,
        `inqueritos/${inqueritoId}/assinaturas/${normalizarTexto(cargo)}`
    );

}


// ==========================================================
// FOTO DE PERFIL
// ==========================================================

export async function uploadFotoPerfil(
    arquivo,
    uid = null
) {

    const usuarioId =
        uid ||
        obterUidAtual();


    validarId(
        usuarioId,
        "UID"
    );


    return uploadArquivo(
        arquivo,
        `usuarios/${usuarioId}/perfil`
    );

}


// ==========================================================
// EXCLUIR ARQUIVO STORAGE
// ==========================================================

export async function excluirArquivo(
    caminho
) {

    if (!caminho) {

        return false;

    }


    try {

        await removerArquivo(
            caminho
        );


        return true;

    } catch (erro) {

        console.error(
            "SIGCOR: erro ao excluir arquivo:",
            erro
        );


        throw erro;

    }

}


// ==========================================================
// GERAR NOME DE ARQUIVO
//
// Mantido porque outros módulos podem
// importar essa função diretamente.
// ==========================================================

export function gerarNomeArquivo(
    nomeOriginal
) {

    const nome =
        String(
            nomeOriginal ||
            "arquivo"
        );


    const ultimoPonto =
        nome.lastIndexOf(".");


    let base =
        ultimoPonto > 0
            ?
            nome.substring(
                0,
                ultimoPonto
            )
            :
            nome;


    const extensao =
        ultimoPonto > 0
            ?
            nome
                .substring(
                    ultimoPonto + 1
                )
                .toLowerCase()
            :
            "";


    base =
        base
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-zA-Z0-9_-]/g,
                "_"
            )
            .replace(
                /_+/g,
                "_"
            )
            .substring(
                0,
                70
            );


    const identificador =
        window.crypto?.randomUUID?.() ||
        (
            Date.now()
                .toString(36)
            +
            Math.random()
                .toString(36)
                .substring(2)
        );


    return (
        `${Date.now()}_${identificador}_${base}` +
        (
            extensao
                ?
                `.${extensao}`
                :
                ""
        )
    );

}


// ==========================================================
// CONTAR INQUÉRITOS
// ==========================================================

export async function obterEstatisticasInqueritos() {

    const inqueritos =
        await listarInqueritos(
            1000
        );


    const estatisticas = {

        total:
            inqueritos.length,

        rascunho:
            0,

        emAndamento:
            0,

        emAnalise:
            0,

        emInvestigacao:
            0,

        aguardandoDecisao:
            0,

        concluidos:
            0,

        arquivados:
            0

    };


    inqueritos.forEach(
        inquerito => {

            const status =
                normalizarTexto(
                    inquerito.status
                );


            switch (status) {

                case "rascunho":

                    estatisticas
                        .rascunho++;

                    break;


                case "em_andamento":

                    estatisticas
                        .emAndamento++;

                    break;


                case "em_analise":

                    estatisticas
                        .emAnalise++;

                    break;


                case "em_investigacao":

                    estatisticas
                        .emInvestigacao++;

                    break;


                case "aguardando_decisao":

                    estatisticas
                        .aguardandoDecisao++;

                    break;


                case "concluido":

                    estatisticas
                        .concluidos++;

                    break;


                case "arquivado":

                    estatisticas
                        .arquivados++;

                    break;

            }

        }
    );


    return estatisticas;

}


// ==========================================================
// PESQUISAR INQUÉRITOS LOCALMENTE
// ==========================================================

export async function pesquisarInqueritos(
    termo
) {

    const pesquisa =
        normalizarTexto(
            termo
        );


    if (!pesquisa) {

        return listarInqueritos();

    }


    const inqueritos =
        await listarInqueritos();


    return inqueritos.filter(
        inquerito => {

            const texto =
                normalizarTexto(
                    [

                        inquerito.numero,

                        inquerito.titulo,

                        inquerito.localFatos,

                        inquerito.encarregado?.nome,

                        inquerito.corregedorGeral?.nome,

                        inquerito.investigador?.nome,

                        inquerito.status

                    ]
                        .filter(Boolean)
                        .join(" ")
                );


            return texto.includes(
                pesquisa
            );

        }
    );

}


// ==========================================================
// TESTAR CONEXÃO COM FIRESTORE
// ==========================================================

export async function testarConexao() {

    const usuario =
        auth.currentUser;


    if (!usuario) {

        return {

            conectado:
                false,

            autenticado:
                false,

            usuario:
                null

        };

    }


    try {

        const perfil =
            await buscarUsuario(
                usuario.uid
            );


        return {

            conectado:
                true,

            autenticado:
                true,

            usuario:
                usuario,

            perfil:
                perfil

        };

    } catch (erro) {

        return {

            conectado:
                false,

            autenticado:
                true,

            usuario,

            perfil:
                null,

            erro

        };

    }

}


// ==========================================================
// EXPORTAÇÕES FIREBASE ÚTEIS
// ==========================================================

export {

    auth,

    db,

    serverTimestamp

};