import Link from 'next/link'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import ABI from '../utils/abi.json'

export default function Layout({children, userData}) {
    const { logout, user, Moralis } = useMoralis();
    const router = useRouter();
    const [owner, setOwner] = useState();
    const { native } = useMoralisWeb3Api();

    useEffect(()=>{
        getOwnerAddress();
    },[])

    async function getOwnerAddress(){
        const options = {
            chain: 'matic testnet',
            address: process.env.contractAddress,
            function_name: "getOwner",
            abi: ABI,
        }

        const data = await Moralis.Web3API.native.runContractFunction(options);
        console.log(data, user.attributes.ethAddress)
        setOwner(data.toLocaleLowerCase());
    }
    
    const handleLogout = async () => {
        await logout();
        console.log("logged out");
        router.push('/')
    }

    return (
        <div id='layout' className="flex w-full h-screen justify-between">
            <aside className="h-full bg-gradient-to-r from-purple-500/40 to-pink-500/50 bg-clip-padding w-[18%] flex flex-col justify-between top-0 fixed" style={{backdropFilter:'blur(10px)'}}>
                <div className='w-full h-full mt-[2rem]'>
                <p className='text-center text-lg'>Hello {userData[0]}, welcome!</p>
                <ul className="mt-[5rem] font-semibold text-xl text-white">
                    <Link href="/createbattle"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Create a Battle</li></Link>
                    <Link href="/InitializedBattles"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Initialized Battles</li></Link>
                    <Link href="/browseBattles"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Browse Battles</li></Link>
                    <Link href="/BazookaNFTs"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Bazooka Bets</li></Link>
                    <Link href="/BattlesHistory"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Battles History</li></Link>
                    {(owner && owner==user.attributes.ethAddress.toLocaleLowerCase()) && <Link href="/addNFTs"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Add NFTs</li></Link>}
                    <li></li>
                </ul>
                </div>
                <button className='mb-2 rounded-md w-[60%] mx-auto h-10 bg-black text-white' onClick={handleLogout}>Logout</button>
            </aside>
            <div className="flex flex-col w-full ml-[20%] h-full mx-auto">
                {/* <header className="w-full h-[10%] bg-red-500 top-0 fixed">

                </header> */}
                <div className='w-full mx-auto mt-[2%]'>{children}</div>
            </div>
        </div>
    )
}