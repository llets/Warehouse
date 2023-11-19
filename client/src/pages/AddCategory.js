import React from "react";
import { useState } from "react";
import {Container,Form} from "react-bootstrap";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import {observer} from "mobx-react-lite";

const AddCategory = observer(() => {
    const inputArr = [
        {
          value: ""
        }
      ];
      const [arr, setArr] = useState(inputArr);
    const handleChange = e => {
        e.preventDefault();
    
        const index = 0;
 
        setArr(s => {
          const newArr = s.slice();
          newArr[index].value = e.target.value;
    
          return newArr;
    });}
    const sendHandler = e =>{
        e.preventDefault();
        console.log(arr);
        setArr(s => {
            const newArr = s.slice();
            newArr[0].value = '';
      
            return newArr;});
        
    };
    
    return(
        
            <Container className="d-flex justify-content-center align-items-center"
                    style={{height: window.innerHeight - 54}}>
                <Card style={{width: 600}} className="p-5">
               <Form className="d-flex flex-column">
                         <div>
                <Form.Control
                    className="mt-3"
                    placeholder={"name"}
                    onChange={handleChange}
                    id={String(0)}
                    value={arr[0].value}
                />
               
                </div>
                <Button
                className="align-self-end"
                variant={"outline-success"}
                onClick={sendHandler}
                >
                Send
                </Button>
                </Form>

        </Card>
    </Container>

                    
);
})
export default AddCategory;