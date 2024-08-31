import React, {useEffect, useState} from 'react';
import mainStore from "../store/mainStore.jsx";
import http from "../plugins/http.jsx";
import {useNavigate} from "react-router-dom";
import {socket} from "../plugins/sockets.jsx";

const ConversationsPage = () => {

    const {user,setUser} = mainStore()
    const [conversations,setConversations] = useState([])
    const nav= useNavigate()

    useEffect(() => {

        http.get(`/all-conversations/${user?._id}`)
            .then(res => {
                if (res.success) {
                setConversations(res.data)
                    console.log(res.data)
                } else {
                    console.error('Fetching failed:', res.message);
                    setConversations([])
                }
            })
    }, [user]);

    async function deleteConversation(conversation){
        const data = {
           id:conversation._id
        }
        const token = localStorage.getItem(`${user.username} token`);
        const res = await http.postAuth("/delete-conversation", data, token)
        if (res.success) {
            setUser(res.data)
            const recipientId = conversation.members.find(member => member._id !== user._id)
            socket.emit("conv",recipientId._id)
        } else {
            console.error('Deleting failed:', res.message);
        }
    }

    return (
        <div className="p-5 flex justify-center" >
            {conversations.length === 0?
                <h1 className="font-semibold text-xl mt-80 ">You don't have active conversations at the moment</h1> :
                <>
                    <div className="w-full min-h-[62vh] bg-base-200 flex flex-col gap-2  items-center rounded-lg p-5">
                        <h1 className="font-semibold text-xl mb-5">All conversations:</h1>
                        {conversations?.map(x =>
                            <div key={x._id}
                                 className="card w-full lg:w-2/3 lg:mt-0 mt-3 bg-base-100 h-2/6 p-2 shadow-lg rounded-lg flex items-center justify-center flex-row cursor-pointer hover:bg-blue-200/25 transition-all hover:scale-105">
                                <div className="flex-1 ml-4">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        Conversation with <span
                                        className="font-bold">{x.members.find(member => member._id !== user._id)?.username}</span>
                                    </p>
                                    <div className="chat-footer opacity-50 mt-2">Created At :
                                        {new Date(x.createdAt
                                        ).toLocaleDateString('lt-LT', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row">
                                    <button className="btn btn-error m-1"
                                            onClick={() => deleteConversation(x)}>Delete conversation
                                    </button>
                                    <button className="btn bg-blue-300 m-1"
                                            onClick={() => nav(`/chat/${x._id}`)}>Go to conversation
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </>}

        </div>

    );
};

export default ConversationsPage;