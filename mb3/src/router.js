import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './ui/views/HomeView.vue';
/**
 * Router: currently only has a HomeView route.
 */
const routes = [{ path: '/', component: HomeView }];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
//# sourceMappingURL=router.js.map