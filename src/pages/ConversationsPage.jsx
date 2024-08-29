import React, {useEffect} from 'react';
import mainStore from "../store/mainStore.jsx";
import http from "../plugins/http.jsx";

const ConversationsPage = () => {

    const {user} = mainStore()


    useEffect(() => {


        http.get(`/all-conversations/${user._id}`)
            .then(res => {
                if (res.success) {

                } else {
                    console.error('Fetching failed:', res.message);
                }
            })
    }, []);

    return (
        <div>

        </div>
    );
};

export default ConversationsPage;