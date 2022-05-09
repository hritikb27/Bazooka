import { useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import ABI from '../utils/abi.json'

export default function InitializedBattles() {
    const { Moralis } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const [battles, setBattles] = useState([]);

    useEffect(()=>{
        let battleNum;
        async function getBattleData() {
            const options = {
                contractAddress: "0x0F6d227e58314Af97a11a29fACb7B96bFE3d0602",
                functionName: "getBattleAmount",
                abi: ABI,
            }
    
            const data = await Moralis.executeFunction(options)
            battleNum = parseInt(data);
        }

        async function getAllBattles(){
            const options = {
                contractAddress: "0x0F6d227e58314Af97a11a29fACb7B96bFE3d0602",
                functionName: "getBattleData",
                abi: ABI,
            }
            const data = await contractProcessor.fetch({params: {...options, params:{battleId:`${2}`}}})
            console.log(data)
            for(let i=1; i<=2; i++){
                console.log(i)
                const data = await contractProcessor.fetch({params: {...options, params:{battleId:`${i}`}}})
                setBattles(prev=>[...prev,data]);
            }
        }


        getBattleData();
        getAllBattles();

    },[])

    function getBattles(){
        console.log(battles)
    }

    return(
        <div className="flex flex-col items-center justify-center mt-[5rem] gap-5">
            <button onClick={getBattles}>Click</button>
            <ul className="w-[100%] md:w-[80%] lg:w-[60%] xl:w-[60%] m-auto flex gap-5 flex-wrap">
                {battles.map(battle=>{
                    return <li className="w-[30%] h-[300px]  border border-black rounded flex flex-col justify-between cursor-pointer">
                        <img src={battle[0][1]} className="min-h-[210px] max-h-[210px] min-w-[256px] " />
                        <p>Amount: {parseInt(battle.amount)}</p>
                        <button className="border border-white bg-black text-white h-[18%] ">Battle</button>
                    </li>
                })}
            </ul>
        </div>
    )
}