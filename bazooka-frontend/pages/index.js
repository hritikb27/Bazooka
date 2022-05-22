import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router'
import { storeContext } from "./_app";
import ABI from '../utils/abi.json'

export default function Home() {
  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const router = useRouter()
  const [users, setUsers] = useState();
  const { userData, setUserData } = useContext(storeContext);

  useEffect(() => {
    // if(window.ethereum){
    //   window.ethereum.on('accountsChanged',async()=>{
    //     await logout();
    //     router.push('/');
    //   })
    // }

    async function web3(){
      await Moralis.enableWeb3();
    }

    web3();

    // run();
  }, []);

  // useEffect(() => {
   
  //   if (isAuthenticated) {
  //     // async function web3enable() {
  //     //   await Moralis.enableWeb3();
  //     // }
  //     // web3enable();
  //     console.log(user)
  //     if (user) {
  //       if (!(users && users.includes(user))) {
  //         console.log(users)
          
  //       } else {
  //         // router.push('/createProfile')
  //       }
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated]);

  const login = async () => {
    console.log(user)
    if (!isAuthenticated) {
      await Moralis.authenticate();
      // .catch(function (error) {
      //   console.log(error);
      // });
    }
  }

  const handleLogin = ()=> {
    async function getUserData() {
      const options = {
        contractAddress: process.env.contractAddress,
        functionName: "getUsersList",
        abi: ABI,
      }

      const data = await Moralis.executeFunction(options)
      console.log(data)
      console.log(data.includes(user.attributes.ethAddress))
      data.map(add=>{
        console.log(user.attributes.ethAddress)
        if(add.toLowerCase()==user.attributes.ethAddress.toLowerCase()){
          async function userData(){
            const options = {
              contractAddress: process.env.contractAddress,
              functionName: "getUserData",
              abi: ABI,
            }
            const data = await Moralis.executeFunction(options)
            setUserData(data)
          }
          userData();
          router.push('/createbattle')
        }
        else router.push('/createProfile');
      })
    }
    getUserData();
  }

  return (
    <div className="flex flex-col justify-center">
      <button onClick={login} className="text-white">Connect Wallet</button>
      {isAuthenticated && <button onClick={handleLogin} className="text-white block">Login</button>}
    </div>
  )
}
