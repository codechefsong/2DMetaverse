import { useState, useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';
import {
  useScaffoldContractRead,
  useScaffoldContractWrite
} from "~~/hooks/scaffold-eth";

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


const Cell = ({ id, content, type, index, gridData, bagData, moveItem, setSelectedIndex }) => {
  const handleDrop = (item, index) => {
    // Handle the drop logic here
    // let newGrid = [...gridData];
    // console.log(item, index)

    // if(item.type === "mybags"){
    //   newGrid[index].content = item.content;
    //   const newBag = bagData
    //   newBag.shift();
    // }
    // const oldContent = gridData[index].content;
    // newGrid[index].content = item.content;
    // newGrid[item.index].content = oldContent;
    console.log(index, "d")
    moveItem();
    //setGridData(newGrid);
  };

  const handleHover = (item, monitor) => {
    console.log(index);
    setSelectedIndex(index);
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CELL',
    item: { id, index, type, content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'CELL',
    hover: handleHover,
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
  // const [gridData, setGridData] = useState(generateGridData());
  // const [bagData, setBagData] = useState(myItems);
  const [selectedIndex, setSelectedIndex] = useState(0);
  console.log(selectedIndex, "selectedIndex");

  const { data: gridData } = useScaffoldContractRead({
    contractName: "YourGarden",
    functionName: "getGrid",
  });

  const { data: bagData } = useScaffoldContractRead({
    contractName: "YourGarden",
    functionName: "getMyBags",
  });
 
  const { writeAsync: moveItem, isLoading } = useScaffoldContractWrite({
    contractName: "YourGarden",
    functionName: "moveItem",
    args: [selectedIndex],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div>
      <div className="flex">
        <div>
          <h2 className="mt-4 text-3xl">House {selectedIndex}</h2>
          <div className="flex flex-wrap" style={{ width: "350px"}}>
            {gridData && gridData.map((item, index) => (
              <Cell key={item.id.toString()} id={item.id.toString()} content={item.content.toString()} type={item.typeGrid} index={index} gridData={gridData} bagData={bagData} moveItem={moveItem} setSelectedIndex={setSelectedIndex} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mt-4 text-3xl">My Bag</h2>
          <div className="flex flex-wrap" style={{ width: "500px"}}>
            {bagData && bagData.map((item, index) => (
              <Cell key={item.id.toString()} id={item.id.toString()} content={item.content.toString()} type={item.type} index={index} gridData={gridData} bagData={bagData} moveItem={moveItem} setSelectedIndex={setSelectedIndex} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}