// @ts-ignore
import { CryptoUtils } from 'loom-js'
import {
  SignedTx,
  NonceTx,
  Transaction,
  MessageTx,
  CallTx,
  Request,
  ContractMethodCall,
} from 'loom-js/dist/proto/loom_pb'
// import { MapEntry } from '@/pbs/phaser/setscore_pb'
import * as Decoder from '@/pbs/protoc';

export enum TxKind {
  CreateAccount = 'createAccount',
  PostComment = 'post',
  AcceptAnswer = 'acceptAnswer',
  Vote = 'vote',
  Nonce = 'nonce',
  Common = 'common'
}

export interface ISigned {
  sig: Uint8Array
  pubkey: Uint8Array
}

export interface IOneSigTx {
  tx: IDecodedTx
  signed: ISigned
}

export interface IDecodedTx {
  method: string
  arrData: Array<any>
}

export interface IActor {
  chainId: string
  app: string
  address: Buffer
}

export interface ICreateAccountTx {
  txKind: TxKind.CreateAccount
  owner: IActor
  username: string
  // fields below are only available in v2
  email?: string
  name?: string
  image?: string
}

export enum CommentKind {
  Question = 'question',
  Answer = 'answer',
  Comment = 'comment'
}

export interface IPostCommentTx {
  txKind: TxKind.PostComment
  kind: CommentKind
  parent_permalink: string
  permalink: string
  author: string
  title: string
  body: string
  tags: string[]
}

export interface IUpdateCommentTx {
  txKind: TxKind.PostComment
  kind: CommentKind
  parent_permalink: string
  permalink: string
  author: string
  title: string
  body: string
  tags: string[]
}

export interface IAcceptAnswerTx {
  txKind: TxKind.AcceptAnswer
  answer_permalink: string
  acceptor: string
}

export interface IVoteTx {
  txKind: TxKind.Vote
  comment_permalink: string
  voter: string
  up: boolean
}

export interface INonceTx {
  txKind: TxKind.Nonce
  sequence: number
  signers: Array<IActor>
  tx: IDecodedTx
}

// export type DelegateCallTx =
//   | ICreateAccountTx
//   | IPostCommentTx
//   | IUpdateCommentTx
//   | IAcceptAnswerTx
//   | IVoteTx
//   | IDecodedTx

enum TxFieldKind {
  String = 'string',
  UInt8 = 'uint8',
  UInt32 = 'uint32'
}

interface ITxField {
  name: string
  kind: TxFieldKind
}

class InvalidTxVersionError extends Error {}

class UnsupportedTxTypeError extends Error {}

export function extractTxDataFromStr(base64Str: string): IOneSigTx {
  // const buf = new Buffer(base64Str, 'base64')
  // // version info isn't stored in txs so may have to make multiple attempts to decode tx types whose
  // // structure evolved over time
  // let attempt = 0
  // let lastError: Error | null = null
  // while (attempt < 10) {
  //
  //   const txType = r.readUint8()
  //   if (txType !== 0x16) {
  //     throw new Error('Invalid OneSigTx')
  //   }
  //   const wrappedTxType = r.readUint8()
  //
  //   try {
  //     const payload = readTxPayload(r, wrappedTxType, attempt++)
  //     const sig = readTxSignature(r)
  //     return { tx: payload, signed: sig }
  //   } catch (e) {
  //     if (e instanceof InvalidTxVersionError) {
  //       throw lastError
  //     } else {
  //       lastError = e
  //     }
  //   }
  // }
  // throw lastError
  const pbBuf = CryptoUtils.bufferToProtobufBytes(CryptoUtils.B64ToUint8Array(base64Str))
  const sig = readTxSignature(pbBuf)
  const payload = readTxPayload(pbBuf)
  return { tx: payload, signed: sig }
}

function readTxPayload(i: Uint8Array): IDecodedTx {
  const deSignedTx = SignedTx.deserializeBinary(i)
  console.log(deSignedTx.toObject())
  const deNonceTx = NonceTx.deserializeBinary(deSignedTx.toArray()[0])
  console.log(deNonceTx.toObject())
  const deTransaction = Transaction.deserializeBinary(deNonceTx.toArray()[0])
  console.log(deTransaction.toObject())
  const deMessageTx = MessageTx.deserializeBinary(deTransaction.toArray()[1])
  console.log(deMessageTx.toObject())
  const deCallTx = CallTx.deserializeBinary(deMessageTx.toArray()[2])
  console.log(deCallTx.toObject())
  const deRequest = Request.deserializeBinary(deCallTx.toArray()[1])
  console.log(deRequest.toObject())
  const deContractMethodCall = ContractMethodCall.deserializeBinary(deRequest.toArray()[2])
  console.log(deContractMethodCall.toObject())
  // const phaserTx = MapEntry.deserializeBinary(deContractMethodCall.toArray()[1]).array.toString();
  // return phaserTx;
  let txArrData = readProtoData(deContractMethodCall)
  return txArrData
}

function readProtoData(cmc: ContractMethodCall): IDecodedTx {
  const methodName = cmc.toObject().method
  const txData = MapEntry.deserializeBinary(cmc.toArray()[1])
  const txStringArrData = txData.toArray()
  return { method: methodName, arrData: txStringArrData }
}

