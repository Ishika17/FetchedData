import React, { useEffect, useState } from 'react';
import './list.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const List = () => {
  const [todos, setTodos] = useState([]); 
  const [open, setOpen] = useState(false); 
  const [newTodo, setNewTodo] = useState(''); 
  const [deleteTodoId, setDeleteTodoId] = useState(null); 
  const [anchorEl, setAnchorEl] = useState(null); 
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); 
  const[update , setUpadte] = useState(false);

  useEffect(() => {
   
    const role = localStorage.getItem('role');
    let apiUrl = 'https://dummyjson.com/todos'; 

   
    if (role !== 'admin') {
      apiUrl += '?limit=3&skip=10';
    }

   
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos); 
      })
      .catch((error) => console.error('Error fetching todos:', error)); 
  }, []); 
 
  useEffect(() => {
   
    const role = localStorage.getItem('role');
    let apiUrl = 'https://dummyjson.com/todos'; 
    
    if (role !== 'admin') {
      apiUrl += '?limit=3&skip=10';
    }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos); 
      })
      .catch((error) => console.error('Error fetching todos:', error)); 
      setUpadte(false);
  }, [update]); 

  const handleClickOpen = () => {
    setOpen(true); 
  };

  const handleClose = () => {
    setOpen(false); 
    setNewTodo(''); 
  };

  const handleAddTodo = () => {
 
    const newUserId = Math.floor(Math.random() * 100) + 1; 
    fetch('https://dummyjson.com/todos/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: newTodo,
        completed: false,
        userId: newUserId,
       
      }),
    })
      .then((res) => res.json())
      .then((data) => {
    
        setTodos((prevTodos) => [...prevTodos, { ...data }]);
        handleClose(); 
      })
      .catch((error) => console.error('Error adding todo:', error));
  };

  const handleDeleteClick = () => {
   
    setConfirmDeleteOpen(true); 
  };

  const handleConfirmDelete = () => {
    const  deletedid = localStorage.getItem('id');
    
    if (deletedid !== null) { 
   
      fetch(`https://dummyjson.com/todos/${deletedid}`, {
        method: 'DELETE',
      })
        .then((res) => {
            setUpadte(true);
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(() => {
          
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== deletedid));
          setConfirmDeleteOpen(false);
          setDeleteTodoId(null); 
          setAnchorEl(null); 
        })
        .catch((error) => console.error('Error deleting todo:', error));
    }
  };

  const handleMenuClick = (event, id) => {
    localStorage.setItem('id' , id );
    setAnchorEl(event.currentTarget); 
    setDeleteTodoId(id); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null); 
  };

  return (
    <div>
      <h2>Todo List</h2>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Todo
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Todo"
            type="text"
            fullWidth
            variant="outlined"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTodo} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this todo?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Todo</th>
            <th>Completed</th>
            <th>User ID</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.todo}</td>
              <td>{todo.completed ? 'Yes' : 'No'}</td>
              <td>{todo.userId}</td>
              <td>
         <IconButton onClick={(event) => handleMenuClick(event, todo.id)}>
                  <MoreVertIcon />
                </IconButton> 
             <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                 <MenuItem 
                    onClick={() => { 
                      handleDeleteClick(); 
                      handleMenuClose(); 
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
