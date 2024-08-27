<template>
	<div>
		<h2>Login</h2>
		<input v-model="email" type="email" placeholder="Email" />
		<input v-model="password" type="password" placeholder="Password" />
		<button @click="login">Login</button>
	</div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default {
	data() {
		return {
			email: "",
			password: ""
		};
	},
	methods: {
		async login() {
			try {
				const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
				console.log("User logged in:", userCredential.user);
				// ログイン成功後の処理(例：リダイレクト)
			} catch (error) {
				console.error("Login error:", error);
			}
		}
	}
};

</script>