// @param attempt Indicates which tx version the function should attempt to read, zero corresponds
//                to the latest version, one corresponds to the second to second to last version, etc.
//                The function will throw InvalidTxVersionError if this parameter exceeds the number
//                of available tx versions.
// function readTxPayload(r: Reader, txType: number, attempt: number): DelegateCallTx | INonceTx {
//   switch (txType) {
//     case 0x40:
//       return readCreateAccountTxPayload(r, attempt)
//     case 0x41:
//     case 0x44:
//       return readPostCommentTxPayload(r, attempt)
//     case 0x42:
//       return readAcceptAnswerTxPayload(r, attempt)
//     case 0x43:
//       return readVoteTxPayload(r, attempt)
//     case 0x69:
//       return readNonceTxPayload(r, attempt)
//   }
//   throw new UnsupportedTxTypeError(txType.toString(16))
// }

// function readCreateAccountTxPayload(r: Reader, attempt: number): ICreateAccountTx {
//   const versions = txVersions[TxKind.CreateAccount]
//   if (!versions || attempt >= versions.length) {
//     throw new InvalidTxVersionError()
//   }
//   const fieldDefs = versions[attempt]
//   const fields = readFields(r, fieldDefs)
//   return { txKind: TxKind.CreateAccount, ...(fields as any) }
// }
//
// function readPostCommentTxPayload(r: Reader, attempt: number): IPostCommentTx {
//   if (attempt !== 0) {
//     throw new InvalidTxVersionError()
//   }
//   // In Go the inner field is of type TxInner (from Cosmos SDK), in JS though DelegateCall seems to
//   // leave it undefined so it gets serialized as a zero byte, so just read & discard for now.
//   const inner = r.readUint8()
//   const kind = r.readString() as CommentKind
//   // tslint:disable-next-line:variable-name
//   const parent_permalink = r.readString()
//   const permalink = r.readString()
//   const author = r.readString()
//   const title = r.readString()
//   const body = r.readString()
//   const tagCount = r.readUvarint()
//   const tags: string[] = []
//   for (let i = 0; i < tagCount; i++) {
//     tags.push(r.readString())
//   }
//   return {
//     txKind: TxKind.PostComment,
//     kind,
//     parent_permalink,
//     permalink,
//     author,
//     title,
//     body,
//     tags
//   }
// }
//
// // TODO: test this, haven't seen any transactions of this kind yet
// function readAcceptAnswerTxPayload(r: Reader, attempt: number): IAcceptAnswerTx {
//   if (attempt !== 0) {
//     throw new InvalidTxVersionError()
//   }
//   const inner = r.readUint8()
//   // tslint:disable-next-line:variable-name
//   const answer_permalink = r.readString()
//   const acceptor = r.readString()
//   return { txKind: TxKind.AcceptAnswer, answer_permalink, acceptor }
// }
//
// function readVoteTxPayload(r: Reader, attempt: number): IVoteTx {
//   if (attempt !== 0) {
//     throw new InvalidTxVersionError()
//   }
//   const inner = r.readUint8()
//   // tslint:disable-next-line:variable-name
//   const comment_permalink = r.readString()
//   const voter = r.readString()
//   const up = r.readUint8() !== 0
//   return { txKind: TxKind.Vote, comment_permalink, voter, up }
// }
//
// function readNonceTxPayload(r: Reader, attempt: number): INonceTx {
//   const txKind = TxKind.Nonce
//   const sequence = r.readUint32()
//   const numSigners = r.readUvarint()
//   const signers: IActor[] = []
//   for (let i = 0; i < numSigners; i++) {
//     signers.push(readActor(r))
//   }
//   const wrappedTxType = r.readUint8()
//   return {
//     txKind,
//     sequence,
//     signers,
//     tx: readTxPayload(r, wrappedTxType, attempt) as DelegateCallTx
//   }
// }
//
// function readActor(r: Reader): IActor {
//   const chainId = r.readString()
//   const app = r.readString()
//   const address = readBuffer(r)
//   return { chainId, app, address }
// }
//
// function readBuffer(r: Reader): Buffer {
//   const byteCount = r.readUvarint()
//   const buf = new Buffer(byteCount)
//   for (let i = 0; i < byteCount; i++) {
//     buf[i] = r.readByte()
//   }
//   return buf
// }
//
// function readUint8Array(r: Reader, byteCount: number): Uint8Array {
//   const buf = new Uint8Array(byteCount)
//   for (let i = 0; i < byteCount; i++) {
//     buf[i] = r.readByte()
//   }
//   return buf
// }

// function readTxSignature(r: Reader): ISigned {
//   const typeByte = r.readUint8()
//   if (typeByte !== 0x01) {
//     throw new Error('Invalid ed25519 signature')
//   }
//   // const sig = readUint8Array(r, 64)
//   // const pubkey = readUint8Array(r, 32)
//   // return { sig, pubkey }
// }

function readTxSignature(i: Uint8Array): ISigned {
  const deSignedTx = SignedTx.deserializeBinary(i)
  const deSignedTxArr = deSignedTx.toArray()
  const sig = deSignedTxArr[2]
  const pubkey = deSignedTxArr[1]
  return { sig, pubkey }
}

// // TODO: move this to loom-js
// function readFields(r: Reader, fields: ITxField[]): { [index: string]: any } {
//   const result: { [index: string]: any } = {}
//   for (let f of fields) {
//     result[f.name] = readField(r, f)
//   }
//   return result
// }

// function readField(r: Reader, f: ITxField): any {
//   switch (f.kind) {
//     case TxFieldKind.String:
//       return r.readString()
//     case TxFieldKind.UInt8:
//       return r.readUint8()
//     case TxFieldKind.UInt32:
//       return r.readUint32()
//     default:
//       if (f.kind instanceof Function) {
//         return f.kind(r)
//       }
//   }
//   throw new Error('Unsupported tx field kind')
// }
