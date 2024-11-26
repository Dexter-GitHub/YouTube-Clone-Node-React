import React, { useState } from 'react'
import { loginUser} from '../../../_actions/user_action';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(rememberMeChecked);

    const handleRememberMe = () => {
        setRememberMe(!rememberMe);
    }

    const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

    return (
        <Formik
            initialValues = {{
                email: initialEmail,
                password: '',
            }}
            validationsSchema = {Yup.object().shape({
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required'),
                password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Password is required'),
            })}
            onSubmit = {(values, { setSubmitting }) => {
                setTimeout(() => {
                    let dataToSubmit = {
                        email: values.email,
                        password: values.password
                    };

                    dispatch(loginUser(dataToSubmit))
                        .then(response => {
                            if (response.payload.loginSuccess) {
                                window.localStorage.setItem('userId', response.payload.userId);
                                if (rememberMe) {
                                    window.localStorage.setItem('rememberMe', values.id);
                                }
                                else {
                                    localStorage.removeItem('rememberMe');
                                }
                                navigate('/');
                            }
                            else {
                                setFormErrorMessage('Check out your Account or Password again.');
                            }
                        })
                        .catch(error => {
                            setFormErrorMessage('Check out your Account or Password again');
                            setTimeout(() => {
                                setFormErrorMessage("")
                            }, 3000);
                        });
                    setSubmitting(false);
                }, 500);
            }}
        >
            {props => {
                const {
                    values,
                    touched,
                    errors,                    
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,                    
                } = props;
                return (
                    <div className="app">
                        <Title level={2}>Log In</Title>
                        <form onSubmit={handleSubmit} style={{ width: '350px' }}>
                            <Form.Item required>
                                <Input
                                    id="email"
                                    prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                                    placeholder="Enter your email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    classNames={
                                        errors.email && touched.email ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div className="input-feedback">{errors.email}</div>
                                )}
                            </Form.Item>
                            <Form.Item required>
                                <Input 
                                    id="password"
                                    prefix={<LockFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Enter your password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    classNames={
                                        errors.password && touched.password ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div className='input-feedback'>{errors.password}</div>
                                )}
                            </Form.Item>

                            {formErrorMessage && (
                                <label><p style={{ color: '#ff0000bf', fontSize: '0.7rem', board: '1px solid', paddig: '1rem', borderRadius: '10px' }}>
                                    {formErrorMessage}</p></label>
                            )}

                            <Form.Item>
                                <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >Remember me</Checkbox>
                                <a className="login-form-forgot" href="/reset_user" style={{ float: 'right'}}>
                                    forgot password
                                </a>
                                <div>
                                    <Button type='primary' htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                                        Log in
                                    </Button>
                                </div>
                                Or <a href="/register">register now!</a>
                            </Form.Item>
                        </form>
                    </div>
                );
            }}
        </Formik>
    );
};

export default LoginPage;

/*
function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 새로고침 방지
        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    navigate('/');
                }
                else {
                    alert('Error');
                }
            })  
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}
*/