import React from 'react';
import mainStore from "../store/mainStore.jsx";
import {useNavigate} from "react-router-dom";
import http from "../plugins/http.jsx";

const NotificationPage = () => {

    const {user,setUser} = mainStore()
    const nav = useNavigate()
    async function deleteNotification(id) {
        const data = {
            notificationId: id
        }
        try {
            const token = localStorage.getItem(`${user.username} token`);
            if (!token) {
                console.error("No token found for the user");
                return;
            }
            const res = await http.postAuth("/delete-notification", data, token)
            if (res.success) {
              setUser(res.data)
            } else {
                console.error('Fetching failed:', res.message);
            }
        } catch (error) {
            console.error("Error fetching conversation", error);
        }
    }

    return (
        <div className="p-5">
            {user?.notifications.length === 0 ?
                <h1 className="font-semibold text-center text-xl mt-72 ">You don't have notifications at the moment</h1>:
                <>
                    <div
                        className="w-full min-h-[75vh] max-h-[75vh] overflow-y-scroll bg-base-200 flex flex-col gap-2 items-center rounded-lg p-5">
                        <h1 className="font-semibold text-xl mb-5">All notifications:</h1>
                        {user?.notifications?.map((x, i) =>
                            <div
                                onClick={() => {
                                    nav(`/chat/${x.conversationsId}`);
                                    deleteNotification(x._id);
                                }}
                                key={i}
                                className="card w-full lg:w-2/3 lg:mt-0 mt-3 bg-base-100 h-2/6 p-2 shadow-lg rounded-lg flex items-center justify-center flex-row cursor-pointer hover:bg-blue-200/25 transition-all hover:scale-105">
                                <div className="flex-1 mx-4 flex justify-between flex-col md:flex-row">
                                    <p className="text-sm md:text-lg font-medium text-gray-900 truncate dark:text-white">
                                        {x.type === "message" ? (
                                            <>
                                                You got a new message from <span className="font-bold italic">{x.sender.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-bold italic">{x.sender.name}</span> liked your message
                                            </>
                                        )}
                                </p>
                                <div className="opacity-50 text-sm md:text-lg italic">{new Date(x.date
                                    ).toLocaleDateString('lt-LT', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}</div>
                                </div>
                            </div>
                        )}

                    </div>
                </>
            }
        </div>

    );
};

export default NotificationPage;