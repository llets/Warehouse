import React, {useContext, useEffect} from 'react';
import AddCard from "../components/AddCard";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchModel} from "../http/modelAPI";

const AddPage = observer(() => {
    const {model} = useContext(Context)

    useEffect(() => {
            fetchModel().then(data => {
                model.setModels(data)
                }, () => {
                model.setModels([])
                }
            )
        }
        , []);

    return (
        <div>
            <AddCard/>
        </div>
    );
})

export default AddPage;