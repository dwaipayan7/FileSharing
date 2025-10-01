import { useChunkStore } from '../db/chunkStorage';

export const receiveFileAck = async (
  data: any,
  socket: any,
  setReceivedFiles: any,
) => {};

export const sendChunkAck = async (
  chunkIndex: any,
  socket: any,
  setTotalSentBytes: any,
  setSentFiles: any,
) => {};

export const receiveChunkAck = async(
    chunk: any,
    chunkNo: any,
    socket: any,
    setTotalReceivedBytes: any,
    generateFile: any
) => {
    
}