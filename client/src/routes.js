import AddModel from "./pages/AddModel"
import AddCategory from "./pages/AddCategory"
import DeletePage from "./pages/DeletePage"
import Storage from "./pages/Storage"
import { ADD_ROUTE, DELETE_ROUTE, STORAGE_ROUTE,ADD_CATEGORY_ROUTE } from "./utils/consts"

export const authRoutes=[
    {
    path:ADD_ROUTE,
    Component:<AddModel/>
    },
    {
        path:ADD_CATEGORY_ROUTE,
        Component:<AddCategory/>

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