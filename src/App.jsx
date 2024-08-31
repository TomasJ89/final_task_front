import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AllUsersPage from "./pages/AllUsersPage.jsx";
import SingleUserPage from "./pages/SingleUserPage.jsx";
import ConversationsPage from "./pages/ConversationsPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Footer from "./components/Footer.jsx";
import {useEffect} from "react";
import mainStore from "./store/mainStore.jsx";
import http from "./plugins/http.jsx";
import {socket} from "./plugins/sockets.jsx"

function App() {
    const {setLoggedIn, setUser,setLoading,user,socketTrigger,setSocketTrigger} = mainStore()

    // useEffect(() => {
    //         autoLogin()
    //     }, []);
    // async function autoLogin() {
    //     try {
    //         const token = localStorage.getItem(`${user.username} token`);
    //         if (!token) return;
    //         let object = { data: "auto-login" };
    //         const res = await http.postAuth("/auto-login", object, token);
    //         if (res && res.success) {
    //             localStorage.setItem(`${res.data.username} token`, res.token)
    //             setUser(res.data);
    //             setLoggedIn(true);
    //         } else {
    //             console.error('Login failed:', res.message);
    //         }
    //     } catch (error) {
    //         console.error('Auto-login error:', error);
    //     }
    // }
    useEffect(() => {
        socket.on("update", () => {
            if (user) {
                updateUser(); // Directly call the update function when the "update" message is received
            }
        });

        return () => {
            socket.off("update");
        };

    }, [user, socket]);

    const updateUser = async () => {
        const data = { id: user._id };
        try {
            const res = await http.post("/updatedUser", data);
            if (res.success) {
                setUser(res.data);
            } else {
                console.log(res.message);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <>
            <BrowserRouter>
                <Toolbar/>
                <div className="bg-blue-100 min-h-[80vh]">
                    <div className="container mx-auto">
                        <Routes>
                            <Route element={<RegisterPage />} path="/register"/>
                            <Route element={<LoginPage socket={socket}/>} path="/"/>
                            <Route element={<AllUsersPage/>} path="/allUsers"/>
                            <Route element={<ProfilePage/>} path="/profile"/>
                            <Route element={<SingleUserPage/>} path="/user/:username"/>
                            <Route element={<ConversationsPage/>} path="/conversations"/>
                            <Route element={<ChatPage/>} path="/chat/:conversationsId"/>
                            <Route element={<NotificationPage/>} path="/notifications"/>
                        </Routes>
                    </div>
                </div>
                <Footer/>
            </BrowserRouter>


        </>
    )
}

export default App
