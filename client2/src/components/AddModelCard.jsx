import React, {useContext, useState} from 'react';
import classes from "./AddModelCard.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import {Button} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {createModel} from "../http/modelAPI";

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
        className={classes.size}
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

const AddModelCard = observer(() => {
    const {model} = useContext(Context)
    const [chosen, setChosen] = useState('Size')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [sizeId, setSizeId] = useState('')

    const addDrink = async () => {
        const form = new FormData()
        form.append('name', `${name}`)
        form.append('description', `${description}`)
        form.append('sizeId', sizeId)
        try {
            const modelData = Object.fromEntries(form)
            let dat = await createModel(modelData)
            setName('')
            setDescription('')
            model.addModel(dat)
            alert("The model was successfully added.")
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const handleClick = (id, data) => {
        setSizeId(id)
        setChosen(data)
    }
    const {size} = useContext(Context)
    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <div className={classes.title}>Add model</div>
                    <div className={classes.form_inner}>
                        <Dropdown>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                {chosen}
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomMenu} className={classes.size_dropdown}>
                                {size.Sizes.map((item) => {
                                    return <Dropdown.Item eventKey={item.id} onClick={() => {handleClick(item.id, item.description)}}>
                                        {item.description}</Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                        <input
                            type="name"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <input
                            type="description"
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                <Button className={classes.sendButton} onClick={addDrink}>Send</Button>
            </div>
        </div>
    )
})

export default AddModelCard;