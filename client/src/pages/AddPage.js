import React from "react";
import { useState } from "react";
import {Container,Form} from "react-bootstrap";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import {observer} from "mobx-react-lite";


const AddPage = observer(() => {
    const inputArr = [
        {
          id: 0,
          type: "input",
          value: ""
        },
        {
            id: 1,
            type:"input",
            value: ""
        },
        {
            id:2,
            type:"list",
            value:""
        }
      ];
    const [arr, setArr] = useState(inputArr);

    const addInput = () => {
        setArr(s => {
            //const lastId = s[s.length - 1].id;
            return [
                ...s,
                {
                    type:"input",
                value: ""
                },
                {
                    type:"input",
                    value: ""
                },
                {
                    type:"list",
                    value: ""
                }
            ];
        });
    };
    const handleChange = e => {
        e.preventDefault();
    
        const index = e.target.id;
        setArr(s => {
          const newArr = s.slice();
          newArr[index].value = e.target.value;
    
          return newArr;
        });
    };

    return(
    <Container className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}>

        <Card style={{width: 600}} className="p-5">
       <Form className="d-flex flex-column">
            
        
            {arr.map((item, LocalId) => {
                if (item.type== "input"){
                return (
                <div>
                <Form.Control
                    className="mt-3"
                    placeholder={LocalId % 3 == 0?"name":"description"}
                    onChange={handleChange}
                    id={LocalId}
                    value={item.value}
                />
               
                </div>
                );}
                else{
                    return(
                        <div>
                        <select class="form-select" required aria-label="select example">
                            <option value="">Откройте это меню выбора</option>
                            <option value="1">Один</option>
                            <option value="2">Два</option>
                            <option value="3">Три</option>
                        </select>
                        </div>
                    );
                }
            })}
            <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            <Button
                variant={"outline-success"}
                onClick={addInput}
                >
                    +
                </Button>
           
            <Button
                className="align-self-end"
                variant={"outline-success"}
                //onClick={click}
                >
                Send
                </Button>
            </Row>
        </Form>

        </Card>
    </Container>
    );
});
export default AddPage;