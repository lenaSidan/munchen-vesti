import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx0sQo3kO8KhKUy_P7D3iiUxVtTR0nGFU",
  authDomain: "munchen-vesti-likes.firebaseapp.com",
  projectId: "munchen-vesti-likes",
  storageBucket: "munchen-vesti-likes.appspot.com",
  messagingSenderId: "731141469287",
  appId: "1:731141469287:web:12ed778d6f827dae21d0c2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
