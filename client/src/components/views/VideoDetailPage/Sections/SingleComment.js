import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Avatar } from "antd";
import Axios  from 'axios';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {    
    const user = useSelector(state => state.user);    
    const [OpenReply, setOepnReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");
    const onClickReplyOpen = () => {
        setOepnReply(!OpenReply)
    } 

    const onHandleChange = (event) => {        
        setCommentValue(event.target.value);
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }
        
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);
                    setCommentValue("");
                    setOepnReply(false);
                    props.refreshFunction(response.data.result);
                }
                else {
                    alert('코멘트를 저장하지 못했습니다.');
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    const actions = [
        <LikeDislikes 
            userId={localStorage.getItem('userId')} 
            commentId={props.comment._id}
            key={`like-dislike-${props.comment._id}`}
        />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"
            style={{ marginLeft: '0rem' }}> Reply to</span>
    ];
    
    return (
        <div style={{ margin: "10px 0" }}>            
            <div style={{ display: "flex", alignItems: "center"}}>
                <Avatar src={props.comment.writer.image} alt="User Avatar" />
                <div style={{ marginLeft: "10px" }}>
                    <p style={{ marginTop: "35px", marginBottom: "8px", fontWeight: "blod", color: "#808080" }}>
                        {props.comment.writer.name}
                    </p>
                    <p style={{ marginTop: "0px", marginLeft: "5px" }}>
                        {props.comment.content}
                    </p>
                </div>
            </div>
            {actions}            
            {/* <Comment 
                actions
                author
                avatar={<Avatar src alt />}
            /> */}
            {OpenReply && 
                <form style={{ display: 'flex', margin: "10px 0"}} onSubmit={onSubmit} >
                    <textarea 
                        style={{ width: '100%', borderRadius: '5px '}}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요."
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment
