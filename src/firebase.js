import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

const app = firebase.initializeApp({
    apiKey: "AIzaSyC_DPDxP5wPTapewV8QJh3DLEqzqG8db-s",
    authDomain: "furniturestore-ce4ea.firebaseapp.com",
    databaseURL: "https://furniturestore-ce4ea-default-rtdb.firebaseio.com",
    projectId: "furniturestore-ce4ea",
    storageBucket: "furniturestore-ce4ea.appspot.com",
    messagingSenderId: "506705197147",
    appId: "1:506705197147:web:8f7be109d870af55a7277e"
})

export const auth = app.auth()
export const storage = app.storage()
export const fireDb = app.database()
export default app