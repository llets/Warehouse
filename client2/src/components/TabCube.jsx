import React from 'react';
import {observer} from "mobx-react-lite";
import classes from './Tab.module.css'
import TabCubeRow from "./TabCubeRow";

const TabCube = observer(({cube}) => {
    return (
        <div className={classes.cube}>
            {
                cube.map((cube_row) => {
                    return <TabCubeRow row = {cube_row}/>
                })
            }
        </div>
    )
})

export default TabCube;