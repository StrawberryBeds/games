// FROM FIREBASE

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCf2BaAVL5G7lOnVrBAoaJws3f8UzcOJqk",
//   authDomain: "ludico-9433b.firebaseapp.com",
//   projectId: "ludico-9433b",
//   storageBucket: "ludico-9433b.firebasestorage.app",
//   messagingSenderId: "750254650132",
//   appId: "1:750254650132:web:1be5c493f781e43f448801",
//   measurementId: "G-54N3FQMT4E"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// FROM GOOGLE AI

    // src/firebase.js
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
  apiKey: "AIzaSyCf2BaAVL5G7lOnVrBAoaJws3f8UzcOJqk",
  authDomain: "ludico-9433b.firebaseapp.com",
  projectId: "ludico-9433b",
  storageBucket: "ludico-9433b.firebasestorage.app",
  messagingSenderId: "750254650132",
  appId: "1:750254650132:web:1be5c493f781e43f448801",
  measurementId: "G-54N3FQMT4E"
};

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);
