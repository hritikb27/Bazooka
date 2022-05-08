import { useState, useEffect } from "react"
import ABI from '../utils/abi.json'
import { useMoralis, useMoralisWeb3Api,useMoralisWeb3ApiCall } from "react-moralis";
import Image from "next/image";

export default function Dashboard() {
    const [amount, setAmount] = useState();
    const [NftBalance, setNftBalance] = useState([{ name: 'name', tokenAddress: 'address', image: 'result' }]);
    const [selectedNFT, setSelectedNFT] = useState();
    const { Moralis } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const {native} = useMoralisWeb3Api();

    useEffect(() => {
        async function getNfts() {
            const options1 = { chain: 'rinkeby', address: '0x153Da55D54e815E9e6Dd1BDEA497dDec4aF52A21' };

            const testnetNFTs = await Web3Api.Web3API.account.getNFTs(options1);

            testnetNFTs.result.map(async (nft, index) => {
                const result = await getNftData(nft);
                setNftBalance(prev => {
                    return [...prev, { name: `${nft.name}`, tokenAddress: `${nft.token_address}`, image: result }];
                })
            })


            async function getNftData(nft) {
                const imageUrl = await fetch(nft.token_uri);
                const result = await imageUrl.json();
                console.log('NFT IMAGE: ', NftBalance);
                return result;
            }

            testnetNFTs.result.map(n => console.log('Running loop'))
            console.log(testnetNFTs.result)
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
        await Moralis.enableWeb3();
        const options = {
            contractAddress: "0x2d8922fE1c0847F5fd1550FDb39c3e0584F4edB7",
            functionName: "createInitialBattle",
            abi: ABI,
            msgValue: Moralis.Units.ETH("0.01"),
            params: {
                _candidate1: selectedNFT.address,
            }
        }

        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait();
        console.log('Transaction reciept: ', receipt);
    }

    async function getBattleData(e) {
        e.preventDefault();
        await Moralis.enableWeb3();
        const options = {
            contractAddress: "0x2d8922fE1c0847F5fd1550FDb39c3e0584F4edB7",
            functionName: "BattlesMapping",
            abi: ABI,
        }
        // const transaction = await Moralis.executeFunction(options);
        // const receipt = await transaction.wait();

        const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(
            native.runContractFunction,
            { ...options }
          );
        console.log(data)

    }

    function handleNftSelection(nft){
        setSelectedNFT({
            name: nft.name,
            image: nft.image.image,
            address: nft.tokenAddress
        })

        console.log(selectedNFT)
    }

    return (
        <div className="flex flex-col items-center justify-center mt-[5rem] gap-5">
            <form className="md:w-[80%] lg:w-[60%] xl:w-[38%] flex flex-col gap-5">
                <label className='m-auto'>Select Bet Amount</label>
                <ul className="flex gap-5 m-auto w-[50%] ">
                    <li className={amount === 30 ? 'text-center border border-black rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-black rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(1)}>30</li>
                    <li className={amount === 50 ? 'text-center border border-black rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-black rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(2)}>50</li>
                    <li className={amount === 80 ? 'text-center border border-black rounded cursor-pointer w-[40%] bg-red-400' : 'text-center border border-black rounded cursor-pointer w-[40%]'} onClick={() => handleAmount(3)}>80</li>
                </ul>

                <ul className="w-[100%] m-auto flex gap-5 flex-wrap">
                    {NftBalance.map((nft, index) => {
                        if (index == 0) return;
                        return <li className="w-[30%] h-[250px] border border-black rounded flex flex-col justify-between cursor-pointer">
                            {<img src={NftBalance[1] && nft.image.image} width='256px' height='210px' />}
                            <p className="ml-2">{nft.name}</p>
                            <input type='radio' name="nftSelect" onClick={()=>handleNftSelection(nft)} />
                        </li>
                    })}
                </ul>
                <button className="text-center w-[20%] border border-black rounded m-auto" onClick={createBattle}>Create Battle</button>
                <button className="text-center w-[20%] border border-black rounded m-auto" onClick={getBattleData}>Get Battle Data</button>
            </form>
        </div>
    )
}