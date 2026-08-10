// ==========================================================
// SIGCOR
// Sistema Integrado de Gestão da Corregedoria
//
// Arquivo: assets/js/utils.js
//
// Parte 1/6
//
// Utilidades gerais:
// - Strings
// - IDs
// - Datas
// - Números
// - Debounce
// - Throttle
// - Espera
// - Clonagem
// - Comparações
// ==========================================================


// ==========================================================
// ESPERAR
// ==========================================================

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


// ==========================================================
// NORMALIZAR TEXTO
// ==========================================================

export function normalizarTexto(
    texto
) {

    return String(
        texto ?? ""
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
// NORMALIZAR PARA PESQUISA
// ==========================================================

export function normalizarPesquisa(
    texto
) {

    return String(
        texto ?? ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9\s]/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


// ==========================================================
// CAPITALIZAR
// ==========================================================

export function capitalizar(
    texto
) {

    return String(
        texto ?? ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /(^|\s)\S/g,
            letra =>
                letra.toUpperCase()
        );

}


// ==========================================================
// PRIMEIRA LETRA MAIÚSCULA
// ==========================================================

export function primeiraMaiuscula(
    texto
) {

    const valor =
        String(
            texto ?? ""
        );


    if (!valor) {

        return "";

    }


    return (
        valor.charAt(0)
            .toUpperCase()
        +
        valor.slice(1)
    );

}


// ==========================================================
// TRUNCAR TEXTO
// ==========================================================

export function truncarTexto(
    texto,
    limite = 100,
    sufixo = "..."
) {

    const valor =
        String(
            texto ?? ""
        );


    const maximo =
        Math.max(
            0,
            Number(
                limite
            ) || 0
        );


    if (
        valor.length <=
        maximo
    ) {

        return valor;

    }


    return (
        valor
            .substring(
                0,
                maximo
            )
            .trimEnd()
        +
        sufixo
    );

}


// ==========================================================
// REMOVER ESPAÇOS DUPLOS
// ==========================================================

export function limparEspacos(
    texto
) {

    return String(
        texto ?? ""
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


// ==========================================================
// SLUG
// ==========================================================

export function gerarSlug(
    texto
) {

    return String(
        texto ?? ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

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


// ==========================================================
// ESCAPAR ATRIBUTO
// ==========================================================

export function escaparAtributo(
    valor
) {

    return escaparHTML(
        valor
    );

}


// ==========================================================
// GERAR ID
// ==========================================================

export function gerarId() {

    if (
        globalThis.crypto
            ?.randomUUID
    ) {

        return globalThis
            .crypto
            .randomUUID();

    }


    return (
        Date.now()
            .toString(36)
        +
        "-"
        +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


// ==========================================================
// GERAR ID CURTO
// ==========================================================

export function gerarIdCurto(
    tamanho = 8
) {

    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


    const quantidade =
        Math.max(
            4,
            Math.min(
                64,
                Number(
                    tamanho
                ) || 8
            )
        );


    let resultado =
        "";


    if (
        globalThis.crypto
            ?.getRandomValues
    ) {

        const numeros =
            new Uint32Array(
                quantidade
            );


        globalThis.crypto
            .getRandomValues(
                numeros
            );


        numeros.forEach(
            numero => {

                resultado +=
                    caracteres[
                        numero %
                        caracteres.length
                    ];

            }
        );


        return resultado;

    }


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        resultado +=
            caracteres[
                Math.floor(
                    Math.random() *
                    caracteres.length
                )
            ];

    }


    return resultado;

}


// ==========================================================
// NÚMERO ALEATÓRIO
// ==========================================================

export function numeroAleatorio(
    minimo = 0,
    maximo = 100
) {

    let min =
        Number(
            minimo
        );


    let max =
        Number(
            maximo
        );


    if (
        Number.isNaN(
            min
        )
    ) {

        min = 0;

    }


    if (
        Number.isNaN(
            max
        )
    ) {

        max = 100;

    }


    if (
        min > max
    ) {

        [
            min,
            max
        ] = [
            max,
            min
        ];

    }


    return Math.floor(
        Math.random() *
        (
            max -
            min +
            1
        )
    ) + min;

}


// ==========================================================
// CLAMP
// ==========================================================

export function limitarNumero(
    valor,
    minimo,
    maximo
) {

    const numero =
        Number(
            valor
        );


    const min =
        Number(
            minimo
        );


    const max =
        Number(
            maximo
        );


    return Math.min(
        max,
        Math.max(
            min,
            numero
        )
    );

}


// ==========================================================
// É NÚMERO
// ==========================================================

export function ehNumero(
    valor
) {

    return (
        valor !== null &&
        valor !== "" &&
        Number.isFinite(
            Number(
                valor
            )
        )
    );

}


// ==========================================================
// FORMATAR NÚMERO
// ==========================================================

export function formatarNumero(
    valor,
    {
        casas = 0,
        locale = "pt-BR"
    } = {}
) {

    const numero =
        Number(
            valor
        );


    if (
        Number.isNaN(
            numero
        )
    ) {

        return "0";

    }


    return numero.toLocaleString(
        locale,
        {
            minimumFractionDigits:
                casas,

            maximumFractionDigits:
                casas
        }
    );

}


// ==========================================================
// FORMATAR MOEDA
// ==========================================================

export function formatarMoeda(
    valor,
    moeda = "BRL",
    locale = "pt-BR"
) {

    const numero =
        Number(
            valor
        );


    if (
        Number.isNaN(
            numero
        )
    ) {

        return "R$ 0,00";

    }


    return numero.toLocaleString(
        locale,
        {
            style:
                "currency",

            currency:
                moeda
        }
    );

}


// ==========================================================
// PORCENTAGEM
// ==========================================================

export function calcularPorcentagem(
    parte,
    total,
    casas = 0
) {

    const p =
        Number(
            parte
        );


    const t =
        Number(
            total
        );


    if (
        !Number.isFinite(
            p
        ) ||
        !Number.isFinite(
            t
        ) ||
        t === 0
    ) {

        return 0;

    }


    return Number(
        (
            (
                p /
                t
            ) * 100
        ).toFixed(
            casas
        )
    );

}


// ==========================================================
// DEBOUNCE
// ==========================================================

export function debounce(
    funcao,
    esperaMs = 300
) {

    let timer =
        null;


    return function (
        ...args
    ) {

        clearTimeout(
            timer
        );


        timer =
            setTimeout(
                () => {

                    funcao.apply(
                        this,
                        args
                    );

                },
                esperaMs
            );

    };

}


// ==========================================================
// THROTTLE
// ==========================================================

export function throttle(
    funcao,
    limiteMs = 300
) {

    let bloqueado =
        false;


    let ultimoContexto =
        null;


    let ultimosArgs =
        null;


    return function (
        ...args
    ) {

        if (
            !bloqueado
        ) {

            funcao.apply(
                this,
                args
            );


            bloqueado =
                true;


            setTimeout(
                () => {

                    bloqueado =
                        false;


                    if (
                        ultimosArgs
                    ) {

                        funcao.apply(
                            ultimoContexto,
                            ultimosArgs
                        );


                        ultimoContexto =
                            null;


                        ultimosArgs =
                            null;

                    }

                },
                limiteMs
            );


            return;

        }


        ultimoContexto =
            this;


        ultimosArgs =
            args;

    };

}


// ==========================================================
// ONCE
// ==========================================================

export function executarUmaVez(
    funcao
) {

    let executado =
        false;


    let resultado;


    return function (
        ...args
    ) {

        if (
            executado
        ) {

            return resultado;

        }


        executado =
            true;


        resultado =
            funcao.apply(
                this,
                args
            );


        return resultado;

    };

}


// ==========================================================
// CLONAR OBJETO
// ==========================================================

export function clonarObjeto(
    objeto
) {

    if (
        typeof structuredClone ===
        "function"
    ) {

        try {

            return structuredClone(
                objeto
            );

        } catch {

            // Continua no fallback.
        }

    }


    return JSON.parse(
        JSON.stringify(
            objeto
        )
    );

}


// ==========================================================
// REMOVER UNDEFINED
// ==========================================================

export function removerUndefined(
    valor
) {

    if (
        valor === undefined
    ) {

        return undefined;

    }


    if (
        valor === null
    ) {

        return null;

    }


    if (
        Array.isArray(
            valor
        )
    ) {

        return valor
            .filter(
                item =>
                    item !==
                    undefined
            )
            .map(
                removerUndefined
            );

    }


    if (
        valor instanceof Date
    ) {

        return valor;

    }


    if (
        typeof valor !==
        "object"
    ) {

        return valor;

    }


    const resultado =
        {};


    Object.entries(
        valor
    ).forEach(
        (
            [
                chave,
                item
            ]
        ) => {

            if (
                item ===
                undefined
            ) {

                return;

            }


            resultado[
                chave
            ] =
                removerUndefined(
                    item
                );

        }
    );


    return resultado;

}


// ==========================================================
// OBJETO VAZIO
// ==========================================================

export function objetoVazio(
    objeto
) {

    return (
        objeto &&
        typeof objeto ===
        "object" &&
        !Array.isArray(
            objeto
        ) &&
        Object.keys(
            objeto
        ).length === 0
    );

}


// ==========================================================
// VALOR VAZIO
// ==========================================================

export function valorVazio(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return true;

    }


    if (
        typeof valor ===
        "string"
    ) {

        return (
            valor.trim() ===
            ""
        );

    }


    if (
        Array.isArray(
            valor
        )
    ) {

        return (
            valor.length ===
            0
        );

    }


    if (
        typeof valor ===
        "object"
    ) {

        return objetoVazio(
            valor
        );

    }


    return false;

}


// ==========================================================
// PRIMEIRO VALOR NÃO VAZIO
// ==========================================================

export function primeiroValor(
    ...valores
) {

    return valores.find(
        valor =>
            !valorVazio(
                valor
            )
    );

}


// ==========================================================
// COMPARAR TEXTO
// ==========================================================

export function textoIgual(
    a,
    b
) {

    return (
        normalizarPesquisa(
            a
        ) ===
        normalizarPesquisa(
            b
        )
    );

}


// ==========================================================
// CONTÉM TEXTO
// ==========================================================

export function contemTexto(
    origem,
    pesquisa
) {

    return normalizarPesquisa(
        origem
    ).includes(
        normalizarPesquisa(
            pesquisa
        )
    );

}


// ==========================================================
// DATA ATUAL
// ==========================================================

export function agora() {

    return new Date();

}


// ==========================================================
// DATA PARA YYYY-MM-DD
// ==========================================================

export function dataParaInput(
    valor = new Date()
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return "";

    }


    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${ano}-${mes}-${dia}`;

}


// ==========================================================
// DATETIME-LOCAL
// ==========================================================

export function dataHoraParaInput(
    valor = new Date()
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return "";

    }


    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        );


    const hora =
        String(
            data.getHours()
        ).padStart(
            2,
            "0"
        );


    const minuto =
        String(
            data.getMinutes()
        ).padStart(
            2,
            "0"
        );


    return (
        `${ano}-${mes}-${dia}` +
        `T${hora}:${minuto}`
    );

}


// ==========================================================
// CONVERTER PARA DATA
// ==========================================================

export function converterParaData(
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


    if (
        typeof valor ===
        "object" &&
        valor.seconds !==
        undefined
    ) {

        const data =
            new Date(
                Number(
                    valor.seconds
                ) * 1000
            );


        return Number.isNaN(
            data.getTime()
        )
            ?
            null
            :
            data;

    }


    if (
        typeof valor ===
        "string" &&
        /^\d{4}-\d{2}-\d{2}$/
            .test(
                valor
            )
    ) {

        const data =
            new Date(
                `${valor}T00:00:00`
            );


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


// ==========================================================
// FORMATAR DATA
// ==========================================================

export function formatarData(
    valor,
    opcoes = {}
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
                "numeric",

            ...opcoes

        }
    );

}


// ==========================================================
// FORMATAR DATA E HORA
// ==========================================================

export function formatarDataHora(
    valor,
    opcoes = {}
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
                "2-digit",

            ...opcoes

        }
    );

}


// ==========================================================
// FORMATAR HORA
// ==========================================================

export function formatarHora(
    valor
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return "-";

    }


    return data.toLocaleTimeString(
        "pt-BR",
        {

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


// ==========================================================
// INÍCIO DO DIA
// ==========================================================

export function inicioDoDia(
    valor = new Date()
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return null;

    }


    const resultado =
        new Date(
            data
        );


    resultado.setHours(
        0,
        0,
        0,
        0
    );


    return resultado;

}


// ==========================================================
// FIM DO DIA
// ==========================================================

export function fimDoDia(
    valor = new Date()
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return null;

    }


    const resultado =
        new Date(
            data
        );


    resultado.setHours(
        23,
        59,
        59,
        999
    );


    return resultado;

}


// ==========================================================
// ADICIONAR DIAS
// ==========================================================

export function adicionarDias(
    valor,
    quantidade
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return null;

    }


    const resultado =
        new Date(
            data
        );


    resultado.setDate(
        resultado.getDate() +
        Number(
            quantidade || 0
        )
    );


    return resultado;

}


// ==========================================================
// DIFERENÇA EM DIAS
// ==========================================================

export function diferencaDias(
    dataA,
    dataB
) {

    const a =
        inicioDoDia(
            dataA
        );


    const b =
        inicioDoDia(
            dataB
        );


    if (
        !a ||
        !b
    ) {

        return null;

    }


    const diferenca =
        b.getTime() -
        a.getTime();


    return Math.round(
        diferenca /
        86400000
    );

}


// ==========================================================
// DATA É HOJE?
// ==========================================================

export function ehHoje(
    valor
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return false;

    }


    const hoje =
        new Date();


    return (
        data.getFullYear() ===
            hoje.getFullYear()
        &&
        data.getMonth() ===
            hoje.getMonth()
        &&
        data.getDate() ===
            hoje.getDate()
    );

}


// ==========================================================
// TEMPO RELATIVO
// ==========================================================

export function tempoRelativo(
    valor
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return "-";

    }


    const agoraMs =
        Date.now();


    const diferenca =
        agoraMs -
        data.getTime();


    const segundos =
        Math.floor(
            diferenca /
            1000
        );


    if (
        segundos < 10
    ) {

        return "agora";

    }


    if (
        segundos < 60
    ) {

        return (
            `${segundos} segundos atrás`
        );

    }


    const minutos =
        Math.floor(
            segundos /
            60
        );


    if (
        minutos < 60
    ) {

        return (
            `${minutos} ${
                minutos === 1
                    ?
                    "minuto"
                    :
                    "minutos"
            } atrás`
        );

    }


    const horas =
        Math.floor(
            minutos /
            60
        );


    if (
        horas < 24
    ) {

        return (
            `${horas} ${
                horas === 1
                    ?
                    "hora"
                    :
                    "horas"
            } atrás`
        );

    }


    const dias =
        Math.floor(
            horas /
            24
        );


    if (
        dias < 30
    ) {

        return (
            `${dias} ${
                dias === 1
                    ?
                    "dia"
                    :
                    "dias"
            } atrás`
        );

    }


    return formatarData(
        data
    );

}
// ==========================================================
// SIGCOR
// assets/js/utils.js
//
// PARTE 2/6
//
// Validações e máscaras:
// - E-mail
// - Senha
// - Telefone
// - CPF
// - RG
// - Matrícula
// - Arquivos
// - MIME
// - Extensões
// ==========================================================


// ==========================================================
// SOMENTE NÚMEROS
// ==========================================================

export function somenteNumeros(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /\D/g,
            ""
        );

}


// ==========================================================
// SOMENTE LETRAS
// ==========================================================

export function somenteLetras(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /[^a-zA-ZÀ-ÿ\s]/g,
            ""
        );

}


// ==========================================================
// VALIDAR EMAIL
// ==========================================================

export function emailValido(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            String(
                email ?? ""
            )
                .trim()
        );

}


// ==========================================================
// NORMALIZAR EMAIL
// ==========================================================

export function normalizarEmail(
    email
) {

    return String(
        email ?? ""
    )
        .trim()
        .toLowerCase();

}


// ==========================================================
// VALIDAR SENHA
// ==========================================================

export function validarSenha(
    senha,
    {
        minimo = 8,
        exigirMaiuscula = true,
        exigirMinuscula = true,
        exigirNumero = true,
        exigirEspecial = true
    } = {}
) {

    const valor =
        String(
            senha ?? ""
        );


    const erros =
        [];


    if (
        valor.length <
        minimo
    ) {

        erros.push(
            `A senha deve possuir pelo menos ${minimo} caracteres.`
        );

    }


    if (
        exigirMaiuscula &&
        !/[A-Z]/
            .test(
                valor
            )
    ) {

        erros.push(
            "A senha deve possuir uma letra maiúscula."
        );

    }


    if (
        exigirMinuscula &&
        !/[a-z]/
            .test(
                valor
            )
    ) {

        erros.push(
            "A senha deve possuir uma letra minúscula."
        );

    }


    if (
        exigirNumero &&
        !/\d/
            .test(
                valor
            )
    ) {

        erros.push(
            "A senha deve possuir um número."
        );

    }


    if (
        exigirEspecial &&
        !/[^a-zA-Z0-9]/
            .test(
                valor
            )
    ) {

        erros.push(
            "A senha deve possuir um caractere especial."
        );

    }


    return {

        valida:
            erros.length === 0,

        erros

    };

}


// ==========================================================
// FORÇA DA SENHA
// ==========================================================

export function forcaSenha(
    senha
) {

    const valor =
        String(
            senha ?? ""
        );


    let pontos =
        0;


    if (
        valor.length >=
        8
    ) {

        pontos++;

    }


    if (
        valor.length >=
        12
    ) {

        pontos++;

    }


    if (
        /[A-Z]/.test(
            valor
        )
    ) {

        pontos++;

    }


    if (
        /[a-z]/.test(
            valor
        )
    ) {

        pontos++;

    }


    if (
        /\d/.test(
            valor
        )
    ) {

        pontos++;

    }


    if (
        /[^a-zA-Z0-9]/
            .test(
                valor
            )
    ) {

        pontos++;

    }


    if (
        pontos <= 2
    ) {

        return {

            nivel:
                "fraca",

            pontos

        };

    }


    if (
        pontos <= 4
    ) {

        return {

            nivel:
                "media",

            pontos

        };

    }


    return {

        nivel:
            "forte",

        pontos

    };

}


// ==========================================================
// FORMATAR TELEFONE
// ==========================================================

export function formatarTelefone(
    valor
) {

    const numeros =
        somenteNumeros(
            valor
        )
            .substring(
                0,
                11
            );


    if (
        numeros.length <=
        2
    ) {

        return numeros;

    }


    if (
        numeros.length <=
        6
    ) {

        return numeros.replace(
            /^(\d{2})(\d+)/,
            "($1) $2"
        );

    }


    if (
        numeros.length <=
        10
    ) {

        return numeros.replace(
            /^(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );

    }


    return numeros.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
    );

}


// ==========================================================
// TELEFONE VÁLIDO
// ==========================================================

export function telefoneValido(
    valor
) {

    const numeros =
        somenteNumeros(
            valor
        );


    return (
        numeros.length ===
        10
        ||
        numeros.length ===
        11
    );

}


// ==========================================================
// FORMATAR CPF
// ==========================================================

export function formatarCPF(
    valor
) {

    const numeros =
        somenteNumeros(
            valor
        )
            .substring(
                0,
                11
            );


    return numeros
        .replace(
            /(\d{3})(\d)/,
            "$1.$2"
        )
        .replace(
            /(\d{3})(\d)/,
            "$1.$2"
        )
        .replace(
            /(\d{3})(\d{1,2})$/,
            "$1-$2"
        );

}


// ==========================================================
// VALIDAR CPF
// ==========================================================

export function cpfValido(
    valor
) {

    const cpf =
        somenteNumeros(
            valor
        );


    if (
        cpf.length !==
        11
    ) {

        return false;

    }


    if (
        /^(\d)\1{10}$/
            .test(
                cpf
            )
    ) {

        return false;

    }


    let soma =
        0;


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        soma +=
            Number(
                cpf.charAt(i)
            ) *
            (
                10 - i
            );

    }


    let digito =
        11 -
        (
            soma %
            11
        );


    if (
        digito >= 10
    ) {

        digito =
            0;

    }


    if (
        digito !==
        Number(
            cpf.charAt(9)
        )
    ) {

        return false;

    }


    soma =
        0;


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        soma +=
            Number(
                cpf.charAt(i)
            ) *
            (
                11 - i
            );

    }


    digito =
        11 -
        (
            soma %
            11
        );


    if (
        digito >= 10
    ) {

        digito =
            0;

    }


    return (
        digito ===
        Number(
            cpf.charAt(10)
        )
    );

}


// ==========================================================
// FORMATAR RG
//
// Como RP pode usar RG fictício, não há validação rígida.
// ==========================================================

export function formatarRG(
    valor
) {

    return String(
        valor ?? ""
    )
        .toUpperCase()
        .replace(
            /[^A-Z0-9.\-]/g,
            ""
        )
        .substring(
            0,
            30
        );

}


// ==========================================================
// RG VÁLIDO
// ==========================================================

export function rgValido(
    valor
) {

    const texto =
        String(
            valor ?? ""
        )
            .trim();


    return (
        texto.length >=
        3
    );

}


// ==========================================================
// FORMATAR MATRÍCULA
// ==========================================================

export function formatarMatricula(
    valor
) {

    return String(
        valor ?? ""
    )
        .toUpperCase()
        .replace(
            /[^A-Z0-9\-]/g,
            ""
        )
        .substring(
            0,
            30
        );

}


// ==========================================================
// MATRÍCULA VÁLIDA
// ==========================================================

export function matriculaValida(
    valor
) {

    const texto =
        String(
            valor ?? ""
        )
            .trim();


    return (
        texto.length >=
        2
    );

}


// ==========================================================
// FORMATAR NÚMERO DE INQUÉRITO
// ==========================================================

export function formatarNumeroInquerito(
    valor
) {

    return String(
        valor ?? ""
    )
        .toUpperCase()
        .replace(
            /[^A-Z0-9\/\-]/g,
            ""
        )
        .substring(
            0,
            50
        );

}


// ==========================================================
// EXTENSÃO DO ARQUIVO
// ==========================================================

export function obterExtensao(
    nomeArquivo
) {

    const nome =
        String(
            nomeArquivo ?? ""
        );


    const indice =
        nome.lastIndexOf(
            "."
        );


    if (
        indice <= 0 ||
        indice ===
        nome.length - 1
    ) {

        return "";

    }


    return nome
        .substring(
            indice + 1
        )
        .toLowerCase();

}


// ==========================================================
// NOME SEM EXTENSÃO
// ==========================================================

export function nomeSemExtensao(
    nomeArquivo
) {

    const nome =
        String(
            nomeArquivo ?? ""
        );


    const indice =
        nome.lastIndexOf(
            "."
        );


    if (
        indice <= 0
    ) {

        return nome;

    }


    return nome.substring(
        0,
        indice
    );

}


// ==========================================================
// FORMATAR BYTES
// ==========================================================

export function formatarBytes(
    bytes,
    casas = 2
) {

    const numero =
        Number(
            bytes
        );


    if (
        !Number.isFinite(
            numero
        ) ||
        numero <= 0
    ) {

        return "0 B";

    }


    const base =
        1024;


    const unidades = [

        "B",

        "KB",

        "MB",

        "GB",

        "TB",

        "PB"

    ];


    const indice =
        Math.min(
            unidades.length - 1,
            Math.floor(
                Math.log(
                    numero
                ) /
                Math.log(
                    base
                )
            )
        );


    const resultado =
        numero /
        Math.pow(
            base,
            indice
        );


    return (
        Number(
            resultado.toFixed(
                casas
            )
        )
        +
        " "
        +
        unidades[indice]
    );

}


// ==========================================================
// MB -> BYTES
// ==========================================================

export function mbParaBytes(
    megabytes
) {

    return (
        Number(
            megabytes
        ) *
        1024 *
        1024
    );

}


// ==========================================================
// BYTES -> MB
// ==========================================================

export function bytesParaMB(
    bytes
) {

    return (
        Number(
            bytes
        ) /
        (
            1024 *
            1024
        )
    );

}


// ==========================================================
// TIPO DE ARQUIVO
// ==========================================================

export function obterTipoArquivo(
    arquivoOuMime
) {

    let mime =
        "";


    let extensao =
        "";


    if (
        typeof arquivoOuMime ===
        "string"
    ) {

        mime =
            arquivoOuMime;

    } else if (
        arquivoOuMime
    ) {

        mime =
            arquivoOuMime.type ||
            "";


        extensao =
            obterExtensao(
                arquivoOuMime.name
            );

    }


    mime =
        String(
            mime
        ).toLowerCase();


    if (
        mime.startsWith(
            "image/"
        )
        ||
        [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "bmp"
        ].includes(
            extensao
        )
    ) {

        return "imagem";

    }


    if (
        mime.startsWith(
            "video/"
        )
        ||
        [
            "mp4",
            "webm",
            "mov",
            "avi",
            "mkv"
        ].includes(
            extensao
        )
    ) {

        return "video";

    }


    if (
        mime.startsWith(
            "audio/"
        )
        ||
        [
            "mp3",
            "wav",
            "ogg",
            "m4a"
        ].includes(
            extensao
        )
    ) {

        return "audio";

    }


    if (
        mime ===
        "application/pdf"
        ||
        extensao ===
        "pdf"
    ) {

        return "pdf";

    }


    if (
        [
            "doc",
            "docx",
            "odt",
            "txt",
            "rtf"
        ].includes(
            extensao
        )
    ) {

        return "documento";

    }


    return "outro";

}


// ==========================================================
// VALIDAR ARQUIVO
// ==========================================================

export function validarArquivo(
    arquivo,
    {
        tamanhoMaximoMB = 50,
        tiposMime = [],
        extensoes = []
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


    if (
        arquivo.size >
        mbParaBytes(
            tamanhoMaximoMB
        )
    ) {

        return {

            valido:
                false,

            erro:
                `O arquivo deve possuir no máximo ${tamanhoMaximoMB} MB.`

        };

    }


    if (
        Array.isArray(
            tiposMime
        ) &&
        tiposMime.length > 0
    ) {

        const tipo =
            String(
                arquivo.type ||
                ""
            ).toLowerCase();


        const permitido =
            tiposMime.some(
                item => {

                    const regra =
                        String(
                            item
                        )
                            .toLowerCase();


                    if (
                        regra.endsWith(
                            "/*"
                        )
                    ) {

                        return tipo.startsWith(
                            regra.slice(
                                0,
                                -1
                            )
                        );

                    }


                    return (
                        tipo ===
                        regra
                    );

                }
            );


        if (!permitido) {

            return {

                valido:
                    false,

                erro:
                    "O tipo deste arquivo não é permitido."

            };

        }

    }


    if (
        Array.isArray(
            extensoes
        ) &&
        extensoes.length > 0
    ) {

        const extensao =
            obterExtensao(
                arquivo.name
            );


        const permitidas =
            extensoes.map(
                item =>
                    String(
                        item
                    )
                        .replace(
                            /^\./,
                            ""
                        )
                        .toLowerCase()
            );


        if (
            !permitidas.includes(
                extensao
            )
        ) {

            return {

                valido:
                    false,

                erro:
                    "A extensão deste arquivo não é permitida."

            };

        }

    }


    return {

        valido:
            true,

        erro:
            null

    };

}


// ==========================================================
// VALIDAR IMAGEM
// ==========================================================

export function validarImagem(
    arquivo,
    tamanhoMaximoMB = 8
) {

    return validarArquivo(
        arquivo,
        {

            tamanhoMaximoMB,

            tiposMime: [

                "image/jpeg",

                "image/png",

                "image/webp"

            ],

            extensoes: [

                "jpg",

                "jpeg",

                "png",

                "webp"

            ]

        }
    );

}


// ==========================================================
// VALIDAR VÍDEO
// ==========================================================

export function validarVideo(
    arquivo,
    tamanhoMaximoMB = 150
) {

    return validarArquivo(
        arquivo,
        {

            tamanhoMaximoMB,

            tiposMime: [

                "video/*"

            ],

            extensoes: [

                "mp4",

                "webm",

                "mov",

                "mkv"

            ]

        }
    );

}


// ==========================================================
// VALIDAR ÁUDIO
// ==========================================================

export function validarAudio(
    arquivo,
    tamanhoMaximoMB = 100
) {

    return validarArquivo(
        arquivo,
        {

            tamanhoMaximoMB,

            tiposMime: [

                "audio/*"

            ],

            extensoes: [

                "mp3",

                "wav",

                "ogg",

                "m4a"

            ]

        }
    );

}


// ==========================================================
// VALIDAR PDF
// ==========================================================

export function validarPDF(
    arquivo,
    tamanhoMaximoMB = 30
) {

    return validarArquivo(
        arquivo,
        {

            tamanhoMaximoMB,

            tiposMime: [

                "application/pdf"

            ],

            extensoes: [

                "pdf"

            ]

        }
    );

}


// ==========================================================
// NOME SEGURO PARA ARQUIVO
// ==========================================================

export function nomeArquivoSeguro(
    nomeOriginal
) {

    const nome =
        nomeSemExtensao(
            nomeOriginal
        );


    const extensao =
        obterExtensao(
            nomeOriginal
        );


    const base =
        String(
            nome
        )
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
            .replace(
                /^_+|_+$/g,
                ""
            )
            .substring(
                0,
                80
            )
        ||
        "arquivo";


    return extensao
        ?
        `${base}.${extensao}`
        :
        base;

}


// ==========================================================
// GERAR NOME ÚNICO DE ARQUIVO
// ==========================================================

export function nomeArquivoUnico(
    nomeOriginal
) {

    const seguro =
        nomeArquivoSeguro(
            nomeOriginal
        );


    const base =
        nomeSemExtensao(
            seguro
        );


    const extensao =
        obterExtensao(
            seguro
        );


    const id =
        gerarIdCurto(
            12
        );


    const nomeFinal =
        `${Date.now()}_${id}_${base}`;


    return extensao
        ?
        `${nomeFinal}.${extensao}`
        :
        nomeFinal;

}


// ==========================================================
// APLICAR MÁSCARA DE TELEFONE
// ==========================================================

export function aplicarMascaraTelefone(
    input
) {

    if (!input) {

        return;

    }


    const atualizar =
        () => {

            input.value =
                formatarTelefone(
                    input.value
                );

        };


    input.addEventListener(
        "input",
        atualizar
    );


    atualizar();

}


// ==========================================================
// APLICAR MÁSCARA DE CPF
// ==========================================================

export function aplicarMascaraCPF(
    input
) {

    if (!input) {

        return;

    }


    const atualizar =
        () => {

            input.value =
                formatarCPF(
                    input.value
                );

        };


    input.addEventListener(
        "input",
        atualizar
    );


    atualizar();

}


// ==========================================================
// APLICAR MÁSCARA DE RG
// ==========================================================

export function aplicarMascaraRG(
    input
) {

    if (!input) {

        return;

    }


    const atualizar =
        () => {

            input.value =
                formatarRG(
                    input.value
                );

        };


    input.addEventListener(
        "input",
        atualizar
    );


    atualizar();

}


// ==========================================================
// APLICAR MÁSCARA DE MATRÍCULA
// ==========================================================

export function aplicarMascaraMatricula(
    input
) {

    if (!input) {

        return;

    }


    const atualizar =
        () => {

            input.value =
                formatarMatricula(
                    input.value
                );

        };


    input.addEventListener(
        "input",
        atualizar
    );


    atualizar();

}


// ==========================================================
// CONFIGURAR MÁSCARAS AUTOMÁTICAS
//
// Exemplo HTML:
//
// data-mask="telefone"
// data-mask="cpf"
// data-mask="rg"
// data-mask="matricula"
// ==========================================================

export function configurarMascaras(
    raiz = document
) {

    raiz
        .querySelectorAll(
            '[data-mask="telefone"]'
        )
        .forEach(
            aplicarMascaraTelefone
        );


    raiz
        .querySelectorAll(
            '[data-mask="cpf"]'
        )
        .forEach(
            aplicarMascaraCPF
        );


    raiz
        .querySelectorAll(
            '[data-mask="rg"]'
        )
        .forEach(
            aplicarMascaraRG
        );


    raiz
        .querySelectorAll(
            '[data-mask="matricula"]'
        )
        .forEach(
            aplicarMascaraMatricula
        );

}
// ==========================================================
// SIGCOR
// assets/js/utils.js
//
// PARTE 3/6
//
// Navegador e DOM:
// - localStorage
// - sessionStorage
// - Clipboard
// - URL / query params
// - Download
// - Blob
// - JSON / CSV
// - DOM helpers
// ==========================================================


// ==========================================================
// LOCAL STORAGE - SALVAR
// ==========================================================

export function salvarLocal(
    chave,
    valor
) {

    try {

        const dado =
            typeof valor === "string"
                ?
                valor
                :
                JSON.stringify(
                    valor
                );


        localStorage.setItem(
            chave,
            dado
        );


        return true;

    } catch (erro) {

        console.warn(
            "SIGCOR - Erro ao salvar no localStorage:",
            erro
        );


        return false;

    }

}


// ==========================================================
// LOCAL STORAGE - LER
// ==========================================================

export function lerLocal(
    chave,
    padrao = null
) {

    try {

        const valor =
            localStorage.getItem(
                chave
            );


        if (
            valor === null
        ) {

            return padrao;

        }


        try {

            return JSON.parse(
                valor
            );

        } catch {

            return valor;

        }

    } catch {

        return padrao;

    }

}


// ==========================================================
// LOCAL STORAGE - REMOVER
// ==========================================================

export function removerLocal(
    chave
) {

    try {

        localStorage.removeItem(
            chave
        );


        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// LIMPAR LOCAL STORAGE
// ==========================================================

export function limparLocalStorage() {

    try {

        localStorage.clear();

        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// SESSION STORAGE - SALVAR
// ==========================================================

export function salvarSessao(
    chave,
    valor
) {

    try {

        const dado =
            typeof valor === "string"
                ?
                valor
                :
                JSON.stringify(
                    valor
                );


        sessionStorage.setItem(
            chave,
            dado
        );


        return true;

    } catch (erro) {

        console.warn(
            "SIGCOR - Erro ao salvar sessionStorage:",
            erro
        );


        return false;

    }

}


// ==========================================================
// SESSION STORAGE - LER
// ==========================================================

export function lerSessao(
    chave,
    padrao = null
) {

    try {

        const valor =
            sessionStorage.getItem(
                chave
            );


        if (
            valor === null
        ) {

            return padrao;

        }


        try {

            return JSON.parse(
                valor
            );

        } catch {

            return valor;

        }

    } catch {

        return padrao;

    }

}


// ==========================================================
// SESSION STORAGE - REMOVER
// ==========================================================

export function removerSessao(
    chave
) {

    try {

        sessionStorage.removeItem(
            chave
        );


        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// COPIAR TEXTO
// ==========================================================

export async function copiarParaClipboard(
    texto
) {

    const valor =
        String(
            texto ?? ""
        );


    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                valor
            );


            return true;

        }

    } catch {

        // Continua no fallback.
    }


    try {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            valor;


        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";

        textarea.style.pointerEvents =
            "none";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

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


// ==========================================================
// LER CLIPBOARD
// ==========================================================

export async function lerClipboard() {

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            return await navigator.clipboard.readText();

        }


        return null;

    } catch {

        return null;

    }

}


// ==========================================================
// QUERY PARAM
// ==========================================================

export function obterParametroURL(
    nome
) {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return parametros.get(
        nome
    );

}


// ==========================================================
// TODOS OS PARAMETROS
// ==========================================================

export function obterParametrosURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return Object.fromEntries(
        parametros.entries()
    );

}


// ==========================================================
// DEFINIR PARAMETRO
// ==========================================================

export function definirParametroURL(
    nome,
    valor,
    {
        substituirHistorico = true
    } = {}
) {

    const url =
        new URL(
            window.location.href
        );


    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        url.searchParams.delete(
            nome
        );

    } else {

        url.searchParams.set(
            nome,
            valor
        );

    }


    if (
        substituirHistorico
    ) {

        window.history.replaceState(
            {},
            "",
            url
        );

    } else {

        window.history.pushState(
            {},
            "",
            url
        );

    }


    return url.toString();

}


// ==========================================================
// REMOVER PARAMETRO
// ==========================================================

export function removerParametroURL(
    nome
) {

    return definirParametroURL(
        nome,
        null
    );

}


// ==========================================================
// OBTER HASH
// ==========================================================

export function obterHashURL() {

    return window.location.hash
        .replace(
            /^#/,
            ""
        );

}


// ==========================================================
// DEFINIR HASH
// ==========================================================

export function definirHashURL(
    hash
) {

    window.location.hash =
        String(
            hash ?? ""
        )
            .replace(
                /^#/,
                ""
            );

}


// ==========================================================
// URL ATUAL
// ==========================================================

export function urlAtual() {

    return window.location.href;

}


// ==========================================================
// CAMINHO ATUAL
// ==========================================================

export function caminhoAtual() {

    return window.location.pathname;

}


// ==========================================================
// NOME DA PÁGINA
// ==========================================================

export function paginaAtual() {

    const partes =
        window.location.pathname
            .split("/");


    return (
        partes.pop() ||
        "index.html"
    );

}


// ==========================================================
// REDIRECIONAR
// ==========================================================

export function redirecionar(
    destino,
    substituir = false
) {

    if (
        substituir
    ) {

        window.location.replace(
            destino
        );

        return;

    }


    window.location.href =
        destino;

}


// ==========================================================
// VOLTAR
// ==========================================================

export function voltarPagina(
    fallback = "./dashboard.html"
) {

    if (
        window.history.length >
        1
    ) {

        window.history.back();

        return;

    }


    window.location.href =
        fallback;

}


// ==========================================================
// CRIAR BLOB
// ==========================================================

export function criarBlob(
    conteudo,
    tipo =
        "text/plain;charset=utf-8"
) {

    return new Blob(
        [
            conteudo
        ],
        {
            type:
                tipo
        }
    );

}


// ==========================================================
// DOWNLOAD DE BLOB
// ==========================================================

export function baixarBlob(
    blob,
    nomeArquivo
) {

    if (
        !(blob instanceof Blob)
    ) {

        throw new Error(
            "Blob inválido."
        );

    }


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        nomeArquivo ||
        "arquivo";


    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        500
    );

}


// ==========================================================
// DOWNLOAD DE TEXTO
// ==========================================================

export function baixarTexto(
    conteudo,
    nomeArquivo =
        "arquivo.txt"
) {

    const blob =
        criarBlob(
            String(
                conteudo ?? ""
            ),
            "text/plain;charset=utf-8"
        );


    baixarBlob(
        blob,
        nomeArquivo
    );

}


// ==========================================================
// DOWNLOAD DE JSON
// ==========================================================

export function baixarJSON(
    dados,
    nomeArquivo =
        "dados.json"
) {

    const conteudo =
        JSON.stringify(
            dados,
            null,
            2
        );


    const blob =
        criarBlob(
            conteudo,
            "application/json;charset=utf-8"
        );


    baixarBlob(
        blob,
        nomeArquivo
    );

}


// ==========================================================
// OBJETO -> CSV
// ==========================================================

export function converterParaCSV(
    dados,
    separador = ";"
) {

    if (
        !Array.isArray(
            dados
        ) ||
        dados.length ===
        0
    ) {

        return "";

    }


    const colunas =
        [
            ...new Set(
                dados.flatMap(
                    item =>
                        Object.keys(
                            item || {}
                        )
                )
            )
        ];


    const escaparCSV =
        valor => {

            if (
                valor === null ||
                valor === undefined
            ) {

                return "";

            }


            let texto =
                typeof valor === "object"
                    ?
                    JSON.stringify(
                        valor
                    )
                    :
                    String(
                        valor
                    );


            texto =
                texto.replace(
                    /"/g,
                    '""'
                );


            if (
                texto.includes(
                    separador
                ) ||
                texto.includes(
                    "\n"
                ) ||
                texto.includes(
                    '"'
                )
            ) {

                texto =
                    `"${texto}"`;

            }


            return texto;

        };


    const cabecalho =
        colunas
            .map(
                escaparCSV
            )
            .join(
                separador
            );


    const linhas =
        dados.map(
            item => {

                return colunas
                    .map(
                        coluna =>
                            escaparCSV(
                                item?.[
                                    coluna
                                ]
                            )
                    )
                    .join(
                        separador
                    );

            }
        );


    return [
        cabecalho,
        ...linhas
    ].join(
        "\n"
    );

}


// ==========================================================
// DOWNLOAD CSV
// ==========================================================

export function baixarCSV(
    dados,
    nomeArquivo =
        "dados.csv",
    separador = ";"
) {

    const csv =
        converterParaCSV(
            dados,
            separador
        );


    // BOM melhora acentos no Excel.
    const blob =
        criarBlob(
            "\uFEFF" +
            csv,
            "text/csv;charset=utf-8"
        );


    baixarBlob(
        blob,
        nomeArquivo
    );

}


// ==========================================================
// SELECIONAR ELEMENTO
// ==========================================================

export function selecionar(
    seletor,
    raiz = document
) {

    try {

        return raiz.querySelector(
            seletor
        );

    } catch {

        return null;

    }

}


// ==========================================================
// SELECIONAR TODOS
// ==========================================================

export function selecionarTodos(
    seletor,
    raiz = document
) {

    try {

        return [
            ...raiz.querySelectorAll(
                seletor
            )
        ];

    } catch {

        return [];

    }

}


// ==========================================================
// ELEMENTO POR ID
// ==========================================================

export function porId(
    id
) {

    return document.getElementById(
        id
    );

}


// ==========================================================
// CRIAR ELEMENTO
// ==========================================================

export function criarElemento(
    tag,
    {
        classe = "",
        id = "",
        texto = "",
        html = "",
        atributos = {}
    } = {}
) {

    const elemento =
        document.createElement(
            tag
        );


    if (
        classe
    ) {

        elemento.className =
            classe;

    }


    if (
        id
    ) {

        elemento.id =
            id;

    }


    if (
        html
    ) {

        elemento.innerHTML =
            html;

    } else if (
        texto
    ) {

        elemento.textContent =
            texto;

    }


    Object.entries(
        atributos
    ).forEach(
        (
            [
                chave,
                valor
            ]
        ) => {

            if (
                valor !==
                null &&
                valor !==
                undefined
            ) {

                elemento.setAttribute(
                    chave,
                    String(
                        valor
                    )
                );

            }

        }
    );


    return elemento;

}


// ==========================================================
// MOSTRAR ELEMENTO
// ==========================================================

export function mostrar(
    elementoOuSeletor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.hidden =
        false;


    elemento.classList.remove(
        "hidden"
    );


    return true;

}


// ==========================================================
// ESCONDER ELEMENTO
// ==========================================================

export function esconder(
    elementoOuSeletor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.hidden =
        true;


    elemento.classList.add(
        "hidden"
    );


    return true;

}


// ==========================================================
// ALTERNAR ELEMENTO
// ==========================================================

export function alternarVisibilidade(
    elementoOuSeletor,
    mostrarEstado = null
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    const oculto =
        elemento.hidden ||
        elemento.classList.contains(
            "hidden"
        );


    const deveMostrar =
        mostrarEstado ===
        null
            ?
            oculto
            :
            Boolean(
                mostrarEstado
            );


    return deveMostrar
        ?
        mostrar(
            elemento
        )
        :
        esconder(
            elemento
        );

}


// ==========================================================
// DEFINIR TEXTO
// ==========================================================

export function definirTextoElemento(
    elementoOuSeletor,
    texto
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.textContent =
        texto ?? "";


    return true;

}


// ==========================================================
// DEFINIR HTML
// ==========================================================

export function definirHtmlElemento(
    elementoOuSeletor,
    html
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.innerHTML =
        html ?? "";


    return true;

}


// ==========================================================
// VALOR DE CAMPO
// ==========================================================

export function obterValorCampo(
    elementoOuSeletor,
    padrao = ""
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return padrao;

    }


    if (
        "value" in elemento
    ) {

        return String(
            elemento.value ??
            padrao
        );

    }


    return String(
        elemento.textContent ??
        padrao
    );

}


// ==========================================================
// DEFINIR VALOR DE CAMPO
// ==========================================================

export function definirValorCampo(
    elementoOuSeletor,
    valor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    if (
        "value" in elemento
    ) {

        elemento.value =
            valor ?? "";

        return true;

    }


    elemento.textContent =
        valor ?? "";


    return true;

}


// ==========================================================
// DESABILITAR ELEMENTO
// ==========================================================

export function desabilitar(
    elementoOuSeletor,
    estado = true
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    if (
        "disabled" in elemento
    ) {

        elemento.disabled =
            estado;

    }


    elemento.setAttribute(
        "aria-disabled",
        String(
            estado
        )
    );


    elemento.classList.toggle(
        "disabled",
        estado
    );


    return true;

}


// ==========================================================
// HABILITAR ELEMENTO
// ==========================================================

export function habilitar(
    elementoOuSeletor
) {

    return desabilitar(
        elementoOuSeletor,
        false
    );

}


// ==========================================================
// FOCAR ELEMENTO
// ==========================================================

export function focar(
    elementoOuSeletor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    try {

        elemento.focus();

        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// ROLAR ATÉ ELEMENTO
// ==========================================================

export function rolarAte(
    elementoOuSeletor,
    {
        comportamento =
            "smooth",

        bloco =
            "center"
    } = {}
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.scrollIntoView(
        {
            behavior:
                comportamento,

            block:
                bloco
        }
    );


    return true;

}


// ==========================================================
// RESOLVER ELEMENTO
// ==========================================================

function resolverElementoUtil(
    elementoOuSeletor
) {

    if (!elementoOuSeletor) {

        return null;

    }


    if (
        elementoOuSeletor instanceof
        HTMLElement
    ) {

        return elementoOuSeletor;

    }


    if (
        typeof elementoOuSeletor ===
        "string"
    ) {

        return (
            document.getElementById(
                elementoOuSeletor
            )
            ||
            document.querySelector(
                elementoOuSeletor
            )
        );

    }


    return null;

}


// ==========================================================
// EVENTO UMA VEZ
// ==========================================================

export function eventoUmaVez(
    elementoOuSeletor,
    evento,
    callback
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (
        !elemento ||
        typeof callback !==
        "function"
    ) {

        return false;

    }


    elemento.addEventListener(
        evento,
        callback,
        {
            once:
                true
        }
    );


    return true;

}


// ==========================================================
// DISPARAR EVENTO PERSONALIZADO
// ==========================================================

export function dispararEvento(
    nome,
    detalhes = {},
    alvo = window
) {

    try {

        alvo.dispatchEvent(
            new CustomEvent(
                nome,
                {
                    detail:
                        detalhes,

                    bubbles:
                        true
                }
            )
        );


        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// RECARREGAR PÁGINA
// ==========================================================

export function recarregarPagina() {

    window.location.reload();

}
// ==========================================================
// SIGCOR
// assets/js/utils.js
//
// PARTE 3/6
//
// Navegador e DOM:
// - localStorage
// - sessionStorage
// - Clipboard
// - URL / query params
// - Download
// - Blob
// - JSON / CSV
// - DOM helpers
// ==========================================================


// ==========================================================
// LOCAL STORAGE - SALVAR
// ==========================================================

export function salvarLocal(
    chave,
    valor
) {

    try {

        const dado =
            typeof valor === "string"
                ?
                valor
                :
                JSON.stringify(
                    valor
                );


        localStorage.setItem(
            chave,
            dado
        );


        return true;

    } catch (erro) {

        console.warn(
            "SIGCOR - Erro ao salvar no localStorage:",
            erro
        );


        return false;

    }

}


// ==========================================================
// LOCAL STORAGE - LER
// ==========================================================

export function lerLocal(
    chave,
    padrao = null
) {

    try {

        const valor =
            localStorage.getItem(
                chave
            );


        if (
            valor === null
        ) {

            return padrao;

        }


        try {

            return JSON.parse(
                valor
            );

        } catch {

            return valor;

        }

    } catch {

        return padrao;

    }

}


// ==========================================================
// LOCAL STORAGE - REMOVER
// ==========================================================

export function removerLocal(
    chave
) {

    try {

        localStorage.removeItem(
            chave
        );


        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// LIMPAR LOCAL STORAGE
// ==========================================================

export function limparLocalStorage() {

    try {

        localStorage.clear();

        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// SESSION STORAGE - SALVAR
// ==========================================================

export function salvarSessao(
    chave,
    valor
) {

    try {

        const dado =
            typeof valor === "string"
                ?
                valor
                :
                JSON.stringify(
                    valor
                );


        sessionStorage.setItem(
            chave,
            dado
        );


        return true;

    } catch (erro) {

        console.warn(
            "SIGCOR - Erro ao salvar sessionStorage:",
            erro
        );


        return false;

    }

}


// ==========================================================
// SESSION STORAGE - LER
// ==========================================================

export function lerSessao(
    chave,
    padrao = null
) {

    try {

        const valor =
            sessionStorage.getItem(
                chave
            );


        if (
            valor === null
        ) {

            return padrao;

        }


        try {

            return JSON.parse(
                valor
            );

        } catch {

            return valor;

        }

    } catch {

        return padrao;

    }

}


// ==========================================================
// SESSION STORAGE - REMOVER
// ==========================================================

export function removerSessao(
    chave
) {

    try {

        sessionStorage.removeItem(
            chave
        );


        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// COPIAR TEXTO
// ==========================================================

export async function copiarParaClipboard(
    texto
) {

    const valor =
        String(
            texto ?? ""
        );


    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                valor
            );


            return true;

        }

    } catch {

        // Continua no fallback.
    }


    try {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            valor;


        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";

        textarea.style.pointerEvents =
            "none";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

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


// ==========================================================
// LER CLIPBOARD
// ==========================================================

export async function lerClipboard() {

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            return await navigator.clipboard.readText();

        }


        return null;

    } catch {

        return null;

    }

}


// ==========================================================
// QUERY PARAM
// ==========================================================

export function obterParametroURL(
    nome
) {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return parametros.get(
        nome
    );

}


// ==========================================================
// TODOS OS PARAMETROS
// ==========================================================

export function obterParametrosURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return Object.fromEntries(
        parametros.entries()
    );

}


// ==========================================================
// DEFINIR PARAMETRO
// ==========================================================

export function definirParametroURL(
    nome,
    valor,
    {
        substituirHistorico = true
    } = {}
) {

    const url =
        new URL(
            window.location.href
        );


    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        url.searchParams.delete(
            nome
        );

    } else {

        url.searchParams.set(
            nome,
            valor
        );

    }


    if (
        substituirHistorico
    ) {

        window.history.replaceState(
            {},
            "",
            url
        );

    } else {

        window.history.pushState(
            {},
            "",
            url
        );

    }


    return url.toString();

}


// ==========================================================
// REMOVER PARAMETRO
// ==========================================================

export function removerParametroURL(
    nome
) {

    return definirParametroURL(
        nome,
        null
    );

}


// ==========================================================
// OBTER HASH
// ==========================================================

export function obterHashURL() {

    return window.location.hash
        .replace(
            /^#/,
            ""
        );

}


// ==========================================================
// DEFINIR HASH
// ==========================================================

export function definirHashURL(
    hash
) {

    window.location.hash =
        String(
            hash ?? ""
        )
            .replace(
                /^#/,
                ""
            );

}


// ==========================================================
// URL ATUAL
// ==========================================================

export function urlAtual() {

    return window.location.href;

}


// ==========================================================
// CAMINHO ATUAL
// ==========================================================

export function caminhoAtual() {

    return window.location.pathname;

}


// ==========================================================
// NOME DA PÁGINA
// ==========================================================

export function paginaAtual() {

    const partes =
        window.location.pathname
            .split("/");


    return (
        partes.pop() ||
        "index.html"
    );

}


// ==========================================================
// REDIRECIONAR
// ==========================================================

export function redirecionar(
    destino,
    substituir = false
) {

    if (
        substituir
    ) {

        window.location.replace(
            destino
        );

        return;

    }


    window.location.href =
        destino;

}


// ==========================================================
// VOLTAR
// ==========================================================

export function voltarPagina(
    fallback = "./dashboard.html"
) {

    if (
        window.history.length >
        1
    ) {

        window.history.back();

        return;

    }


    window.location.href =
        fallback;

}


// ==========================================================
// CRIAR BLOB
// ==========================================================

export function criarBlob(
    conteudo,
    tipo =
        "text/plain;charset=utf-8"
) {

    return new Blob(
        [
            conteudo
        ],
        {
            type:
                tipo
        }
    );

}


// ==========================================================
// DOWNLOAD DE BLOB
// ==========================================================

export function baixarBlob(
    blob,
    nomeArquivo
) {

    if (
        !(blob instanceof Blob)
    ) {

        throw new Error(
            "Blob inválido."
        );

    }


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        nomeArquivo ||
        "arquivo";


    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        500
    );

}


// ==========================================================
// DOWNLOAD DE TEXTO
// ==========================================================

export function baixarTexto(
    conteudo,
    nomeArquivo =
        "arquivo.txt"
) {

    const blob =
        criarBlob(
            String(
                conteudo ?? ""
            ),
            "text/plain;charset=utf-8"
        );


    baixarBlob(
        blob,
        nomeArquivo
    );

}


// ==========================================================
// DOWNLOAD DE JSON
// ==========================================================

export function baixarJSON(
    dados,
    nomeArquivo =
        "dados.json"
) {

    const conteudo =
        JSON.stringify(
            dados,
            null,
            2
        );


    const blob =
        criarBlob(
            conteudo,
            "application/json;charset=utf-8"
        );


    baixarBlob(
        blob,
        nomeArquivo
    );

}


// ==========================================================
// OBJETO -> CSV
// ==========================================================

export function converterParaCSV(
    dados,
    separador = ";"
) {

    if (
        !Array.isArray(
            dados
        ) ||
        dados.length ===
        0
    ) {

        return "";

    }


    const colunas =
        [
            ...new Set(
                dados.flatMap(
                    item =>
                        Object.keys(
                            item || {}
                        )
                )
            )
        ];


    const escaparCSV =
        valor => {

            if (
                valor === null ||
                valor === undefined
            ) {

                return "";

            }


            let texto =
                typeof valor === "object"
                    ?
                    JSON.stringify(
                        valor
                    )
                    :
                    String(
                        valor
                    );


            texto =
                texto.replace(
                    /"/g,
                    '""'
                );


            if (
                texto.includes(
                    separador
                ) ||
                texto.includes(
                    "\n"
                ) ||
                texto.includes(
                    '"'
                )
            ) {

                texto =
                    `"${texto}"`;

            }


            return texto;

        };


    const cabecalho =
        colunas
            .map(
                escaparCSV
            )
            .join(
                separador
            );


    const linhas =
        dados.map(
            item => {

                return colunas
                    .map(
                        coluna =>
                            escaparCSV(
                                item?.[
                                    coluna
                                ]
                            )
                    )
                    .join(
                        separador
                    );

            }
        );


    return [
        cabecalho,
        ...linhas
    ].join(
        "\n"
    );

}


// ==========================================================
// DOWNLOAD CSV
// ==========================================================

export function baixarCSV(
    dados,
    nomeArquivo =
        "dados.csv",
    separador = ";"
) {

    const csv =
        converterParaCSV(
            dados,
            separador
        );


    // BOM melhora acentos no Excel.
    const blob =
        criarBlob(
            "\uFEFF" +
            csv,
            "text/csv;charset=utf-8"
        );


    baixarBlob(
        blob,
        nomeArquivo
    );

}


// ==========================================================
// SELECIONAR ELEMENTO
// ==========================================================

export function selecionar(
    seletor,
    raiz = document
) {

    try {

        return raiz.querySelector(
            seletor
        );

    } catch {

        return null;

    }

}


// ==========================================================
// SELECIONAR TODOS
// ==========================================================

export function selecionarTodos(
    seletor,
    raiz = document
) {

    try {

        return [
            ...raiz.querySelectorAll(
                seletor
            )
        ];

    } catch {

        return [];

    }

}


// ==========================================================
// ELEMENTO POR ID
// ==========================================================

export function porId(
    id
) {

    return document.getElementById(
        id
    );

}


// ==========================================================
// CRIAR ELEMENTO
// ==========================================================

export function criarElemento(
    tag,
    {
        classe = "",
        id = "",
        texto = "",
        html = "",
        atributos = {}
    } = {}
) {

    const elemento =
        document.createElement(
            tag
        );


    if (
        classe
    ) {

        elemento.className =
            classe;

    }


    if (
        id
    ) {

        elemento.id =
            id;

    }


    if (
        html
    ) {

        elemento.innerHTML =
            html;

    } else if (
        texto
    ) {

        elemento.textContent =
            texto;

    }


    Object.entries(
        atributos
    ).forEach(
        (
            [
                chave,
                valor
            ]
        ) => {

            if (
                valor !==
                null &&
                valor !==
                undefined
            ) {

                elemento.setAttribute(
                    chave,
                    String(
                        valor
                    )
                );

            }

        }
    );


    return elemento;

}


// ==========================================================
// MOSTRAR ELEMENTO
// ==========================================================

export function mostrar(
    elementoOuSeletor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.hidden =
        false;


    elemento.classList.remove(
        "hidden"
    );


    return true;

}


// ==========================================================
// ESCONDER ELEMENTO
// ==========================================================

export function esconder(
    elementoOuSeletor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.hidden =
        true;


    elemento.classList.add(
        "hidden"
    );


    return true;

}


// ==========================================================
// ALTERNAR ELEMENTO
// ==========================================================

export function alternarVisibilidade(
    elementoOuSeletor,
    mostrarEstado = null
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    const oculto =
        elemento.hidden ||
        elemento.classList.contains(
            "hidden"
        );


    const deveMostrar =
        mostrarEstado ===
        null
            ?
            oculto
            :
            Boolean(
                mostrarEstado
            );


    return deveMostrar
        ?
        mostrar(
            elemento
        )
        :
        esconder(
            elemento
        );

}


// ==========================================================
// DEFINIR TEXTO
// ==========================================================

export function definirTextoElemento(
    elementoOuSeletor,
    texto
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.textContent =
        texto ?? "";


    return true;

}


// ==========================================================
// DEFINIR HTML
// ==========================================================

export function definirHtmlElemento(
    elementoOuSeletor,
    html
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.innerHTML =
        html ?? "";


    return true;

}


// ==========================================================
// VALOR DE CAMPO
// ==========================================================

export function obterValorCampo(
    elementoOuSeletor,
    padrao = ""
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return padrao;

    }


    if (
        "value" in elemento
    ) {

        return String(
            elemento.value ??
            padrao
        );

    }


    return String(
        elemento.textContent ??
        padrao
    );

}


// ==========================================================
// DEFINIR VALOR DE CAMPO
// ==========================================================

export function definirValorCampo(
    elementoOuSeletor,
    valor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    if (
        "value" in elemento
    ) {

        elemento.value =
            valor ?? "";

        return true;

    }


    elemento.textContent =
        valor ?? "";


    return true;

}


// ==========================================================
// DESABILITAR ELEMENTO
// ==========================================================

export function desabilitar(
    elementoOuSeletor,
    estado = true
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    if (
        "disabled" in elemento
    ) {

        elemento.disabled =
            estado;

    }


    elemento.setAttribute(
        "aria-disabled",
        String(
            estado
        )
    );


    elemento.classList.toggle(
        "disabled",
        estado
    );


    return true;

}


// ==========================================================
// HABILITAR ELEMENTO
// ==========================================================

export function habilitar(
    elementoOuSeletor
) {

    return desabilitar(
        elementoOuSeletor,
        false
    );

}


// ==========================================================
// FOCAR ELEMENTO
// ==========================================================

export function focar(
    elementoOuSeletor
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    try {

        elemento.focus();

        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// ROLAR ATÉ ELEMENTO
// ==========================================================

export function rolarAte(
    elementoOuSeletor,
    {
        comportamento =
            "smooth",

        bloco =
            "center"
    } = {}
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (!elemento) {

        return false;

    }


    elemento.scrollIntoView(
        {
            behavior:
                comportamento,

            block:
                bloco
        }
    );


    return true;

}


// ==========================================================
// RESOLVER ELEMENTO
// ==========================================================

function resolverElementoUtil(
    elementoOuSeletor
) {

    if (!elementoOuSeletor) {

        return null;

    }


    if (
        elementoOuSeletor instanceof
        HTMLElement
    ) {

        return elementoOuSeletor;

    }


    if (
        typeof elementoOuSeletor ===
        "string"
    ) {

        return (
            document.getElementById(
                elementoOuSeletor
            )
            ||
            document.querySelector(
                elementoOuSeletor
            )
        );

    }


    return null;

}


// ==========================================================
// EVENTO UMA VEZ
// ==========================================================

export function eventoUmaVez(
    elementoOuSeletor,
    evento,
    callback
) {

    const elemento =
        resolverElementoUtil(
            elementoOuSeletor
        );


    if (
        !elemento ||
        typeof callback !==
        "function"
    ) {

        return false;

    }


    elemento.addEventListener(
        evento,
        callback,
        {
            once:
                true
        }
    );


    return true;

}


// ==========================================================
// DISPARAR EVENTO PERSONALIZADO
// ==========================================================

export function dispararEvento(
    nome,
    detalhes = {},
    alvo = window
) {

    try {

        alvo.dispatchEvent(
            new CustomEvent(
                nome,
                {
                    detail:
                        detalhes,

                    bubbles:
                        true
                }
            )
        );


        return true;

    } catch {

        return false;

    }

}


// ==========================================================
// RECARREGAR PÁGINA
// ==========================================================

export function recarregarPagina() {

    window.location.reload();

}
// ==========================================================
// SIGCOR
// assets/js/utils.js
//
// PARTE 5/6
//
// Utilidades específicas do sistema:
// - Cargos
// - Permissões
// - Status
// - Firebase errors
// - Iniciais
// - Caminhos
// - Evidências
// - Inquéritos
// ==========================================================


// ==========================================================
// NORMALIZAR CARGO
// ==========================================================

export function normalizarCargoUtil(
    cargo
) {

    return normalizarTexto(
        cargo
    );

}


// ==========================================================
// NOME DO CARGO
// ==========================================================

export function obterNomeCargoUtil(
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


    const chave =
        normalizarTexto(
            cargo
        );


    return (
        mapa[
            chave
        ] ||
        cargo ||
        "-"
    );

}


// ==========================================================
// CARGOS DISPONÍVEIS
// ==========================================================

export function obterCargosDisponiveis() {

    return [

        {
            valor:
                "administrador",

            nome:
                "Administrador"
        },

        {
            valor:
                "corregedor_geral",

            nome:
                "Corregedor-Geral"
        },

        {
            valor:
                "sub_corregedor",

            nome:
                "Subcorregedor"
        },

        {
            valor:
                "corregedor",

            nome:
                "Corregedor"
        },

        {
            valor:
                "investigador",

            nome:
                "Investigador"
        },

        {
            valor:
                "perito",

            nome:
                "Perito"
        },

        {
            valor:
                "escrivao",

            nome:
                "Escrivão"
        },

        {
            valor:
                "consulta",

            nome:
                "Consulta"
        }

    ];

}


// ==========================================================
// VERIFICAR CARGO
// ==========================================================

export function cargoEh(
    cargo,
    esperado
) {

    return (
        normalizarTexto(
            cargo
        ) ===
        normalizarTexto(
            esperado
        )
    );

}


// ==========================================================
// CARGO EM LISTA
// ==========================================================

export function cargoPermitido(
    cargo,
    permitidos = []
) {

    const atual =
        normalizarTexto(
            cargo
        );


    return garantirArray(
        permitidos
    )
        .map(
            normalizarTexto
        )
        .includes(
            atual
        );

}


// ==========================================================
// É ADMINISTRADOR
// ==========================================================

export function ehAdministrador(
    perfil
) {

    return cargoEh(
        perfil?.cargo,
        "administrador"
    );

}


// ==========================================================
// É CORREGEDOR GERAL
// ==========================================================

export function ehCorregedorGeral(
    perfil
) {

    return cargoEh(
        perfil?.cargo,
        "corregedor_geral"
    );

}


// ==========================================================
// É ADMINISTRAÇÃO
// ==========================================================

export function ehAdministracao(
    perfil
) {

    return (
        ehAdministrador(
            perfil
        )
        ||
        ehCorregedorGeral(
            perfil
        )
    );

}


// ==========================================================
// USUÁRIO ATIVO
// ==========================================================

export function usuarioAtivoUtil(
    perfil
) {

    return (
        normalizarTexto(
            perfil?.status
        ) ===
        "ativo"
    );

}


// ==========================================================
// TEM PERMISSÃO
// ==========================================================

export function temPermissaoUtil(
    perfil,
    permissao
) {

    if (
        !perfil ||
        !permissao
    ) {

        return false;

    }


    if (
        ehAdministracao(
            perfil
        )
    ) {

        return true;

    }


    return (
        perfil.permissoes?.[
            permissao
        ] === true
    );

}


// ==========================================================
// LISTA DE PERMISSÕES
// ==========================================================

export function obterPermissoesDisponiveis() {

    return [

        {
            chave:
                "criarInquerito",

            nome:
                "Criar inquéritos"
        },

        {
            chave:
                "editarInquerito",

            nome:
                "Editar inquéritos"
        },

        {
            chave:
                "finalizarInquerito",

            nome:
                "Finalizar inquéritos"
        },

        {
            chave:
                "arquivarInquerito",

            nome:
                "Arquivar inquéritos"
        },

        {
            chave:
                "excluirInquerito",

            nome:
                "Excluir inquéritos"
        },

        {
            chave:
                "verEvidencias",

            nome:
                "Visualizar evidências"
        },

        {
            chave:
                "adicionarEvidencias",

            nome:
                "Adicionar evidências"
        },

        {
            chave:
                "gerenciarUsuarios",

            nome:
                "Gerenciar usuários"
        },

        {
            chave:
                "gerenciarDepartamentos",

            nome:
                "Gerenciar departamentos"
        },

        {
            chave:
                "verLogs",

            nome:
                "Visualizar auditoria"
        }

    ];

}


// ==========================================================
// GERAR INICIAIS
// ==========================================================

export function gerarIniciaisUtil(
    nome,
    limite = 2
) {

    const partes =
        String(
            nome ?? ""
        )
            .trim()
            .split(
                /\s+/
            )
            .filter(
                Boolean
            );


    if (
        partes.length ===
        0
    ) {

        return "?";

    }


    if (
        partes.length ===
        1
    ) {

        return partes[0]
            .substring(
                0,
                limite
            )
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[
            partes.length - 1
        ][0]
    )
        .substring(
            0,
            limite
        )
        .toUpperCase();

}


// ==========================================================
// NOME DE STATUS DO USUÁRIO
// ==========================================================

export function nomeStatusUsuarioUtil(
    status
) {

    const mapa = {

        ativo:
            "Ativo",

        pendente:
            "Pendente",

        suspenso:
            "Suspenso",

        inativo:
            "Inativo"

    };


    const chave =
        normalizarTexto(
            status
        );


    return (
        mapa[
            chave
        ] ||
        status ||
        "-"
    );

}


// ==========================================================
// STATUS DE INQUÉRITO
// ==========================================================

export function nomeStatusInqueritoUtil(
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


    const chave =
        normalizarTexto(
            status
        );


    return (
        mapa[
            chave
        ] ||
        status ||
        "-"
    );

}


// ==========================================================
// STATUS DISPONÍVEIS DO INQUÉRITO
// ==========================================================

export function obterStatusInqueritos() {

    return [

        {
            valor:
                "rascunho",

            nome:
                "Rascunho"
        },

        {
            valor:
                "em_andamento",

            nome:
                "Em andamento"
        },

        {
            valor:
                "em_analise",

            nome:
                "Em análise"
        },

        {
            valor:
                "em_investigacao",

            nome:
                "Em investigação"
        },

        {
            valor:
                "aguardando_decisao",

            nome:
                "Aguardando decisão"
        },

        {
            valor:
                "concluido",

            nome:
                "Concluído"
        },

        {
            valor:
                "arquivado",

            nome:
                "Arquivado"
        }

    ];

}


// ==========================================================
// COR DE STATUS
// ==========================================================

export function classeStatusUtil(
    status
) {

    const chave =
        normalizarTexto(
            status
        );


    const mapa = {

        ativo:
            "success",

        concluido:
            "success",

        pendente:
            "warning",

        em_andamento:
            "warning",

        em_analise:
            "info",

        em_investigacao:
            "warning",

        aguardando_decisao:
            "warning",

        suspenso:
            "danger",

        inativo:
            "muted",

        rascunho:
            "muted",

        arquivado:
            "muted"

    };


    return (
        mapa[
            chave
        ] ||
        "muted"
    );

}


// ==========================================================
// GERAR NÚMERO VISUAL DE INQUÉRITO
//
// Apenas visual.
// A numeração oficial continua no api.js.
// ==========================================================

export function gerarNumeroInqueritoVisual(
    sequencial,
    ano =
        new Date()
            .getFullYear()
) {

    const numero =
        Math.max(
            0,
            Number(
                sequencial
            ) || 0
        );


    return (
        `IP-CG/${String(numero).padStart(4, "0")}/${ano}`
    );

}


// ==========================================================
// VALIDAR NÚMERO DE INQUÉRITO
// ==========================================================

export function numeroInqueritoValido(
    numero
) {

    const valor =
        String(
            numero ?? ""
        )
            .trim()
            .toUpperCase();


    return /^IP-CG\/\d{4,}\/\d{4}$/
        .test(
            valor
        );

}


// ==========================================================
// TIPO DE ENVOLVIDO
// ==========================================================

export function nomeTipoEnvolvido(
    tipo
) {

    const mapa = {

        vitima:
            "Vítima",

        autor:
            "Autor do fato",

        testemunha:
            "Testemunha",

        investigado:
            "Investigado",

        suspeito:
            "Suspeito",

        outro:
            "Outro"

    };


    const chave =
        normalizarTexto(
            tipo
        );


    return (
        mapa[
            chave
        ] ||
        tipo ||
        "-"
    );

}


// ==========================================================
// TIPOS DE ENVOLVIDOS
// ==========================================================

export function obterTiposEnvolvidos() {

    return [

        {
            valor:
                "vitima",

            nome:
                "Vítima"
        },

        {
            valor:
                "autor",

            nome:
                "Autor do fato"
        },

        {
            valor:
                "testemunha",

            nome:
                "Testemunha"
        },

        {
            valor:
                "investigado",

            nome:
                "Investigado"
        },

        {
            valor:
                "suspeito",

            nome:
                "Suspeito"
        },

        {
            valor:
                "outro",

            nome:
                "Outro"
        }

    ];

}


// ==========================================================
// TIPO DE EVIDÊNCIA
// ==========================================================

export function nomeTipoEvidencia(
    tipo
) {

    const mapa = {

        imagem:
            "Imagem",

        video:
            "Vídeo",

        audio:
            "Áudio",

        documento:
            "Documento",

        pdf:
            "PDF",

        link:
            "Link",

        outro:
            "Outro"

    };


    const chave =
        normalizarTexto(
            tipo
        );


    return (
        mapa[
            chave
        ] ||
        tipo ||
        "-"
    );

}


// ==========================================================
// CAMINHO BASE DE INQUÉRITO
// ==========================================================

export function caminhoInquerito(
    id
) {

    const seguro =
        limparSegmentoCaminho(
            id
        );


    if (!seguro) {

        throw new Error(
            "ID do inquérito inválido."
        );

    }


    return (
        `inqueritos/${seguro}`
    );

}


// ==========================================================
// CAMINHO DE EVIDÊNCIA
// ==========================================================

export function caminhoEvidencias(
    inqueritoId
) {

    return (
        `${caminhoInquerito(inqueritoId)}/evidencias`
    );

}


// ==========================================================
// CAMINHO DE DEPOIMENTO
// ==========================================================

export function caminhoDepoimentos(
    inqueritoId
) {

    return (
        `${caminhoInquerito(inqueritoId)}/depoimentos`
    );

}


// ==========================================================
// CAMINHO DE ASSINATURA
// ==========================================================

export function caminhoAssinaturas(
    inqueritoId
) {

    return (
        `${caminhoInquerito(inqueritoId)}/assinaturas`
    );

}


// ==========================================================
// CAMINHO DE ENVOLVIDO
// ==========================================================

export function caminhoEnvolvido(
    inqueritoId,
    envolvidoId
) {

    const id =
        limparSegmentoCaminho(
            envolvidoId
        );


    if (!id) {

        throw new Error(
            "ID do envolvido inválido."
        );

    }


    return (
        `${caminhoInquerito(inqueritoId)}/envolvidos/${id}`
    );

}


// ==========================================================
// CAMINHO DE USUÁRIO
// ==========================================================

export function caminhoUsuario(
    uid
) {

    const id =
        limparSegmentoCaminho(
            uid
        );


    if (!id) {

        throw new Error(
            "UID inválido."
        );

    }


    return (
        `usuarios/${id}`
    );

}


// ==========================================================
// LIMPAR SEGMENTO DE CAMINHO
// ==========================================================

export function limparSegmentoCaminho(
    valor
) {

    return String(
        valor ?? ""
    )
        .trim()
        .replace(
            /[\/\\]/g,
            "_"
        )
        .replace(
            /\s+/g,
            "_"
        )
        .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        )
        .substring(
            0,
            150
        );

}


// ==========================================================
// VALIDAR URL
// ==========================================================

export function urlValida(
    valor
) {

    try {

        const url =
            new URL(
                valor
            );


        return (
            url.protocol ===
            "http:"
            ||
            url.protocol ===
            "https:"
        );

    } catch {

        return false;

    }

}


// ==========================================================
// NORMALIZAR URL
// ==========================================================

export function normalizarURL(
    valor
) {

    const texto =
        String(
            valor ?? ""
        ).trim();


    if (!texto) {

        return "";

    }


    if (
        /^https?:\/\//i
            .test(
                texto
            )
    ) {

        return texto;

    }


    return (
        `https://${texto}`
    );

}


// ==========================================================
// TRADUZIR ERRO FIREBASE
// ==========================================================

export function traduzirErroFirebase(
    erro
) {

    const codigo =
        erro?.code ||
        erro?.message ||
        "";


    const mapa = {

        "auth/invalid-email":
            "E-mail inválido.",

        "auth/invalid-credential":
            "E-mail ou senha incorretos.",

        "auth/user-not-found":
            "Usuário não encontrado.",

        "auth/wrong-password":
            "Senha incorreta.",

        "auth/user-disabled":
            "Esta conta foi desativada.",

        "auth/too-many-requests":
            "Muitas tentativas. Aguarde alguns minutos.",

        "auth/network-request-failed":
            "Não foi possível conectar ao Firebase.",

        "auth/email-already-in-use":
            "Este e-mail já está cadastrado.",

        "auth/weak-password":
            "A senha informada é muito fraca.",

        "permission-denied":
            "Você não possui permissão para realizar esta operação.",

        "firestore/permission-denied":
            "O Firestore recusou esta operação.",

        "storage/unauthorized":
            "Você não possui permissão para acessar este arquivo.",

        "storage/object-not-found":
            "O arquivo solicitado não foi encontrado.",

        "storage/quota-exceeded":
            "O limite do Firebase Storage foi atingido.",

        "storage/retry-limit-exceeded":
            "O envio demorou demais. Tente novamente.",

        "storage/invalid-format":
            "Formato de arquivo inválido."

    };


    return (
        mapa[
            codigo
        ] ||
        erro?.message ||
        "Ocorreu um erro inesperado."
    );

}


// ==========================================================
// VERIFICAR ERRO DE PERMISSÃO
// ==========================================================

export function ehErroPermissao(
    erro
) {

    const codigo =
        erro?.code ||
        erro?.message ||
        "";


    return [
        "permission-denied",
        "firestore/permission-denied",
        "storage/unauthorized"
    ].includes(
        codigo
    );

}


// ==========================================================
// VERIFICAR ERRO DE REDE
// ==========================================================

export function ehErroRede(
    erro
) {

    const codigo =
        erro?.code ||
        "";


    return [
        "auth/network-request-failed",
        "unavailable",
        "firestore/unavailable"
    ].includes(
        codigo
    );

}


// ==========================================================
// STATUS ONLINE
// ==========================================================

export function estaOnline() {

    return navigator.onLine;

}


// ==========================================================
// OBSERVAR CONEXÃO
// ==========================================================

export function observarConexao(
    callback
) {

    if (
        typeof callback !==
        "function"
    ) {

        return () => {};

    }


    const online =
        () =>
            callback(
                true
            );


    const offline =
        () =>
            callback(
                false
            );


    window.addEventListener(
        "online",
        online
    );


    window.addEventListener(
        "offline",
        offline
    );


    callback(
        navigator.onLine
    );


    return () => {

        window.removeEventListener(
            "online",
            online
        );


        window.removeEventListener(
            "offline",
            offline
        );

    };

}


// ==========================================================
// IDIOMA DO NAVEGADOR
// ==========================================================

export function idiomaNavegador() {

    return (
        navigator.language ||
        "pt-BR"
    );

}


// ==========================================================
// DISPOSITIVO MOBILE
// ==========================================================

export function ehMobile() {

    return (
        window.matchMedia(
            "(max-width: 768px)"
        ).matches
    );

}


// ==========================================================
// TOUCH
// ==========================================================

export function suportaTouch() {

    return (
        "ontouchstart" in
        window
        ||
        navigator.maxTouchPoints >
        0
    );

}


// ==========================================================
// LARGURA DA TELA
// ==========================================================

export function larguraTela() {

    return window.innerWidth;

}


// ==========================================================
// ALTURA DA TELA
// ==========================================================

export function alturaTela() {

    return window.innerHeight;

}


// ==========================================================
// COPIAR OBJETO SEM CAMPOS
// ==========================================================

export function omitirCampos(
    objeto,
    campos = []
) {

    const copia = {

        ...(
            objeto ||
            {}
        )

    };


    garantirArray(
        campos
    ).forEach(
        campo => {

            delete copia[
                campo
            ];

        }
    );


    return copia;

}


// ==========================================================
// PEGAR APENAS CAMPOS
// ==========================================================

export function selecionarCampos(
    objeto,
    campos = []
) {

    const resultado =
        {};


    garantirArray(
        campos
    ).forEach(
        campo => {

            if (
                Object.prototype.hasOwnProperty.call(
                    objeto ||
                    {},
                    campo
                )
            ) {

                resultado[
                    campo
                ] =
                    objeto[
                        campo
                    ];

            }

        }
    );


    return resultado;

}


// ==========================================================
// MESCLAR OBJETOS PROFUNDAMENTE
// ==========================================================

export function mesclarObjetos(
    alvo = {},
    origem = {}
) {

    const resultado = {

        ...alvo

    };


    Object.entries(
        origem ||
        {}
    ).forEach(
        (
            [
                chave,
                valor
            ]
        ) => {

            if (
                valor &&
                typeof valor ===
                "object" &&
                !Array.isArray(
                    valor
                ) &&
                !(valor instanceof Date)
            ) {

                resultado[
                    chave
                ] =
                    mesclarObjetos(
                        resultado[
                            chave
                        ] ||
                        {},
                        valor
                    );


                return;

            }


            resultado[
                chave
            ] =
                valor;

        }
    );


    return resultado;

}
// ==========================================================
// SIGCOR
// assets/js/utils.js
//
// PARTE 6/6
//
// Utilidades finais:
// - JSON seguro
// - Relatórios
// - Impressão
// - Performance
// - Eventos
// - Datas amigáveis
// - Objetos
// - API global
// ==========================================================


// ==========================================================
// JSON SEGURO - STRINGIFY
// ==========================================================

export function jsonSeguro(
    valor,
    espacos = 2
) {

    try {

        return JSON.stringify(
            valor,
            (
                chave,
                item
            ) => {

                if (
                    item instanceof Date
                ) {

                    return item.toISOString();

                }


                if (
                    typeof item?.toDate ===
                    "function"
                ) {

                    return item
                        .toDate()
                        .toISOString();

                }


                return item;

            },
            espacos
        );

    } catch (erro) {

        console.warn(
            "SIGCOR - Erro ao converter JSON:",
            erro
        );


        return "{}";

    }

}


// ==========================================================
// PARSE JSON SEGURO
// ==========================================================

export function parseJSONSeguro(
    valor,
    padrao = null
) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return padrao;

    }


    if (
        typeof valor !==
        "string"
    ) {

        return valor;

    }


    try {

        return JSON.parse(
            valor
        );

    } catch {

        return padrao;

    }

}


// ==========================================================
// GERAR DATA PARA NOME DE ARQUIVO
// ==========================================================

export function dataParaNomeArquivo(
    valor = new Date()
) {

    const data =
        converterParaData(
            valor
        );


    if (!data) {

        return "";

    }


    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        );


    const hora =
        String(
            data.getHours()
        ).padStart(
            2,
            "0"
        );


    const minuto =
        String(
            data.getMinutes()
        ).padStart(
            2,
            "0"
        );


    const segundo =
        String(
            data.getSeconds()
        ).padStart(
            2,
            "0"
        );


    return (
        `${ano}-${mes}-${dia}_` +
        `${hora}-${minuto}-${segundo}`
    );

}


// ==========================================================
// GERAR NOME DE RELATÓRIO
// ==========================================================

export function gerarNomeRelatorio(
    titulo =
        "relatorio",
    extensao =
        "pdf"
) {

    const nome =
        gerarSlug(
            titulo
        )
        ||
        "relatorio";


    return (
        `${nome}_${dataParaNomeArquivo()}.${String(extensao).replace(/^\./, "")}`
    );

}


// ==========================================================
// IMPRIMIR ELEMENTO
// ==========================================================

export function imprimirElemento(
    elementoOuSeletor,
    {
        titulo =
            "SIGCOR",

        estilos =
            ""
    } = {}
) {

    let elemento =
        elementoOuSeletor;





    if (
        typeof elementoOuSeletor ===
        "string"
    ) {

        elemento =
            document.querySelector(
                elementoOuSeletor
            )
            ||
            document.getElementById(
                elementoOuSeletor
            );

    }


    if (!elemento) {

        return false;

    }


    const janela =
        window.open(
            "",
            "_blank",
            "width=1000,height=800"
        );


    if (!janela) {

        return false;

    }


    janela.document.write(`

        <!DOCTYPE html>

        <html lang="pt-BR">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>
                ${escaparHTML(titulo)}
            </title>

            <style>

                * {
                    box-sizing:
                        border-box;
                }

                body {
                    margin:
                        30px;

                    color:
                        #111827;

                    background:
                        #ffffff;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    font-size:
                        12px;
                }

                img {
                    max-width:
                        100%;
                }

                table {
                    width:
                        100%;

                    border-collapse:
                        collapse;
                }

                th,
                td {
                    padding:
                        8px;

                    border:
                        1px solid
                        #d1d5db;
                }

                ${estilos}

            </style>

        </head>

        <body>

            ${elemento.innerHTML}

        </body>

        </html>

    `);


    janela.document.close();


    janela.focus();


    setTimeout(
        () => {

            janela.print();

        },
        250
    );


    return true;

}


// ==========================================================
// IMPRESSÃO DA PÁGINA
// ==========================================================

export function imprimirPagina() {

    window.print();

}


// ==========================================================
// DOWNLOAD DE OBJETO COMO JSON
// ==========================================================

export function exportarObjetoJSON(
    dados,
    nome =
        "sigcor-dados.json"
) {

    const conteudo =
        jsonSeguro(
            dados,
            2
        );


    baixarBlob(
        new Blob(
            [
                conteudo
            ],
            {
                type:
                    "application/json;charset=utf-8"
            }
        ),
        nome
    );

}


// ==========================================================
// FORMATAR BOOLEAN
// ==========================================================

export function formatarBooleano(
    valor,
    positivo =
        "Sim",
    negativo =
        "Não"
) {

    return valor
        ?
        positivo
        :
        negativo;

}


// ==========================================================
// CONVERTER PARA BOOLEAN
// ==========================================================

export function paraBooleano(
    valor
) {

    if (
        typeof valor ===
        "boolean"
    ) {

        return valor;

    }


    const texto =
        String(
            valor ?? ""
        )
            .trim()
            .toLowerCase();


    return [
        "true",
        "1",
        "sim",
        "yes",
        "ativo"
    ].includes(
        texto
    );

}


// ==========================================================
// CONVERTER PARA INTEIRO
// ==========================================================

export function paraInteiro(
    valor,
    padrao = 0
) {

    const numero =
        parseInt(
            valor,
            10
        );


    return Number.isNaN(
        numero
    )
        ?
        padrao
        :
        numero;

}


// ==========================================================
// CONVERTER PARA FLOAT
// ==========================================================

export function paraDecimal(
    valor,
    padrao = 0
) {

    const numero =
        parseFloat(
            String(
                valor ?? ""
            )
                .replace(
                    ",",
                    "."
                )
        );


    return Number.isNaN(
        numero
    )
        ?
        padrao
        :
        numero;

}


// ==========================================================
// VALOR ENTRE
// ==========================================================

export function numeroEntre(
    valor,
    minimo,
    maximo
) {

    const numero =
        Number(
            valor
        );


    if (
        !Number.isFinite(
            numero
        )
    ) {

        return false;

    }


    return (
        numero >=
        minimo
        &&
        numero <=
        maximo
    );

}


// ==========================================================
// É PROMISE?
// ==========================================================

export function ehPromise(
    valor
) {

    return Boolean(
        valor &&
        typeof valor.then ===
        "function"
    );

}


// ==========================================================
// EXECUTAR COM TENTATIVAS
// ==========================================================

export async function tentarNovamente(
    funcao,
    {
        tentativas =
            3,

        intervalo =
            500
    } = {}
) {

    let ultimoErro =
        null;


    for (
        let tentativa = 1;
        tentativa <= tentativas;
        tentativa++
    ) {

        try {

            return await funcao(
                tentativa
            );

        } catch (erro) {

            ultimoErro =
                erro;


            if (
                tentativa <
                tentativas
            ) {

                await esperar(
                    intervalo
                );

            }

        }

    }


    throw ultimoErro;

}


// ==========================================================
// MEDIR TEMPO DE EXECUÇÃO
// ==========================================================

export async function medirTempo(
    funcao
) {

    const inicio =
        performance.now();


    const resultado =
        await funcao();


    const fim =
        performance.now();


    return {

        resultado,

        milissegundos:
            fim -
            inicio

    };

}


// ==========================================================
// EXECUTAR QUANDO DOM ESTIVER PRONTO
// ==========================================================

export function aoCarregarDOM(
    callback
) {

    if (
        typeof callback !==
        "function"
    ) {

        return;

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            callback,
            {
                once:
                    true
            }
        );


        return;

    }


    callback();

}


// ==========================================================
// ESPERAR ELEMENTO EXISTIR
// ==========================================================

export function esperarElemento(
    seletor,
    {
        timeout =
            5000,

        intervalo =
            100
    } = {}
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const inicio =
                Date.now();


            const verificar =
                () => {

                    const elemento =
                        document.querySelector(
                            seletor
                        );


                    if (
                        elemento
                    ) {

                        resolve(
                            elemento
                        );

                        return;

                    }


                    if (
                        Date.now() -
                        inicio >=
                        timeout
                    ) {

                        reject(
                            new Error(
                                `Elemento não encontrado: ${seletor}`
                            )
                        );

                        return;

                    }


                    setTimeout(
                        verificar,
                        intervalo
                    );

                };


            verificar();

        }
    );

}


