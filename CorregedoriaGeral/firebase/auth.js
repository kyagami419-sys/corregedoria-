// ==========================================================
// SIGCOR
// firebase/auth.js
// ==========================================================

import {

    auth,
    db,
    aguardarAuth

} from "./firebase.js";


import {

    signOut

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


import {

    doc,
    getDoc,
    updateDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


let perfilAtual =
    null;


// ==========================================================
// NORMALIZAR
// ==========================================================

export function normalizarCargo(
    cargo
) {

    return String(
        cargo || ""
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
// INICIAIS
// ==========================================================

export function gerarIniciais(
    nome
) {

    const partes =
        String(
            nome || ""
        )
            .trim()
            .split(
                /\s+/
            )
            .filter(
                Boolean
            );


    if (
        partes.length === 0
    ) {

        return "?";

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


// ==========================================================
// BUSCAR PERFIL
// ==========================================================

export async function buscarPerfilUsuario(
    uid
) {

    if (!uid) {

        return null;

    }


    const snapshot =
        await getDoc(
            doc(
                db,
                "usuarios",
                uid
            )
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

}


// ==========================================================
// PERFIL ATUAL
// ==========================================================

export function obterPerfilAtual() {

    return perfilAtual;

}


// ==========================================================
// PERMISSÃO
// ==========================================================

export function possuiPermissao(
    perfil,
    permissao
) {

    if (!perfil) {

        return false;

    }


    const cargo =
        normalizarCargo(
            perfil.cargo
        );


    if (
        cargo === "administrador" ||
        cargo === "corregedor_geral"
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
// PROTEGER PÁGINA
// ==========================================================

export async function protegerPagina() {

    console.log(
        "SIGCOR: aguardando sessão..."
    );


    const usuario =
        await aguardarAuth();


    if (!usuario) {

        console.warn(
            "SIGCOR: sem sessão."
        );


        window.location.replace(
            "../index.html"
        );


        return false;

    }


    console.log(
        "SIGCOR: usuário autenticado:",
        usuario.uid
    );


    let perfil;


    try {

        perfil =
            await buscarPerfilUsuario(
                usuario.uid
            );

    } catch (erro) {

        console.error(
            "SIGCOR: erro ao buscar perfil:",
            erro
        );


        return false;

    }


    if (!perfil) {

        console.error(
            "SIGCOR: perfil não encontrado em usuarios/" +
            usuario.uid
        );


        await signOut(
            auth
        );


        window.location.replace(
            "../index.html"
        );


        return false;

    }


    if (
        String(
            perfil.status || ""
        )
            .trim()
            .toLowerCase()
        !==
        "ativo"
    ) {

        console.error(
            "SIGCOR: perfil não está ativo:",
            perfil.status
        );


        await signOut(
            auth
        );


        window.location.replace(
            "../index.html"
        );


        return false;

    }


    perfilAtual =
        perfil;


    console.log(
        "SIGCOR: acesso liberado:",
        perfil.nome,
        perfil.cargo
    );


    return {

        usuario,

        perfil

    };

}


// ==========================================================
// ÚLTIMO ACESSO
// ==========================================================

export async function atualizarUltimoAcesso() {

    const usuario =
        auth.currentUser;


    if (!usuario) {

        return;

    }


    try {

        await updateDoc(
            doc(
                db,
                "usuarios",
                usuario.uid
            ),
            {

                ultimoAcesso:
                    serverTimestamp()

            }
        );

    } catch (erro) {

        console.warn(
            "SIGCOR: último acesso:",
            erro
        );

    }

}


// ==========================================================
// LOGOUT
// ==========================================================

export async function logout() {

    try {

        perfilAtual =
            null;


        sessionStorage.removeItem(
            "sigcor_usuario"
        );


        await signOut(
            auth
        );

    } finally {

        window.location.replace(
            "../index.html"
        );

    }

}


export const sair =
    logout;