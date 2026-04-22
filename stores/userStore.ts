import { defineStore } from 'pinia';

export interface User {
  pn: number | null;
  memberId: string | null;
  name: string | null;
  email: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    pn: null,
    memberId: null,
    name: null,
    email: null,
  }),
  persist: {
    key: 'user_auth',
    storage:piniaPluginPersistedstate.localStorage() // 클라이언트사이드의 localStorage 설정
  },
  getters: {
    isLoggedIn: (state) => !!state.memberId,
  },

  actions: {
    setUser(user: Partial<User>) {
      this.pn = user.pn ?? null;
      this.memberId = user.memberId ?? null;
      this.name = user.name ?? null;
      this.email = user.email ?? null;
    },

    clearUser() {
      this.pn = null;
      this.memberId = null;
      this.name = null;
      this.email = null;
    },
  },
});
