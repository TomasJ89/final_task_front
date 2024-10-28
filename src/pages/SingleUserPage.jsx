import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../plugins/http.jsx';
import mainStore from '../store/mainStore.jsx';
import {socket} from "../plugins/sockets.jsx";
import socketListener from "../plugins/socketListener.jsx";

const SingleUserPage = () => {
    const { setUser, user} = mainStore();
    const { username } = useParams();
    const [singleUser, setSingleUser] = useState(null);
    const [commonConversations, setCommonConversations] = useState([]);
    const nav = useNavigate();



    const fetchSingleUser = async () => {
        try {
            const res = await http.get(`/user/${username}`);
            if (res.success) {
                setSingleUser(res.data);
            } else {
                console.error("Failed to fetch user");
            }
        } catch (error) {
            console.error("Error fetching user", error);
        }
    };
    socketListener(socket, fetchSingleUser)

    useEffect(() => {
        fetchSingleUser();
    }, [username]);

    async function createConversation(singleUser) {
        if (!singleUser || !user) return; // Ensure singleUser and user are defined

        const data = {
            id: singleUser._id
        };

        const token = localStorage.getItem(`token`);
        if (!token) {
            console.error("No token found for the user");
            return;
        }

        try {
            const res = await http.postAuth("/create-conversation", data, token);
            if (res.success) {
                setUser(res.data.updateUser);
                nav(`/chat/${res.data.conversation._id}`);
                socket.emit("conv",singleUser._id)
            } else {
                console.error("Failed to create conversation");
            }
        } catch (error) {
            console.error("Error creating conversation", error);
        }
    }

    function getCommonConversations(userConversations, singleUserConversations) {
        return userConversations.filter(convId => singleUserConversations.includes(convId));
    }

    useEffect(() => {
        if (singleUser && user) {
            const commonConvs = getCommonConversations(user.conversations, singleUser.conversations);
            setCommonConversations(commonConvs);

        }
    }, [singleUser, user]);

    return (
        <div className="p-5 flex justify-center ">
            <div className="card glass w-96">
                <figure>
                    <img
                        src={singleUser?.image}
                        alt="car!"/>
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{singleUser?.username}</h2>
                    <p>Here could be a description about the user</p>
                    <div className="card-actions justify-end">
                        <button className="btn bg-blue-300"
                                onClick={()=>{commonConversations.length > 0?
                                    nav(`/chat/${commonConversations[0]}`): createConversation(singleUser)}}>Go chat!</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SingleUserPage;