import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>();
  const onSubmit = ({ toDo }: IForm) => {
    const newToDo = { text: toDo, category, id: Date.now() };
    setToDos((oldToDos) => [...oldToDos, newToDo]);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("toDo", {
          required: "Please write some ToDo",
          minLength: {
            value: 5,
            message: "Write more than 4 words",
          },
        })}
        placeholder="Write a ToDo"
      />
      <button>Add</button>
      <span>{errors?.toDo?.message}</span>
    </form>
  );
}

export default CreateToDo;
