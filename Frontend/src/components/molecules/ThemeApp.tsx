export interface ThemeAppProps {
    variant: "light" | "dark"
}

export function ThemeApp({ variant }: ThemeAppProps) {
    if (variant === "light") {
        return (
            <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full'>
                <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                    <div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
                        <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                    </div>
                </div>
            </div>
        )
    } else if (variant === "dark") {
        return (
            <div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground w-full'>
                <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                    <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                        <div className='h-2 w-[80px] rounded-lg bg-slate-400' />
                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-slate-400' />
                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-slate-400' />
                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                    </div>
                </div>
            </div>
        )
    }
}

export default ThemeApp
