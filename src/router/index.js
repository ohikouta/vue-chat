import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PrivateChatView from '../views/PrivateChatView.vue';
import UserList from '../components/UserList.vue';
import RegisterComponent from '../components/RegisterComponent.vue';
import LoginComponent from '../components/LoginComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/register', component: RegisterComponent },
  { path: '/login', component: LoginComponent },
  { path: '/profile', component: ProfileComponent },
  { path: '/users', name: 'UserList', component: UserList },
  { path: '/chat/:userId', name: 'PrivateChat', component: PrivateChatView }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
