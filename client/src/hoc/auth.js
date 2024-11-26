import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {
    // [option]
    // null: 아무나 출입이 가능한 페이지
    // true: 로그인한 유저만 출입이 가능한 페이지
    // false: 로그인한 유저는 출입이 불가능한 페이지    
    function AuthenticationCheck(props) {
        let user = useSelector(state => state.user);
        const dispatch = useDispatch(); 
        const navigate = useNavigate();
               
        useEffect(() => {
            /* 페이지 이동시 계속 호출됨 (dispatch) */
            dispatch(auth()).then(response => {
                /* 로그인하지 않은 상태 */
                if (!response.payload.isAuth) {
                    if (option) {                        
                        navigate('/login');
                    }
                }
                else {
                    /* 로그인한 상태 */
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate('/');
                    }
                    else {
                        if (!option) {                                                        
                            navigate('/');
                        }
                    }
                }
            })            
        }, [])

        return (
            <SpecificComponent {...props} user={user}/>
        )
    }

    return AuthenticationCheck;
}
