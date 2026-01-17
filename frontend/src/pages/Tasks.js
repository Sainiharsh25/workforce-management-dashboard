import React, { useState } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Develop Login System",
      progress: 70,
      deadline: "2025-03-15",
      assignedTo: "EMP1001",
      assignedBy: "Manager",
      feedback: "",
    },
    {
      id: 2,
      title: "Create Dashboard UI",
      progress: 50,
      deadline: "2025-03-18",
      assignedTo: "EMP1002",
      assignedBy: "Team Leader",
      feedback: "",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    assignedBy: "",
    deadline: "",
  });

  const [feedbacks, setFeedbacks] = useState({});
  const [filter, setFilter] = useState("All");

  // Handle new task addition
  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.assignedBy || !newTask.deadline) {
      alert("Please fill all fields!");
      return;
    }
    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        title: newTask.title,
        progress: 0,
        deadline: newTask.deadline,
        assignedTo: newTask.assignedTo,
        assignedBy: newTask.assignedBy,
        feedback: "",
      },
    ]);
    setNewTask({ title: "", assignedTo: "", assignedBy: "", deadline: "" });
  };

  // Handle task withdrawal
  const handleWithdrawTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Handle feedback submission
  const handleFeedbackChange = (id, text) => {
    setFeedbacks({ ...feedbacks, [id]: text });
  };

  const handleFeedbackSubmit = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, feedback: feedbacks[id] || "" } : task
    );
    setTasks(updatedTasks);
    alert("Feedback sent successfully!");
  };

  // Filter tasks based on selected role
  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((task) => task.assignedBy === filter);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Tasks Management</h2>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center mb-4 gap-4 bg-gray-800 p-4 rounded-lg">
        <label className="text-lg font-semibold">Filter by Assigning Role:</label>
        <select
          className="p-2 border rounded-lg bg-gray-700 text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">📋 All</option>
          <option value="Manager">🧑‍💼 Manager</option>
          <option value="Team Leader">👨‍🏫 Team Leader</option>
          <option value="Co-Leader">🤝 Co-Leader</option>
        </select>
      </div>

      {/* New Task Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Assign New Task</h3>
        <input
          type="text"
          placeholder="Task Title"
          className="p-2 m-2 border rounded-lg bg-gray-700 text-white"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Assign To (Employee ID)"
          className="p-2 m-2 border rounded-lg bg-gray-700 text-white"
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        />
        <select
          className="p-2 m-2 border rounded-lg bg-gray-700 text-white"
          value={newTask.assignedBy}
          onChange={(e) => setNewTask({ ...newTask, assignedBy: e.target.value })}
        >
          <option value="">Assign By</option>
          <option value="Manager">Manager</option>
          <option value="Team Leader">Team Leader</option>
          <option value="Co-Leader">Co-Leader</option>
        </select>
        <input
          type="date"
          className="p-2 m-2 border rounded-lg bg-gray-700 text-white"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <button
          className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleAddTask}
        >
          Assign Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="p-4 mb-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>Assigned To: {task.assignedTo}</p>
              <p>Assigned By: {task.assignedBy}</p>
              <p>Deadline: {task.deadline}</p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-600 rounded-md h-4 mt-2">
                <div
                  className="h-4 bg-blue-500 rounded-md"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <p className="text-sm">Progress: {task.progress}%</p>

              {/* Feedback Section */}
              <div className="mt-3">
                <textarea
                  placeholder="Enter feedback..."
                  className="p-2 w-full border rounded-lg bg-gray-700 text-white"
                  value={feedbacks[task.id] || ""}
                  onChange={(e) => handleFeedbackChange(task.id, e.target.value)}
                ></textarea>
                <button
                  className="bg-green-500 px-4 py-2 rounded-md mt-2 hover:bg-green-700"
                  onClick={() => handleFeedbackSubmit(task.id)}
                >
                  Send
                </button>
              </div>

              {/* Withdraw Task */}
              <button
                className="bg-red-500 px-4 py-2 rounded-md mt-2 hover:bg-red-700"
                onClick={() => handleWithdrawTask(task.id)}
              >
                Withdraw Task
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
