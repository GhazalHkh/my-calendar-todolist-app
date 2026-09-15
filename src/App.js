import logo from './logo.svg';
import './App.css';
import  Calendar from './componants/Calendar.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodoList from "./componants/TodoList.js";

function App() {
  return (
      <BrowserRouter>
    <div className="App">

        
        <Routes>
         <Route path='/' element={<Calendar />} />
         <Route path="/todo/:day" element={<TodoList />} />

        </Routes>

        

    </div></BrowserRouter>
  );
}

export default App;
