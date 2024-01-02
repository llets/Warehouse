import React, {createContext} from 'react';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client'
import UserStore from "./store/userStore";
import ModelStore from "./store/modelStore";
import SizeStore from "./store/sizeStore";
import StorageStore from "./store/storageStore";

export const Context = createContext(null)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context.Provider value={{
        user: new UserStore(),
        model: new ModelStore(),
        size: new SizeStore(),
        storage: new StorageStore()
    }}>
        <App />
    </Context.Provider>
);
