import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import { useMutation } from '@apollo/client'
import client from '../apollo-client'
import toast from 'react-hot-toast'

interface FormData {
  postTitle: string,
  postBody: string,
  postImage: string,
  subreddit: string
}

type Props = {
  subreddit?: string
  input?: boolean
}

const PostBox = ({ subreddit, input }: Props) => {

    const { data: session } = useSession()

    const [addPost] = useMutation(ADD_POST, {
      refetchQueries: [GET_ALL_POSTS, 'getPostList']
    })
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)
    
    const [imageBoxOpen, setImageBoxOpen] = useState(false);

    const {
      register,
      setValue,
      handleSubmit,
      watch,
      formState: { errors }
    } = useForm<FormData>()

    const onSubmit = handleSubmit( async (formData) => {

      const notification = toast.loading('Creating new post...')
      
      try {

        // Query for the subbredit topic...
        // We are destructuring the data from the query 2 times 
        const { data: {  getSubredditListByTopic } } = await client.query({
          query: GET_SUBREDDIT_BY_TOPIC,
          variables: {
            topic: subreddit?.toLowerCase() || formData.subreddit.toLowerCase()
          }
        })

        const subredditExists =  getSubredditListByTopic.length > 0

        if (!subredditExists) {
         // Create the subbredit...
          console.log('Subreddit is new!')

          // Adding the subbredit row to the database...
          // First, we are desctructuring the main object "data" that comes back from the mutation
          // Second, we are also desctructuring the "addSubreddit" object that comes back from the mutation
          // "addSubreddit" is the name of the query define in the .graphql file
          // For the last part we are naming the insertSubredit with the newSubreddit for grasping it better
          const { data: { insertSubreddit: newSubreddit }} = await addSubreddit({
            variables: {
              topic: formData.subreddit.toLowerCase()
            }
          })

          console.log('Creating post...')

          // We are handling the image input field, in case there is no image, we are setting it to empty string, so it doesn't freak out

          const image = formData.postImage || ""

          // Adding the post row to the database

          const { data: { insertPost: newPost }} = await addPost({
            variables: {
              body: formData.postBody,
              image: image,
              subreddit_id: newSubreddit.id,
              title: formData.postTitle,
              username: session?.user?.name
            }
          })

          console.log('New post added!', newPost)

        } else {
          // Use the existing subbredit...

          console.log('Using existing subreddit!')
          console.log( getSubredditListByTopic)

          const image = formData.postImage || ""

          const {data: { insertPost: newPost } } = await addPost({
            variables: {
              body: formData.postBody,
              image: image,
              subreddit_id: getSubredditListByTopic[0].id,
              title: formData.postTitle,
              username: session?.user?.name
            }
          })

          console.log('New post added', newPost);
        }

        // After the post has been added!
        // Clear up all the input fields!

        setValue('postBody', '')
        setValue('postImage', '')
        setValue('postTitle', '')
        setValue('subreddit', '')

        toast.success('Post created!', {
          id: notification
        })
      } catch(err) {
        toast.error('Something went wrong!', {
          id: notification
        })
        console.log(err);
      }

    })

  return (
    <form onSubmit={onSubmit} className='sticky top-16 mt-8 z-50 p-2 rounded-md border border-gray-300 bg-white'> 
        <div className='flex items-center space-x-3'>
            <Avatar />
            <input
            {...register('postTitle', { required: true })}
              type="text"
              disabled={!session}
              className='flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none'
              placeholder={session ? subreddit ? `Create a post in r/${subreddit}` :  'Create a post by entering a title!' : 'Sign in to post'}
            />

            <PhotographIcon onClick={() => setImageBoxOpen(!imageBoxOpen)} className={`h-6 cursor-pointer text-gray-300 ${imageBoxOpen && 'text-blue-300'}`} />
            <LinkIcon className='h-6 text-gray-300' />
        </div>
        {!!watch('postTitle') && (
          <div className='flex flex-col py-2'>
            <div className='flex items-center px-2'>
              <p className={`${input ? 'w-fit' : 'min-w-[90px]'}`}>Body:</p>
              <input
                className='flex-1 m-2 bg-blue-50 p-2 outline-none'
                type="text"
                {...register('postBody')}
                placeholder="Text (optional)"
              />
            </div>
            {!subreddit && (
              <div className='flex items-center px-2'>
                <p className='min-w-[90px]'>Subreddit:</p>
                <input
                  className='flex-1 m-2 bg-blue-50 p-2 outline-none'
                  type="text"
                  {...register('subreddit', { required: true })}
                  placeholder="Text (optional)"
                />
              </div>
            )}
            {imageBoxOpen && (
              <div className='flex items-center px-2'>
                <p className='min-w-[90px]'>Image URL:</p>
                <input
                  className='flex-1 m-2 bg-blue-50 p-2 outline-none'
                  {...register('postImage')}
                  type="text"
                  placeholder="Optional..."
                />
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <div className='space-y-2 p-2 text-red-500'>
                <p>Subreddit field is required!</p>
              </div>
            )}

            {!!watch('postTitle') && (
              <button
                disabled={!session}
                type="submit"
                className='mt-2 w-2/3 mx-auto rounded-full text-white bg-blue-400 p-2'
              >
                Create Post
              </button>
            )}
          </div>
        )}
    </form>
  )
}

export default PostBox