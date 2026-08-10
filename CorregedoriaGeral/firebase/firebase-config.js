// ==========================================================
// SIGCOR - FIREBASE CONFIG
// firebase/firebase-config.js
// ==========================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyA3Ib5e_HDZzRGVD0YEgyyX8_TfuTYFiIY",

    authDomain:
        "corregedoriageral.firebaseapp.com",

    projectId:
        "corregedoriageral",

    storageBucket:
        "corregedoriageral.firebasestorage.app",

    messagingSenderId:
        "632766450220",

    appId:
        "1:632766450220:web:736728fa3574a0ccf65f89",

    measurementId:
        "G-SLE79V97FB"

};


const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(
        app
    );


const db =
    getFirestore(
        app
    );


const storage =
    getStorage(
        app
    );


console.log(
    "SIGCOR Firebase Config:",
    firebaseConfig.projectId
);


export {

    firebaseConfig,

    app,

    auth,

    db,

    storage

};