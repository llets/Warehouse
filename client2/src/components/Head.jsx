import React, {useContext, useState} from 'react';
import classes from './Head.module.css'
import {
    ADD_CATEGORY_ROUTE,
    ADD_MODEL_ROUTE,
    ADD_ROUTE,
    AUTHREG_ROUTE,
    DELETE_ROUTE,
    STORE_ROUTE
} from "../utils/consts";
import {Link} from "react-router-dom";
import {Nav} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        className={classes.administration_title}
    >
        {children}
    </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <ul
                    className={classes.list_item}
                >
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);

const Head = observer(() => {
    const {user} = useContext(Context)
    const logOut = () => {
        user.setUser(false)
        user.setIsAdmin(false)
        user.setId(0)
        user.setIsAuth(false)
        localStorage.removeItem('token')
    }
    return (
        <div>
        { user.IsAuth ?
                <Nav className={classes.nav}>
                    {(user.IsAdmin) ?
                    <div>
                        <Dropdown>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                Administration
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomMenu} className={classes.admin_dropdown}>
                                <Dropdown.Item eventKey="1">
                                    <Link className={classes.add_category} to={ADD_CATEGORY_ROUTE}> Add category </Link>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="2">
                                    <Link className={classes.add_model} to={ADD_MODEL_ROUTE}> Add model </Link>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                        : <></>
                    }
                    <Link className={classes.add} to={ADD_ROUTE}> Add item </Link>
                    <Link className={classes.delete} to={DELETE_ROUTE}> Delete item </Link>
                    <Link className={classes.location} to={STORE_ROUTE}> Store scheme </Link>

                    <div className={classes.reg_auth}>
                        <Link className={classes.authreg_link} to={AUTHREG_ROUTE} onClick={() => logOut()}> Log out </Link>
                    </div>
                </Nav>
                :
                <Nav className={classes.nav} style={{justifyContent:"flex-end"}}>
                    <div className={classes.reg_auth} style={{flexDirection:"row", width:"200px"}}>
                        <Link className={classes.authreg_link} to={AUTHREG_ROUTE}> Log in </Link>
                    </div>
                </Nav>
        }
        <div>
            <ul className={classes.lightrope}>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
        </div>
    )
})

export default Head;