import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post'
import { GET_POST_BY_POST_ID, GET_VOTES_BY_POST_ID } from '../../graphql/queries'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ADD_COMMENT } from '../../graphql/mutations'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import TimeAgo from 'react-timeago'

type FormData = {
    comment: string
}

const PostPage = () => {

    const { data: session } = useSession()

    const { query: { postId }} = useRouter()


    const { data } = useQuery(GET_POST_BY_POST_ID, {
        variables: {
            post_id: postId
        }
    })

    console.log(postId);

    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [ GET_POST_BY_POST_ID, 'getPostListByPostId']
    })

    const post: Post = data?.getPostListByPostId


    // const onSubmit: SubmitHandler<FormData> = async (data) => {
    //     // Post comment

    //     const notificationToast = toast.loading('Posting your comment...')

    //     await addComment({
    //         variables: {
    //             post_id: postId,
    //             username: session?.user?.name,
    //             text: data.comment,
    //         }
    //     })

    //     setValue('comment', '')

    //     toast.success('Comment Successfuly Posted!', {
    //         id: notificationToast,
    //     })
    // } 

  return (
    <div className="min-h-screen max-w-5xl mx-auto">
        <Post post={post} comment postId={postId} />

        {/* <div className='rounded-b-md -mt-10 pt-12 border border-t-0 border-gray-300 bg-white p-5 pl-16 cursor-pointer '>
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
        </div> */}
    </div>
  )
}

export default PostPage