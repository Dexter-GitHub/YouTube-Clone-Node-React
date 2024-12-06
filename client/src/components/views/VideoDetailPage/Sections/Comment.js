import Axios  from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const user = useSelector(state => state.user);
    const { videoId } = useParams();
    const [commentValue, setcommentValue] = useState("");
    const handleClick = (event) => {        
        setcommentValue(event.currentTarget.value)
    }
    
    const onSubmit = (event) => {
        event.preventDefault(); /* 새로고침 방지 */
        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }        
        
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);
                    setcommentValue("");
                    props.refreshFunction(response.data.result);
                }
                else {
                    alert(' 커멘트를 저장하지 못했습니다.');
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />
            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={comment._id || index}>
                        <SingleComment refreshFunction={props.refreshFunction} 
                            comment={comment} 
                            postId={videoId} />
                        <ReplyComment 
                            refreshFunction={props.refreshFunction} 
                            parentCommentId={comment._id} 
                            postId={videoId} 
                            commentLists={props.commentLists} />
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}
            <form style={{ display: 'flex', marginTop: '20px' }} onSubmit={onSubmit}>
                <textarea 
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='코멘트를 작성해 주세요'
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment;
