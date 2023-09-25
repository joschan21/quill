import { cn } from '@/lib/utils'
import { ExtendedMessage } from '@/types/message'
import { Icons } from '../Icons'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { forwardRef } from 'react'

interface MessageProps {
  message: ExtendedMessage
  isNextMessageSamePerson: boolean
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-end', {
          'justify-end': message.isUserMessage,
        })}>
        <div
          className={cn(
            'relative flex h-6 w-6 aspect-square items-center justify-center',
            {
              'order-2 bg-blue-600 rounded-sm':
                message.isUserMessage,
              'order-1 bg-zinc-800 rounded-sm':
                !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}>
          {message.isUserMessage ? (
            <Icons.user className='fill-zinc-200 text-zinc-200 h-3/4 w-3/4' />
          ) : (
            <Icons.logo className='fill-zinc-300 h-3/4 w-3/4' />
          )}
        </div>

        <div
          className={cn(
            'flex flex-col space-y-2 text-base max-w-md mx-2',
            {
              'order-1 items-end': message.isUserMessage,
              'order-2 items-start': !message.isUserMessage,
            }
          )}>
          <div
            className={cn(
              'px-4 py-2 rounded-lg inline-block',
              {
                'bg-blue-600 text-white':
                  message.isUserMessage,
                'bg-gray-200 text-gray-900':
                  !message.isUserMessage,
                'rounded-br-none':
                  !isNextMessageSamePerson &&
                  message.isUserMessage,
                'rounded-bl-none':
                  !isNextMessageSamePerson &&
                  !message.isUserMessage,
              }
            )}>
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                className={cn('prose', {
                  'text-zinc-50': message.isUserMessage,
                })}>
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== 'loading-message' ? (
              <div
                className={cn(
                  'text-xs select-none mt-2 w-full text-right',
                  {
                    'text-zinc-500': !message.isUserMessage,
                    'text-blue-300': message.isUserMessage,
                  }
                )}>
                {format(
                  new Date(message.createdAt),
                  'HH:mm'
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

Message.displayName = 'Message'

export default Message
