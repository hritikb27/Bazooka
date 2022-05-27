import { useState, useEffect, useContext } from "react"
import { storeContext } from "./_app";
import ABI from '../utils/abi.json'
import { ethers } from "ethers";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";
import Image from "next/image";
import {useRouter} from 'next/router'

export default function Dashboard() {
    const [amount, setAmount] = useState();
    const [NftBalance, setNftBalance] = useState([{ name: 'name', tokenAddress: 'address', image: 'result' }]);
    const {userNfts, setUserNfts, battlesPaused, setBattlesPaused} = useContext(storeContext);
    const [selectedNFT, setSelectedNFT] = useState();
    const { user, Moralis, isAuthenticated } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const Web3Api = useMoralisWeb3Api();
    const { native } = useMoralisWeb3Api();
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            
            router.push('/')
            // Moralis.authenticate();
            // Moralis.enableWeb3();
        }else{

        async function getNfts() {
            const options1 = { chain: 'rinkeby', address: `${user.attributes.ethAddress}` };

            const testnetNFTs = await Web3Api.Web3API.account.getNFTs(options1);

            testnetNFTs.result.map(async (nft, index) => {
                const result = await getNftData(nft);
                setUserNfts(prev=>[...prev, { name: `${nft.name}`, tokenAddress: `${nft.token_address}`, image: result }])
                setNftBalance(prev => {
                    return [...prev, { name: `${nft.name}`, tokenAddress: `${nft.token_address}`, image: result }];
                })
            })


            async function getNftData(nft) {
                try {
                    const imageUrl = await fetch(nft.token_uri);
                    const result = await imageUrl.json()

                    console.log('NFT IMAGE: ', NftBalance);
                    return result.image
                }
                catch (e) {
                    console.log();
                }
            }
        }
        async function getBattlesPaused() {
            const options = {
                contractAddress: process.env.contractAddress,
                functionName: "getBattlesPaused",
                abi: ABI,
            }

            const data = await contractProcessor.fetch({ params: { ...options } })
            setBattlesPaused(data);
        }

        getNfts();
        getBattlesPaused();
    }

    }, [])


    function handleAmount(num) {
        if (num === 1) setAmount(0.01)
        else if (num === 2) setAmount(0.05)
        else if (num === 3) setAmount(0.1)
    }

    async function createBattle(e) {
        e.preventDefault();
        const options = {
            contractAddress: process.env.contractAddress,
            functionName: "createInitialBattle",
            abi: ABI,
            msgValue: Moralis.Units.ETH(amount),
            params: {
                _candidate1: selectedNFT.address,
                image: selectedNFT.image,
                name: selectedNFT.name
            }
        }

        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait();
        console.log('Transaction reciept: ', receipt);
    }

    function handleNftSelection(nft) {
        setSelectedNFT({
            name: nft.name,
            image: nft.image,
            address: nft.tokenAddress
        })

        console.log(selectedNFT)
    }

    return !battlesPaused ? (
        <div className="flex flex-col items-center justify-center gap-5">
            <form className="md:w-[100%] xl:w-[70%] 2xl:w-[60%] flex flex-col gap-5 text-white">
                <label className='m-auto'>Select Bet Amount</label>
                <ul className="flex gap-5 m-auto w-[50%]">
                    <li className={amount === 0.01 ? 'text-center border border-white rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-white rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(1)}>0.01</li>
                    <li className={amount === 0.05 ? 'text-center border border-white rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-white rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(2)}>0.05</li>
                    <li className={amount === 0.1 ? 'text-center border border-white rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-white rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(3)}>0.1</li>
                </ul>

                <ul className="w-[100%] max-h-[720px] m-auto flex gap-5 flex-wrap overflow-y-auto " >
                    {NftBalance.map((nft, index) => {
                        if (index == 0) return;
                        return <li className="w-[30%] h-[300px] border border-white rounded flex flex-col justify-between bg-black bg-opacity-30 bg-clip-padding rounded-lg " style={{backdropFilter:'blur(15px)'}}>
                            {nft.image ? <img src={NftBalance[1] && nft.image} className="min-h-[210px] rounded max-h-[210px] md:min-w-[200px] " />: <p>Can't fetch NFT Image!</p>}
                            <p className="ml-2 text-white">{nft.name}</p>
                            {nft.image && <input type='radio' name="nftSelect" onClick={() => handleNftSelection(nft)} className='m-auto cursor-pointer' />}
                        </li>
                    })}
                </ul>
                <button className="text-center w-[20%] border border-black rounded m-auto text-white" onClick={createBattle}>Create Battle</button>
            </form>
        </div>
    ) : (<div className="w-full h-full flex justify-center mt-10 items-center"><p className="h-[50px] w-[30%] flex justify-center items-center text-black m-auto border-2 bg-white border-black rounded">Battles are paused currently, please visit in a while!</p></div>)
}