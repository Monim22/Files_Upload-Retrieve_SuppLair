const firebaseAdmin = require('firebase-admin');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBN3ttASJnS0m3Pma-hgc9kNFBI5FQmix0",
  authDomain: "orderly-af56f.firebaseapp.com",
  projectId: "orderly-af56f",
  storageBucket: "orderly-af56f.appspot.com",
  messagingSenderId: "135379430269",
  appId: "1:135379430269:web:d0457cc4d782f1fb7c7a14"
};

const serviceAccount =require('./orderly-af56f-firebase-adminsdk-qfi8l-113b0eb23d.json');

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket
  });

module.exports = {
  firebaseAdmin
};