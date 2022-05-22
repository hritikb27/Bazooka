import { useEffect, useState, useContext } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { storeContext } from "./_app";
import ABI from '../utils/abi.json'

export default function BrowseBattles() {
    const { Moralis } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const [battles, setBattles] = useState([]);
    const { battlesPaused, setBattlesPaused } = useContext(storeContext);

    useEffect(()=>{
        async function getBattleData() {
            const options = {
                contractAddress: process.env.contractAddress,
                functionName: "getNFTNum",
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
            contractAddress: process.env.contractAddress,
            functionName: "getNFTs",
            abi: ABI,
        }
        
        for(let i=1; i<=battleNum; i++){
            const data = await contractProcessor.fetch({params: {...options, params:{nftId:`${i}`}}})
            console.log(data
                )
            setBattles(prev=>[...prev,data]);
        }
    }

    function getBattles(){
        console.log(battles)
    }
    
    async function handleBet(battle){
        const battleID = parseInt(battle._id)
        const options = {
            chain: 'matic testnet',
            contractAddress: process.env.contractAddress,
            functionName: "bet",
            abi: ABI,
            params: {
                battleId: battleID,
            }
        }

        const transaction = await Moralis.executeFunction(options)
        const receipt = await transaction.wait();
        console.log('Transaction reciept: ', receipt);
    }

    return !battlesPaused ? (
        <div className="flex flex-col items-center justify-center mt-[5rem] gap-5">
            <button onClick={getBattles} className="text-white">Click</button>
            <ul className="w-[100%] md:w-[100%] xl:w-[70%] 2xl:w-[60%] m-auto flex gap-5 flex-wrap max-h-[720px] overflow-y-auto customScrollbar">
                {battles.map(battle=>{
                    return <li className="w-[30%] h-[300px]  border border-white rounded flex flex-col justify-between cursor-pointer text-white">
                            <img src={battle[0][1]} className="min-h-[210px] max-h-[210px] md:min-w-[200px] " />
                            <p className="text-white text-center">{battle[0][2]}</p>
                            <button className="border border-white bg-red-400 text-white h-[18%]" onClick={()=>handleBet(battle)}>Bet</button>
                            {battle[3] && <p>Winner!</p>}
                        </li>
                })}
            </ul>
        </div>
    ) : (<div className="w-full h-full flex justify-center mt-10 items-center"><p className="h-[50px] w-[30%] flex justify-center items-center text-black m-auto border-2 bg-white border-black rounded">Battles are paused currently, please visit in a while!</p></div>)
}