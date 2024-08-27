<template>
  <div>
    <h2>Register</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="register">Register</button>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        console.log("User registered:", userCredential.user);
        // ユーザー登録成功後の処理（例：リダイレクト）
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  }
};
</script>
