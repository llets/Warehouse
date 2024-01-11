import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import classes from './Tab.module.css';
import boxImage from 'D:/Учёба/7сем/аис/проект5/Warehouse/client2/src/images/box.png';
import {Context} from "../index";

const TabLittleCube = observer(({number, information}) => {
    const {storage} = useContext(Context)
    return (
        <div>
        {
            information.length !== 0 ?
                <div className={classes.littleCube} style={{backgroundColor: '#2f3478'}}>
                    {number}
                    <div className={classes.help}>
                        <img className={classes.box} src={boxImage} alt="Box image"/>
                        <div className={classes.info}>
                            <div className={classes.header}>
                                {`Rack № ${Math.ceil(number/8)} Shelf № ${number}`}
                            </div>
                            <div className={classes.table}>
                                    <table style={{border: '1px solid #333', margin: '10px'}}>
                                        <thead>
                                        <tr>
                                            {storage.Headers.map((item) =>
                                                <th style={{border: '1px solid #333', padding: '10px'}}>{item}</th>
                                            )}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            information.map((row) => {
                                                return(
                                                    <tr>
                                                        <td style={{border: '1px solid #333', padding: '10px'}}>{row.good_id}</td>
                                                        <td style={{border: '1px solid #333', padding: '10px'}}>{row.model_name}</td>
                                                        <td style={{border: '1px solid #333', padding: '10px'}}>{row.size}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                    </div>
                </div> :
                <div className={classes.littleCube}>
                    {number}
                    <div className={classes.help}>
                        <img className={classes.box} src={boxImage} alt="Box image"/>
                        <div className={classes.info}>
                            <div className={classes.header}>
                                {`Rack № ${Math.ceil(number/8)} Shelf № ${number}`}
                            </div>
                            <div className={classes.table}>
                                {"Empty"}
                            </div>
                        </div>
                    </div>
                </div>
        }
        </div>
    );
})

export default TabLittleCube;