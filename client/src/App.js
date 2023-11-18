
import './App.css';
import AppRouter from "./components/AppRouter"
import NavBar from "./components/NavBar"
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
