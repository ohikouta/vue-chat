<template>
  <div class="chat-view">
    <MessageList :messages="messages" :currentUser="currentUser" />
    <MessageInput @sendMessage="sendMessage" />
  </div>
  <div>
    <h1>この下にユーザーの一覧を出したい</h1>
    <!-- UserListコンポーネントを追加 -->
    <UserList />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebaseConfig';  // ここで firebaseConfig.js から auth をインポート
import { onAuthStateChanged } from 'firebase/auth'; 
import { db } from '../firebaseConfig';
import MessageList from '../components/MessageList.vue';
import MessageInput from '../components/MessageInput.vue';
import UserList from '../components/UserList.vue';

export default {
  components: {
    MessageList,
    MessageInput,
    UserList,
  },
  setup() {
    const messages = ref([]);
    const currentUser = ref(null);
    const users = ref([]);

    const fetchMessages = () => {
      const q = collection(db, "messages");
      onSnapshot(q, (querySnapshot) => {
        messages.value = querySnapshot.docs.map(doc => doc.data());
        console.log("Loaded messages:", messages.value);
      });
    };

    // ユーザー情報をフェッチする
    const fetchUsers = () => {
      const q = collection(db, "users");
      onSnapshot(q, (querySnapshot) => {
        users.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Loaded users:", users.value);
      });
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser.value = user;
        console.log('User is logged in:', user.uid);
      } else {
        console.error('No user is signed in');
      }
    });

    const sendMessage = async (message) => {
      try {
        if (currentUser.value) {
          await addDoc(collection(db, "messages"), {
            text: message,
            timestamp: new Date(),
            userId: currentUser.value.uid,
            userName: currentUser.value.displayName,
          });
        } else {
          console.error("User is not logged in or currentUser is null");
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    onMounted(() => {
      fetchMessages();
      fetchUsers();
    });

    return {
      messages,
      currentUser,
      sendMessage
    };
  }
};

</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  background-color: #ffe4e1;
}
</style>
