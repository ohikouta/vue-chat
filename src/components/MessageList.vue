<template>
  <div class="message-list">
    <div v-for="(message, index) in messages" :key="index" class="message-item">
      {{ message.text }}
    </div>
    <p>変わるか？</p>
    <p>ここから新規実装</p>

    <!-- currentUserが存在するかチェックしてから処理する -->
     <div v-if="currentUser">
       <div v-for="message in messages" :key="message.timestamp">
         <p>Logged in user ID: {{ currentUser.uid }}</p>
   
         <!-- 自分のメッセージかどうかを判定 -->
         <div v-if="message.userId === currentUser.uid" class="my-message">
           {{ message.userName }}: {{ message.text }}
         </div>
         <div v-else class="other-message">
           {{ message.userName }}: {{ message.text }}
         </div>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: Array,
    currentUser: Object
  }
};
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.message-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
}
</style>
