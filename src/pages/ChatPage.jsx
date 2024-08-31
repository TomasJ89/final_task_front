import React, {useEffect, useState, useRef} from 'react';
import {useParams} from "react-router-dom";
import http from "../plugins/http.jsx";
import mainStore from "../store/mainStore.jsx";
import {socket} from "../plugins/sockets.jsx";
import socketListener from "../plugins/socketListener.jsx";

const ChatPage = () => {
    const {user} = mainStore();
    const {conversationsId} = useParams();
    const [recipient, setRecipient] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [error, setError] = useState(null);
    const [allMessages, setAllMessages] = useState([]);
    const lastMessageRef = useRef(null);
    const [text, setText] = useState(null)


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
            socket.emit("joinRoom", { conversationsId });

            socket.on("addMessage", message => {
                setAllMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                socket.emit("leaveRoom", { conversationsId });
                socket.off("addMessage");
            };
        }
    }, [conversationsId]);

    useEffect(() => {
        // Scroll to the last message whenever `allMessages` updates
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
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
            socket.emit("newMessage", { ...res.message, conversationsId });
        }
    }

    return (
        <div className="p-5">
            {text? <>
                <div className="p-5 flex justify-center">
                    <h1 className="font-semibold text-xl mt-64 ">{text}</h1>
                </div>
            </> : <>
                <div className="relative bg-base-200 rounded-lg shadow-lg">
                    <h1 className="bg-blue-300 text-center rounded-t-xl text-lg font-semibold">Chat
                        with {recipient?.username}</h1>
                    <div className="overflow-y-scroll max-h-96 min-h-[62vh] p-5 mx-5">
                        {allMessages?.map((msg, index) => {
                            const isLastMessage = index === allMessages.length - 1;
                            return (
                                <div
                                    key={index}
                                    className={msg.sender === user._id ? "chat chat-start" : "chat chat-end"}
                                    ref={isLastMessage ? lastMessageRef : null} // Attach ref to the last message
                                >
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
                                    <div className="chat-footer opacity-50">
                                        {new Date(msg.date).toLocaleDateString('lt-LT', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
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