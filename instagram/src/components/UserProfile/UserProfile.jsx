/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PostDetails from '../postdetails/PostDetails';
import { useParams } from 'react-router-dom';
import "../../components/Profile/profile.css";

function UserProfile() {
    var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
    const { userid } = useParams()
    // console.log(userid);
    const navigate = useNavigate();
    const [user, setuser] = useState("")
    const [isFollow, setIsFollow] = useState(false)
    const [posts, setposts] = useState([])



    // to follow user
    const followUser = (userId) => {
        console.log("userId === ", userId);
        const token = localStorage.getItem("jwt");
        const data = JSON.parse(token);
        console.log("followUser data === ", data);
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
    // // to unfollow user    

    console.log("user === ", user);
    const unfollowUser = (userId) => {
        let token = localStorage.getItem("jwt");
        console.log("user === ", user);
        let data = JSON.parse(token);
        console.log("data === ", data);
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + (data.token)
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                setIsFollow(false);
            })
    }

    // 
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const data = JSON.parse(token);
        if (!token) {
            navigate("/signup");
            return;
        }

        // console.log("userid === ", userid);
        fetch(`/user/${userid}`, {
            headers: {
                authorization: "Bearer " + (data.token)
            }
        })
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                setuser(result.user);
                setposts(result.posts);
                if (result.user.followers.includes(data['user']._id)) {
                    setIsFollow(true)
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [isFollow, navigate, userid]); // 

    let userData = JSON.parse(localStorage.getItem("jwt"));
    // console.log("userData === ", userData);
    // console.log("user.name === ", user.name);
    // console.log("userData._id === ", user._id);

    return (
        <div className='profile text-center'>
            <div className="prifle-frame flex justify-evenly">
                <div className="profile-pic h-fit">
                    <img src={user.photo ? user.photo : picLink} alt="" className="m-auto" />
                </div>

                <div className="profile-data flex flex-col justify-around">
                    <div className='flex items-center gap-8 justify-between'>
                        <div>
                            <h1>
                                {user.name}
                            </h1>
                        </div>
                        <div className='followBtn'>

                            <button
                                onClick={() => {
                                    if (isFollow) {
                                        unfollowUser(user._id)
                                    }
                                    else {
                                        followUser(user._id)
                                    }
                                }}>
                                {isFollow ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    </div>


                    <div className="profile-info flex text-left">
                        <p>{posts.length} post </p>
                        <p>{user.followers ? user.followers.length : 0} followers</p>

                        <p>
                            {user.following ? user.following.length : 0} follwing
                        </p>
                    </div>
                </div>
            </div>
            <hr />
            {/* gallery */}
            <div className="gallery flex flex-wrap text-center">
                {posts.map((pics, index) => (
                    <img key={pics._id}
                        src={pics.photo}
                        alt={`Image ${index + 1}`}
                    // onClick={() => toggleDetails(pics)}
                    />
                ))}
            </div>
            {/* {
                show &&
                <PostDetails item={posts}
                 toggleDetails={toggleDetails} />
            } */}

        </div>
    )
}

export default UserProfile