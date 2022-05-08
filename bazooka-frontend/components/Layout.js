import Link from 'next/link'

export default function Layout({children}) {
    return (
        <div className="flex w-full h-screen">
            <aside className="h-full bg-red-400 w-[20%]">
                <ul className="mt-[10rem] font-semibold text-xl">
                    <Link href="/createbattle"><li className="border-y border-black w-[100%] p-[1rem] cursor-pointer">Create a Battle</li></Link>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </aside>
            <div className="flex flex-col w-full h-full">
                <header className="w-full h-[10%] bg-red-500">

                </header>
                {children}
            </div>
        </div>
    )
}