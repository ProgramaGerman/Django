import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Taskpages} from './pages/TaskPages.jsx';
import {TaskFormpages} from './pages/TaskFormPages.jsx';
import Navigations from './components/navigations.jsx';
import './App.css';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
      <div className='container mx-auto'>
        <Navigations />
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route path="/tasks/:id" element={<TaskFormpages />} />
          <Route path="/tasks" element={<Taskpages />} />
          <Route path="/form" element={<TaskFormpages />} />
        </Routes>
      <Toaster />
      </div>

      </BrowserRouter>
    </>
  );
}

export default App;