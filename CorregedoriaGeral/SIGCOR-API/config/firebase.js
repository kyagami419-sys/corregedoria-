import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {

    throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_JSON não configurada."
    );

}

let serviceAccount;

try {

    serviceAccount =
        JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_JSON
        );

} catch (erro) {

    console.error(
        "Erro ao interpretar FIREBASE_SERVICE_ACCOUNT_JSON"
    );

    throw erro;

}


if (!admin.apps.length) {

    admin.initializeApp({
        credential:
            admin.credential.cert(
                serviceAccount
            )
    });

}


const auth =
    admin.auth();

const db =
    admin.firestore();


export {
    admin,
    auth,
    db
};