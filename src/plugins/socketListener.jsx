import {useEffect} from "react";

const socketListener = (socket,fetchData) => {
    useEffect(() => {
        // Listen for the "updatedProfile" event and call the provided fetch function
        const handleUpdatedProfile = () => {
            fetchData();
        };

        socket.on("updatedProfile", handleUpdatedProfile);
        socket.on("likedMsg",handleUpdatedProfile)

        // Cleanup the event listener
        return () => {
            socket.off("updatedProfile", handleUpdatedProfile);
            socket.off("likedMsg",handleUpdatedProfile)
        };
    }, [socket, fetchData]);

}
export default socketListener;