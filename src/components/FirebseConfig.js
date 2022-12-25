import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA18n2kIfR139OZ_u4rMhmC1w2DN4F1Wfk",
  authDomain: "talkynew.firebaseapp.com",
  projectId: "talkynew",
  storageBucket: "talkynew.appspot.com",
  messagingSenderId: "565100202831",
  appId: "1:565100202831:web:a0dae1a28ffdbd2b45533a"
};

const app = initializeApp(firebaseConfig);
export default firebaseConfig;