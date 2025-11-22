<template>
  <div class="chat-view">
    <div v-if="currentUser">
      <UserList />
    </div>
    <div v-else>
      <LandingHero @login="goToLogin" @register="goToRegister"/>
    </div>  
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth'; 
import { db } from '../firebaseConfig';
import UserList from '../components/UserList.vue';
import LandingHero from '../components/LandingHero.vue';

export default {
  components: {
    UserList,
    LandingHero
  },
  setup() {
    const router = useRouter();
    const goToLogin = () => router.push('/login');
    const goToRegister = () => router.push('/register');
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
      goToLogin,
      goToRegister,
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
  justify-content: space-between;
}
</style>
