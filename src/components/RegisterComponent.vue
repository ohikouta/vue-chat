<template>
  <div>
    <h2>Register</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <input v-model="username" type="text" placeholder="Username" />
    <button @click="register">Register</button>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      email: "",
      password: "",
      username: "",
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          username: this.username,
          email: this.email,
          createdAt: new Date()
        });
        console.log("User registered and additional info saved:", user.uid);
        // リダイレクト処理
        this.$router.push('/'); // ホーム画面にリダイレクト
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  }
};
</script>
