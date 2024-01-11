import React, {useContext, useState} from 'react';
import classes from './AddCard.module.css'
import classes2 from "./AddForm.module.css";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import {createGood} from "../http/goodAPI";

let nextId = 1;

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

const AddCard = observer(() => {
    const {model} = useContext(Context)
    const {user} = useContext(Context)
    const [inputList, setInputList] =
        useState([{id: nextId, modelId: 1, modelName: 'Model', amount: 1}]);
    const [disabled, setDisabled] = useState(false)

    const addGoods = async () => {
        setDisabled(true)

        let arr_models_id = []
        let arr_goods_amount = []
        inputList.map( (item) =>{
            if (item.modelName !== 'Model' && item.modelId >= 1 && item.amount >= 1) {
                arr_models_id.push(item.modelId)
                arr_goods_amount.push(item.amount)
            }
        })

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        let hh = today.getHours()
        let mi = today.getMinutes()
        today = dd + '-' + mm + '-' + yyyy + '-' + hh + '-' + mi;

        const form = new FormData()
        form.append('userId', user.UserId)
        form.append('string_date_of_arrival', today)
        form.append('string_models_id', JSON.stringify(arr_models_id))
        form.append('string_goods_amount', JSON.stringify(arr_goods_amount))

        try {
            const goodData = Object.fromEntries(form)
            await createGood(goodData)
            alert("Congs! You successfully added items!")
        } catch (e) {
            alert(e.response.data.message)
        }
        setDisabled(false)
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
        // const nextGoods = goods.map((c, i) => {
        //     if (i === number && key === 'amount') {
        //         return {modelId: c.modelId, amount: value};
        //     } else if (i === number && key !== 'amount'){
        //         return {modelId: value, amount: c.amount};
        //     } else {
        //         // The rest haven't changed
        //         return c;
        //     }
        // });
        // setGoods(nextGoods);
        // const nextGoods = goods.map((item) => {
        //     if (item.id === number && key === 'amount') {
        //         return {id: number, modelId: item.modelId, amount: value};
        //     } else if (item.id === number && key === 'modelId'){
        //         return {id:number, modelId: value, amount: item.amount};
        //     } else {
        //         // The rest haven't changed
        //         return item;
        //     }
        // });
        // setGoods(nextGoods);
        console.log(JSON.stringify(inputList))
        console.log(' -- CHANGE START -- ')
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <div className={classes.title}>Add item</div>
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
                    <Button className={classes.sendButton} onClick={addGoods} disabled={disabled}>Send</Button>
                </div>
            </div>
        </div>
    );
})

export default AddCard;