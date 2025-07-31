import { useEffect, useState } from "react";
import { getAllTasks} from '../api/task.api';
import { TaskCard } from './TaskCard.jsx';

export function Tasklist() {
  const [tasks, setTasks] = useState([]);

    useEffect(() => {
       async function loadTasks(){
        const res = await getAllTasks();
        setTasks(res.data);
       }
       loadTasks();
    }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      <h1>Task List</h1>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
