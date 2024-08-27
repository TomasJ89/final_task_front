import React, {useState,useRef} from 'react';
import {useNavigate} from "react-router-dom";
import http from "../plugins/http.jsx";
import mainStore from "../store/mainStore.jsx";
const LoginPage = () => {
    const nav = useNavigate()
    const [error,setError] = useState(null)
    const [passHide,setPassHide] = useState(true)
    const nameRef = useRef()
    const passRef = useRef();
    const {setLoggedIn,setUser} = mainStore()
    async function login() {
        setError(null);
        if (!nameRef.current.value || !passRef.current.value ) {
            return setError("All fields must be filled")
        }
        const user = {
            name: nameRef.current.value,
            password: passRef.current.value
        };
        const res = await http.post("/login", user);
        if (res.success) {
            localStorage.setItem("token", res.token)
            setLoggedIn(true);
            setUser(res.data)
            nav('/profile');
            setError(null)
        } else {
            setError(res.message);
        }
    }
    return (
        <div>
            <div className="relative flex flex-col items-center justify-center h-[80vh] overflow-hidden mx-5">
                <div
                    className="w-80 p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-md border-top lg:max-w-lg">
                    <h1 className="text-3xl font-semibold text-center text-gray-700">
                       Please Login
                    </h1>
                    <div className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="text-base label-text">Username</span>
                            </label>
                            <input type="text" placeholder="Enter Username" className="w-full input input-bordered"
                                   maxLength="20" ref={nameRef}/>
                        </div>
                        <div>
                            <label className="label">
                                <span className="text-base label-text">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">

                                <button onClick={() => setPassHide(!passHide)}>
                                    {passHide ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>
                                    )}
                                </button>

                                <input
                                    type={passHide ? "password" : "text"}
                                    className="grow"
                                    placeholder="Enter Password"
                                    maxLength="20"
                                    ref={passRef}
                                />
                            </label>

                        </div>
                        {error && <a className="text-sm text-red-500 ">
                            {error}</a>}
                        <div>
                        <button className="btn btn-block btn-neutral" onClick={login}>Login</button>
                        </div>
                        <div className="text-sm text-gray-400">
                            If you are not register <span className="cursor-pointer underline"
                                                          onClick={() => nav("/register")}>click here !</span></div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default LoginPage;