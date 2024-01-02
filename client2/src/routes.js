import {
    ADD_CATEGORY_ROUTE,
    ADD_MODEL_ROUTE,
    ADD_ROUTE,
    AUTHREG_ROUTE,
    DELETE_ROUTE,
    STORE_ROUTE
} from "./utils/consts";
import AddPage from "./pages/AddPage";
import DeletePage from "./pages/DeletePage";
import AuthRegPage from "./pages/AuthRegPage";
import StoragePage from "./pages/StoragePage";
import AddCategoryPage from "./pages/AddCategoryPage";
import AddModelPage from "./pages/AddModelPage";

export const adminRoutes = [
    {
        path: ADD_CATEGORY_ROUTE,
        element: <AddCategoryPage/>
    },
    {
        path: ADD_MODEL_ROUTE,
        element: <AddModelPage/>
    }
];
export const authRoutes = [
    {
        path: ADD_ROUTE,
        element: <AddPage/>
    },
    {
        path: DELETE_ROUTE,
        element: <DeletePage/>
    },
    {
        path: STORE_ROUTE,
        element: <StoragePage/>
    }
];
export const publicRoutes = [
    {
        path: AUTHREG_ROUTE,
        element: <AuthRegPage/>
    },
];