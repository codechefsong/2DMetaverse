import { useState, useRef } from "react";

import { useDrag, useDrop } from 'react-dnd';

const myItems = [
  {
    id: `26`,
    index: 26,
    type: "mybags",
    content: "TTT",
  },
  {
    id: `27`,
    index: 27,
    type: "mybags",
    content: "AAA",
  }
]

const generateGridData = () => {
  const data = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      data.push({
        id: `cell-${row}-${col}`,
        index: data.length,
        type: "base",
        content: data.length + 1,
      });
    }
  }
  return data;
};

const Cell = ({ id, content, type, index, gridData, setGridData, bagData, setBagData }) => {
  const handleDrop = (item, index) => {
    // Handle the drop logic here
    let newGrid = [...gridData];
    console.log(item, index)

    if(item.type === "mybags"){
      newGrid[index].content = item.content;
      const newBag = bagData
      newBag.shift();
    }
    const oldContent = gridData[index].content;
    newGrid[index].content = item.content;
    newGrid[item.index].content = oldContent;
    setGridData(newGrid);
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CELL',
    item: { id, index, type, content },
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
  const [bagData, setBagData] = useState(myItems);

  return (
    <div>
      <div className="flex">
        <div>
          <h2 className="mt-4 text-3xl">House</h2>
          <div className="flex flex-wrap" style={{ width: "500px"}}>
            {gridData.map((item, index) => (
              <Cell key={item.id} id={item.id} content={item.content} type={item.type} index={index} gridData={gridData} setGridData={setGridData} bagData={bagData} setBagData={setBagData} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mt-4 text-3xl">My Bag</h2>
          <div className="flex flex-wrap" style={{ width: "500px"}}>
            {bagData.map((item, index) => (
              <Cell key={item.id} id={item.id} content={item.content} type={item.type} index={index} gridData={gridData} setGridData={setGridData} bagData={bagData} setBagData={setBagData} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}