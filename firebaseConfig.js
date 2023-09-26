// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
import {getFirestore, Timestamp, FieldValue} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getDatabase} from 'firebase/database'
import analytics from '@react-native-firebase/analytics';


const firebaseConfig = {
<Your Config>
};





export const app = initializeApp(firebaseConfig)
export const firebaseAnalytics = analytics();



export default app  