// ==========================================================
// ELEMENTO ESTÁ VISÍVEL
// ==========================================================

export function elementoVisivel(
    elemento
) {

    if (!elemento) {

        return false;

    }


    const estilo =
        window.getComputedStyle(
            elemento
        );


    return (
        estilo.display !==
        "none"
        &&
        estilo.visibility !==
        "hidden"
        &&
        Number(
            estilo.opacity
        ) !==
        0
    );

}


// ==========================================================
// ESTÁ NO VIEWPORT
// ==========================================================

export function estaNoViewport(
    elemento
) {

    if (!elemento) {

        return false;

    }


    const rect =
        elemento.getBoundingClientRect();


    return (
        rect.top >=
        0
        &&
        rect.left >=
        0
        &&
        rect.bottom <=
        (
            window.innerHeight ||
            document.documentElement
                .clientHeight
        )
        &&
        rect.right <=
        (
            window.innerWidth ||
            document.documentElement
                .clientWidth
        )
    );

}


// ==========================================================
// SCROLL PARA TOPO
// ==========================================================

export function irParaTopo(
    suave = true
) {

    window.scrollTo(
        {
            top:
                0,

            behavior:
                suave
                    ?
                    "smooth"
                    :
                    "auto"
        }
    );

}


// ==========================================================
// SCROLL PARA BAIXO
// ==========================================================

