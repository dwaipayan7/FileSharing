import { Alert } from 'react-native';
import { useChunkStore } from '../db/chunkStorage';
import { produce } from 'immer';
import { Buffer } from 'buffer';

export const receiveFileAck = async (
  data: any,
  socket: any,
  setReceivedFiles: any,
) => {
  const { setChunkStore, chunkStore } = useChunkStore.getState();

  if (chunkStore) {
    Alert.alert('There are files which need to be received !');
    return;
  }

  setReceivedFiles((prevData: any) =>
    produce(prevData, (draft: any) => {
      draft.push(data);
    }),
  );

  setChunkStore({
    id: data?.id,
    totalChunks: data?.totalChunks,
    name: data?.name,
    size: data?.size,
    mimeType: data?.mimeType,
    chunkArray: [],
  });

  if (!socket) {
    console.log('Socket not available');
    return;
  }

  try {
    await new Promise((resolve: any) => setTimeout(resolve, 10));
    console.log('File Received');
    socket.write(JSON.stringify({ event: 'send_chunk_ack', chunkNo: 0 }));
    console.log('REQUEST FOR FIRST CHUNK');
  } catch (error) {
    console.log('Error sending file', error);
  }
};

export const sendChunkAck = async (
  chunkIndex: any,
  socket: any,
  setTotalSentBytes: any,
  setSentFiles: any,
) => {
  const { currentChunkSet, resetCurrentChunkSet } = useChunkStore.getState();

  if (!currentChunkSet) {
    Alert.alert('No Chunk Sent!');
    return;
  }

  if (!socket) {
    console.log('Socket not available');
    return;
  }

  const totalChunks = currentChunkSet?.totalChunks;

  try {
    await new Promise((resolve: any) => setTimeout(resolve, 10));
    socket.write(
      JSON.stringify({
        event: 'receive_chunk_ack',
        chunk: currentChunkSet?.chunkArray[chunkIndex].toString('base64'),
        chunkNo: chunkIndex,
      }),
    );

    setTotalSentBytes(
      (prev: number) => prev + currentChunkSet.chunkArray[chunkIndex]?.length,
    );

    if (chunkIndex + 2 > totalChunks) {
      console.log('All chunks sent successfully');
      setSentFiles((prevFiles: any) => {
        produce(prevFiles, (draftFiles: any) => {
          const fileIndex = draftFiles?.findIndex(
            (f: any) => f.id === currentChunkSet.id,
          );
          if (fileIndex !== -1) {
            draftFiles[fileIndex].available = true;
          }
        });
      });
      resetCurrentChunkSet();
    }
  } catch (error) {
    console.log('Error sending file', error);
  }
};

export const receiveChunkAck = async (
  chunk: any,
  chunkNo: any,
  socket: any,
  setTotalReceivedBytes: any,
  generateFile: any,
) => {
  const { chunkStore, resetChunkStore, setChunkStore } =
    useChunkStore.getState();

  if (!chunkStore) {
    console.log('Chunk Store is null');
    return;
  }

  try {
    const bufferChunk = Buffer.from(chunk, 'base64');
    const updatedChunkArray = [...(chunkStore.chunkArray || [])];
    updatedChunkArray[chunkNo] = bufferChunk;

    setChunkStore({
      ...chunkStore,
      chunkArray: updatedChunkArray,
    });

    setTotalReceivedBytes(
      (prevValue: number) => prevValue + bufferChunk.length,
    );
  } catch (error) {
    console.log('Error updating chunk', error);
  }

  if (!socket) {
    console.log('Socket not available');
    return;
  }

  if (chunkNo + 1 === chunkStore?.totalChunks) {
    console.log('All chunks received');
    generateFile();
    resetChunkStore();
    return;
  }

  try {
    await new Promise((resolve: any) => setTimeout(resolve, 10));
    console.log('Requested for the next chunk ', chunkNo + 1);
    socket.write(
      JSON.stringify({ event: 'send_chunk_ack', chunkNo: chunkNo + 1 }),
    );
  } catch (error) {
    console.log('Error sending file: ', error);
  }
};
