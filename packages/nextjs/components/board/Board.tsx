import { useState, useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';
import {
  useScaffoldContractRead,
  useScaffoldContractWrite
} from "~~/hooks/scaffold-eth";
import { useRouter } from 'next/router';

const Cell = ({ id, content, type, index, gridData, bagData, moveItem, changeSelectedIndex }) => {
  const router = useRouter();

  const handleDrop = async (item, index) => {
    router.push('/confirm/'+ index)
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
      className="w-16 h-16 border border-gray-300 flex items-center justify-center font-bold bg-yellow-100"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {content === "O" &&  <img src="/assets/seed.png" alt="Seed" />}
    </div>
  );
};

export const BoardMain = () => {
  // const [gridData, setGridData] = useState(generateGridData());
  // const [bagData, setBagData] = useState(myItems);
  const [selectedIndex, setSelectedIndex] = useState(1);

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

  const changeSelectedIndex = (num) => {
    setSelectedIndex(num);
  }

  return (
    <div>
      <div className="flex">
        <div>
          <h2 className="mt-4 text-3xl">Garden  {selectedIndex}</h2>
          <div className="flex flex-wrap" style={{ width: "350px"}}>
            {gridData && gridData.map((item, index) => (
              <Cell key={item.id.toString()} id={item.id.toString()} content={item.content.toString()} type={item.typeGrid} index={index} gridData={gridData} bagData={bagData} moveItem={moveItem} changeSelectedIndex={changeSelectedIndex} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mt-4 text-3xl">My Bag</h2>
          <div className="flex flex-wrap" style={{ width: "500px"}}>
            {bagData && bagData.map((item, index) => (
              <Cell key={item.id.toString()} id={item.id.toString()} content={item.content.toString()} type={item.type} index={index} gridData={gridData} bagData={bagData} moveItem={moveItem} changeSelectedIndex={changeSelectedIndex} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}