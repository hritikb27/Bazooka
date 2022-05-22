import { useEffect, useState, useContext } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import ABI from '../utils/abi.json'

export default function addNFTs() {
    const [nftName, setNftName] = useState(undefined);
    const [nftImage, setNftImage] = useState(undefined);
    const [nftAddress, setNftAddress] = useState(undefined);
    const { Moralis } = useMoralis();
    
    async function addNFT(e){
        e.preventDefault()
        const options = {
            contractAddress: process.env.contractAddress,
            functionName: "addNFTS",
            abi: ABI,
            params: {
                name: nftName,
                image: nftImage,
                nftAddress: nftAddress,

            }
        }
        await Moralis.executeFunction(options);
    }

    async function runVRF(){
        const options = {
            contractAddress: process.env.contractAddress,
            functionName: "requestRandomWords",
            abi: ABI,
        }
        await Moralis.executeFunction(options);
    }

    return(
        <>
         <div className="md:col-span-2 w-[40%] h-[800px] m-auto">
            <form action="#" method="POST" className="pt-20 h-full">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-black/30 sm:p-6">
                  <div className="flex flex-col gap-6">
                    <div className="col-span-6 sm:col-span-3 text-white">
                      <label htmlFor="first-name" className="block text-sm font-medium">
                        NFT name
                      </label>
                      <input
                        type="text"
                        name="user-name"
                        id="user-name"
                        autoComplete="given-name"
                        className="mt-1 h-[25px] block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl text-black px-2"
                        value={nftName}
                        onChange={(e)=>setNftName(e.target.value)}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 text-white">
                      <label htmlFor="last-name" className="block text-sm font-medium">
                        NFT Image Url
                      </label>
                      <input
                        type="text"
                        name="avatar-url"
                        id="avatar-url"
                        className="mt-1 h-[25px] block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl text-black px-2"
                        value={nftImage}
                        onChange={(e)=>setNftImage(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3 text-white">
                      <label htmlFor="last-name" className="block text-sm font-medium">
                        NFT Address
                      </label>
                      <input
                        type="text"
                        name="avatar-url"
                        id="avatar-url"
                        className="mt-1 h-[25px] block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl text-black px-2"
                        value={nftAddress}
                        onChange={(e)=>setNftAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-center sm:px-6 bg-black/30">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={addNFT}
                  >
                    Add NFT
                  </button>
                </div>
              </div>
            </form>
            <button onClick={runVRF}>Run VRF</button>
          </div>
        </>
    )
}