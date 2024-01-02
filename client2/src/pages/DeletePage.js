import React, {useContext, useEffect} from 'react';
import DeleteCard from "../components/DeleteCard";
import {Context} from "../index";
import {fetchModel} from "../http/modelAPI";
import {observer} from "mobx-react-lite";

const DeletePage = observer(() => {
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
            <DeleteCard/>
        </div>
    );
})

export default DeletePage;