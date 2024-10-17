import {BrowserRouter , Route , Routes} from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import { List } from './components/List';

function App() {
  return (
<BrowserRouter>
<Routes>
<Route path = "/"  element = {<LoginPage/>}/>
<Route path = "/list"  element = {<List/>}/>

</Routes>

</BrowserRouter>
  );
}

export default App;