export function irParaFim(
    suave = true
) {

    window.scrollTo(
        {
            top:
                document.documentElement
                    .scrollHeight,

            behavior:
                suave
                    ?
                    "smooth"
                    :
                    "auto"
        }
    );

}


// ==========================================================
// TRAVAR SCROLL
// ==========================================================

export function travarScroll() {

    document.body.dataset
        .sigcorOverflow =
        document.body.style
            .overflow ||
        "";


    document.body.style
        .overflow =
        "hidden";

}


// ==========================================================
// LIBERAR SCROLL
// ==========================================================

export function liberarScroll() {

    document.body.style
        .overflow =
        document.body.dataset
            .sigcorOverflow ||
        "";


    delete document.body.dataset
        .sigcorOverflow;

}


// ==========================================================
// GERAR COR ALEATÓRIA CSS
// ==========================================================

export function gerarCorHex() {

    const numero =
        Math.floor(
            Math.random() *
            0xffffff
        );


    return (
        "#" +
        numero
            .toString(
                16
            )
            .padStart(
                6,
                "0"
            )
    );

}


// ==========================================================
// HEX -> RGB
// ==========================================================

export function hexParaRGB(
    hex
) {

    const valor =
        String(
            hex ?? ""
        )
            .replace(
                "#",
                ""
            )
            .trim();


    if (
        !/^[0-9a-f]{6}$/i
            .test(
                valor
            )
    ) {

        return null;

    }


    return {

        r:
            parseInt(
                valor.substring(
                    0,
                    2
                ),
                16
            ),

        g:
            parseInt(
                valor.substring(
                    2,
                    4
                ),
                16
            ),

        b:
            parseInt(
                valor.substring(
                    4,
                    6
                ),
                16
            )

    };

}


