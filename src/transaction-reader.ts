import { Reader } from 'loom/wire'

/*
// loom-js/modules/auth.js
registerType(Signed, ['sig', 'pubkey'], 0x00);
registerType(OneSigTx, ['tx', 'signed'], 0x16);
// loom-js/actor.js
registerType(Actor, ['chainId', 'app', 'address'], 0x00);
// delegatecall.com/app/javascript/client/tx.js
registerType(CreateAccountTx, ['inner', 'owner', 'username'], 0x40);
registerType(PostCommentTx, ['inner', 'kind', 'parent_permalink', 'permalink', 'author', 'title', 'body', 'tags'], 0x41);
registerType(UpdateCommentTx, ['inner', 'kind', 'parent_permalink', 'permalink', 'author', 'title', 'body', 'tags'], 0x44);
registerType(AcceptAnswerTx, ['answer_permalink', 'acceptor'], 0x42);
registerType(VoteTx, ['comment_permalink', 'voter', 'up'], 0x43);
*/

export enum TxKind {
  CreateAccount = 'createAccount',
  PostComment = 'post',
  AcceptAnswer = 'acceptAnswer',
  Vote = 'vote'
}

export interface ISigned {
  sig: string
  pubkey: string
}

export interface IOneSigTx {
  tx: DelegateCallTx
  signed: ISigned
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
}

export type CommentKind = 'question' | 'answer' | 'comment'

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

export type DelegateCallTx =
  | ICreateAccountTx
  | IPostCommentTx
  | IUpdateCommentTx
  | IAcceptAnswerTx
  | IVoteTx

export function extractTxDataFromStr(base64Str: string): DelegateCallTx {
  const buf = new Buffer(base64Str, 'base64')
  const r = new Reader(buf)
  const txType = r.readUint8()
  if (txType !== 0x16) {
    throw new Error('Invalid OneSigTx')
  }
  return readTxPayload(r)
}

function readTxPayload(r: Reader): DelegateCallTx {
  const txType = r.readUint8()
  switch (txType) {
    case 0x40:
      return readCreateAccountTxPayload(r)
    case 0x41:
    case 0x44:
      return readPostCommentTxPayload(r)
    case 0x42:
      return readAcceptAnswerTxPayload(r)
    case 0x43:
      return readVoteTxPayload(r)
  }
  throw new Error('Unknown Tx Type: ' + txType.toString(16))
}

function readCreateAccountTxPayload(r: Reader): ICreateAccountTx {
  const owner = readActor(r)
  const username = r.readString()
  return { txKind: TxKind.CreateAccount, owner, username }
}

function readPostCommentTxPayload(r: Reader): IPostCommentTx {
  // In Go the inner field is of type TxInner (from Cosmos SDK), in JS though DelegateCall seems to
  // leave it undefined so it gets serialized as a zero byte, so just read & discard for now.
  const inner = r.readUint8()
  const kind = r.readString() as CommentKind
  // tslint:disable-next-line:variable-name
  const parent_permalink = r.readString()
  const permalink = r.readString()
  const author = r.readString()
  const title = r.readString()
  const body = r.readString()
  const tagCount = r.readUvarint()
  const tags: string[] = []
  for (let i = 0; i < tagCount; i++) {
    tags.push(r.readString())
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

// TODO: test this, haven't seen any transactions of this kind yet
function readAcceptAnswerTxPayload(r: Reader): IAcceptAnswerTx {
  // tslint:disable-next-line:variable-name
  const answer_permalink = r.readString()
  const acceptor = r.readString()
  return { txKind: TxKind.AcceptAnswer, answer_permalink, acceptor }
}

// TODO: test this, haven't seen any transactions of this kind yet
function readVoteTxPayload(r: Reader): IVoteTx {
  // tslint:disable-next-line:variable-name
  const comment_permalink = r.readString()
  const voter = r.readString()
  const up = r.readByte() !== 0
  return { txKind: TxKind.Vote, comment_permalink, voter, up }
}

function readActor(r: Reader): IActor {
  const txType = r.readUint8()
  if (txType !== 0x00) {
    throw new Error('Invalid Actor')
  }
  const chainId = r.readString()
  const app = r.readString()
  const address = readBuffer(r)
  return { chainId, app, address }
}

function readBuffer(r: Reader): Buffer {
  const byteCount = r.readUvarint()
  const buf = new Buffer(byteCount)
  for (let i = 0; i < byteCount; i++) {
    buf[i] = r.readByte()
  }
  return buf
}
