import { useState } from "react";
import dynamic from 'next/dynamic';

const DragDropContext = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.DragDropContext;
    }),
  {ssr: false},
);
const Droppable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Droppable;
    }),
  {ssr: false},
);
const Draggable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Draggable;
    }),
  {ssr: false},
);

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `${k + offset}`
  }));

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",

  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 100
});

export const BoardMain = () => {
  const [state, setState] = useState([getItems(5), getItems(5, 5), getItems(5, 10), getItems(5, 15), getItems(5, 20)]);

  function onDragEnd(result) {
    const { source, destination } = result;
    console.log(source, destination)

    if (!destination) {
      return;
    }

    let newState = [...state];
    const data1 = state[destination.droppableId][destination.index].content;
    const data2 = state[source.droppableId][source.index].content;
    console.log(data1, data2)
    newState[source.droppableId][source.index].content = data1;
    newState[destination.droppableId][destination.index].content = data2;
    setState(newState);
  }

  return (
    <div>
      <h1 className="mt-4 text-4xl">House</h1>
      <div className="flex">
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            className="flex justify-around"
                          >
                            {item.content}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}