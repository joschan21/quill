import { db } from '@/db';
import { openai } from '@/lib/openai';
import { getPineconeClient } from '@/lib/pinecone';
import { sendMessageValidator } from '@/lib/sendMessageValidator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { NextRequest } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const { id: userId } = user;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { fileId, message } = sendMessageValidator.parse(body);
  const file = await db.file.findFirst({ where: { id: fileId, userId } });

  if (!file) {
    return new Response('Not found', { status: 404 });
  }

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  })

  // 1: Vectorize message
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

  // Initialize the Pinecone vector store
  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index('quill'); // Use a single index name

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex }); 

  // console.log(vectorStore)

  try {
    // Search for similar messages using the file ID as context
    const results = await vectorStore.similaritySearch(message, 4);
    const prevMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: 'asc' },
      take: 6,
    });
    const formattedPrevMessages = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? 'user' : 'assistant',
      content: msg.text,
    }));
    
    // Construct a context string with previous conversation, results, and user input
    const context = `PREVIOUS CONVERSATION:${formattedPrevMessages.map((msg) => {
      if (msg.role === 'user') return `User:${msg.content}\n`;
      return `Assistant:${msg.content}\n`;
    })}CONTEXT:${results.map((r) => r.pageContent).join('\n\n')}USER INPUT:${message}`;

    console.log(context)

    // Use a system message to instruct the model
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7, // Adjust the temperature as needed
      stream: true,
      messages: [
        {
          role: 'system',
          content: 'You have access to a PDF document. Please use the information from the document to answer the user\'s question.',
        },
        {
          role: 'user',
          content: context, // Provide the context here
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error searching for similar messages:', error);
    return new Response('InternalServerError', { status: 500 });
  }
};