// ==========================================================
// GERAR AVATAR TEXTO
// ==========================================================

export function gerarAvatarTexto(
    nome
) {

    return gerarIniciaisUtil(
        nome,
        2
    );

}


// ==========================================================
// VERIFICAR SE OBJETO TEM CAMPO
// ==========================================================

export function possuiCampo(
    objeto,
    campo
) {

    return Object.prototype
        .hasOwnProperty
        .call(
            objeto ||
            {},
            campo
        );

}


// ==========================================================
// OBTER CAMPO PROFUNDO
//
// Exemplo:
// obterCampo(obj, "usuario.nome")
// ==========================================================

export function obterCampo(
    objeto,
    caminho,
    padrao = null
) {

    if (
        !objeto ||
        !caminho
    ) {

        return padrao;

    }


    const partes =
        String(
            caminho
        ).split(
            "."
        );


    let atual =
        objeto;


    for (
        const parte
        of partes
    ) {

        if (
            atual === null ||
            atual === undefined
        ) {

            return padrao;

        }


        atual =
            atual[
                parte
            ];

    }


    return (
        atual === undefined
            ?
            padrao
            :
            atual
    );

}


// ==========================================================
// DEFINIR CAMPO PROFUNDO
// ==========================================================

export function definirCampo(
    objeto,
    caminho,
    valor
) {

    if (
        !objeto ||
        !caminho
    ) {

        return false;

    }


    const partes =
        String(
            caminho
        ).split(
            "."
        );


    const ultimo =
        partes.pop();


    let atual =
        objeto;


    partes.forEach(
        parte => {

            if (
                !atual[
                    parte
                ] ||
                typeof atual[
                    parte
                ] !==
                "object"
            ) {

                atual[
                    parte
                ] =
                    {};

            }


            atual =
                atual[
                    parte
                ];

        }
    );


    atual[
        ultimo
    ] =
        valor;


    return true;

}


