import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyB2tF_MVknrZH0JyuHMK6xyx49paSGn_XM",
	authDomain: "dropbox-clone-b7ce5.firebaseapp.com",
	projectId: "dropbox-clone-b7ce5",
	storageBucket: "dropbox-clone-b7ce5.appspot.com",
	messagingSenderId: "366336838373",
	appId: "1:366336838373:web:0309902951029ed4b9620c",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
