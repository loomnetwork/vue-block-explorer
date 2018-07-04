// @ts-ignore
import { CryptoUtils } from 'loom-js'
import {
  SignedTx,
  NonceTx,
  Transaction,
  MessageTx,
  CallTx,
  Request,
  ContractMethodCall
} from 'loom-js/dist/proto/loom_pb'
import { MapEntry } from '@/pbs/phaser/setscore_pb'
import * as DC from '@/pbs/delegatecall/delegatecall_txs_pb'

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
  tx: DelegateCallTx
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
  username: string
  // fields below are only available in v2
  email?: string
  name?: string
  image?: string
}

export enum CommentKind {
  Question = 'question',
  Answer = 'answer',
  Comment = 'comment',
  Invalid = 'invalid'
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

export type DelegateCallTx =
  | ICreateAccountTx
  | IPostCommentTx
  | IUpdateCommentTx
  | IAcceptAnswerTx
  | IVoteTx

enum TxFieldKind {
  String = 'string',
  UInt8 = 'uint8',
  UInt32 = 'uint32'
}

interface ITxField {
  name: string
  kind: TxFieldKind
}

class InvalidTxVersionError extends Error {
}

class UnsupportedTxTypeError extends Error {
}

export function extractTxDataFromStr(base64Str: string): IOneSigTx {
  const pbBuf = CryptoUtils.bufferToProtobufBytes(CryptoUtils.B64ToUint8Array(base64Str))
  const sig = readTxSignature(pbBuf)
  const payload = readTxPayload(pbBuf)
  return { tx: payload, signed: sig }
}

function readTxPayload(i: Uint8Array): DelegateCallTx {
  const deSignedTx = SignedTx.deserializeBinary(i)
  // console.log(deSignedTx.toObject())
  const deNonceTx = NonceTx.deserializeBinary(deSignedTx.toArray()[0])
  // console.log(deNonceTx.toObject())
  const deTransaction = Transaction.deserializeBinary(deNonceTx.toArray()[0])
  // console.log(deTransaction.toObject())
  const deMessageTx = MessageTx.deserializeBinary(deTransaction.toArray()[1])
  // console.log(deMessageTx.toObject())
  const deCallTx = CallTx.deserializeBinary(deMessageTx.toArray()[2])
  // console.log(deCallTx.toObject())
  const deRequest = Request.deserializeBinary(deCallTx.toArray()[1])
  // console.log(deRequest.toObject())
  const deContractMethodCall = ContractMethodCall.deserializeBinary(deRequest.toArray()[2])
  // console.log(deContractMethodCall.toObject())
  let dcData = readDCProtoData(deContractMethodCall)
  return dcData
}

function readProtoData(cmc: ContractMethodCall): IDecodedTx {
  const methodName = cmc.toObject().method
  const txData = MapEntry.deserializeBinary(cmc.toArray()[1])
  const txStringArrData = txData.toArray()
  return { method: methodName, arrData: txStringArrData }
}

function readDCProtoData(cmc: ContractMethodCall): DelegateCallTx {
  const methodName = cmc.toObject().method
  const dataArr = cmc.toArray()[1]
  switch (methodName) {
    case 'CreateAccount':
      return readCreateAccountTxPayload(dataArr)
    case 'Vote':
      return readVoteTxPayload(dataArr)
    case 'CreateQuestion':
    case 'CreateAnswer':
    case 'CreateComment':
      return readPostCommentTxPayload(dataArr)
    case 'AcceptAnswer':
      return readAcceptAnswerTxPayload(dataArr)
  }
  throw new UnsupportedTxTypeError()
}

function readCreateAccountTxPayload(r: Uint8Array): ICreateAccountTx {
  let accountTx = DC.DelegatecallCreateAccountTx.deserializeBinary(r).toObject()
  return { txKind: TxKind.CreateAccount, ...(accountTx.accountDetails as any) }
}

function readPostCommentTxPayload(r: Uint8Array): IPostCommentTx {
  const postTX = DC.DelegatecallCommentTx.deserializeBinary(r).toObject()
  console.log(postTX)
  const commentTX = postTX.commentTx
  let commentKind = [CommentKind.Answer, CommentKind.Question, CommentKind.Comment]
  let kind = CommentKind.Invalid
  let parent_permalink = ''
  let permalink = ''
  let author = ''
  let body = ''
  let tags = ['']
  let title = ''
  if (commentTX) {
    ;(kind = commentKind[commentTX.kind]),
      (parent_permalink = commentTX.parentPermalink),
      (permalink = commentTX.permalink),
      (author = commentTX.author),
      (title = commentTX.title),
      (body = commentTX.body),
      (tags = commentTX.tagsList)
  }
  return {
    txKind: TxKind.PostComment,
    kind,
    parent_permalink,
    permalink,
    author,
    title,
    body,
    tags
  }
}

function readAcceptAnswerTxPayload(r: Uint8Array): IAcceptAnswerTx {
  let acceptTX = DC.AcceptAnswerTx.deserializeBinary(r).toObject()
  return {
    txKind: TxKind.AcceptAnswer,
    answer_permalink: acceptTX.answerPermalink,
    acceptor: acceptTX.acceptor
  }
}

function readVoteTxPayload(r: Uint8Array): IVoteTx {
  const DCVoteTX = DC.DelegatecallVoteTx.deserializeBinary(r).toObject()
  const voteTX = DCVoteTX.voteTx!
  return {
    txKind: TxKind.Vote,
    comment_permalink: voteTX.commentPermalink.trim(),
    voter: voteTX.voter,
    up: voteTX.up
  }
}

function readTxSignature(i: Uint8Array): ISigned {
  const deSignedTx = SignedTx.deserializeBinary(i)
  const deSignedTxArr = deSignedTx.toArray()
  const sig = deSignedTxArr[2]
  const pubkey = deSignedTxArr[1]
  return { sig, pubkey }
}
