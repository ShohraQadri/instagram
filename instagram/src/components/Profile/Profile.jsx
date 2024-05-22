/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import "./profile.css"
import { useNavigate } from 'react-router-dom';
import PostDetails from '../postdetails/PostDetails';
import ProfilePic from '../ProfilePic/ProfilePic';

function Profile() {
    const navigate = useNavigate();
    var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
    const [pic, setPic] = useState([]);
    const [isFollow, setIsFollow] = useState(false);
    const [posts, setPosts] = useState([]);
    const [ChangePic, setChangePic] = useState(false);
    const [show, setShow] = useState(false);
    const [user, setUser] = useState("")


    // show and hide comment function
    const toggleDetails = (post) => {
        if (show) {
            setShow(false);
        } else {
            setShow(true);
            setPosts(post);
            console.log("item", post);
        }
    };

    //Change prfile
    const changeprofile = () => {
        if (ChangePic) {
            setChangePic(false)
        }
        else {
            setChangePic(true)
        }

    }

    // to follow user
    const followUser = (userId) => {
        const token = localStorage.getItem("jwt");
        const data = JSON.parse(token);
        fetch("/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + data.token,
            },
            body: JSON.stringify({
                followId: userId,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setIsFollow(true);
            });
    };

    // to unfollow user
    const unfollowUser = (userId) => {
        const token = localStorage.getItem("jwt");
        const data = JSON.parse(token);
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + data.token,
            },
            body: JSON.stringify({
                followId: userId,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setIsFollow(false);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/signup");
            return;
        }
        const data = JSON.parse(token);

        fetch(`/user/${userData.user._id}`, {
            headers: {
                authorization: "Bearer " + data.token
            }
        })
            .then(res => res.json())
            .then((result) => {
                setPic(result.posts);
                setUser(result.user)
                console.log(result);
                console.log(pic);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [navigate]);

    const userData = JSON.parse(localStorage.getItem("jwt"));

    return (
        <div className='profile text-center'>
            <div className="profile-frame flex justify-evenly ">
                <div className="profile-pic h-fit">
                    <img onClick={changeprofile} src={user.photo ? user.photo : picLink} alt="" className="m-auto" />
                </div>
                <div className="profile-data flex flex-col justify-around">
                    <div className='flex items-center gap-8 justify-between'>
                        <h1>{userData.user.name}</h1>
                        <div className='followBtn'>
                            <button onClick={() => {
                                isFollow ? unfollowUser(userData.user._id) : followUser(userData.user._id)
                            }}>
                                {isFollow ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    </div>
                    <div className="profile-info flex text-left mt-1">
                        <p>{pic.length} posts</p>
                        <p>{user.followers ? user.followers.length : "0"} followers</p>
                        <p>{user.following ? user.following.length : "0"} following</p>
                    </div>
                </div>
            </div>
            <hr />
            {/* gallery */}
            <div className="gallery flex flex-wrap text-center">
                {pic.map((pics, index) => (
                    <img key={pics._id}
                        src={pics.photo}
                        alt={`Image ${index + 1}`}
                        onClick={() => toggleDetails(pics)}
                    />
                ))}
            </div>
            {
                show &&
                <PostDetails item={posts} toggleDetails={toggleDetails} />
            }
            {
                ChangePic &&
                <ProfilePic changeprofile={changeprofile} />
            }
        </div>
    )
}

export default Profile;
