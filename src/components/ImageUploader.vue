<template>
  <div>
    <input type="file" @change="onFileChange" />
    <button @click="uploadImage">Upload</button>
    <p v-if="uploadProgress">Uploading: {{ uploadProgress }}%</p>
    <p v-if="downloadURL">Uploaded: <a :href="downloadURL" target="_blank">{{ downloadURL }}</a></p>
  </div>
</template>

<script>
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";

export default {
  data() {
    return {
      file: null,
      uploadProgress: null,
      downloadURL: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadImage() {
      if (!this.file) return;

      const storageRef = ref(storage, `images/${this.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, this.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // 進行状況の更新
          this.uploadProgress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          // アップロード完了後にURLを取得
          this.downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", this.downloadURL);
        }
      );
    },
  },
};
</script>
