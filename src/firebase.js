// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCbjiaEX9gjfsMeG6ol8ocrVbmN0O9aBQ0",
    authDomain: "toeic-app-784e5.firebaseapp.com",
    projectId: "toeic-app-784e5",
    storageBucket: "toeic-app-784e5.firebasestorage.app",
    messagingSenderId: "611369710872",
    appId: "1:611369710872:web:71fd9e9b251f1df0755a6d"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);