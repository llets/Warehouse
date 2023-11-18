import AddPage from "./pages/AddPage"
import DeletePage from "./pages/DeletePage"
import Storage from "./pages/Storage"
import { ADD_ROUTE, DELETE_ROUTE, STORAGE_ROUTE } from "./utils/consts"

export const authRoutes=[
    {
    path:ADD_ROUTE,
    Component:<AddPage/>
    },
    {
        path:DELETE_ROUTE,
        Component:<DeletePage/>
    },
    {
        path:STORAGE_ROUTE,
        Component:<Storage/>
    }
    ]
    export const publicRoutes=[
        {
            path:STORAGE_ROUTE,
            Component:<Storage/>
        }
    ]