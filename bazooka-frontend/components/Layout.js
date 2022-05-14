import Link from 'next/link'
import { useRouter } from 'next/router';
import { useMoralis } from "react-moralis";

export default function Layout({children}) {
    const { logout } = useMoralis();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        console.log("logged out");
        router.push('/')
    }

    return (
        <div id='layout' className="flex w-full h-screen justify-between">
            <aside className="h-full bg-red-400 w-[20%] flex flex-col justify-between top-0 fixed">
                <ul className="mt-[10rem] font-semibold text-xl">
                    <Link href="/createbattle"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Create a Battle</li></Link>
                    <Link href="/InitializedBattles"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Initialized Battles</li></Link>
                    <Link href="/browseBattles"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Browse Battles</li></Link>
                    <li></li>
                </ul>
                <button className='mb-2 rounded-md w-[60%] mx-auto h-10 bg-red-300' onClick={handleLogout}>Logout</button>
            </aside>
            <div className="flex flex-col w-full ml-[20%] h-full mx-auto">
                <header className="w-full h-[10%] bg-red-500 top-0 fixed">

                </header>
                <div className='w-full mx-auto mt-[10%]'>{children}</div>
            </div>
        </div>
    )
}