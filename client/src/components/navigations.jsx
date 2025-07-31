import {Link} from 'react-router-dom';

function Navigations() {return (
    <div className='flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg shadow-md py-3 mb-4'>
      <Link to="/tasks" className='text-2xl font-bold'>Task App</Link>
      <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out'>
        <Link to="/form">Crear Tarea</Link>
      </button>
    </div>
  );
}

export default Navigations;
