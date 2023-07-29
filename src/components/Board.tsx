import { styled } from "styled-components";
import DraggableCard from "./DraggableCard";
import { IToDo, toDoIndex, toDoState } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  background-color: #fff;
  width: 300px;
  min-height: 300px;
  display: flex;
  text-align: center;
  flex-direction: column;
`;

const Title = styled.h2`
  position: relative;
  font-weight: 600;
  font-size: 18px;
  padding: 10px;
`;

const Xbutton = styled.button`
  position: absolute;
  right: 10px;
  border: none;
  background-color: white;
  cursor: pointer;
`;

const Area = styled.div`
  background-color: #bbb;
  flex-grow: 1;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  padding-bottom: 5px;
  input {
    width: 80%;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    background-color: white;
  }
`;

interface IBoard {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoard) {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const setIndex = useSetRecoilState(toDoIndex);
  const setToDos = useSetRecoilState(toDoState);
  const onValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => {
      const newToDo = { id: Date.now(), text: toDo };
      return {
        ...oldToDos,
        [boardId]: [...oldToDos[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  const deleteBoard = () => {
    setToDos((oldToDos) => {
      const { [boardId]: _, ...newBoard } = oldToDos;
      return { ...newBoard };
    });
    setIndex((prevOrder) => prevOrder.filter((board) => board !== boardId));
  };
  return (
    <Wrapper>
      <Title>
        {boardId}
        <Xbutton onClick={deleteBoard}>X</Xbutton>
      </Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          placeholder="Write To Do"
          {...register("toDo", { required: true })}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic) => (
          <Area ref={magic.innerRef} {...magic.droppableProps}>
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
