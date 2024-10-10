import React, {useEffect, useState} from 'react';
import mainStore from "../store/mainStore.jsx";
import http from "../plugins/http.jsx";
import {useNavigate} from "react-router-dom";
import socketListener from "../plugins/socketListener.jsx";
import {socket} from "../plugins/sockets.jsx";

const AllUsersPage = () => {

    const {user, onlineUsers, loading,setLoading} = mainStore()
    const [allUsers, setAllUsers] = useState([])
    const [error, setError] = useState(null);
    const nav = useNavigate()


    const allUsersFetch = async () => {
        setLoading(true)
        try {
            const res = await http.get("/all-users")
            if (res.success) {
                const filteredUsers = res.data.filter(x => x._id !== user._id)
                setAllUsers(filteredUsers);
                setLoading(false)
            } else {
                console.error('Fetching failed:', res.message);
                setError(res.message);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        }
    }
    socketListener(socket, allUsersFetch)

    useEffect(() => {
        allUsersFetch()
    }, []);

    return (
        <div>
            {loading ? <div className="flex items-center justify-center h-screen">
                    <span className="loading loading-ring loading-lg"></span>
                </div> :
                <>
                    <div className="min-h-[75vh] max-h-[75vh] overflow-y-scroll">
                        <div className="overflow-x-auto mx-5">
                            <table className="table">
                                <thead>
                                <tr className="flex justify-center items-center">
                                    <th className="text-lg">All Users</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {allUsers?.map(user => (
                                    <tr className="border-b-2 border-white" key={user._id}>
                                        <td>
                                            <div className="flex justify-center items-center gap-3 cursor-pointer"
                                                 onClick={() => nav(`/user/${user.username}`)}>
                                                <div
                                                    className={`avatar ${onlineUsers.find(x => x.userId === user._id) ? "online" : "offline"}`}>
                                                    <div className="w-24 rounded-full">
                                                        <img
                                                            src={user.image}
                                                            alt={`${user.username}'s Avatar`}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.username}</div>
                                                    <div
                                                        className="text-sm opacity-50">{onlineUsers.find(x => x.userId === user._id) ? "Online" : "Offline"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <th className="flex justify-center">
                                            <button className="btn btn-blue" onClick={()=> nav("/conversations")}>Chat with {user.username}!</button>
                                        </th>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </>}
        </div>

    );
};

export default AllUsersPage;