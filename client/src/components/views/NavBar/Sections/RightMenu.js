import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { useSelector } from "react-redux";

function RightMenu(props) {
    const user = useSelector(state => state.user)
    const navigate = useNavigate();

    const logoutHandler = () => {
        axios.get(`${USER_SERVER}/logout`).then(response => {
            if (response.status === 200) {
                navigate('/login');
            }
            else {
                alert('Log Out Failed');
            }
        });
    };

    if (user.userData && !user.userData.isAuth) {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="mail">
                    <a href="/login">Signin</a>
                </Menu.Item>
                <Menu.Item key="app">
                    <a href="/register">Signup</a>
                </Menu.Item>
            </Menu>
        )
    }
    else {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="upload">
                    <a href="/video/upload">Video</a>
                </Menu.Item>
                <Menu.Item key="logout">
                    <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
            </Menu>
        )
    }
}

export default RightMenu
