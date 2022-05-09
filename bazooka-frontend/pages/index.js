import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralis } from "react-moralis";
import { useEffect } from 'react';
import Router from 'next/router'

export default function Home() {
  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

  useEffect(()=>{
      if(window.ethereum){
        window.ethereum.on('accountsChanged',async()=>{
          await logout();
          Router.push('/');
        })
      }
  },[]);

  useEffect(() => {
    if (isAuthenticated) {
      async function web3enable(){
        await Moralis.enableWeb3();
      }
      web3enable();
      Router.push('/createbattle')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = async () => {
    if (!isAuthenticated) {
      const user = await Moralis.authenticate();
      if(user){
        Moralis.enableWeb3();
        console.log(user.get('ethAddress'))
        Router.push('/createbattle')
      }
        // .catch(function (error) {
        //   console.log(error);
        // });
    }
  }

  const logOut = async () => {
    await logout();
    console.log("logged out");
  }

  return (
    <div className="flex justify-center">
      <button onClick={login}>Connect Wallet</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
