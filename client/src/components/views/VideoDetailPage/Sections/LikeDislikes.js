import React, { useMemo, useEffect, useState } from 'react'
import { Tooltip } from 'antd';
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import Axios  from 'axios';

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [Dislikes, setDislikes] = useState(0);
    const [DislikeAction, setDislikeAction] = useState(null);
    let variable = useMemo(() => {
        return props.video ? 
            { videoId: props.videoId, userId: props.userId } :
            { commentId: props.commentId, userId: props.userId }        
    }, [props.video, props.videoId, props.userId, props.commentId]);

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
                .then(response => {
                    if (response.data.success) {
                        // 얼마나 많은 좋아요를 받았는지
                        setLikes(response.data.likes.length)
                        // 내가 이미 그 좋아요를 눌렀는지
                        response.data.likes.forEach(like => {
                            if (like.userId === props.userId) {
                                setLikeAction('liked')
                            }
                        })
                    }
                    else {
                        alert('Likes에 대한 정보를 가져오지 못했습니다.')
                    }
                })

        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if (response.data.success) {
                    // 얼마나 많은 싫어요를 받았는지
                    setDislikes(response.data.dislikes.length)
                    // 내가 이미 그 싫어요를 눌렀는지
                    response.data.dislikes.forEach(dislike => {
                        if (dislike.userId === props.userId) {
                            setDislikeAction('disliked')
                        }
                    })
                }
                else {
                    alert('Dislikes에 대한 정보를 가져오지 못했습니다.')
                }
            })
    }, [variable, props.userId])

    const onLike = () => {
        if (LikeAction === null) {
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1);
                        setLikeAction('liked');

                        if (DislikeAction !== null) {
                            setDislikeAction(null);
                            setDislikes(Dislikes - 1);
                        }
                    }
                    else {
                        alert('Like를 올리지 못하였습니다.');
                    }
                })
        }
        else {
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes - 1);
                        setLikeAction(null);
                    }
                    else {
                        alert('Like을 내리지 못하였습니다.');
                    }
                })
        }
    }

    const onDislike = () => {
        if (DislikeAction !== null) {
            Axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1);
                        setDislikeAction(null);
                    }
                    else {
                        alert('dislike를 지우지 못했습니다.');
                    }
                })
        }
        else {
            Axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes + 1);
                        setDislikeAction('disliked');

                        if (LikeAction !== null) {
                            setLikeAction(null);
                            setLikes(Likes - 1);
                        }
                    }
                    else {
                        alert('dislike를 지우지 못했습니다.');
                    }
                })
        }
    }

    return (<div style={{ marginRight: '10px', display: 'inline' }}>
            <span key='comment-basic-like'>
                <Tooltip title="Like">
                    {LikeAction === 'liked' ? (
                        <LikeFilled style={{ color: '#1890ff', cursor: 'pointer' }}                     
                            onClick={onLike}
                        />
                    ) : (                        
                        <LikeOutlined                         
                            onClick={onLike}
                        />
                    )}               
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto'  }}> {Likes} </span>
            </span>
            <span key='comment-basic-dislike' style={{ paddingLeft: '10px' }}>
                <Tooltip title="Dislike">
                    {DislikeAction === 'disliked' ? (
                        <DislikeFilled style={{ color: '#1890ff', cursor: 'pointer' }}                          
                            onClick={onDislike}
                        />
                    ) : (
                        <DislikeOutlined                         
                            onClick={onDislike}
                        />
                    )}                
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto'  }}> {Dislikes} </span>
            </span>
        </div>
    )
}

export default LikeDislikes
