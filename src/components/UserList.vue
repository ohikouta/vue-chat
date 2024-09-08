<!-- UserList.vue -->
<template>
    <div>
      <h2>User List</h2>
      <ul>
        <li v-for="user in users" :key="user.uid">
          <router-link :to="{ name: 'PrivateChat', params: { userId: user.uid } }">
            {{ user.username }} - {{ user.email }}
          </router-link>
        </li>
      </ul>
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
  