// ==========================================================
// REMOVER CAMPO PROFUNDO
// ==========================================================

export function removerCampo(
    objeto,
    caminho
) {

    if (
        !objeto ||
        !caminho
    ) {

        return false;

    }


    const partes =
        String(
            caminho
        ).split(
            "."
        );


    const ultimo =
        partes.pop();


    let atual =
        objeto;


    for (
        const parte
        of partes
    ) {

        if (
            !atual?.[
                parte
            ]
        ) {

            return false;

        }


        atual =
            atual[
                parte
            ];

    }


    delete atual[
        ultimo
    ];


    return true;

}


// ==========================================================
// CRIAR MAPA DE PERMISSÕES
// ==========================================================

export function criarMapaPermissoes(
    valorPadrao = false
) {

    const resultado =
        {};


    obterPermissoesDisponiveis()
        .forEach(
            permissao => {

                resultado[
                    permissao.chave
                ] =
                    Boolean(
                        valorPadrao
                    );

            }
        );


    return resultado;

}


// ==========================================================
// TODAS AS PERMISSÕES
// ==========================================================

export function concederTodasPermissoes() {

    return criarMapaPermissoes(
        true
    );

}


// ==========================================================
// REMOVER TODAS AS PERMISSÕES
// ==========================================================

export function removerTodasPermissoes() {

    return criarMapaPermissoes(
        false
    );

}


