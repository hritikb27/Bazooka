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
        <div>
            <button onClick={getBattles}>Click me</button>
        </div>
    )
}