import React from 'react';
import {observer} from "mobx-react-lite";
import classes from './Tab.module.css'
import TabCube from "./TabCube";

const TabLine = observer(({array}) => {
    return (
        <div className={classes.tabLine}>
            {array.map((cube) =>
                {
                    return <TabCube cube={cube}/>
                }
            )}
        </div>
    );
})

export default TabLine;