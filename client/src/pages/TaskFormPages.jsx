import { useForm } from "react-hook-form";
import { createTask, deleteTask, updateTask, getTaskID } from "../api/task.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function TaskFormpages() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      // Update existing task logic can be added here
      await updateTask(params.id, data);
      toast.success("Tarea Actualizada", {
        position: "bottom-right",
        style: {
          background: "#333",
          color: "#fff",
          fontSize: "16px",
          padding: "10px 20px",
          borderRadius: "5px",
        },
      });
      navigate("/tasks");
    } else {
      await createTask(data);
      toast.success("Tarea Creada", {
        position: "bottom-right",
        style: {
          background: "#333",
          color: "#fff",
          fontSize: "16px",
          padding: "10px 20px",
          borderRadius: "5px",
        },
      });
      navigate("/tasks");
    }
  });

  useEffect(() => {
    async function fetchTask() {
      if (params.id) {
        const res = await getTaskID(params.id);
        setValue("title", res.data.title);
        setValue("description", res.data.description);
        console.log(res.data);
      }
    }
    fetchTask();
  });

  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-white text-sm font-bold mb-2"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600"
            placeholder="Task Title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-white text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600 h-32 resize-none"
            placeholder="Task Description"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center gap-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out"
          >
            Save
          </button>

          {params.id && (
            <button
              onClick={async (e) => {
                e.preventDefault();
                const accepted = window.confirm(
                  "Are you sure you want to delete this task?"
                );
                if (accepted) {
                  await deleteTask(params.id);
                  toast.success("Tarea Eliminada", {
                    position: "bottom-right",
                    style: {
                      background: "#333",
                      color: "#fff",
                      fontSize: "16px",
                      padding: "10px 20px",
                      borderRadius: "5px",
                    },
                  });
                  navigate("/tasks");
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
