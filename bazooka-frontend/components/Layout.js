export default function Layout({children}) {
    return (
        <div className="flex w-full h-screen">
            <aside className="h-full bg-red-400 w-[20%]">

            </aside>
            <div className="flex flex-col w-full h-full">
                <header className="w-full h-[10%] bg-red-500">

                </header>
                {children}
            </div>
        </div>
    )
}