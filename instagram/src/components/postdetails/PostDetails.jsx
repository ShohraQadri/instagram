/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-regular-svg-icons';
import { IoMdClose } from 'react-icons/io';
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './PostDetails.css';

// eslint-disable-next-line react/prop-types, no-unused-vars
function PostDetails({ item, makeComment, toggleDetails }) {
    const navigate = useNavigate()

    // const notifyError = (msg) => toast.error(msg);
    const notifySuccess = (msg) => toast.success(msg);


    let userData = JSON.parse(localStorage.getItem("jwt"));
    // console.log("userData === ", userData);
    const removePost = (postId) => {
        console.log(postId);
        if (window.confirm("do ypu want to delete this post")) {

            fetch(`/deletePost/${postId}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userData.token
                },
            }).then((res) => res.json())
                .then((result) => {
                    console.log(result);
                    toggleDetails();
                    navigate("/");
                    notifySuccess(result.message)
                });
        }
    }

    return (
        <div className="showComment">
            <div className="container">
                <div className="postPic">
                    <img src={item.photo} alt="" />
                </div>
                <div className="details">
                    <div className="card-header items-center" style={{ borderBottom: '1px solid rgb(173, 173, 173)' }}>
                        <div className="card-pic">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSohsTUG9fjHzk53wlJYRl3qHTZB_FZAJpYzQ&usqp=CAU"
                                alt=""
                            />
                        </div>
                        <div>
                            <h5>{item.postedBy.name}</h5>
                        </div>
                        <div className='deletePost' onClick={() => { removePost(item._id) }}>
                            <RiDeleteBin5Line />
                        </div>
                    </div>
                    {/* comment section */}
                    <div className="comment-section" style={{ borderBottom: '1px solid rgb(173, 173, 173)', overflow: 'auto' }}>
                        {item.comments.map((comment, index) => (
                            <p className='comm' key={index}>
                                <span className='commenter font-bold'>{comment.postedBy.name} </span>
                                <span className='commentText'>{comment.comment}</span>
                            </p>
                        ))}
                    </div>
                    {/*  */}
                    <div className="card-content text-left">
                        <p>{item.likes.length}  Like</p>
                        <p>{item.body}</p>
                    </div>
                    {/* add comment */}
                    <div className='add-comment flex items-center'>
                        <FontAwesomeIcon icon={faSmile} /> <br />
                        <input
                            type="text"
                            placeholder='Add a comment'
                            className='w-full outline-none border-none m-0 p-2'
                        />
                        <br />
                        <button
                            className='comment border-none font-bold cursor-pointer'
                            onClick={() => {
                                // Call makeComment function with appropriate arguments
                                // makeComment(commentValue, itemId);
                                // Toggle comment section visibility
                                // toggleComment();
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
            {/* close  */}
            <div className="close-comment" onClick={() => toggleDetails()}>
                <span className='material-symbols-outlined-comment'>
                    <IoMdClose />
                </span>
            </div>
        </div>
    );
}

export default PostDetails;
