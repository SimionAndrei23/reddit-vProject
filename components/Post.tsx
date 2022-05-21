import React, { useEffect, useState } from 'react'
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BookmarkIcon,
    ChatAltIcon,
    DotsHorizontalIcon,
    GiftIcon,
    ShareIcon
} from '@heroicons/react/outline'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import PostBox from './PostBox'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import { GET_POST_BY_POST_ID, GET_VOTES_BY_POST_ID } from '../graphql/queries'
import { ADD_COMMENT, ADD_VOTE } from '../graphql/mutations'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
    post: Post
    comment?: boolean
    postId?: string | string[] | undefined
}


type FormData = {
     comment: string
 }

function Post ({ post, comment, postId }: Props) {

     const {
          register,
          handleSubmit,
          watch,
          setValue,
          formState: { errors }
      } = useForm<FormData>()

     const [addComment] = useMutation(ADD_COMMENT, {
          refetchQueries: [ GET_POST_BY_POST_ID, 'getPostListByPostId']
      })

     const { data } = useQuery(GET_VOTES_BY_POST_ID, {
          variables: {
               post_id: post?.id

          }
     })

     const [addVote] = useMutation(ADD_VOTE, {
          refetchQueries: [ GET_VOTES_BY_POST_ID, 'getVotesByPostId']
     })

     useEffect(() => {
          const votes: Vote[] = data?.getVotesByPostId

          // Latest vote ( as we sorted by newely created first in SQL query)
          // Note: You could improve this by moving it to the original Query

          const vote = votes?.find(vote => vote.username === session?.user?.name)?.upvote

          setVoted(vote)
     },[data])
     

     const [voted, setVoted] = useState<boolean>()

     const { data: session } = useSession();

     if(!post) 
          return (
               <div className='flex items-center justify-center min-h-screen w-full p-10 text-xl'>
                    <Jelly size={50} color="#FF4501" />
               </div>
          )
     const upVote = async (isUpVote: boolean) => {
          if(!session) {
               toast.error("You'll need to sign in to Vote!")
               return
          }

          if(voted && isUpVote) return
          if(voted === false && !isUpVote) return

          await addVote({
               variables: {
                    post_id: post.id,
                    username: session?.user?.name,
                    upvote: isUpVote,
               }
          })

          if(isUpVote) {
               toast.success('You upvoted a post!')
          } else {
               toast.success('You downvoted a post!')
          }
     }


     const displayVotes = (data: any) => {
          const votes: Vote[] = data?.getVotesByPostId
          const displayNumber = votes?.reduce((acc,vote) => (vote.upvote ? (acc += 1) : (acc -=1)),0)

          if (votes?.length === 0) return 0

          if(displayNumber === 0) {
               return votes[0]?.upvote ? 1 : -1
          }



          return displayNumber;
     }

     const onSubmit: SubmitHandler<FormData> = async (data) => {
          // Post comment
  
          const notificationToast = toast.loading('Posting your comment...')
  
          await addComment({
              variables: {
                  post_id: postId,
                  username: session?.user?.name,
                  text: data.comment,
              }
          })
  
          setValue('comment', '')
  
          toast.success('Comment Successfuly Posted!', {
              id: notificationToast,
          })
      } 

  return (
    <>
          <div className='flex rounded-md border border-gray-300 bg-white shadow-sm cursor-pointer mt-8'>
               <div className='flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400'>
                    <ArrowUpIcon onClick={() => upVote(true)} className={`voteButtons hover:text-blue-400 ${voted && 'text-blue-400'} `} />
                    <p className='text-xs font-bold text-black'>{displayVotes(data)}</p>
                    <ArrowDownIcon onClick={() => upVote(false)} className={`voteButtons hover:text-red-400 ${voted === false && 'text-red-400'} `} />
               </div>
               <Link href={`/post/${post.id}`}>
                    <main className='p-3 pb-1 w-full '>
                         <header className='flex items-center space-x-2'>
                              <Avatar seed={post.subreddit[0]?.topic} />
                              <p className='text-sm mt-1 text-gray-400'>
                                   <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                                        <span className='text-lback font-bold hover:text-blue-400 hover:underline'>r/{post.subreddit[0]?.topic.toLowerCase()}</span>
                                   </Link>
                                   - Posted by u/{post.username} - <TimeAgo date={post.created_at} />
                              </p>
                         </header>
                         <div className='py-6 mx-2'>
                              <h2 className='text-xl font-semibold'>{post.title}</h2>
                              <p className='mt-2 text-sm font-light'>{post.body}</p>
                         </div>
                         <div className='w-full bg-gray-50'>
                              <img className='w-fit mx-auto' src={post.image ? post.image : 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} alt="imagePost" />
                         </div>
                         <footer className='flex my-4  justify-between text-gray-400'>
                              <div className='postButtons'>
                                   <ChatAltIcon className='w-6 h-6' />
                                   <p className="hidden sm:inline">{post.comments.length}</p>
                              </div>
                              <div className='postButtons'>
                                   <GiftIcon className='w-6 h-6' />
                                   <p className="hidden sm:inline">Award</p>
                              </div>
                              <div className='postButtons'>
                                   <ShareIcon className='w-6 h-6' />
                                   <p className="hidden sm:inline">Share</p>
                              </div>
                              <div className='postButtons'>
                                   <BookmarkIcon className='w-6 h-6' />
                                   <p className="hidden sm:inline">Save</p>
                              </div>
                              <div className='postButtons'>
                                   <DotsHorizontalIcon className='w-6 h-6' />
                              </div>
                         </footer>
                    </main>
               </Link>
          </div>
          {comment && (
               <>
                    <div className='rounded-b-md -mt-10 pt-12 border border-t-0 border-gray-300 bg-white p-5 pl-16 cursor-pointer '>
                         <p className="text-sm mb-2">
                              Comment as <span className="text-red-500">{session?.user?.name}</span>
                         </p>

                         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                              <textarea
                                   {...register('comment')}
                                   disabled={!session}
                                   className="h-24 rounded-md border resize-none border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
                              />
                              <div className='flex items-center justify-center'>
                                   <button disabled={!session} type="submit" className="w-2/3 mx-auto bg-red-500 rounded-full p-3 mt-2 font-semibold text-white disabled:bg-gray-200">
                                        Comment
                                   </button>
                              </div>
                         </form>
                    </div>

                    <div className='rounded-b-md -my-5 border border-t-0 border-gray-300 bg-white py-5 pl-16 pr-6'>
                         <hr className='py-2' />

                         {post?.comments.map(comment => (
                              <div key={comment.id} className='flex items-center space-x-2 space-y-5'>
                                   <div className='z-50 mt-2'>
                                        <Avatar seed={comment.username} />
                                   </div>
                                   <div className='flex flex-col'>
                                        <p className='py-1 text-xs text-gray-400'>
                                             <span className="font-semibold text-gray-600">
                                                  {comment.username}
                                             </span>{' '}
                                             . <TimeAgo date={post.created_at} />
                                        </p>
                                        <p>{comment.text}</p>
                                   </div> 
                              </div>
                         ))}
                    </div>
               </>
          )}
    </>
  )
}

export default Post