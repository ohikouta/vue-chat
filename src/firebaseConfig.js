import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore'; // 追加
import { getAnalytics, logEvent } from 'firebase/analytics'; // 追加
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUG6aoRr4a75rSv9kIM-JpNgISrbgsXk0",
  authDomain: "vue-chat-c4179.firebaseapp.com",
  projectId: "vue-chat-c4179",
  storageBucket: "gs://vue-chat-c4179.firebasestorage.app",
  messagingSenderId: "322636212530",
  appId: "1:322636212530:web:3650aa55051f8466e28f2b",
  measurementId: "G-MTWEB1Y4ZW"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig); // `initializeApp`を使用
const auth = getAuth(app);

// Firestoreのインスタンスを取得
const db = getFirestore(app);
const storage = getStorage(app);

// Firestoreからデータを取得
const querySnapshot = await getDocs(collection(db, "vue-chat"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});

// Optional: Analyticsの初期化
const analytics = getAnalytics(app);

// ページビューイベントを記録
logEvent(analytics, 'page_view');


export { db };
export { auth };
export { storage };