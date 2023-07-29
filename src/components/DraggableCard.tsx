import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";

const Card = styled.div`
  background-color: #fff;
  margin-bottom: 5px;
  padding: 10px;
`;

interface IDraggableCard {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableCard) {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic) => (
        <Card
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default DraggableCard;
