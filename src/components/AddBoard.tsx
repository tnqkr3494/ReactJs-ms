import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

function AddBoard() {
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const setToDos = useSetRecoilState(toDoState);

  const handleNewBoard = () => {
    setToDos((prevToDos) => {
      const newBoardId = newBoardTitle;
      return {
        ...prevToDos,
        [newBoardId]: [],
      };
    });
    setNewBoardTitle("");
  };

  return (
    <div>
      <input
        type="text"
        value={newBoardTitle}
        onChange={(e) => setNewBoardTitle(e.target.value)}
        placeholder="Enter board title"
      />
      <button onClick={handleNewBoard}>Add Board</button>
    </div>
  );
}

export default AddBoard;
