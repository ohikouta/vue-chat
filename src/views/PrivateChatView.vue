<!-- PrivateChatView.vue -->
<template>
    <div>
      <h2>Chat with {{ chatPartnerName }}</h2>
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
  import { getDoc, doc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { serverTimestamp } from 'firebase/firestore';

  
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
        currentUser: getAuth().currentUser,
        chatPartnerId: '',
        chatPartnerName: '', // 相手の名前を動的に取得
      };
    },
    async created() {

      // ここで chatPartnerId を初期化
      this.chatPartnerId = this.$route.params.userId;
      console.log('取れているかを確認する---->>>:', this.chatPartnerId);

      console.log('Chat partner ID:', this.chatPartnerId);
      const chatId = this.generateChatId(this.currentUser.uid, this.chatPartnerId);

      // Firestoreから特定のチャットメッセージをリアルタイムで取得
      const messagesQuery = query(
        collection(db, "messages"),
        where("chatId", "==", chatId)
      );

      onSnapshot(messagesQuery, (snapshot) => {
        this.messages = snapshot.docs.map(doc => doc.data());
      });

      // チャット相手の情報を取得
      await this.fetchChatPartnerName();

    },
    methods: {
      // chatIdを生成する関数
      generateChatId(userId1, userId2) {
        return [userId1, userId2].sort().join('_');
      },

      // チャット相手の名前をFirestoreから取得
      async fetchChatPartnerName() {
        if (!this.chatPartnerId) {
          console.log('checkckckckckk')
          console.error("chatPartnerId is undefined or null");
          this.chatPartnerName = "Unknown User";
          return;
        }

        const userDoc = doc(db, "users", this.chatPartnerId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          this.chatPartnerName = docSnap.data().username || 'Anonymous';
        } else {
          console.log("No such user!");
          this.chatPartnerName = "Unknown User";
        }
      },

      // メッセージ送信
      async sendMessage() {
        const chatId = this.generateChatId(this.currentUser.uid, this.chatPartnerId);

        if (!this.newMessage.trim()) {
          alert('メッセージを入力してください');
          return;
        }

        // Firestoreからユーザーの名前を取得
        const userDoc = doc(db, "users", this.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        let senderName = "Anonymous"; // デフォルトの名前
        if (userSnap.exists()) {
          senderName = userSnap.data().username || "Anonymous";
        }

        const messageData = {
          text: this.newMessage.trim(),
          senderId: this.currentUser.uid,
          senderName: senderName, 
          receiverId: this.chatPartnerId,
          chatId: chatId,  // ユニークなチャットIDを保存
          timestamp: serverTimestamp(),
          participants: [this.currentUser.uid, this.chatPartnerId]
        };

        try {
          await addDoc(collection(db, "messages"), messageData);
          this.newMessage = "";  // メッセージフィールドをリセット
        } catch (error) {
          console.error('メッセージ送信エラー:', error);
        }
      }
    }
  };
  </script>
