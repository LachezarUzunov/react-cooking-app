import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7DnCkoICtSLngNCGmrRQy50pjCS3nCEk",
  authDomain: "cook-master-67375.firebaseapp.com",
  projectId: "cook-master-67375",
  storageBucket: "cook-master-67375.appspot.com",
  messagingSenderId: "982249387916",
  appId: "1:982249387916:web:25482f8c9eb1148e9588a9",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
