// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
import {getFirestore, Timestamp, FieldValue} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getDatabase} from 'firebase/database'
import analytics from '@react-native-firebase/analytics';


const firebaseConfig = {
  apiKey: "AIzaSyCDiUOus-d_4VKcoaE1eir2E_67L-8G2BY",
  authDomain: "bible-project-82210.firebaseapp.com",
  projectId: "bible-project-82210",
  storageBucket: "bible-project-82210.appspot.com",
  messagingSenderId: "976038233878",
  appId: "1:976038233878:web:f8cb93543911ac79cbf237"
};





export const app = initializeApp(firebaseConfig)
export const firebaseAnalytics = analytics();



export default app  