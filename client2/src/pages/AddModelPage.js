import React, {useContext, useEffect} from 'react';
import AddModelCard from "../components/AddModelCard";
import {Context} from "../index";
import {fetchSize} from "../http/sizeAPI";

const AddModelPage = () => {
    const {size} = useContext(Context)

    useEffect(() => {
            fetchSize().then(data => {
                size.setSizes(data)
                }, () => {
                size.setSizes([])
                }
            )
        }
        , []);

    return (
        <div>
            <AddModelCard/>
        </div>
    );
};

export default AddModelPage;