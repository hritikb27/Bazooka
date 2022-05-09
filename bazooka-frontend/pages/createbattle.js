import { useState, useEffect } from "react"
import ABI from '../utils/abi.json'
import { ethers } from "ethers";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";
import Image from "next/image";

export default function Dashboard() {
    const [amount, setAmount] = useState();
    const [NftBalance, setNftBalance] = useState([{ name: 'name', tokenAddress: 'address', image: 'result' }]);
    const [selectedNFT, setSelectedNFT] = useState();
    const { user, Moralis, isAuthenticated } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const { native } = useMoralisWeb3Api();

    useEffect(() => {
        if (!isAuthenticated) {
            Moralis.authenticate();
            Moralis.enableWeb3();
        }
        console.log(user.attributes);
        async function getNfts() {
            const options1 = { chain: 'rinkeby', address: `${user.attributes.ethAddress}` };

            const testnetNFTs = await Web3Api.Web3API.account.getNFTs(options1);

            testnetNFTs.result.map(async (nft, index) => {
                const result = await getNftData(nft);
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

        getNfts();

    }, [])


    function handleAmount(num) {
        if (num === 1) setAmount(30)
        else if (num === 2) setAmount(50)
        else if (num === 3) setAmount(80)
    }

    async function createBattle(e) {
        e.preventDefault();
        const options = {
            contractAddress: "0x0F6d227e58314Af97a11a29fACb7B96bFE3d0602",
            functionName: "createInitialBattle",
            abi: ABI,
            msgValue: Moralis.Units.ETH("0.01"),
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
            image: nft.image.image,
            address: nft.tokenAddress
        })

        console.log(selectedNFT)
    }

    return (
        <div className="flex flex-col items-center justify-center mt-[5rem] gap-5">
            <form className="md:w-[80%] lg:w-[60%] xl:w-[60%] flex flex-col gap-5">
                <label className='m-auto'>Select Bet Amount</label>
                <ul className="flex gap-5 m-auto w-[50%] ">
                    <li className={amount === 30 ? 'text-center border border-black rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-black rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(1)}>30</li>
                    <li className={amount === 50 ? 'text-center border border-black rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-black rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(2)}>50</li>
                    <li className={amount === 80 ? 'text-center border border-black rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-black rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(3)}>80</li>
                </ul>

                <ul className="w-[100%] m-auto flex gap-5 flex-wrap">
                    {NftBalance.map((nft, index) => {
                        if (index == 0) return;
                        return <li className="w-[30%] h-[300px] border border-black rounded flex flex-col justify-between">
                            {nft.image ? <img src={NftBalance[1] && nft.image} className="min-h-[210px] max-h-[210px] min-w-[256px] " />: <p>Can't fetch NFT Image!</p>}
                            <p className="ml-2">{nft.name}</p>
                            {nft.image && <input type='radio' name="nftSelect" onClick={() => handleNftSelection(nft)} className='m-auto cursor-pointer' />}
                        </li>
                    })}
                </ul>
                <button className="text-center w-[20%] border border-black rounded m-auto" onClick={createBattle}>Create Battle</button>
            </form>
        </div>
    )
}