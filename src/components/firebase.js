import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

console.log(process.env.REACT_APP_API_KEY)
const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    appId: process.env.REACT_APP_APP_ID
})

export const auth = app.auth()
export default app