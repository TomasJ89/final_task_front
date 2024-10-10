import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import mainStore from "../store/mainStore.jsx";
import {socket} from "../plugins/sockets.jsx";

const Toolbar = () => {
    const {loggedIn, setUser, setLoggedIn, user} = mainStore()
    const nav = useNavigate()

    function logOut() {
        localStorage.setItem(`${user.username} token`, null);
        setLoggedIn(false);
        setUser(null);
        nav("/");
        socket.emit("logout")
    }

    function Supplier() {
        this.supply = function () {
            return this;
        }
    }

    var supplier = new Supplier()
    var supply = supplier.supply()
    var comparison = (supplier === supply)
    return (
        <div className="container mx-auto">
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"/>
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {loggedIn ? <>
                                <li>
                                    <Link to="/profile">My profile</Link>
                                </li>

                                <li>
                                    <Link to="/allUsers">All Users</Link>
                                </li>
                                <li>
                                    <Link to={user?.conversations?.length === 0 ? "#" : "/conversations"}
                                          onClick={(e) => user?.conversations?.length === 0 && e.preventDefault()}
                                          className={user?.conversations?.length === 0 ? ' opacity-50' : ''}
                                    >My Conversations ({user?.conversations.length})</Link>
                                </li>
                                <li>
                                    <Link to={user?.notifications?.length === 0 ? "#" : "/notifications"}
                                          onClick={(e) => user?.notifications?.length === 0 && e.preventDefault()}
                                          className={user?.notifications?.length === 0 ? ' opacity-50' : ''}
                                    >Notifications ({user?.notifications.length})</Link>
                                </li>
                                <li>
                                    <button onClick={logOut}>Log Out</button>
                                </li>
                            </> : <>
                                <li>
                                    <button onClick={() => nav("/")}>Login</button>
                                </li>
                                <li>
                                    <button onClick={() => nav("/register")}>Register</button>
                                </li>
                            </>
                            }
                        </ul>
                    </div>
                    <a className="btn bg-blue-300 text-xl font-thin">ChattApp</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal flex items-center  px-1 gap-2 space-x-6">
                        {loggedIn &&
                            <>
                                <li>
                                    <Link to="/profile" className="flex items-center space-x-3">
                                        <div className="chat-image avatar">
                                            <div className="w-8 rounded-full">
                                                <img alt="Profile" src={user.image}/>
                                            </div>
                                        </div>
                                        <span>My profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/allUsers" className="flex items-center space-x-3">
                                        <span>All Users</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={user?.conversations?.length === 0 ? "#" : "/conversations"}
                                          onClick={(e) => user?.conversations?.length === 0 && e.preventDefault()}
                                          className={`flex items-center space-x-3 ${user?.conversations?.length === 0 ? ' opacity-50' : ''}`}
                                    >
                                        <span>My Conversations ({user?.conversations.length})</span>
                                    </Link>
                                </li>
                                <li>

                                    <Link to={user?.notifications?.length === 0 ? "#" : "/notifications"}
                                          className={` relative flex items-center space-x-3 ${user?.notifications?.length === 0 ? ' opacity-50' : ''}`}>
                                        <img
                                            className="h-9 border-gray-600 cursor-pointer rounded-full p-1"
                                            src="https://www.svgrepo.com/show/31480/notification-bell.svg"
                                            alt="upload"
                                        />
                                        <span
                                            className={`absolute flex top-1 justify-center items-center left-7 h-5 w-5 rounded-full border-black p-1 ${user?.notifications.length === 0 ? "" : "bg-amber-300"}`}
                                        >{user?.notifications?.length}</span>

                                    </Link>
                                </li>
                            </>
                        }

                    </ul>
                </div>

                <div className="navbar-end hidden lg:flex">
                    {loggedIn ? (
                        <a className="btn " onClick={logOut}>Logout</a>
                    ) : (
                        <>
                            <a className="btn me-2" onClick={() => nav("/")}>Login</a>
                            <a className="btn" onClick={() => nav("/register")}>Register</a>
                        </>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Toolbar;