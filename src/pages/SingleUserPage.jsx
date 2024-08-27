import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../plugins/http.jsx";
const SingleUserPage = () => {
    const {username} = useParams()
    const [singleUser,setSingleUser] = useState(null)

    useEffect(() => {
        const fetchSingleUser = async () => {
            try {
                const res = await http.get(`/user/${username}`);
                if (res.success) {
                    setSingleUser(res.data)
                }
            } catch (error) {
                console.error("Error fetching user", error);
            }
        };
        fetchSingleUser();
    }, []);


    return (
        <div className="p-5 flex justify-center ">
            {/*<div className="card lg:card-side bg-base-100 shadow-xl ">*/}
            {/*    <figure>*/}
            {/*        <img*/}
            {/*            src={singleUser?.image}*/}
            {/*            alt={singleUser?.username}/>*/}
            {/*    </figure>*/}
            {/*    <div className="card-body">*/}
            {/*        <h2 className="card-title">{singleUser?.username}</h2>*/}
            {/*        <p>Here could be a description about the user</p>*/}
            {/*        <div className="card-actions justify-end">*/}
            {/*            <button className="btn btn-primary">Listen</button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
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
                        <button className="btn bg-blue-300">Go chat!</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SingleUserPage;