// ==========================================================
// GERAR RESUMO DO INQUÉRITO
// ==========================================================

export function gerarResumoInquerito(
    inquerito
) {

    if (
        !inquerito
    ) {

        return "";

    }


    const numero =
        inquerito.numero ||
        "Sem número";


    const local =
        inquerito.localFatos ||
        inquerito.local ||
        "Local não informado";


    const status =
        nomeStatusInqueritoUtil(
            inquerito.status
        );


    return (
        `${numero} • ${local} • ${status}`
    );

}


// ==========================================================
// CRIAR REFERÊNCIA VISUAL DO INQUÉRITO
// ==========================================================

export function referenciaInquerito(
    inquerito
) {

    if (
        !inquerito
    ) {

        return "-";

    }


    return (
        inquerito.numero ||
        inquerito.id ||
        "-"
    );

}


// ==========================================================
// FORMATAR QUANTIDADE
// ==========================================================

export function pluralizar(
    quantidade,
    singular,
    plural = null
) {

    const total =
        Number(
            quantidade
        ) || 0;


    const textoPlural =
        plural ||
        `${singular}s`;


    return (
        `${total} ${
            total === 1
                ?
                singular
                :
                textoPlural
        }`
    );

}


// ==========================================================
// RECRIAR ÍCONES LUCIDE
// ==========================================================

