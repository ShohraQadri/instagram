/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from 'react';

function ProfilePic({ changeprofile }) {
    const hiddenFileInput = useRef(null);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(null);


    const postDetails = async () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "cloud786");
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/cloud786/image/upload", {
                method: "post",
                body: data
            });
            const result = await response.json();
            setUrl(result.url);
        } catch (err) {
            console.error("Error uploading image: ", err);
        }
    };

    const postPic = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/signup");
            return;
        }

        const data = JSON.parse(token);
        console.log("data === ", data);
        try {
            const response = await fetch("/uploadProfilePic", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + data.token
                },
                body: JSON.stringify({
                    pic: url,
                    id: data.user._id
                })
            });
            const result = await response.json();
            console.log("Profile picture updated successfully: ", result);
            changeprofile();
            window.location.reload();
        } catch (err) {
            console.error("Error updating profile picture: ", err);
        }
    };

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    useEffect(() => {
        if (image) {
            postDetails();
        }
    }, [image]);

    useEffect(() => {
        if (url) {
            postPic();
        }
        // else if (!url) {
        //     setUrl(null)
        // }
    }, [url]);

    const handleRemovePhoto = () => {
        console.log("handleRemovePhoto === ",);
        setUrl(''); // Clear the URL to indicate removal

        postPic()
    };
    return (
        <div className='profilePic darkBg'>
            <div className='changePic centered'>
                <div>
                    <h2>
                        <strong>Change Profile Photo</strong>
                    </h2>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='upload-btn' style={{ color: "#1EA1F7" }} onClick={handleClick}>Upload photo</button>
                    <input
                        type="file"
                        accept='image/*'
                        style={{ display: 'none' }}
                        ref={hiddenFileInput}
                        onChange={(e) => { setImage(e.target.files[0]) }}
                    />
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='upload-btn' style={{ color: "#ED4956" }}
                        onClick={handleRemovePhoto}>
                        Remove current photo
                    </button>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='cursor-pointer' style={{ background: "none", fontSize: "15px" }} onClick={changeprofile}>Cancel</button>
                </div>
            </div>
        </div >
    );
}

export default ProfilePic;
