import { useState, useRef } from "react";

import { useDrag, useDrop } from 'react-dnd';

const generateGridData = () => {
  const data = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      data.push({
        id: `cell-${row}-${col}`,
        index: data.length,
        content: data.length + 1,
      });
    }
  }
  return data;
};

const Cell = ({ id, content, index, gridData, setGridData }) => {
  const handleDrop = (item, index) => {
    // Handle the drop logic here
    let newGrid = [...gridData];
    const oldContent = gridData[index].content;
    newGrid[index].content = item.content;
    newGrid[item.index].content = oldContent;
    setGridData(newGrid);
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CELL',
    item: { id, index, content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'CELL',
    drop: (item) => handleDrop(item, index),
  }));

  const cellRef = useRef(null); // Create a ref for the cell

  drag(drop(cellRef)); // Assign the ref to the drag and drop functions

  return (
    <div
      ref={cellRef} // Assign the ref to the actual DOM element
      className="w-16 h-16 border border-gray-300 flex items-center justify-center font-bold"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {content}
    </div>
  );
};


export const BoardMain = () => {
  const [gridData, setGridData] = useState(generateGridData());

  return (
    <div style={{ width: "500px"}}>
      <h1 className="mt-4 text-4xl">House</h1>
      <div className="flex flex-wrap">
        {gridData.map((item, index) => (
          <Cell key={item.id} id={item.id} content={item.content} index={index} gridData={gridData} setGridData={setGridData} />
        ))}
      </div>
    </div>
  );
}