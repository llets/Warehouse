import React, {useState} from "react";
import classes from '../RegLogTab.module.css'
import {Button} from "react-bootstrap";
const LoginTab = ({clickFunc}) => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className={classes.wrapper}>
            <div className={classes.textOnInput}>
                <label>Login</label>
                <input
                    className={classes.login}
                    type='text'
                    minLength='5'
                    maxLength='40'
                    placeholder='example@gmail.com'
                    value={login}
                    onChange={e => setLogin(e.target.value)}>
                </input>
            </div>
            <div className={classes.textOnInput}>
                <label>Password</label>
                <input
                    className={classes.password}
                    type='password'
                    minLength="6"
                    maxLength="40"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    value={password}
                    onChange={e => setPassword(e.target.value)}>
                </input>
            </div>
            <Button className={classes.enter}
                    onClick={()=>clickFunc(login, password)}>Enter</Button>
        </div>
    );
};
export default LoginTab;