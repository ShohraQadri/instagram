import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSmile } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [comment, setcomment] = useState({})
    const [show, setshow] = useState(false);
    const [item, setitem] = useState([]);

    // const notifyError = (msg) => toast.error(msg);
    const notifySuccess = (msg) => toast.success(msg);

    useEffect(() => {
        let token = localStorage.getItem("jwt");
        // console.log("Home token === ", token);
        if (!token) {
            navigate("/signup");
            return;
        }

        // let data = JSON.parse(token);
        let data = JSON.parse(localStorage.getItem("jwt"));
        // console.log("Home data === ", data);
        fetch("/allposts", {
            headers: {
                "Authorization": "Bearer " + data.token
            },
        })
            .then(res => {
                // console.log("res === ", res);
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
                return res.json(); // Parse the response body as JSON
            })
            .then(data => {
                // console.log("data === ", data);
                // setData(data); // Set the fetched data
                if (!Array.isArray(data)) {
                    throw new Error("Data is not an array");
                }
                setData(data);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch data");
            });
    }, [navigate]);


    // show and hide comment function
    const toggleComment = (post) => {
        if (show) {
            setshow(false);
            // console.log("hide");
        } else {
            setshow(true);
            setitem(post);
            // Log the updated item after it has been set
            console.log("item", post);
            // console.log("show");
        }
    };

    let userData = JSON.parse(localStorage.getItem("jwt"));
    // console.log("Home data === ", userData);

    const likepost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.token
            },
            body: JSON.stringify({
                postId: id
            })

        }).then((res) => res.json())
            .then((result) => {
                const newData = data.map((post) => {
                    if (post._id == result._id) {
                        return result;
                    } else {
                        return post;
                    }
                });
                setData(newData);
                console.log(result);
            });
    }

    const unlikepost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.token,
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log("result === ", result);
                const newData = data.map((post) => {
                    console.log("result._id === ", result._id);
                    if (post._id == result._id) {
                        return result;
                    } else {
                        return post;
                    }
                });
                setData(newData);
                console.log(result);
            });
    };


    const makeComment = (comment, id,) => {
        // console.log("comment, id,  === ", comment, id,);
        let data1 = JSON.parse(localStorage.getItem("jwt"));
        // console.log("Home data1 === ", data1);
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + data1.token
            },
            body: JSON.stringify({
                text: comment,
                postId: id,

            })

        })
            .then((res) => res.json())
            .then((result) => {
                // console.log("result === ", id);
                // console.log("result === ", result._id);
                const updatedData = data.map(item => {
                    // If the item's ID matches the given ID, update it
                    if (item._id === result._id) {
                        // Update the properties of the matching item here
                        // For example, let's say you want to update the 'name' property
                        return result;
                    }
                    // For items whose ID doesn't match, return them as they are
                    return item;
                });

                console.log("updatedData === ", updatedData);
                setData(updatedData);
                // setcomment("");
                notifySuccess("comment posted")
                console.log(result);
                setshow(false);
            });
        // console.log("navigate === ", navigate);
        // navigate("/");

    }


    return (
        <div className="Home">
            {error && <div className="error">{error}</div>}
            {
                Array.isArray(data) && data.map((post, index) => {
                    // console.log("data === ", data);
                    // console.log("post === ", post);

                    // console.log("userData === ", userData);
                    return (
                        <div className="card" key={post._id || index}>
                            <div className="card-header">
                                <div className="card-pic">
                                    <img
                                        src={post.postedBy.photo ? post.postedBy.photo : picLink}
                                        alt=""
                                    />
                                </div>
                                <h5>
                                    <Link to={`/profile/${post.postedBy._id}`}>
                                        {post.postedBy.name}
                                    </Link>
                                </h5>
                            </div>
                            <div className="card-img">
                                <img src={post.photo} alt="" className='m-auto' />
                            </div>
                            <div className="card-content text-left">
                                {
                                    post.likes.includes(userData.user._id) ? (
                                        <span className='text-red-600 cursor-pointer' onClick={() => { unlikepost(post._id) }}>
                                            <FaHeart />
                                        </span>
                                    )
                                        : (
                                            <span className='cursor-pointer' onClick={() => { likepost(post._id) }}>
                                                <FontAwesomeIcon icon={faHeart} />
                                            </span>
                                        )
                                }
                                <p>{post.likes.length} Like</p>
                                <p>{post.body}</p>
                                <p style={{ fontWeight: 'bold' }} className='cursor-pointer' onClick={() => { toggleComment(post) }} >View all comments</p>
                            </div>
                            <div className='add-comment flex items-center'>
                                <FontAwesomeIcon icon={faSmile} /> <br />
                                <input type="text" placeholder='Add a comment' value={comment[post._id] || ''}
                                    onChange={(e) => {
                                        setcomment(prevState => ({
                                            ...prevState,
                                            [post._id]: e.target.value
                                        }));
                                    }} className='w-full outline-none border-none m-0 p-2' />

                                <br />
                                <button className='comment border-none font-bold cursor-pointer' onClick={() => makeComment(comment[post._id], post._id, post.name)}>Post</button>

                            </div>

                        </div>

                    )
                })
            }
            {/* comment section */}
            {show && (
                <div className="showComment">
                    <div className="container">
                        <div className="postPic">
                            <img src={item.photo} alt="" />
                        </div>
                        <div className="details">
                            <div className="card-header" style={{ borderBottom: '1px solid rgb(173, 173, 173)' }}>
                                <div className="card-pic">
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSohsTUG9fjHzk53wlJYRl3qHTZB_FZAJpYzQ&usqp=CAU"
                                        alt="" />
                                </div>
                                <h5>
                                    {item.postedBy.name}
                                </h5>
                            </div>
                            {/* comment section */}
                            <div className="comment-section" style={{ borderBottom: '1px solid rgb(173, 173, 173)', overflow: 'auto' }}>
                                {
                                    item.comments.map((comment, index) => {
                                        return (
                                            <p className='comm ' key={index}>
                                                <span className='commenter font-bold'>
                                                    {comment.postedBy.name}{" "} </span>
                                                <span className='commentText '>
                                                    {comment.comment}
                                                </span>
                                            </p>
                                        )
                                    })
                                }
                            </div>
                            {/*  */}
                            <div className="card-content text-left">
                                <p>
                                    {item.likes.length}  Like
                                </p>
                                <p>{item.body}</p>
                            </div>
                            {/* add comment */}
                            <div className='add-comment flex items-center'>
                                <FontAwesomeIcon icon={faSmile} /> <br />
                                <input type="text" placeholder='Add a comment'
                                    value={comment[item._id] || ''}
                                    onChange={(e) => {
                                        setcomment(prevState => ({
                                            ...prevState,
                                            [item._id]: e.target.value
                                        }));
                                    }}
                                    className='w-full outline-none border-none m-0 p-2' />

                                <br />
                                <button className='comment border-none font-bold cursor-pointer'
                                    onClick={
                                        () => {
                                            // console.log("item._id === ", item);
                                            // console.log("Object.keys(comment)[0] === ", Object.keys(comment)[0]);
                                            // console.log("Object.values(comment)[0] === ", Object.values(comment)[0]);
                                            makeComment(Object.values(comment)[0], item._id);
                                            toggleComment();
                                        }}>
                                    Post
                                </button>

                            </div>
                        </div>
                    </div>
                    {/* close  */}
                    <div className="close-comment" onClick={() => {
                        toggleComment();
                    }}>
                        <span className='material-symbols-outlined-comment '>
                            <IoMdClose />
                        </span>

                    </div>
                </div>
            )}
        </div >
    );
}

export default Home;
