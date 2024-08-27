import {create} from "zustand";
const useStore = create((set,get) => ({
    user:null,
    loggedIn:false,
    loading:false,
    setUser: val => set ({user:val}),
    setLoggedIn: val => set({loggedIn:val}),
    setLoading: val => set({loading:val}),
}))

export default useStore