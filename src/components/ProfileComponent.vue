<template>
  <div>
    <h2>Profile</h2>
    <p v-if="user">Email: {{ user.email }}</p>
    <p v-else>No user is logged in</p>
    <!-- ChatViewコンポーネントの表示 -->
    <ChatView v-if="user" />
  </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import ChatView from '../views/ChatView.vue';

export default {
  components: {
    ChatView
  },
  data() {
    return {
      user: null // ログイン中のユーザー情報を格納
    };
  },
  created() {
    // 認証状態が変わるたびに呼ばれる
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザーがログインしている場合、ユーザー情報を保存
        this.user = user;
        console.log("Logged in user:", user);
      } else {
        // ユーザーがログアウトしている場合、ユーザー情報をクリア
        this.user = null;
        console.log("No user is logged in");
      }
    });
  }
};
</script>
