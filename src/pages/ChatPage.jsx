import React, {useEffect, useState, useRef} from 'react';
import {useParams} from "react-router-dom";
import http from "../plugins/http.jsx";
import mainStore from "../store/mainStore.jsx";
import {socket} from "../plugins/sockets.jsx";
import socketListener from "../plugins/socketListener.jsx";

const ChatPage = () => {
    const {user,setUser} = mainStore();
    const {conversationsId} = useParams();
    const [recipient, setRecipient] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [error, setError] = useState(null);
    const [allMessages, setAllMessages] = useState([]);
    const lastMessageRef = useRef(null);
    const [text, setText] = useState(null)
    const [chatUsers, setChatUsers] = useState([])


    const conversationFetch = async () => {
        const data = {
            conversationsId
        };
        try {
            const token = localStorage.getItem(`${user.username} token`);
            if (!token) {
                console.error("No token found for the user");
                return;
            }
            const res = await http.postAuth("/single-conversation", data, token)
            if (res.success) {
                setRecipient(res.conversation.members.find(x => x._id !== user._id));
                setAllMessages(res.conversation.messages);
            } else {
                setText("This conversation was deleted")
                console.error('Fetching failed:', res.message);
            }
        } catch (error) {
            console.error("Error fetching conversation", error);
        }
    }

    socketListener(socket, conversationFetch)

    useEffect(() => {
        conversationFetch()
    }, [user]);


    useEffect(() => {
        if (conversationsId) {
            socket.emit("joinRoom", {conversationsId});
            socket.on("roomUsers", filteredUsers => {
                filteredUsers = filteredUsers.filter(x => x.userId !== user._id)
                setChatUsers(filteredUsers)

            })

            socket.on("addMessage", message => {
                setAllMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                socket.emit("leaveRoom", {conversationsId});
                socket.off("addMessage");
            };
        }
    }, [conversationsId]);
    useEffect(() => {

        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [allMessages]);

    async function sendMessage() {
        if (inputMessage === "") {
            return setError("All fields must be filled");
        }
        const message = {
            conversationsId,
            text: inputMessage,
            sender: user._id,
            recipient: recipient._id
        };
        const res = await http.post("/send-message", message);
        if (res.success) {
            setInputMessage("");
            socket.emit("newMessage", {...res.message, conversationsId});
            if (!chatUsers.find(x => x.userId === res.message.recipient)) {
                const notification = {...res.message, conversationsId}
                addNotification(notification)
            }
        }
    }

    async function addNotification(notification) {
        const res = await http.post("/notification", notification);
        if(res.success) {
            const recipient = res.data
            socket.emit("conv",recipient._id)
        }
    }

    async function like(id) {
        const data = {
            userId: user._id,
            msgId: id,
            conversationsId
        }
        const res = await http.post("/like", data);
        if (res.success) {
            conversationFetch()
            socket.emit("like", conversationsId);
            if (!chatUsers.find(x => x.userId === recipient._id)) {
                const notification = {
                    sender:user._id,
                    recipient:recipient._id,
                    date:res.data.likes[0].date,
                    conversationsId,
                }
                addNotification(notification)
            }
        }
    }

    return (
        <div className="p-5">
            {text ? <>
                <div className="p-5 flex justify-center">
                    <h1 className="font-semibold text-xl mt-64 ">{text}</h1>
                </div>
            </> : <>
                <div className="relative bg-base-200 rounded-lg shadow-lg">
                    <h1 className="bg-blue-300 text-center rounded-t-xl text-lg font-semibold">Chat
                        with {recipient?.username}</h1>
                    <div className="overflow-y-scroll max-h-[75vh] min-h-[75vh] p-5 mx-5">
                        {allMessages?.map((msg, index) => {
                            const isLastMessage = index === allMessages.length - 1;
                            return (
                                <div
                                    key={index}
                                    className={msg.sender === user._id ? "chat chat-start" : "chat chat-end"}
                                    ref={isLastMessage ? lastMessageRef : null}>
                                    <div className="chat-image avatar">
                                        <div className="w-10 rounded-full">
                                            <img
                                                alt="Profile"
                                                src={msg.sender === user._id ? user.image : recipient?.image}
                                            />
                                        </div>
                                    </div>
                                    <div className="chat-header">
                                        {msg.sender === user._id ? user.username : recipient?.username}
                                    </div>
                                    <div
                                        className={`chat-bubble ${msg.sender === user._id ? "chat-bubble-info" : "chat-bubble-accent"}`}>
                                        {msg.text}
                                    </div>
                                    <div
                                        className="chat-footer">
                                        <div
                                            className={`flex ${msg.sender !== user._id ? "justify-end" : "justify-start"}`}>
                                            {msg.sender !== user._id ? (
                                                <>
                                                    <img
                                                        className={`h-5 mt-1 cursor-pointer ${msg.likes?.some(like => like.user.toString() === user._id) ? 'opacity-100' : 'opacity-50'}`}
                                                        src={msg.likes?.some(like => like.user.toString() === user._id)
                                                            ? "https://www.svgrepo.com/show/299479/like.svg"
                                                            : "https://www.svgrepo.com/show/157828/like.svg"}
                                                        alt="like"
                                                        onClick={() => like(msg._id)}
                                                    />
                                                    {msg.likes?.length > 0 &&
                                                        <span className="pt-1 ms-1 opacity-50">({msg.likes.length})</span>}
                                                </>
                                            ) : (
                                                msg.likes?.length > 0 &&
                                                <div className="relative group">
                                                    <span className="pt-1 cursor-pointer opacity-50">Likes: {msg.likes.length}</span>
                                                    <div
                                                        className="absolute opacity-0 group-hover:opacity-100 duration-500 ease-in-out p-2 bg-blue-300 text-gray-600 rounded top-5 left-14 transform -translate-x-1/2 whitespace-nowrap">
                                                        {recipient.username} likes this message
                                                    </div>
                                                </div>

                                            )}
                                    </div>
                                   <div className="opacity-50">
                                       {new Date(msg.date).toLocaleDateString('lt-LT', {
                                           year: 'numeric',
                                           month: 'numeric',
                                           day: 'numeric',
                                           hour: '2-digit',
                                           minute: '2-digit',
                                       })}
                                   </div>
                                    </div>
                                </div>

                            );
                        })}
                    </div>
                    <div className="flex p-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                            placeholder="Write a message"
                            className="input input-bordered w-full mr-2"
                        />
                        <button className="btn bg-blue-300" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </>}

        </div>
    );
};

export default ChatPage;