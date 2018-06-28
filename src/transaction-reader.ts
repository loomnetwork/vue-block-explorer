import { CryptoUtils, decodeRawTx} from 'loom-js';
import { SignedTx, NonceTx, Transaction, MessageTx, CallTx, Request, ContractMethodCall } from 'loom-js/dist/proto/loom_pb'
import { MapEntry } from "./phaser_setscore_pb";
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
  Nonce = 'nonce'
}

export interface ISigned {
  sig: Uint8Array
  pubkey: Uint8Array
}

export interface IOneSigTx {
  tx: DelegateCallTx | INonceTx
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
  tx: DelegateCallTx
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
  kind: TxFieldKind | { (r: Reader): any }
}

const txVersions: { [index: string]: Array<ITxField[]> } = {
  [TxKind.CreateAccount]: [
    // v2
    [
      { name: 'inner', kind: TxFieldKind.UInt8 },
      { name: 'owner', kind: readActor },
      { name: 'username', kind: TxFieldKind.String },
      { name: 'email', kind: TxFieldKind.String },
      { name: 'name', kind: TxFieldKind.String },
      { name: 'image', kind: TxFieldKind.String }
    ],
    // v1
    [
      { name: 'inner', kind: TxFieldKind.UInt8 },
      { name: 'owner', kind: readActor },
      { name: 'username', kind: TxFieldKind.String }
    ]
  ]
}

class InvalidTxVersionError extends Error {}
class UnsupportedTxTypeError extends Error {}

export function extractTxDataFromStr(txStr: string): IOneSigTx {
  const pbBuf = CryptoUtils.bufferToProtobufBytes(CryptoUtils.B64ToUint8Array(txStr));
  const c = SignedTx.deserializeBinary(pbBuf);
  const d = NonceTx.deserializeBinary(c.array[0]);

  const e = Transaction.deserializeBinary(d.array[0]);
  const f = MessageTx.deserializeBinary(e.array[1]);
  const g = CallTx.deserializeBinary(f.array[2]);
  const h = Request.deserializeBinary(g.array[1]);
  const i = ContractMethodCall.deserializeBinary(h.array[2]);
  console.log(i);
  console.log(MapEntry.deserializeBinary(i.array[1]));

  // console.log(pbBuf);
  // // const phaserTx = MapEntry.deserializeBinary(decodedTx[1]).array.toString();
  // const decodedTx = decodeRawTx(pbBuf);
  // const phaserTx = MapEntry.deserializeBinary(decodedTx[1]).array.toString();
  // console.log(phaserTx);
  // // version info isn't stored in txs so may have to make multiple attempts to decode tx types whose
  // // structure evolved over time
  // let attempt = 0
  // let lastError: Error | null = null
  // while (attempt < 10) {
  //   const r = new Reader(buf)
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
}

// @param attempt Indicates which tx version the function should attempt to read, zero corresponds
//                to the latest version, one corresponds to the second to second to last version, etc.
//                The function will throw InvalidTxVersionError if this parameter exceeds the number
//                of available tx versions.
function readTxPayload(r: Reader, txType: number, attempt: number): DelegateCallTx | INonceTx {
  switch (txType) {
    case 0x40:
      return readCreateAccountTxPayload(r, attempt)
    case 0x41:
    case 0x44:
      return readPostCommentTxPayload(r, attempt)
    case 0x42:
      return readAcceptAnswerTxPayload(r, attempt)
    case 0x43:
      return readVoteTxPayload(r, attempt)
    case 0x69:
      return readNonceTxPayload(r, attempt)
  }
  throw new UnsupportedTxTypeError(txType.toString(16))
}

function readCreateAccountTxPayload(r: Reader, attempt: number): ICreateAccountTx {
  const versions = txVersions[TxKind.CreateAccount]
  if (!versions || attempt >= versions.length) {
    throw new InvalidTxVersionError()
  }
  const fieldDefs = versions[attempt]
  const fields = readFields(r, fieldDefs)
  return { txKind: TxKind.CreateAccount, ...(fields as any) }
}

function readPostCommentTxPayload(r: Reader, attempt: number): IPostCommentTx {
  if (attempt !== 0) {
    throw new InvalidTxVersionError()
  }
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
function readAcceptAnswerTxPayload(r: Reader, attempt: number): IAcceptAnswerTx {
  if (attempt !== 0) {
    throw new InvalidTxVersionError()
  }
  const inner = r.readUint8()
  // tslint:disable-next-line:variable-name
  const answer_permalink = r.readString()
  const acceptor = r.readString()
  return { txKind: TxKind.AcceptAnswer, answer_permalink, acceptor }
}

function readVoteTxPayload(r: Reader, attempt: number): IVoteTx {
  if (attempt !== 0) {
    throw new InvalidTxVersionError()
  }
  const inner = r.readUint8()
  // tslint:disable-next-line:variable-name
  const comment_permalink = r.readString()
  const voter = r.readString()
  const up = r.readUint8() !== 0
  return { txKind: TxKind.Vote, comment_permalink, voter, up }
}

function readNonceTxPayload(r: Reader, attempt: number): INonceTx {
  const txKind = TxKind.Nonce
  const sequence = r.readUint32()
  const numSigners = r.readUvarint()
  const signers: IActor[] = []
  for (let i = 0; i < numSigners; i++) {
    signers.push(readActor(r))
  }
  const wrappedTxType = r.readUint8()
  return {
    txKind,
    sequence,
    signers,
    tx: readTxPayload(r, wrappedTxType, attempt) as DelegateCallTx
  }
}

function readActor(r: Reader): IActor {
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

// TODO: move this to loom-js
function readFields(r: Reader, fields: ITxField[]): { [index: string]: any } {
  const result: { [index: string]: any } = {}
  for (let f of fields) {
    result[f.name] = readField(r, f)
  }
  return result
}

function readField(r: Reader, f: ITxField): any {
  switch (f.kind) {
    case TxFieldKind.String:
      return r.readString()
    case TxFieldKind.UInt8:
      return r.readUint8()
    case TxFieldKind.UInt32:
      return r.readUint32()
    default:
      if (f.kind instanceof Function) {
        return f.kind(r)
      }
  }
  throw new Error('Unsupported tx field kind')
}
