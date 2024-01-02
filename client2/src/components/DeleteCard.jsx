import React, {useContext, useState} from 'react';
import classes from "./DeleteCard.module.css";
import classes2 from "./DeleteForm.module.css";
import {Button} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {deleteGood} from "../http/goodAPI";
import Dropdown from "react-bootstrap/Dropdown";

let nextId = 1;

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
        className={classes2.model}
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
                    className={classes2.list_item}
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

const DeleteCard = observer(() => {
    const {model} = useContext(Context)
    const {storage} = useContext(Context)
    const [inputList, setInputList] =
        useState([{id: nextId, modelId: 1, modelName: 'Model', amount: 1}]);

    const deleteGoods = async () => {
        let arr_models_id = []
        let arr_goods_amount = []
        let arr_model_names = []
        inputList.map( (item) =>{
            if (item.modelName !== 'Model' && item.modelId >= 1 && item.amount >= 1) {
                arr_models_id.push(item.modelId)
                arr_goods_amount.push(item.amount)
                arr_model_names.push(item.modelName)
            }
        })

        try {
            let response = await deleteGood(arr_models_id, arr_model_names, arr_goods_amount)
            alert(response)
        } catch (e) {
            alert(e.response.data.message)
        }

        arr_model_names.map((model_name, index) => {
            storage.deleteByModelName(model_name, arr_goods_amount[index])
        })

    }

    const onAddBtnClick = () => {
        console.log(' -- BUTTON CLICK START -- ')
        console.log(JSON.stringify(inputList))
        console.log(nextId)
        nextId += 1
        // setInputList(inputList.concat(<AddForm key={nextId} id={nextId} onChange={handleChange}/>));
        setInputList([...inputList, {id: nextId, modelId: 1, modelName: 'Model', amount: 1}])
        console.log(JSON.stringify(inputList))
        console.log(' -- BUTTON CLICK END -- ')
    };

    const handleChange = (number, value, keyName = '') => {
        console.log(' -- CHANGE START -- ')
        console.log(JSON.stringify(inputList))
        if (keyName !== ''){
            setInputList(inputList.map( i => i.id === number ? {...i, ['modelName']: keyName, ['modelId']: value} : i))
        }else{
            setInputList(inputList.map( i => i.id === number ? {...i, ['amount']: value} : i))
        }
        console.log(JSON.stringify(inputList))
        console.log(' -- CHANGE START -- ')
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <div className={classes.title}>Delete item</div>
                {
                    inputList.map(input =>
                        <div className={classes2.form_inner} key={input.id} id={input.id}>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    {input.modelName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomMenu} className={classes2.size_dropdown}>
                                    {model.Models.map((item) => {
                                        return <Dropdown.Item eventKey={item.id}
                                                              onClick={() => {
                                                                  handleChange(input.id, item.id, item.name)}}>
                                            {item.name}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            <input
                                placeholder="1"
                                type="number"
                                min="1"
                                max="10000"
                                onChange={e => handleChange(input.id, e.target.value)}/>
                        </div>
                    )
                }
                <div className={classes.buttons}>
                    <Button className={classes.addButton} onClick={onAddBtnClick}>+</Button>
                    <Button className={classes.deleteButton} onClick={deleteGoods}>Delete</Button>
                </div>
            </div>
        </div>
    );
})

export default DeleteCard;