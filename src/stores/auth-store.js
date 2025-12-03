import { defineStore } from 'pinia';
import { uid } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null, 
    isOwner: false, 
  }),
  
  getters: {
    userName: (state) => state.user ? state.user.name : 'Visiteur',
    userDID: (state) => state.user ? state.user.did : 'Non connecté',
  },

  actions: {
    login(userData) {
      this.isAuthenticated = true;
      this.user = {
        name: userData.name,
        did: 'did:cardano:' + uid().substring(0, 12), // DID simulé
      };
      this.isOwner = true; 
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.isOwner = false;
    },

    register(userData) {
      this.login(userData);
    }
  },
});