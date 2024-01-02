import React, {useContext, useEffect} from 'react';
import StorageCard from "../components/StorageCard";
import {Context} from "../index";
import {fetchStorage} from "../http/storageAPI";

const StoragePage = () => {
    const {storage} = useContext(Context)

    useEffect(() => {
            fetchStorage().then(data => {
                    storage.setStorage(data)
                }, () => {
                    storage.setStorage([])
                }
            )
        }
        , []);

    return (
        <div>
            <StorageCard/>
        </div>
    );
};

export default StoragePage;