import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Head from "./components/Head";
import {observer} from "mobx-react-lite";
import {useContext, useEffect} from "react";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {fetchStorage} from "./http/storageAPI";

const App = observer(() => {
    const {user} = useContext(Context)
    const {storage} = useContext(Context)

    useEffect(() => {
        check().then(data =>{
            user.setUser(true)
            user.setIsAuth(true)
            user.setIsAdmin(data.role === 'ADMIN')
            user.setId(data.id)
        }, () => {
            user.setUser(false)
            user.setIsAuth(false)
            user.setIsAdmin(false)
            user.setId(0)
        });
        fetchStorage().then(data => {
                storage.setStorage(data)
            }, () => {
                storage.setStorage([])
            }
        );
    }, []);
  return (
    <BrowserRouter>
        <Head/>
      <AppRouter/>
    </BrowserRouter>
  );
})

export default App;
