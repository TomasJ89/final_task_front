import React, {useRef, useState} from 'react';
import mainStore from "../store/mainStore.jsx";
import http from "../plugins/http.jsx";
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
        const {user, setUser, loading} = mainStore()
        const [settings, setSettings] = useState(false)
        const [error, setError] = useState(null)
        const [goodNews, setGoodNews] = useState(null)
        const imgRef = useRef()
        const oldPassRef = useRef()
        const newPassRef = useRef()
        const nameRef = useRef()
        const nav = useNavigate()

        async function changePhoto() {
            setError(null);
            if (!imgRef.current.value) {
                return
            }
            const data = {
                url: imgRef.current.value,
            }
            const token = localStorage.getItem(`${user.username} token`);
            const res = await http.postAuth("/update-photo", data, token)
            if (res.success) {
                setUser(res.data)
                setError(null);
            } else {
                setError(res.message);
            }
        }

        async function changeUsername() {
            setError(null);
            if (!nameRef.current.value) {
                return
            }
            const data = {
                name: nameRef.current.value,
            }
            const token = localStorage.getItem(`${user.username} token`);
            const res = await http.postAuth("/update-username", data, token)
            if (res.success) {
                setUser(res.data)
                setError(null);
            } else {
                setError(res.message);
            }
        }

        async function changePassword() {
            setError(null);
            if (!newPassRef.current.value || !oldPassRef.current.value) {
                return
            }
            const data = {
                oldPassword: oldPassRef.current.value,
                newPassword: newPassRef.current.value
            }
            const token = localStorage.getItem(`${user.username} token`);
            const res = await http.postAuth("/update-password", data, token)
            if (res.success) {
                setGoodNews(res.message)
                setTimeout(() => {
                    setGoodNews(null)
                    oldPassRef.current.value = ""
                    newPassRef.current.value = ""
                }, 3000)
                setError(null);
            } else {
                setError(res.message);
            }
        }

        return (
            <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-center py-5">
                {loading ? <div className="flex items-center justify-center h-screen">
                        <span className="loading loading-ring loading-lg"></span>
                    </div> :
                    <>
                        <div
                            className="card card-compact bg-base-100 w-96 shadow-xl mb-5 lg:mb-0 max-h-[560px] min-h-[560px] ">
                            <figure>
                                <img
                                    src={user?.image}
                                    alt={user?.username}/>
                            </figure>
                            <div className="card-body">
                                <div className="relative group ">
                                    <img
                                        className="h-5 border-gray-600 cursor-pointer"
                                        src="https://www.svgrepo.com/show/509221/settings.svg"
                                        alt="upload"
                                        onClick={() => setSettings(!settings)}
                                    />
                                    <div
                                        className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out text-xs p-2 bg-gray-200 text-black rounded -top-10 left-14 transform -translate-x-1/2 whitespace-nowrap">
                                        Profile Settings.
                                    </div>
                                </div>
                                <h2 className="card-title ">{user?.username}</h2>
                                <p>Aš pupius fainuoliukas</p>
                                <div className="card-actions justify-end">
                                    <button className="btn bg-blue-300"
                                            onClick={()=> nav("/conversations")}>My Conversations
                                        ({user?.conversations.length})
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`relative ${!settings && 'hidden'} lg:ms-3  card card-compact bg-base-100 w-96 shadow-xl p-5`}>
                            <h1 className="font-bold text-lg mb-5">Profile Settings</h1>
                            <div className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
                                 onClick={() => setSettings(!settings)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <a>Username:</a>
                            <label className=" mt-1 input input-bordered flex items-center gap-2">
                                <input
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.username}
                                    ref={nameRef}
                                />
                            </label>
                            <button className="btn bg-blue-300  w-full my-2" onClick={changeUsername}>
                                Change username
                            </button>
                            <a>Profile photo:</a>
                            <label className=" mt-1 input input-bordered flex items-center gap-2">
                                <input
                                    ref={imgRef}
                                    type="text"
                                    className="grow"
                                    placeholder="Photo URL"
                                    defaultValue={user?.image}/>
                            </label>
                            <button className="btn bg-blue-300  w-full my-2" onClick={changePhoto}>
                                Change photo
                            </button>

                            <a>Password:</a>
                            <label className=" mt-1 input input-bordered flex items-center mb-1">
                                <input
                                    type="password"
                                    className="grow"
                                    placeholder="Old pasword"
                                    ref={oldPassRef}
                                />
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <input
                                    type="password"
                                    className="grow"
                                    placeholder="New password"
                                    ref={newPassRef}
                                />
                            </label>
                            <button
                                className="btn bg-blue-300  w-full my-2" onClick={changePassword}>
                                Change password
                            </button>
                            {error && <a className="text-sm text-red-500 ">
                                {error}</a>}
                            {goodNews && <a className="text-sm text-green-600 ">
                                {goodNews}</a>}
                        </div>
                    </>
                }

            </div>

        );
    }
;

export default ProfilePage;