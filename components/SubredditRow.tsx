import React from 'react'
import { ChevronUpIcon } from '@heroicons/react/outline'
import Avatar from './Avatar'
import Link from 'next/link'

interface Props {
    topic: string
    index: number
}

const SubredditRow = ({ topic, index }: Props) => {
  return (
    <div className='flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b'>
        <p>{index + 1}</p>
        <ChevronUpIcon className='w-4 h-4 flex-shrink-0 text-green-300' />
        <Avatar seed={`/subreddit/${topic}`} />
        <p className='flex-1 truncate'>r/{topic}</p>
        <Link href={`/subreddit/${topic}`}>
            <span className='rounded-full bg-blue-500 px-3 py-1 text-sm text-white cursor-pointer'>View</span>
        </Link>
    </div>
  )
}

export default SubredditRow