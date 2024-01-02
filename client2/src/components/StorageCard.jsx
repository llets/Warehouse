import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {Tab} from "react-bootstrap";
import {Tabs} from "react-bootstrap";
import classes from './StorageCard.module.css'
import TabCard from "./TabCard";

const StorageCard = observer(() => {
    const pages = [1, 2, 3, 4, 5, 6, 7, 8]
    const [key, setKey] = useState('1');
    return (
        <div className={classes.wrapper}>
            <Tabs
                id="tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className={classes.tabs}
            >
                {
                    pages.map((item) => {
                        return <Tab eventKey={item} title={"Area " + item} className={classes.single_tab}>
                            <TabCard key={item} first_shelf={1 + (item - 1) * 128}/>
                        </Tab>
                    })
                }
            </Tabs>
        </div>
    );
})

export default StorageCard;