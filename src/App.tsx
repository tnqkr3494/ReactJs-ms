import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { toDoIndex, toDoState } from "./atoms";
import Board from "./components/Board";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Wrapper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

interface IForm {
  Title: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [visible, setVisible] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const [Index, setIndex] = useRecoilState(toDoIndex);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    //same board
    if (destination?.droppableId === source.droppableId) {
      setToDos((oldBoards) => {
        const copyBoard = [...oldBoards[source.droppableId]];
        const taskObj = copyBoard[source.index];
        copyBoard.splice(source.index, 1);
        copyBoard.splice(destination?.index, 0, taskObj);
        return {
          ...oldBoards,
          [destination.droppableId]: copyBoard,
        };
      });
    }
    //different board
    if (destination?.droppableId !== source.droppableId) {
      setToDos((oldBoards) => {
        const sourceBoard = [...oldBoards[source.droppableId]];
        const destinationBoard = [...oldBoards[destination.droppableId]];
        const taskObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...oldBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  const onClick = () => {
    setVisible((prev) => !prev);
  };

  const onValid = ({ Title }: IForm) => {
    setToDos((oldToDos) => {
      return {
        ...oldToDos,
        [Title]: [],
      };
    });
    setValue("Title", "");
    setVisible((prev) => !prev);
    setIndex((prevOrder) => [...prevOrder, Title]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Index.map((boardId, index) => (
            <Droppable droppableId={boardId} type="board">
              {(magic) => (
                <div ref={magic.innerRef} {...magic.droppableProps}>
                  <Board
                    key={boardId}
                    toDos={toDos[boardId]}
                    boardId={boardId}
                    index={index}
                  />
                  {magic.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <button
            style={
              visible
                ? { display: "none", width: "300px", height: "300px" }
                : { display: "block", width: "300px", height: "300px" }
            }
            onClick={onClick}
          >
            Add Board
          </button>
          <form onSubmit={handleSubmit(onValid)}>
            <input
              style={visible ? { display: "block" } : { display: "none" }}
              placeholder="Title"
              {...register("Title", { required: true })}
            />
          </form>
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
