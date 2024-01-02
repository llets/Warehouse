import React, {useContext, useState} from 'react';
import classes from './AuthRegCard.module.css'
import {useNavigate} from "react-router-dom";
import LoginTab from "./tabs/loginTab";
import RegTab from "./tabs/regTab";
import {Context} from "../index";
import {STORE_ROUTE} from "../utils/consts";
import {check, login, registration} from "../http/userAPI";

const AuthRegCard = () => {
    const [activeTab, setActiveTab] = useState("logTab");
    const navigate = useNavigate()
    const {user} = useContext(Context)

    const checkEmailPassword = async (log, password) => {
        try{
            if (activeTab === "logTab"){
                await login(log, password);
                check().then(data =>{
                    user.setUser(true)
                    user.setIsAuth(true)
                    user.setIsAdmin(data.role === 'ADMIN')
                    user.setId(data.id)
                    // alert(`ADMIN DATA: ${data.role}`)
                })
                alert("Вы успешно вошли в систему.")
                // alert(`ADMIN: ${user._isAdmin}`)
                // alert(`AUTH: ${user._isAuth}`)
            } else {
                await registration(log, password);
                check().then(data =>{
                    user.setUser(true)
                    user.setIsAuth(true)
                    user.setIsAdmin(data.role === 'ADMIN')
                    user.setId(data.id)
                    alert(`ADMIN DATA: ${data.role}`)
                })
                alert("Вы успешно зарегистрировались и вошли в систему.")
                // alert(`ADMIN: ${user._isAdmin}`)
                // alert(`AUTH: ${user._isAuth}`)
            }
            navigate(STORE_ROUTE)
        } catch(e){
            alert(e.response.data.message)
        }
    }
    const handleLoginTab = () => {
        // update the state to tab1
        setActiveTab("logTab");
    };
    const handleRegTab = () => {
        // update the state to tab2
        setActiveTab("regTab");
    };
    return (
        <div className={classes.background}>
            <div className={classes.Tabs}>
                <ul className={classes.nav}>
                    <li className={activeTab === "logTab" ? "active" : ""}
                        onClick={handleLoginTab}>Login</li>
                    <li className={activeTab === "regTab" ? "active" : ""}
                        onClick={handleRegTab}>Registration</li>
                </ul>
                <div className={classes.outlet}>
                    {activeTab === "logTab" ? <LoginTab clickFunc={checkEmailPassword}/> : <RegTab clickFunc={checkEmailPassword}/>}
                </div>
            </div>
        </div>
    );
};

export default AuthRegCard;