import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Row, Col, List, Avatar } from "antd";
import Axios from 'axios';
import SideVideo from "./Sections/SideVideo";
import Subscribe from './Sections/Subscribe';

function VideoDetailPage() {
    const { videoId } = useParams();    
    const [VideoDetail, setVideoDetail] = useState(null);    
    
    useEffect(() => {
        const variable = { videoId }
        
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {                
                if (response.data.success) {                    
                    setVideoDetail(response.data.videoDetail);
                }
                else {
                    alert('비디오 정보를 가져오는데 실패했습니다.');
                }
            })
            .catch(error => {
                console.error("Error:", error)
            });
    }, [videoId])

    if (!VideoDetail || !VideoDetail.writer) {
        return <div>Loading...</div>;
    }    

    const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') &&
                            <Subscribe 
                                userTo={VideoDetail.writer._id} 
                                userFrom={localStorage.getItem('userId')} 
                            />

    return (            
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24}>
                <div style={{ width: '100%', padding: '3rem 4rem' }}>
                    <video 
                        style={{ width: '90%' }} 
                        src={`http://localhost:5000/${VideoDetail.filePath}`}
                        controls
                    />
                    <List.Item actions={[subscribeButton]}>
                        <List.Item.Meta             
                            avatar={<Avatar src={VideoDetail.writer.image} />}
                            title={VideoDetail.writer.name}
                            description={VideoDetail.description}
                        />
                    </List.Item>
                </div>
            </Col>
            <Col lg={6} xs={24}>
                <SideVideo />
            </Col>
        </Row>
    )
}

export default VideoDetailPage;
