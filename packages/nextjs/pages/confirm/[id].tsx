import type { NextPage } from "next";
import { useRouter } from 'next/router';

import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ConfirmChange: NextPage = () => {
  const router = useRouter();
  const { id, } = router.query;

  const { writeAsync: moveItem, isLoading } = useScaffoldContractWrite({
    contractName: "YourGarden",
    functionName: "moveItem",
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
    <div>
      <h1>Are you sure to move this seed to position {id}</h1>
      <button onClick={handleYes}>Yes</button>
    </div>
  )
}

export default ConfirmChange;