export function atualizarIcones() {

    if (
        typeof window.lucide !==
        "undefined"
    ) {

        window.lucide.createIcons();

        return true;

    }


    return false;

}


// ==========================================================
// SISTEMA DISPONÍVEL?
// ==========================================================

export function navegadorCompativel() {

    return Boolean(

        window.Promise &&
        window.fetch &&
        window.localStorage &&
        window.sessionStorage &&
        window.URL

    );

}


// ==========================================================
// INFORMAÇÕES DO AMBIENTE
// ==========================================================

export function obterInfoAmbiente() {

    return {

        linguagem:
            navigator.language,

        online:
            navigator.onLine,

        largura:
            window.innerWidth,

        altura:
            window.innerHeight,

        mobile:
            ehMobile(),

        touch:
            suportaTouch(),

        pagina:
            paginaAtual(),

        url:
            urlAtual(),

        userAgent:
            navigator.userAgent

    };

}


// ==========================================================
// LOG DE DESENVOLVIMENTO
// ==========================================================

export function logSIGCOR(
    ...dados
) {

    console.log(
        "%cSIGCOR",
        "font-weight:bold;color:#d4af37;",
        ...dados
    );

}


// ==========================================================
// WARNING
// ==========================================================

export function avisoSIGCOR(
    ...dados
) {

    console.warn(
        "SIGCOR:",
        ...dados
    );

}


