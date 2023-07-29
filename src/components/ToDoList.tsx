import { useRecoilState, useRecoilValue } from "recoil";
import { Categories, categoryState, toDoSelect } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
  const toDos = useRecoilValue(toDoSelect);
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value as any);
  };
  return (
    <div>
      <h1>Lists</h1>
      <CreateToDo />
      <hr />
      <select value={category} onInput={onInput}>
        <option value={Categories.TO_DO}>ToDo</option>
        <option value={Categories.DOING}>Doing</option>
        <option value={Categories.DONE}>Done</option>
      </select>
      {toDos.map((toDo) => (
        <ToDo {...toDo} />
      ))}
    </div>
  );
}

export default ToDoList;
