import { FaCode } from "react-icons/fa"
import { Typography, Row, Col, Card, Avatar } from 'antd';
import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Video, setVideo] = useState([]);

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {                
                if (response.data.success) {
                    console.log(response.data);
                    setVideo(response.data.videos)
                }
                else {
                    alert('비디오 가져오기를 실패 했습니다.')
                }
            })
            .catch(error => console.error("Error:", error))   
    }, [])

    const renderCards = Video.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24}>
            <a href={`/video/post/${video._id}`}>
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`}/>
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span style={{ marginLeft: '3rem'}}>{video.writer.name}</span><br />
            <span style={{ marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}               
            </Row>
        </div>
    )
}
/*
function LandingPage() {
    const navigate = useNavigate();
    
    const onClickHandler = () => {
        Axios.get('/api/users/logout')
            .then(response => {                
                if (response.data.success) {                    

                    navigate('/login');
                }
                else {
                    alert('로그아웃 하는데 실패 했습니다.');
                }
            })
            .catch(error => console.error("Error:", error))            
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}
*/

export default LandingPage
