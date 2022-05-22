import { useEffect, useState, useContext } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { storeContext } from "./_app";
import ABI from '../utils/abi.json'

export default function BattlesHistory() {
    const { Moralis } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const [battles, setBattles] = useState([]);
    const [monthNo, setMonthNo] = useState();

    useEffect(()=>{
        async function getMonth(){
            const options = {
                contractAddress: process.env.contractAddress,
                functionName: "getMonthNumber",
                abi: ABI,
            }
            const data = await contractProcessor.fetch({params: {...options }});
            setMonthNo(parseInt(data));
        }

        async function getBattleIdForMonth(monthNum){
            const options = {
                contractAddress: process.env.contractAddress,
                functionName: "getPastBattleIds",
                abi: ABI,
            }

            for(let i=1; i<monthNum; i++){
                const data = await contractProcessor.fetch({params: {...options }, params:{month:`${i}`}});
                getPastNFTs(i,parseInt(data));

            }
        }

        async function getPastNFTs(month, battleId){
            const options = {
                contractAddress: process.env.contractAddress,
                functionName: "getBattleHistory",
                abi: ABI,
            }

            for(let i=1; i<=battleId; i++){
                const data = await contractProcessor.fetch({params: {...options }, params:{month:`${month}`, battleId: `${i}`}});
                setBattles(prev=>[...prev, data]);
            }
        }

        async function run(){
            const monthNum = await getMonth();
            getBattleIdForMonth(monthNum);
        }

        run();
    },[])

    return(
        <div className="flex flex-col items-center justify-center mt-[5rem] gap-5">
            <button className="text-white">Click</button>
            <ul className="w-[100%] md:w-[100%] xl:w-[70%] 2xl:w-[60%] m-auto flex gap-5 flex-wrap max-h-[720px] overflow-y-auto">
                {battles.map(battle=>{
                    
                    return <ul className="w-[90%] border border-white rounded flex justify-between px-2 bg-black bg-black bg-opacity-30 bg-clip-padding rounded-lg" style={{backdropFilter:'blur(15px)'}}>
                        <li className="w-[30%] h-[300px]  border border-white rounded flex flex-col justify-between cursor-pointer text-white">
                        <img src={battle[0][2]} className="min-h-[210px] max-h-[210px] md:min-w-[200px] " />
                        <p className="border border-white bg-red-400 text-white h-[18%]">{}</p>
                        </li>
                        <h2>VS</h2>
                        <li className="w-[30%] h-[300px]  border border-white rounded flex flex-col justify-between cursor-pointer text-white">
                        <img src={battle[1][2]} className="min-h-[210px] max-h-[210px] md:min-w-[200px] " />
                        <p className="border border-white bg-red-400 text-white h-[18%]">{}</p>
                        </li>
                    </ul>
                })}
            </ul>
        </div>
    )
}