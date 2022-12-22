import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [itemText, setItemText] = useState("");
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState("");
  const [updateItemText, setUpdateItemText] = useState("");

  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:7850/api/item", {
        item: itemText,
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText("");
    } catch (err) {
      console.log(err);
    }
  };

  //Create function to fetch all todo items from database -- we will use useEffect hook
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get("http://localhost:7850/api/items");
        setListItems(res.data);
        // console.log("render");
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  // Delete item when click on delete
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:7850/api/item/${id}`);
      const newListItems = listItems.filter((item) => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  //Update item
  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:7850/api/item/${isUpdating}`,
        { item: updateItemText }
      );
      console.log(res.data);
      const updatedItemIndex = listItems.findIndex(
        (item) => item._id === isUpdating
      );
      const updatedItem = (listItems[updatedItemIndex].item = updateItemText);
      setUpdateItemText("");
      setIsUpdating("");
    } catch (err) {
      console.log(err);
    }
  };
  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form 
      className="update-form"
      onSubmit={(e) => {
        updateItem(e);
      }}
    >
      <input
        className="update-new-input"
        type="text"
        placeholder="Update Item"
        required
        onChange={(e) => {
          setUpdateItemText(e.target.value);
        }}
        value={updateItemText}
      />
      <button className="update-new-btn" type="submit">
        Update
      </button>
    </form>
  );

  return (
    <div className="App">
      <h1>Todo List</h1>
      
      <form className="form" onSubmit={(e) => addItem(e)}>
      <div className="inputandbtn">
        <input
          type="text"
          placeholder="Add Item..."
          className="inputtodo"
          required
          onChange={(e) => {
            setItemText(e.target.value);
          }}
          value={itemText}
        />
        <button type="submit">Add</button>
        </div>
      </form>
      
      <div className="todo-listItems"> 
        {listItems.map((item, i) => (
          <div className="todo-item" key={i}>
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <div className="btnanditem">
                  <div className="todoitempara">
                  <p className="item-content">{item.item}</p>
                     {/* <ul className="item-content"><li>{item.item}</li></ul> */}
                  {/* <textarea name="todoitemlist" id="texttodo" cols="65" rows="2">{item.item}</textarea> */}
                  
                  </div>
                  <div className="todoupdateanddeletebtn">
                    <button
                      className="update-item"
                      onClick={() => {
                        setIsUpdating(item._id);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="delete-item"
                      onClick={() => {
                        deleteItem(item._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
