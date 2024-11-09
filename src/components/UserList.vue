<template>
  <div class="user-list">
    <h2>User List</h2>
    <div class="user-card" v-for="user in users" :key="user.uid">
      <router-link :to="{ name: 'PrivateChat', params: { userId: user.uid } }" class="user-link">
        <img :src="user.profileImageUrl || defaultProfileImage" alt="Profile Image" class="profile-image" />
        <h3>{{ user.username || "匿名ユーザー" }}</h3>
        <p>{{ user.email }}</p>
        <p v-if="user.latestMessage">Last message: {{ user.latestMessage.content }} - {{ user.latestMessage.timestamp }}</p>
        <p v-if="user.isOnline" class="online-status">Online</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebaseConfig";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database"; // Realtime Database 用
import defaultProfileImage from "@/assets/default-profile.png"; // デフォルトのプロファイル画像

export default {
  data() {
    return {
      users: []
    };
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, "users"));
    this.users = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
      const userData = { uid: docSnapshot.id, ...docSnapshot.data() };

      // 最新メッセージ取得
      const latestMessageDoc = await getDoc(doc(db, `users/${docSnapshot.id}/messages`, "latest"));
      console.log("Latest message:", latestMessageDoc.data());
      if (latestMessageDoc.exists()) {
        userData.latestMessage = latestMessageDoc.data();
      }

      // オンラインステータスの取得
      const rtdb = getDatabase(); // Realtime Database インスタンスを取得
      const onlineStatusRef = ref(rtdb, `status/${docSnapshot.id}`);
      onValue(onlineStatusRef, (snapshot) => {
        userData.isOnline = snapshot.val()?.isOnline || false;
      });

      return userData;
    }));
  }
};
</script>

<style>
.user-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.user-card {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.user-card:hover {
  background-color: #e0f7fa;
}

.user-link {
  text-decoration: none;
  color: inherit;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.online-status {
  color: green;
  font-weight: bold;
}
</style>
