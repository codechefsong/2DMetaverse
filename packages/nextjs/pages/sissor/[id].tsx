import type { NextPage } from "next";
import { useRouter } from 'next/router';

import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ConfirmCut: NextPage = () => {
  const router = useRouter();
  const { id, } = router.query;

  const { writeAsync: moveItem, isLoading } = useScaffoldContractWrite({
    contractName: "YourGarden",
    functionName: "cutFlower",
    args: [id],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleYes = async() => {
    await moveItem();
    router.push('/board');
  }

  return (
     <div className="flex items-center flex-col flex-grow pt-7">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Are you sure to cut this flower from position {id}?</span>
        </h1>

        <span className="block text-md text-slate-500 mb-5">* You will get 2 seeds</span>

        <button className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50" onClick={handleYes}>
          Yes
        </button>
        <button className="py-2 px-16 mb-1 mt-3 bg-gray-300 rounded baseline hover:bg-gray-200 disabled:opacity-50" onClick={() =>  router.push('/board')}>
          No
        </button>
      </div>
    </div>
  )
}

export default ConfirmCut;