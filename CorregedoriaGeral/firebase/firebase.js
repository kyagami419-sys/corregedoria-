// ==========================================================
// SIGCOR
// firebase/firebase.js
// ==========================================================

import {

    app,
    auth,
    db,
    storage,
    firebaseConfig

} from "./firebase-config.js";


import {

    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


import {

    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// ==========================================================
// PERSISTÊNCIA
// ==========================================================

export async function configurarPersistencia(
    lembrar = true
) {

    await setPersistence(
        auth,
        lembrar
            ?
            browserLocalPersistence
            :
            browserSessionPersistence
    );

}


// ==========================================================
// ESPERAR O FIREBASE RESTAURAR A SESSÃO
// ==========================================================

export function aguardarAuth() {

    return new Promise(
        resolve => {

            const cancelar =
                onAuthStateChanged(
                    auth,
                    usuario => {

                        cancelar();

                        resolve(
                            usuario || null
                        );

                    },
                    erro => {

                        console.error(
                            "SIGCOR - Auth:",
                            erro
                        );

                        cancelar();

                        resolve(
                            null
                        );

                    }
                );

        }
    );

}


// ==========================================================
// DOCUMENTO
// ==========================================================

export async function obterDocumento(
    colecaoNome,
    id
) {

    if (
        !colecaoNome ||
        !id
    ) {

        return null;

    }


    const snapshot =
        await getDoc(
            doc(
                db,
                colecaoNome,
                id
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

        ...snapshot.data()

    };

}


// ==========================================================
// LISTAR COLEÇÃO
// ==========================================================

export async function obterColecao(
    nome
) {

    const snapshot =
        await getDocs(
            collection(
                db,
                nome
            )
        );


    return snapshot.docs.map(
        item => ({

            id:
                item.id,

            ...item.data()

        })
    );

}


// ==========================================================
// ADICIONAR DOCUMENTO
// ==========================================================

export async function adicionarDocumento(
    nome,
    dados = {}
) {

    const referencia =
        await addDoc(
            collection(
                db,
                nome
            ),
            {

                ...dados,

                criadoEm:
                    serverTimestamp(),

                atualizadoEm:
                    serverTimestamp()

            }
        );


    return referencia.id;

}


// ==========================================================
// SALVAR DOCUMENTO COM ID
// ==========================================================

export async function salvarDocumento(
    nome,
    id,
    dados = {},
    merge = true
) {

    await setDoc(
        doc(
            db,
            nome,
            id
        ),
        {

            ...dados,

            atualizadoEm:
                serverTimestamp()

        },
        {
            merge
        }
    );


    return id;

}


// ==========================================================
// ATUALIZAR
// ==========================================================

export async function atualizarDocumentoFirebase(
    nome,
    id,
    dados = {}
) {

    await updateDoc(
        doc(
            db,
            nome,
            id
        ),
        {

            ...dados,

            atualizadoEm:
                serverTimestamp()

        }
    );


    return true;

}


// ==========================================================
// REMOVER
// ==========================================================

export async function removerDocumento(
    nome,
    id
) {

    await deleteDoc(
        doc(
            db,
            nome,
            id
        )
    );


    return true;

}


// ==========================================================
// EXPORTS
// ==========================================================

export {

    firebaseConfig,

    app,

    auth,

    db,

    storage,

    collection,

    doc,

    getDoc,

    getDocs,

    addDoc,

    setDoc,

    updateDoc,

    deleteDoc,

    query,

    where,

    orderBy,

    limit,

    serverTimestamp

};


console.log(
    "SIGCOR Firebase carregado:",
    firebaseConfig.projectId
);
// Retorna usuário autenticado atual
export function obterUidAtual() {
    return auth.currentUser ? auth.currentUser.uid : null;
}

// ===============================================
// STORAGE - UPLOAD DE ARQUIVOS
// ===============================================

import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


// Criar caminho do arquivo
export function gerarCaminhoArquivo(pasta, arquivo) {

    return `${pasta}/${Date.now()}_${arquivo.name}`;

}


// Upload simples
export async function enviarArquivo(arquivo, caminho) {

    const referencia = ref(storage, caminho);

    const resultado = await uploadBytes(
        referencia,
        arquivo
    );

    const url = await getDownloadURL(
        resultado.ref
    );

    return {
        caminho,
        url
    };

}


// Upload com progresso
export function enviarArquivoComProgresso(
    arquivo,
    caminho,
    callbackProgresso = null
) {

    return new Promise((resolve, reject) => {

        const referencia = ref(storage, caminho);

        const tarefa = uploadBytesResumable(
            referencia,
            arquivo
        );


        tarefa.on(
            "state_changed",

            snapshot => {

                if(callbackProgresso){

                    const progresso =
                        (snapshot.bytesTransferred /
                        snapshot.totalBytes) * 100;

                    callbackProgresso(progresso);

                }

            },

            erro => reject(erro),

            async () => {

                const url =
                    await getDownloadURL(
                        tarefa.snapshot.ref
                    );


                resolve({
                    caminho,
                    url
                });

            }

        );

    });

}


// Remover arquivo
export async function removerArquivo(caminho){

    const referencia =
        ref(storage, caminho);

    await deleteObject(referencia);

}