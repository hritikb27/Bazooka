import { useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useRouter } from 'next/router'
import ABI from '../utils/abi.json'

export default function createProfile() {
    const { Moralis } = useMoralis();
    const [userName, setUserName] = useState(undefined);
    const [avatar, setAvatar] = useState(undefined);
    const router = useRouter()
    const contractProcessor = useWeb3ExecuteFunction();

    useEffect(()=>{
        Moralis.enableWeb3();
        

    // if(window.ethereum){
    //   window.ethereum.on('accountsChanged',async()=>{
    //     await logout();
    //     router.push('/');
    //   })
    // }
    },[])

    async function createUser(e){
        e.preventDefault();
        console.log(process.env.contractAddress)
        const options = {
            chain: 'matic testnet',
            contractAddress: process.env.contractAddress,
            functionName: "addUser",
            abi: ABI,
            params: {
                name: userName,
                avatar: avatar
            }
        }

        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait();
        console.log('User created: ', receipt);
        router.push('/createbattle')

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
                        User name
                      </label>
                      <input
                        type="text"
                        name="user-name"
                        id="user-name"
                        autoComplete="given-name"
                        className="mt-1 h-[25px] block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl text-black px-2"
                        value={userName}
                        onChange={(e)=>setUserName(e.target.value)}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 text-white">
                      <label htmlFor="last-name" className="block text-sm font-medium">
                        Avatar Url (optional)
                      </label>
                      <input
                        type="text"
                        name="avatar-url"
                        id="avatar-url"
                        className="mt-1 h-[25px] block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl text-black px-2"
                        value={avatar}
                        onChange={(e)=>setAvatar(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-center sm:px-6 bg-black/30">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={createUser}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        
        </>
    )
}