import React from "react";
import {Routes, Route} from 'react-router-dom'
import {authRoutes, publicRoutes} from "../routes";
import { DEFAULT_ROUTE } from "../utils/consts";

const AppRouter = () => {
    const isAuth = true
    return(
    <Routes>
        {isAuth && authRoutes.map(({path, Component}) =>
                        <Route key={path} path={path} element={Component} />
                    )}
                    {publicRoutes.map(({path, Component}) =>
                        <Route key={path} path={path} element={Component} />
                    )}
    </Routes>
    );
}
export default AppRouter;