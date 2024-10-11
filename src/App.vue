<template>
  <div id="app">
    <header>
      <h1>ようこそ、Vue-chatへ</h1>
      <p>このチャットアプリは、NoSQL(Firebase)を使用しています</p>
      <div v-if="user">
        <p>Logged in as: {{ user.displayName || user.email }}</p>
        <button @click="logout">Logout</button>
      </div>
      <div v-else>
        <button @click="goToLogin">Login</button>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: 'App',
  data() {
    return {
      user: null, // ユーザーの状態を保持
    };
  },
  created() {
    const auth = getAuth();
    this.user = auth.currentUser; // 初期ロード時のユーザー情報
    auth.onAuthStateChanged((user) => {
      this.user = user;
    });
  },
  methods: {
    goToLogin() {
      this.$router.push({ path: '/login' }); // ログインページに遷移
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.user = null; // ログアウト後にユーザーをnullに
          this.$router.push({ path: '/login' }); // ルートページに遷移
        })
        .catch((error) => {
          console.error("Logout failed:", error); //　エラーハンドリング
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
</style>
