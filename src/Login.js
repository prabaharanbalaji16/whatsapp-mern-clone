import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import {auth,provider} from './firebase';
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';

function Login() {
    // eslint-disable-next-line no-empty-pattern
    const[{},dispatch] = useStateValue();
    const signIn = (e)=>{
        auth.signInWithPopup(provider)
        .then((result) => {
            dispatch({
                type:actionTypes.SET_USER,
                user:result.user,
            });
            console.log(result)
        })
        .catch((err) => alert(err.message))
    }
    return (
        <div className="login">
            <div className="login__container">
                <img src="https://cdn.worldvectorlogo.com/logos/whatsapp-symbol.svg" alt="" />
                <div className="login__text">
                    <h1>Sign in to Whatsapp</h1>
                </div>
                <Button onClick={signIn}>
                    Sign In with Google
                </Button>
            </div>
        </div>
    )
}

export default Login
