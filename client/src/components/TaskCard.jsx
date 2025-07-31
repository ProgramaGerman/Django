import { useNavigate } from "react-router-dom";

export function TaskCard({ task }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-zinc-800 p-4 rounded-lg shadow-md hover:bg-zinc-700 cursor-pointer" key={task.id} onClick={() => navigate(`/tasks/${task.id}`)}>
        <h2 className="text-lg font-bold">{task.title}</h2>
        <p className="text-sm">{task.description}</p>
      </div>
      
    </>
  );
}

