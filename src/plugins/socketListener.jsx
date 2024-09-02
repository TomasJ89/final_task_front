import {useEffect} from "react";

const socketListener = (socket,fetchData) => {
    useEffect(() => {

        const handleUpdatedProfile = () => {
            fetchData();
        };

        socket.on("updatedProfile", handleUpdatedProfile);
        socket.on("likedMsg",handleUpdatedProfile)
        socket.on("getUsers",handleUpdatedProfile)

        // Cleanup the event listener
        return () => {
            socket.off("updatedProfile", handleUpdatedProfile);
            socket.off("likedMsg",handleUpdatedProfile)
            socket.off("getUsers",handleUpdatedProfile)
        };
    }, [socket, fetchData]);

}
export default socketListener;