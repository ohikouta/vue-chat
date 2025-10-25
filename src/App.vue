<template>
  <div id="app">
    <header>
      <h1>こんにちは</h1>
      <div v-if="user">
        <div class="profile-icon" @click="openProfileModal">
          <img :src="profileImageUrl" alt="Profile Icon" />
        </div>
        <p>Logged in as: {{ user.displayName || user.email }}</p>
        <button @click="logout">Logout</button>
      </div>
      <div v-else>
        <button @click="goToLogin">Login</button>
      </div>
    </header>

    <ProfileModal v-if="isProfileModalOpen" @close="isProfileModalOpen = false" />
    
    <!-- ImageUploaderコンポーネントを追加 -->
    <section v-if="user">
      <h2>プロフィール画像をアップロード</h2>
      <ImageUploader />
    </section>

    <router-view></router-view>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import ImageUploader from "@/components/ImageUploader.vue"; // ImageUploaderコンポーネントをインポート
import ProfileModal from "@/components/ProfileModal.vue";

export default {
  name: 'App',
  components: {
    ProfileModal,
    ImageUploader, // コンポーネントを登録
  },
  data() {
    return {
      user: null, // ユーザーの状態を保持
      profileImageUrl: null,
      isProfileModalOpen: false,
    };
  },
  created() {
    const auth = getAuth();
    this.user = auth.currentUser; // 初期ロード時のユーザー情報
    auth.onAuthStateChanged((user) => {
      this.user = user;
      if (user) {
        this.loadProfileImage();
      }
    });
  },
  methods: {
    async loadProfileImage() {
      // FirestoreからURLを取得してプロフィール画像URLをセット
      const db = getFirestore();
      const userDocRef = doc(db, "users", this.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists) {
        this.profileImageUrl = userDoc.data().profileImageUrl;
      }
    },
    openProfileModal() {
      this.isProfileModalOpen = true;
    },
    goToLogin() {
      this.$router.push({ path: '/login' }); // ログインページに遷移
    },
    logout() {
      const auth = getAuth();
      const db =  getFirestore();
      // Firestoreのユーザードキュメント参照を取得
      const userDocRef = doc(db, "users", this.user.uid);

      // FirestoreでisOnlineをfalseに設定してからサインアウト
      updateDoc(userDocRef, { isOnline: false })
        .then(() => {
          return signOut(auth);
        })
        .then(() => {
          this.user = null; // ログアウト後にユーザーをnullに
          this.$router.push({ path: '/login' }); // ルートページに遷移
        })
        .catch((error) => {
          console.error("Logout failed:", error); // エラーハンドリング
        });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* アイコンのレイアウト */
.profile-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.profile-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
