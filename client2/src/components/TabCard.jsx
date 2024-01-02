import React from 'react';
import classes from './Tab.module.css';
import TabLine from './TabLine';
import {observer} from "mobx-react-lite";

const TabCard = observer(({first_shelf}) => {
    const get_numbers = (f) => {
        let arr = []
        for (let i = 0; i < 4; i++) {
            arr.push(f + 32 * i)
        }
        let cube = [
            [[[],[],[],[]], [[],[],[],[]]],
            [[[],[],[],[]], [[],[],[],[]]],
            [[[],[],[],[]], [[],[],[],[]]],
            [[[],[],[],[]], [[],[],[],[]]]
        ]
        for (let m = 0; m < 4; m++) { // each line of 2 cubes
            for (let i = 0; i < 4; i++) { // 4 rows
                let first_row = (i%4>=2) ? arr[m] + (i - 1) + 15 : arr[m] + (i % 2)
                for (let j = 0; j < 2; j++) { // 2 cubes
                    for (let k = 0; k < 4; k++) { // 4 cells in each row of each cube
                        let number = first_row + 2 * k + 8 * j
                        cube[m][j][i].push(number)
                    }
                }
            }
        }
        return cube
    }
    let row_num = get_numbers(first_shelf)
    // const array = get_numbers(1)
    return (
        <div className={classes.tab}>
            {
                row_num.map((column) => {
                    return <TabLine array={column}/>
                })
            }
        </div>
    );
})

export default TabCard;