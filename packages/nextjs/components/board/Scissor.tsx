import { useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';
import { useRouter } from 'next/router';

const data = {
  id: `1000`,
  index: 1000,
  type: "scissor",
  content: "TTT",
}

export const Scissor = () => {
  const router = useRouter();

  const handleDrop = async (item, index) => {
    
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CELL',
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'CELL',
    drop: (item) => handleDrop(item, data.index),
  }));

  const cellRef = useRef(null); // Create a ref for the cell

  drag(drop(cellRef)); // Assign the ref to the drag and drop functions

  return (
    <div
      ref={cellRef} // Assign the ref to the actual DOM element
      className="w-16 h-16 border border-gray-300 flex items-center justify-center font-bold bg-green-100"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <img src="/assets/scissor.png" alt="Scissor" />
    </div>
  );
};