<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>プロフィール編集</h2>
            <ImageUploader @imageUploaded="handleImageUploaded" />
            <button @click="close">Close</button>
        </div>
    </div>
</template>

<script>
import ImageUploader from "@/components/ImageUploader.vue";

export default {
  components: {
    ImageUploader,
  },
  data() {
    return {
      profileImageUrl: null,
    };
  },
  methods: {
    handleImageUploaded(url) {
      this.profileImageUrl = url; // アップロード後の画像URLを取得
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style>
/* モーダルのスタイル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}
</style>