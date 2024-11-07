<!-- UserList.vue -->
<template>
  <div class="user-list">
    <h2>User List</h2>
    <div class="user-card" v-for="user in users" :key="user.uid">
      <router-link :to="{name: 'PrivateChat', params: { userId: user.uid }}" class="user-link">
        <h3>{{ user.username || "匿名ユーザー" }}</h3>
        <p>{{ user.email }}</p>
      </router-link>      
    </div>
  </div>
</template>
    
<script>
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default {
  data() {
    return {
      users: []
    };
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, "users"));
    this.users = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
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
  margin: 10px, 0;
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

.user-card h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.user-card p {
  margin: 5px 0, 0;
  color: #666;
}

</style>
  