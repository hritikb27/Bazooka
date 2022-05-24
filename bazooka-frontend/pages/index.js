import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router'
import { storeContext } from "./_app";
import ABI from '../utils/abi.json'
import { motion } from 'framer-motion';

export default function Home() {
  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const router = useRouter()
  const [users, setUsers] = useState();
  const { userData, setUserData } = useContext(storeContext);

  const line1 = "Presenting to you...";
  const line2 = "Bazooka Battles!";

  const sentence = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.8,
        staggerChildren: 0.08,
      },
    },
  }
  const letter = {
    hidden: { opacity: 0, },
    visible: {
      opacity: 1,
      y: 0,
    },
  }
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
      if(data.length<1)router.push('createProfile')
      else data.map(add=>{
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
    <div className="flex flex-col justify-center w-full h-full flex justify-center">
      <button onClick={login} className="text-white">Connect Wallet</button>
      {isAuthenticated && <button onClick={handleLogin} className="text-white block">Login</button>}
      <motion.h1 style={{backdropFilter:'blur(15px)'}} className='load-screen--message text-white text-center m-auto mt-80 tracking-widest rounded bg-purple-600/60 pt-2 h-[100px] w-[30%] text-4xl font-bold' variants={sentence} initial="hidden" animate="visible">
        {line1.split("").map((char,index)=>{
          return (
            <motion.span key={char + "-" + index} variants={letter} className="">
              {char}
            </motion.span>
          )
        })}
        <br/>
        {line2.split("").map((char,index)=>{
          return (
            <motion.span key={char + "-" + index} variants={letter}>
              {char}
            </motion.span>
          )
        })}
      </motion.h1>
    </div>
  )
}