// ==========================================================
// ERRO
// ==========================================================

export function erroSIGCOR(
    ...dados
) {

    console.error(
        "SIGCOR:",
        ...dados
    );

}


// ==========================================================
// API GLOBAL
//
// Pode usar no console:
//
// SIGCORUtils.formatarData(...)
// SIGCORUtils.gerarId()
// SIGCORUtils.emailValido(...)
// ==========================================================

window.SIGCORUtils = {

    esperar,

    gerarId,

    gerarIdCurto,

    normalizarTexto,

    normalizarPesquisa,

    capitalizar,

    escaparHTML,

    formatarData,

    formatarDataHora,

    formatarHora,

    formatarTelefone,

    formatarCPF,

    formatarRG,

    emailValido,

    cpfValido,

    telefoneValido,

    validarSenha,

    formatarBytes,

    validarArquivo,

    validarImagem,

    validarVideo,

    validarAudio,

    validarPDF,

    copiar:
        copiarParaClipboard,

    salvarLocal,

    lerLocal,

    removerLocal,

    salvarSessao,

    lerSessao,

    removerSessao,

    obterParametroURL,

    definirParametroURL,

    paginaAtual,

    redirecionar,

    buscar:
        buscarNaLista,

    paginar:
        paginarLista,

    cargo:
        obterNomeCargoUtil,

    statusInquerito:
        nomeStatusInqueritoUtil,

    statusUsuario:
        nomeStatusUsuarioUtil,

    iniciais:
        gerarIniciaisUtil,

    permissao:
        temPermissaoUtil,

    traduzirErro:
        traduzirErroFirebase,

    online:
        estaOnline,

    imprimir:
        imprimirElemento,

    ambiente:
        obterInfoAmbiente

};


// ==========================================================
// FIM DO UTILS.JS
// ==========================================================

console.log(
    "%cSIGCOR Utils carregado",
    "font-weight:bold;color:#d4af37;"
);