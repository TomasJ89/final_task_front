import {create} from "zustand";
const useStore = create((set,get) => ({
    user:null,
    loggedIn:false,
    loading:false,
    onlineUsers:[],
    allUsers:[],
    setAllUsers: val => set ({allUsers:val}),
    setUser: val => set ({user:val}),
    setLoggedIn: val => set({loggedIn:val}),
    setLoading: val => set({loading:val}),
    setOnlineUsers: val => set({onlineUsers:val})
}))

export default useStore