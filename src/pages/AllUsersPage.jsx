import React, {useEffect, useState} from 'react';
import mainStore from "../store/mainStore.jsx";
import http from "../plugins/http.jsx";
import {useNavigate} from "react-router-dom";

const AllUsersPage = () => {

    const {user} = mainStore()
    const [allUsers,setAllUsers] =useState([])
    const [error, setError] = useState(null);
    const nav= useNavigate()


    useEffect(() => {
        http.get("/all-users")
            .then(res => {
                if (res.success) {
                    const filteredUsers = res.data.filter(x => x._id !== user._id)
                    setAllUsers(filteredUsers);
                } else {
                    console.error('Fetching failed:', res.message);
                    setError(res.message);
                }
            })
    }, []);


    return (
        <div>
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
                            <td >
                            <div className="flex justify-center items-center gap-3 cursor-pointer"
                                 onClick={()=> nav(`/user/${user.username}`)} >
                                <div className="avatar offline">
                                    <div className="w-24 rounded-full">
                                        <img
                                            src={user.image}
                                            alt={`${user.username}'s Avatar`}
                                        />
                                    </div>
                                </div>
                                <div>
                                        <div className="font-bold">{user.username}</div>
                                        <div className="text-sm opacity-50">"Offline"</div>
                                    </div>
                                </div>
                            </td>
                            <th className="flex justify-center ">
                                <button className="btn btn-blue">Chat with {user.username}!</button>
                            </th>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AllUsersPage;