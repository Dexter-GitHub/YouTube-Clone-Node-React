import { Typography, Row, Col, Card, Avatar } from 'antd';
import React, { useState, useEffect } from 'react'
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
                    setVideo(response.data.videos);
                }
                else {
                    alert('비디오 가져오기를 실패 했습니다.');
                }
            })
            .catch(error => console.error("Error:", error));
    }, [])

    const renderCards = Video.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24} key={video._id}>            
                <div style={{ position: 'relative' }}>
                    <a href={`/video/${video._id}`}>
                        <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                        <div className='duration'
                            style={{
                                bottom: 0, right: 0, position: 'absolute', margin: '5px',
                                color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8,
                                padding: '2px 4px', borderRaduis: '2px', letterSpacing: '0.5px', fontSize: '12px',
                                fontWeight: '500', lineHeight: '15px'
                            }}>
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </a>
                </div>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}                
            />
            <span style={{ marginLeft: '3rem'}}>{video.writer.name}</span><br />
            <span style={{ marginLeft: '3rem'}}>{video.views}</span> 
            - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}               
            </Row>
        </div>
    )
}

export default LandingPage
