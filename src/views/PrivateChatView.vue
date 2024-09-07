<!-- PrivateChatView.vue -->
<template>
    <div>
      <h2>Chat with {{ otherUserName }}</h2>
      <div v-for="message in messages" :key="message.id">
        <p><strong>{{ message.senderName }}:</strong> {{ message.text }}</p>
      </div>
      <input v-model="newMessage" placeholder="Type your message" />
      <button @click="sendMessage">Send</button>
    </div>
  </template>
  
  <script>
  import { db } from '../firebaseConfig';
  import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
        otherUserName: '',
        otherUserId: this.$route.params.userId,
        currentUser: getAuth().currentUser
      };
    },
    async created() {
      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", this.otherUserId)
      );
      onSnapshot(q, (querySnapshot) => {
        this.messages = querySnapshot.docs.map(doc => doc.data());
      });
  
      const userDoc = await getDoc(doc(db, "users", this.otherUserId));
      if (userDoc.exists) {
        this.otherUserName = userDoc.data().username;
      }
    },
    methods: {
      async sendMessage() {
        await addDoc(collection(db, "messages"), {
          text: this.newMessage,
          timestamp: new Date(),
          senderId: this.currentUser.uid,
          senderName: this.currentUser.displayName || 'Anonymous',
          participants: [this.currentUser.uid, this.otherUserId]
        });
        this.newMessage = '';
      }
    }
  };
  </script>
