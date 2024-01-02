import React, {useContext, useState} from 'react';
import classes from "./DeleteForm.module.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
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
        className={classes.model}
    >
        {children}
        {/*&#x25bc;*/}
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
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-75"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
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

const DeleteForm = observer(() => {
    const [chosen, setChosen] = useState('Model')
    const handleClick = (data) => {
        setChosen(data)
    }
    const {model} = useContext(Context)
    return (
        <div className={classes.form_inner}>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    {chosen}
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu} className={classes.size_dropdown}>
                    {model.Models.map((item) => {
                        return <Dropdown.Item eventKey={item.id} onClick={() => {handleClick(item.name)}}>
                            {item.name}</Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>

            <input placeholder="Amount" type="number" min="1" max="10000"/>
        </div>
    );
})

export default DeleteForm;