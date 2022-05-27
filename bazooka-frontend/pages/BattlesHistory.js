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
            return parseInt(data)
        }

        async function getBattleIdForMonth(monthNum){
            const options = {
                contractAddress: process.env.contractAddress,
                functionName: "getPastBattleIds",
                abi: ABI,
            }


            for(let i=monthNum; i>0; i--){
                console.log(i)
                const data = await contractProcessor.fetch({params: {...options, params:{month:`${i}`} }});
                console.log(parseInt(data))
                if(parseInt(data)>0) getPastNFTs(i,parseInt(data));
                else continue;
            }
        }

        async function getPastNFTs(month, battleId){
            console.log(battleId)
            const options = {
                contractAddress: process.env.contractAddress,
                functionName: "getBattleHistory",
                abi: ABI,
            }

            for(let i=1; i<=battleId; i++){
                const data = await contractProcessor.fetch({params: {...options, params:{month:`${month}`, battleId: `${i}`} }});
                console.log(data)
                setBattles(prev=>[...prev, data]);
            }
        }

        async function run(){
            const monthNum = await getMonth();
            console.log(monthNum)
            getBattleIdForMonth(monthNum);
        }

        run();
    },[])

    function click(){
        console.log(battles);
    }
    return(
        <div className="flex flex-col items-center justify-center mt-[5rem] gap-5">
            {/* <button className="text-white" onClick={click}>Click</button> */}
            <ul className="w-[100%] md:w-[100%] xl:w-[70%] 2xl:w-[60%] m-auto flex gap-5 flex-wrap max-h-[720px] overflow-y-auto customScrollbar">
                {battles.map(battle=>{
                    
                    return <ul className="w-[90%] border border-white rounded flex justify-between px-2 bg-black bg-black bg-opacity-30 bg-clip-padding rounded-lg" style={{backdropFilter:'blur(15px)'}}>
                        <li className="w-[30%] h-[300px]  border border-white rounded flex flex-col justify-between text-white">
                        <img src={battle && battle[0][2]} className="min-h-[210px] max-h-[210px] md:min-w-[200px] " />
                        <p className="border border-white text-center pt-3 text-white h-[18%] bg-black bg-opacity-30 bg-clip-padding" style={{backdropFilter:'blur(15px)'}}>{parseInt(battle[2])} VOTES</p>
                        </li>
                        <h2 className="my-auto">VS</h2>
                        <li className="w-[30%] h-[300px] border border-white rounded flex flex-col justify-between text-white">
                        <img src={battle && battle[1][2]} className="min-h-[210px] max-h-[210px] md:min-w-[200px] " />
                        <p className="border border-white text-center pt-3 text-white h-[18%] bg-black bg-opacity-30 bg-clip-padding" style={{backdropFilter:'blur(15px)'}}>{parseInt(battle[4])} VOTES</p>
                        </li>
                    </ul>
                })}
            </ul>
        </div>
    )
}