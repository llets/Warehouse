import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import TabLittleCube from "./TabLittleCube";
import classes from './Tab.module.css'
import {Context} from "../index";

const TabCubeRow = observer(({row}) => {
    const {storage} = useContext(Context)
    return (
        <div className={classes.cube_row}>
            {
                row.map((item) => {
                    return <TabLittleCube key={item} number = {item} information={storage.getInfoById(item)}/>
                })
            }
        </div>
    );
})

export default TabCubeRow;