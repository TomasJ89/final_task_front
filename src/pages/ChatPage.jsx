// import React, {useEffect, useState} from 'react';
// import {useParams} from "react-router-dom";
// import http from "../plugins/http.jsx";
// import mainStore from "../store/mainStore.jsx";
// import {socket} from "../plugins/sockets.jsx";
//
// const ChatPage = () => {
//     const {user} = mainStore()
//     const {conversationsId} = useParams()
//     const [recipient, setRecipient] = useState(null)
//     const [inputMessage, setInputMessage] = useState("")
//     const [error, setError] = useState(null)
//     const [allMessages,setAllMessages] = useState([])
//
//     useEffect(() => {
//         const data = {
//             conversationsId
//         };
//         const token = localStorage.getItem(`${user.username} token`);
//         if (!token) {
//             console.error("No token found for the user");
//             return;
//         }
//         http.postAuth("/single-conversation", data, token)
//             .then(res => {
//                 if (res.success) {
//                     // setRecipient(res.recipient)
//                     console.log(res)
//                     setRecipient(res.conversation.members.find(x => x._id !== user._id))
//                     setAllMessages(res.conversation.messages)
//
//                 } else {
//                     console.error('Fetching failed:', res.message);
//                 }
//             })
//     }, []);
//
//     useEffect(() => {
//         if (conversationsId) {
//             // Join the conversation room
//             socket.emit("joinRoom", { conversationsId });
//
//             // Listen for new messages in this room
//             socket.on("addMessage", message => {
//                 setAllMessages(prevMessages => [...prevMessages, message]);
//             });
//
//             // Cleanup function to leave the room and remove the listener when the component unmounts or conversationsId changes
//             return () => {
//                 socket.emit("leaveRoom", { conversationsId });
//                 socket.off("addMessage"); // Remove the listener to prevent memory leaks
//             };
//         }
//     }, [conversationsId]);
//
//     async function sendMessage() {
//         if (inputMessage === "") {
//             return setError("All fields must be filled");
//         }
//         const message = {
//             conversationsId,
//             text: inputMessage,
//             sender: user._id,
//             recipient: recipient._id
//         };
//         const res = await http.post("/send-message", message);
//         if (res.success) {
//             console.log(res);
//             // setAllMessages(res.data.messages);
//             setInputMessage("");
//             socket.emit("newMessage", { ...res.message, conversationsId });
//         }
//     }
//
//
//     return (
//         <div className="p-5 ">
//             <div className="relative  bg-base-200 rounded-lg shadow-lg ">
//                 <h1 className="bg-blue-300 text-center rounded-t-xl text-lg">Chat with {recipient?.username}</h1>
//                 <div className=" overflow-y-scroll max-h-96 p-5 mx-5">
//                     {allMessages?.map(msg => msg.sender === user._id ?
//                         <div className="chat chat-start">
//                             <div className="chat-image avatar">
//                                 <div className="w-10 rounded-full">
//                                     <img
//                                         alt="Tailwind CSS chat bubble component"
//                                         src={user.image}/>
//                                 </div>
//                             </div>
//                             <div className="chat-header">
//                                 {user.username}
//                             </div>
//                             <div className="chat-bubble chat-bubble-info">{msg.text}</div>
//                             <div className="chat-footer opacity-50">{new Date(msg.date).toLocaleDateString('lt-LT', {
//                                 year: 'numeric',
//                                 month: 'numeric',
//                                 day: 'numeric',
//                                 hour: '2-digit',
//                                 minute: '2-digit',
//                             })}</div>
//                         </div> :
//                         <div className="chat chat-end">
//                             <div className="chat-image avatar">
//                                 <div className="w-10 rounded-full">
//                                     <img
//                                         alt="Tailwind CSS chat bubble component"
//                                         src={recipient?.image}/>
//                                 </div>
//                             </div>
//                             <div className="chat-header">
//                                 {recipient?.username}
//                             </div>
//                             <div className="chat-bubble chat-bubble-accent">{msg.text}</div>
//                             <div className="chat-footer opacity-50">{new Date(msg.date).toLocaleDateString('lt-LT', {
//                                 year: 'numeric',
//                                 month: 'numeric',
//                                 day: 'numeric',
//                                 hour: '2-digit',
//                                 minute: '2-digit',
//                             })}</div>
//                         </div>)}
//                 </div>
//                 <div className="flex p-2">
//                     <input
//                         type="text"
//                         value={inputMessage}
//                         onChange={(e) => setInputMessage(e.target.value)}
//                         onKeyUp={(e) => {
//                             if (e.key === "Enter") sendMessage();
//                         }}
//                         placeholder="Write a message"
//                         className="input input-bordered w-full mr-2"
//                     />
//                     <button className="btn " onClick={sendMessage}>
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//
//     );
// };
//
// export default ChatPage;
import React, {useEffect, useState, useRef} from 'react';
import {useParams} from "react-router-dom";
import http from "../plugins/http.jsx";
import mainStore from "../store/mainStore.jsx";
import {socket} from "../plugins/sockets.jsx";

const ChatPage = () => {
    const {user} = mainStore();
    const {conversationsId} = useParams();
    const [recipient, setRecipient] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [error, setError] = useState(null);
    const [allMessages, setAllMessages] = useState([]);
    const lastMessageRef = useRef(null); // Ref for the last message

    useEffect(() => {
        const data = {
            conversationsId
        };
        const token = localStorage.getItem(`${user.username} token`);
        if (!token) {
            console.error("No token found for the user");
            return;
        }
        http.postAuth("/single-conversation", data, token)
            .then(res => {
                if (res.success) {
                    setRecipient(res.conversation.members.find(x => x._id !== user._id));
                    setAllMessages(res.conversation.messages);
                } else {
                    console.error('Fetching failed:', res.message);
                }
            })
    }, []);

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
            <div className="relative bg-base-200 rounded-lg shadow-lg">
                <h1 className="bg-blue-300 text-center rounded-t-xl text-lg">Chat with {recipient?.username}</h1>
                <div className="overflow-y-scroll max-h-96 p-5 mx-5">
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
                                <div className={`chat-bubble ${msg.sender === user._id ? "chat-bubble-info" : "chat-bubble-accent"}`}>
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
        </div>
    );
};

export default ChatPage;