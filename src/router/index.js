import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '../views/ChatView.vue';
import RegisterComponent from '../components/RegisterComponent.vue';
import LoginComponent from '../components/LoginComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue';

const routes = [
  {
    path: '/',
    name: 'ChatView',
    component: ChatView
  },
  {
    path: '/register',
    component: RegisterComponent
  },
  {
    path: '/login',
    component: LoginComponent
  },
  {
    path: '/profile',
    component: ProfileComponent
  },
  // 他のルートがあればここに追加
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
