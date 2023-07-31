import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDoState, toDoState } from "./atoms";
import Board from "./components/Board";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, type } = info;
    console.log(info);
    if (!destination) return;
    if (type === "card") {
      if (destination?.droppableId === source.droppableId) {
        // same board movement.
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          const taskObj = boardCopy[source.index];
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
        });
      }
      if (destination.droppableId !== source.droppableId) {
        // cross board movement
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const taskObj = sourceBoard[source.index];
          const destinationBoard = [...allBoards[destination.droppableId]];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
        });
      }
    } else {
      setToDos((oldToDos) => {
        const boardOrder = [...Object.keys(oldToDos)];
        const [removed] = boardOrder.splice(source.index, 1);
        boardOrder.splice(destination.index, 0, removed);

        const newToDos: IToDoState = {};
        boardOrder.forEach((boardId) => {
          newToDos[boardId] = oldToDos[boardId];
        });

        return newToDos;
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Droppable droppableId="board" type="board" direction="horizontal">
          {(magic) => (
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
              {magic.placeholder}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
