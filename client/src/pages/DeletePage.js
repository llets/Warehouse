import React from "react";
import {Container,Form} from "react-bootstrap";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"

const DeletePage = observer(() => {
    const inputArr = [
        {
          id: 0,
          type: "input",
          value: ""
        },
        
      ];
      const [arr, setArr] = useState(inputArr);
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
                         <div>
                <Form.Control
                    className="mt-3"
                    placeholder={"name"}
                    onChange={handleChange}
                    id={0}
                    value={item.value}
                />
               
                </div>
                <Button
                className="align-self-end"
                variant={"outline-success"}
                //onClick={click}
                >
                Send
                </Button>
                </Form>

        </Card>
    </Container>

                    
);
})
export default DeletePage;