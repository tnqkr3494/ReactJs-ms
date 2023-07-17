import React from "react";
import { useSetRecoilState } from "recoil";
import { Categories, IToDo, toDoState } from "../atoms";

function ToDo({ text, category, id }: IToDo) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (newCategory: Categories) => {
    setToDos((oldToDos) => {
      const updateToDos = oldToDos.map((toDo) =>
        toDo.id === id ? { ...toDo, category: newCategory } : toDo
      );
      return updateToDos;
    });
  };
  return (
    <li>
      <span>{text}</span>
      {category !== Categories.DOING && (
        <button
          name={Categories.DOING}
          onClick={() => onClick(Categories.DOING)}
        >
          Doing
        </button>
      )}
      {category !== Categories.TO_DO && (
        <button
          name={Categories.TO_DO}
          onClick={() => onClick(Categories.TO_DO)}
        >
          To Do
        </button>
      )}
      {category !== Categories.DONE && (
        <button name={Categories.DONE} onClick={() => onClick(Categories.DONE)}>
          Done
        </button>
      )}
    </li>
  );
}

export default ToDo;
