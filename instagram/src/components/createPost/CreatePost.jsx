import { useState, useEffect } from 'react';
import './createPost.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const CreatePost = () => {
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const navigate = useNavigate();

    const notifyError = (msg) => toast.error(msg);
    const notifySuccess = (msg) => toast.success(msg);

    useEffect(() => {
        if (url) {
            const token = localStorage.getItem("jwt");
            if (!token) {
                navigate("/signup");
                return;
            }

            const data = JSON.parse(token);
            fetch("/createPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + data.token
                },
                body: JSON.stringify({
                    body,
                    pic: url,
                    id: data.user._id
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        notifyError(data.error);
                    } else {
                        notifySuccess("Successfully Posted");
                        navigate("/");
                    }
                })
                .catch(err => console.error(err));
        }
    }, [url, body, navigate]);

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "cloud786");
        fetch("https://api.cloudinary.com/v1_1/cloud786/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => console.error(err));
    };

    const loadFile = (event) => {
        const output = document.getElementById("output");
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src);
        };
        setImage(event.target.files[0]);
    };

    return (
        <div className="createPost">
            <div className="Post-header">
                <h4 className="mt-4">Create New Post</h4>
                <button id="post-btn" onClick={postDetails}>Share</button>
            </div>
            <div className="main-div">
                <img id="output" src='https://cdn-icons-png.flaticon.com/256/1160/1160358.png' alt="Preview" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={loadFile}
                />
            </div>
            <div className="details">
                <div className="card-header">
                    <div className="card-pic">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSohsTUG9fjHzk53wlJYRl3qHTZB_FZAJpYzQ&usqp=CAU" alt="User" />
                    </div>
                    <h5>Shohra</h5>
                </div>
                <textarea
                    type="text"
                    placeholder="Write a caption"
                    className="border-2"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                ></textarea>
            </div>
        </div>
    );
};
