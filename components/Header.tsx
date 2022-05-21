import React from 'react'
import Image from 'next/image'
import { ChevronDownIcon, HomeIcon, MenuIcon, SearchIcon } from '@heroicons/react/solid'
import { BellIcon, ChatIcon, GlobeIcon, PlusIcon, SparklesIcon, SpeakerphoneIcon, VideoCameraIcon } from '@heroicons/react/outline'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { GET_POST_BY_POST_ID } from '../graphql/queries'

const Header = () => {

    const { data: session } = useSession();
    
    return (
        <div className='sticky top-0 z-50 flex shadow-sm bg-white px-4 py-2'>
            <div className='relative h-10 w-20 flex-shink-0 cursor-pointer'>
                <Link href="/">
                    <Image src="https://links.papareact.com/fqy" layout="fill" objectFit="contain" />
                </Link>
            </div>
            <div className='flex items-center mx-7 xl:min-w-[300px]'>
                <HomeIcon className='w-5 h-5' />
                <p className='hidden ml-2 flex-1 lg:inline'>Home</p>
                <ChevronDownIcon className='w-5 h-5' />
            </div>
            <form className='flex flex-1 items-center space-x-2 border rounded-sm border-gray-200 bg-gray-100 px-3 py-1'>
                <SearchIcon className='h-6 w-6 text-gray-400' />
                <input 
                    className='flex-1 bg-transparent outline-none'
                    type='text'
                    placeholder='Search Reddit' 
                />
                <button type='submit' hidden />
            </form>
            <div className='hidden items-center mx-5 space-x-2 text-gray-500 lg:inline-flex'>
                <SparklesIcon className='icon' />
                <GlobeIcon className='icon' />
                <VideoCameraIcon className='icon' />
                <hr className='h-10 border border-gray-100' />
                <ChatIcon className='icon' />
                <BellIcon className='icon' />
                <PlusIcon className='icon' />
                <SpeakerphoneIcon className='icon' />
            </div>
            <div className='flex items-center ml-5 lg:hidden'>
                <MenuIcon className='icon' />
            </div>
           {session ? (
                <div onClick={() => signOut()} className='hidden items-center space-x-2 border border-gray-100 p-2 lg:inline-flex cursor-pointer'>
                    <div className='relative h-5 w-5 flex-shrink-0'>
                        <Image
                            src="https://links.papareact.com/23l"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <div className='flex-1 text-xs'>
                        <p className='truncate'>{session?.user?.name}</p>
                    </div>

                    <ChevronDownIcon className='flex-shrink-0 h-5 text-gray-400' />
                </div>
           ) : (
            <div onClick={() => signIn('google')} className='hidden items-center space-x-2 border border-gray-100 p-2 lg:flex cursor-pointer'>
                <div className='relative h-5 w-5 flex-shrink-0'>
                    <Image
                        src="https://links.papareact.com/23l"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <p className='text-gray-400 font-medium'>Sign In</p>
            </div>
           )}
        </div>
    )
}

export default Header