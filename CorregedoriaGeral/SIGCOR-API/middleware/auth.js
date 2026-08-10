import {
    auth,
    db
} from "../config/firebase.js";


export async function autenticar(
    req,
    res,
    next
) {

    try {

        const authorization =
            req.headers.authorization || "";


        if (
            !authorization.startsWith(
                "Bearer "
            )
        ) {

            return res.status(401).json({
                sucesso: false,
                erro: "Token não informado."
            });

        }


        const token =
            authorization.substring(7);


        const decoded =
            await auth.verifyIdToken(
                token
            );


        const perfilSnapshot =
            await db
                .collection("usuarios")
                .doc(decoded.uid)
                .get();


        if (!perfilSnapshot.exists) {

            return res.status(403).json({
                sucesso: false,
                erro: "Perfil SIGCOR não encontrado."
            });

        }


        const perfil =
            perfilSnapshot.data();


        if (
            String(
                perfil.status || ""
            ).toLowerCase() !== "ativo"
        ) {

            return res.status(403).json({
                sucesso: false,
                erro: "Conta sem acesso ao sistema."
            });

        }


        req.usuario = decoded;

        req.perfil = {
            id: perfilSnapshot.id,
            ...perfil
        };


        next();

    } catch (erro) {

        console.error(
            "SIGCOR Auth:",
            erro
        );


        return res.status(401).json({
            sucesso: false,
            erro: "Sessão inválida ou expirada."
        });

    }

}


// ==========================================================
// ADMINISTRAÇÃO
// ==========================================================

export function exigirGerenciamentoUsuarios(
    req,
    res,
    next
) {

    const perfil =
        req.perfil;


    const cargo =
        String(
            perfil?.cargo || ""
        )
            .trim()
            .toLowerCase()
            .replace(
                /[\s-]+/g,
                "_"
            );


    const autorizado =
        cargo === "administrador" ||
        cargo === "corregedor_geral" ||
        perfil?.permissoes
            ?.gerenciarUsuarios === true;


    if (!autorizado) {

        return res.status(403).json({
            sucesso: false,
            erro:
                "Você não possui permissão para gerenciar usuários."
        });

    }


    next();
}