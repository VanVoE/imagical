import { create } from 'zustand'
import { persist } from 'zustand/middleware';

const authStore = (set) => ({
  userProfile: null,
  userCredit: null, 
  isBuyingCoins: false,
  setUserProfile: (user) => set({ userProfile: user }),
  setIsBuyingCoins: (isBuying) => set({isBuyingCoins: isBuying}),
  setUserCredit: (credit) => set({userCredit: credit}),
  decreaseUserCredit: (credit) => set({userCredit: credit - 1}),
  increaseUserCredit: (credit) => set({userCredit: credit + 10}), // current cost is 1 dollar for 5 credits
  removeUser: () => set({ userProfile: null, userCredit: null }),
})

const useAuthStore = create((
    persist(authStore, {
      name: 'auth',
    })
  ));
  
  export default useAuthStore;

