import { Reader } from 'loom/wire'

/*
// loom-js/modules/auth.js
registerType(Signed, ['sig', 'pubkey'], 0x00);
registerType(OneSigTx, ['tx', 'signed'], 0x16);
// loom-js/actor.js
registerType(Actor, ['chainId', 'app', 'address'], 0x00);
// delegatecall.com/app/javascript/client/tx.js
registerType(CreateAccountTx, ['inner', 'owner', 'username', 'email', 'name', 'image'], 0x40);
registerType(PostCommentTx, ['inner', 'kind', 'parent_permalink', 'permalink', 'author', 'title', 'body', 'tags'], 0x41);
registerType(UpdateCommentTx, ['inner', 'kind', 'parent_permalink', 'permalink', 'author', 'title', 'body', 'tags'], 0x44);
registerType(AcceptAnswerTx, ['inner', 'answer_permalink', 'acceptor'], 0x42);
registerType(VoteTx, ['inner', 'comment_permalink', 'voter', 'up'], 0x43);

//delegatecall.com/app/javascript/client/nonce.js
registerType(NonceTx, ['sequence', 'signers', 'tx'], 0x69);

*/

export enum TxKind {
  CreateAccount = 'createAccount',
  PostComment = 'post',
  AcceptAnswer = 'acceptAnswer',
  Vote = 'vote',
  Nonce = "nonce",
}

export interface ISigned {
  sig: Uint8Array
  pubkey: Uint8Array
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

export interface INnoceTx {
  txKind: TxKind.Nonce,
  sequence: number,
  signers: Array<IActor>,
  tx: DelegateCallTx,
}

export type DelegateCallTx =
  | ICreateAccountTx
  | IPostCommentTx
  | IUpdateCommentTx
  | IAcceptAnswerTx
  | IVoteTx
  | INnoceTx

export function extractTxDataFromStr(base64Str: string): IOneSigTx {
  const buf = new Buffer(base64Str, 'base64')
  const r = new Reader(buf)
  const txType = r.readUint8()
  if (txType !== 0x16) {
    throw new Error('Invalid OneSigTx')
  }
  const payload = readTxPayload(r)
  const sig = readTxSignature(r)
  return { tx: payload, signed: sig }
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
    case 0x69:
      return readNonceTxPayload(r)
  }
  throw new Error('Unknown Tx Type: ' + txType.toString(16))
}

function readCreateAccountTxPayload(r: Reader): ICreateAccountTx {
  const owner = readActor(r)
  const username = r.readString()
  const email = r.readString()
  const name = r.readString()
  const image = r.readString()
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
  const inner = r.readUint8()
  // tslint:disable-next-line:variable-name
  const answer_permalink = r.readString()
  const acceptor = r.readString()
  return { txKind: TxKind.AcceptAnswer, answer_permalink, acceptor }
}

function readVoteTxPayload(r: Reader): IVoteTx {
  const inner = r.readUint8()
  // tslint:disable-next-line:variable-name
  const comment_permalink = r.readString()
  const voter = r.readString()
  const up = r.readUint8() !== 0
  return { txKind: TxKind.Vote, comment_permalink, voter, up }
}

function readNonceTxPayload(r: Reader) {
  let sequence = r.readUint32() // read nonce aka sequence
  // TODO read signers => Array<Actor>
  //let actorsLen = r.readUvarint()
  let actorsLen = r.readUvarint()
  debugger;
  // should do it with a iterator, but it has only one now
  let actor = readActor(r)
  return readTxPayload(r)
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

function readUint8Array(r: Reader, byteCount: number): Uint8Array {
  const buf = new Uint8Array(byteCount)
  for (let i = 0; i < byteCount; i++) {
    buf[i] = r.readByte()
  }
  return buf
}

function readTxSignature(r: Reader): ISigned {
  const typeByte = r.readUint8()
  if (typeByte !== 0x01) {
    throw new Error('Invalid ed25519 signature')
  }
  const sig = readUint8Array(r, 64)
  const pubkey = readUint8Array(r, 32)
  return { sig, pubkey }
}
