import { useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import ABI from '../utils/abi.json'

export default function BrowseBattles() {
    const { Moralis } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const [battles, setBattles] = useState([]);

    useEffect(()=>{
        async function getBattleData() {
            const options = {
                contractAddress: "0x0F6d227e58314Af97a11a29fACb7B96bFE3d0602",
                functionName: "getBattleAmount",
                abi: ABI,
            }
    
            const data = await Moralis.executeFunction(options)
            const battleNumber = parseInt(data);
            return battleNumber;
        }

        async function run(){
            const battleNum = await getBattleData();
            getAllBattles(battleNum);
        }

        run()

    },[])

    async function getAllBattles(battleNum){
        console.log(battleNum)
        const options = {
            contractAddress: "0x0F6d227e58314Af97a11a29fACb7B96bFE3d0602",
            functionName: "getBattleData",
            abi: ABI,
        }
        
        for(let i=1; i<=battleNum; i++){
            const data = await contractProcessor.fetch({params: {...options, params:{battleId:`${i}`}}})
            setBattles(prev=>[...prev,data]);
        }
    }

    function getBattles(){
        console.log(battles)
    }

    return(
        <div className="flex flex-col items-center justify-center mt-[5rem] gap-5">
            <button onClick={getBattles} className="text-white">Click</button>
            <ul className="w-[100%] md:w-[100%] xl:w-[70%] 2xl:w-[60%] m-auto flex gap-5 flex-wrap">
                {battles.map(battle=>{
                    if(!battle.finalized) return;
                    return <ul className="w-[90%] border border-white rounded flex justify-between px-2 bg-black">
                        <li className="w-[30%] h-[300px]  border border-white rounded flex flex-col justify-between cursor-pointer text-white">
                        <img src={battle[0][1]} className="min-h-[210px] max-h-[210px] md:min-w-[200px] " />
                        <p>Amount: {parseInt(battle.amount)}</p>
                        <button className="border border-white bg-red-400 text-white h-[18%] ">Vote</button>
                        </li>
                        <h2>VS</h2>
                        <li className="w-[30%] h-[300px]  border border-white rounded flex flex-col justify-between cursor-pointer text-white">
                        <img src={battle[1][1]} className="min-h-[210px] max-h-[210px] md:min-w-[200px] " />
                        <p>Amount: {parseInt(battle.amount)}</p>
                        <button className="border border-white bg-red-400 text-white h-[18%] ">Vote</button>
                        </li>
                    </ul>
                })}
            </ul>
        </div>
    )
}