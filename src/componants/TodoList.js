import { useState, useEffect } from 'react';
import "./TodoList.css";

function TodoList() {

  const loadFromStorage = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [tasks, setTasks] = useState(() => loadFromStorage("todo_tasks", []));
  const [haveDone, setHaveDone] = useState(() => loadFromStorage("todo_done", {}));
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');


  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("todo_done", JSON.stringify(haveDone));
  }, [haveDone]);


  function handleInputChange(e) { setNewTask(e.target.value); }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks(t => [...t, newTask]);
      setNewTask("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") { e.preventDefault(); addTask(); }
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
    
    setHaveDone(prev => {
      const updated = {};
      Object.keys(prev).forEach(k => {
        const i = Number(k);
        if (i < index) updated[i] = prev[i];
        else if (i > index) updated[i - 1] = prev[i];
      });
      return updated;
    });
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updated = [...tasks];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      setTasks(updated);


      setHaveDone(prev => {
        const updated = { ...prev };
        [updated[index], updated[index - 1]] = 
        [updated[index - 1], updated[index]];
        return updated;
      });
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updated = [...tasks];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setTasks(updated);

      setHaveDone(prev => {
        const updated = { ...prev };
        [updated[index], updated[index + 1]] = 
        [updated[index + 1], updated[index]];
        return updated;
      });
    }
  }

  function startEdit(index) {
    setEditIndex(index);
    setEditText(tasks[index]);
  }

  function saveEdit(index) {
    if (editText.trim() !== "") {
      const updated = [...tasks];
      updated[index] = editText;
      setTasks(updated);
      setEditIndex(null);
      setEditText('');
    } else {
      cancelEdit();
    }
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditText('');
  }

  function handleEditKeyDown(e, index) {
    if (e.key === "Enter") { e.preventDefault(); saveEdit(index); }
    else if (e.key === "Escape") cancelEdit();
  }

  function DoneTheTask(index) {
    setHaveDone(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }


  function clearAll() {
    if (window.confirm("همه تسک‌ها پاک بشن؟")) {
      setTasks([]);
      setHaveDone({});
      localStorage.removeItem("todo_tasks");
      localStorage.removeItem("todo_done");
    }
  }

  return (
    <div className='to-do-list'>
      <h1 className='title'>📝 To Do List</h1>

      <div className="input-container">
        <input
          type='text'
          className='writeTask'
          placeholder='What is your task?'
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className='add-button' onClick={addTask}>➕ Add</button>
      </div>

      <div className='line'></div>

      <ol>
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks yet! Add one above ☝️</p>
        ) : (
          tasks.map((task, index) => (
            <li key={index} className="task-item">
              {editIndex === index ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, index)}
                  onBlur={() => saveEdit(index)}
                  autoFocus
                />
              ) : (
                <span className={haveDone[index] ? "done_style" : 'text'}>
                  {task}
                </span>
              )}

              <div className="button-group">
                <button className='Done-button' onClick={() => DoneTheTask(index)}>✔️</button>
                <button className='delete-button' onClick={() => deleteTask(index)}>🗑️</button>

                {editIndex === index ? (
                  <>
                    <button className='save-button' onClick={() => saveEdit(index)}>💾</button>
                    <button className='cancel-button' onClick={cancelEdit}>❌</button>
                  </>
                ) : (
                  <>
                    <button className='edit-button' onClick={() => startEdit(index)}>✏️</button>
                    <button className='up-button' onClick={() => moveTaskUp(index)}>⬆️</button>
                    <button className='down-button' onClick={() => moveTaskDown(index)}>⬇️</button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ol>

      {tasks.length > 0 && (
        <button className="clear-all-button" onClick={clearAll}>
          🧹 Clear All
        </button>
      )}
    </div>
  );
}

export default TodoList;