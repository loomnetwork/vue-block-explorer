// package:
// file: src/pbs/delegatecall/delegatecall_txs.proto

import * as jspb from 'google-protobuf'

export class Meta extends jspb.Message {
  getVersion(): number
  setVersion(value: number): void

  getOwner(): string
  setOwner(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): Meta.AsObject
  static toObject(includeInstance: boolean, msg: Meta): Meta.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: Meta, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): Meta
  static deserializeBinaryFromReader(message: Meta, reader: jspb.BinaryReader): Meta
}

export namespace Meta {
  export type AsObject = {
    version: number
    owner: string
  }
}

export class AccountDetails extends jspb.Message {
  getUsername(): string
  setUsername(value: string): void

  getReputation(): number
  setReputation(value: number): void

  getName(): string
  setName(value: string): void

  getImage(): string
  setImage(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountDetails.AsObject
  static toObject(includeInstance: boolean, msg: AccountDetails): AccountDetails.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: AccountDetails, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountDetails
  static deserializeBinaryFromReader(
    message: AccountDetails,
    reader: jspb.BinaryReader
  ): AccountDetails
}

export namespace AccountDetails {
  export type AsObject = {
    username: string
    reputation: number
    name: string
    image: string
  }
}

export class DelegatecallCreateAccountTx extends jspb.Message {
  hasMeta(): boolean
  clearMeta(): void
  getMeta(): Meta | undefined
  setMeta(value?: Meta): void

  hasAccountDetails(): boolean
  clearAccountDetails(): void
  getAccountDetails(): AccountDetails | undefined
  setAccountDetails(value?: AccountDetails): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DelegatecallCreateAccountTx.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DelegatecallCreateAccountTx
  ): DelegatecallCreateAccountTx.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(
    message: DelegatecallCreateAccountTx,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): DelegatecallCreateAccountTx
  static deserializeBinaryFromReader(
    message: DelegatecallCreateAccountTx,
    reader: jspb.BinaryReader
  ): DelegatecallCreateAccountTx
}

export namespace DelegatecallCreateAccountTx {
  export type AsObject = {
    meta?: Meta.AsObject
    accountDetails?: AccountDetails.AsObject
  }
}

export class CommentTx extends jspb.Message {
  getKind(): CommentKind
  setKind(value: CommentKind): void

  getParentPermalink(): string
  setParentPermalink(value: string): void

  getPermalink(): string
  setPermalink(value: string): void

  getAuthor(): string
  setAuthor(value: string): void

  getTitle(): string
  setTitle(value: string): void

  getBody(): string
  setBody(value: string): void

  clearTagsList(): void
  getTagsList(): Array<string>
  setTagsList(value: Array<string>): void
  addTags(value: string, index?: number): string

  getAcceptAnswerPermalink(): string
  setAcceptAnswerPermalink(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): CommentTx.AsObject
  static toObject(includeInstance: boolean, msg: CommentTx): CommentTx.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: CommentTx, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): CommentTx
  static deserializeBinaryFromReader(message: CommentTx, reader: jspb.BinaryReader): CommentTx
}

export namespace CommentTx {
  export type AsObject = {
    kind: CommentKind
    parentPermalink: string
    permalink: string
    author: string
    title: string
    body: string
    tagsList: Array<string>
    acceptAnswerPermalink: string
  }
}

export class DelegatecallCommentTx extends jspb.Message {
  hasMeta(): boolean
  clearMeta(): void
  getMeta(): Meta | undefined
  setMeta(value?: Meta): void

  hasCommentTx(): boolean
  clearCommentTx(): void
  getCommentTx(): CommentTx | undefined
  setCommentTx(value?: CommentTx): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DelegatecallCommentTx.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DelegatecallCommentTx
  ): DelegatecallCommentTx.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: DelegatecallCommentTx, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DelegatecallCommentTx
  static deserializeBinaryFromReader(
    message: DelegatecallCommentTx,
    reader: jspb.BinaryReader
  ): DelegatecallCommentTx
}

export namespace DelegatecallCommentTx {
  export type AsObject = {
    meta?: Meta.AsObject
    commentTx?: CommentTx.AsObject
  }
}

export class AcceptAnswerTx extends jspb.Message {
  getAnswerPermalink(): string
  setAnswerPermalink(value: string): void

  getAcceptor(): string
  setAcceptor(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AcceptAnswerTx.AsObject
  static toObject(includeInstance: boolean, msg: AcceptAnswerTx): AcceptAnswerTx.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: AcceptAnswerTx, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AcceptAnswerTx
  static deserializeBinaryFromReader(
    message: AcceptAnswerTx,
    reader: jspb.BinaryReader
  ): AcceptAnswerTx
}

export namespace AcceptAnswerTx {
  export type AsObject = {
    answerPermalink: string
    acceptor: string
  }
}

export class DelegatecallAcceptAnswerTx extends jspb.Message {
  hasMeta(): boolean
  clearMeta(): void
  getMeta(): Meta | undefined
  setMeta(value?: Meta): void

  hasAcceptAnswerTx(): boolean
  clearAcceptAnswerTx(): void
  getAcceptAnswerTx(): AcceptAnswerTx | undefined
  setAcceptAnswerTx(value?: AcceptAnswerTx): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DelegatecallAcceptAnswerTx.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DelegatecallAcceptAnswerTx
  ): DelegatecallAcceptAnswerTx.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(
    message: DelegatecallAcceptAnswerTx,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): DelegatecallAcceptAnswerTx
  static deserializeBinaryFromReader(
    message: DelegatecallAcceptAnswerTx,
    reader: jspb.BinaryReader
  ): DelegatecallAcceptAnswerTx
}

export namespace DelegatecallAcceptAnswerTx {
  export type AsObject = {
    meta?: Meta.AsObject
    acceptAnswerTx?: AcceptAnswerTx.AsObject
  }
}

export class StateQueryParams extends jspb.Message {
  getOwner(): string
  setOwner(value: string): void

  getUrl(): string
  setUrl(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StateQueryParams.AsObject
  static toObject(includeInstance: boolean, msg: StateQueryParams): StateQueryParams.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: StateQueryParams, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StateQueryParams
  static deserializeBinaryFromReader(
    message: StateQueryParams,
    reader: jspb.BinaryReader
  ): StateQueryParams
}

export namespace StateQueryParams {
  export type AsObject = {
    owner: string
    url: string
  }
}

export class VoteTx extends jspb.Message {
  getCommentPermalink(): string
  setCommentPermalink(value: string): void

  getVoter(): string
  setVoter(value: string): void

  getUp(): boolean
  setUp(value: boolean): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): VoteTx.AsObject
  static toObject(includeInstance: boolean, msg: VoteTx): VoteTx.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: VoteTx, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): VoteTx
  static deserializeBinaryFromReader(message: VoteTx, reader: jspb.BinaryReader): VoteTx
}

export namespace VoteTx {
  export type AsObject = {
    commentPermalink: string
    voter: string
    up: boolean
  }
}

export class DelegatecallVoteTx extends jspb.Message {
  hasMeta(): boolean
  clearMeta(): void
  getMeta(): Meta | undefined
  setMeta(value?: Meta): void

  hasVoteTx(): boolean
  clearVoteTx(): void
  getVoteTx(): VoteTx | undefined
  setVoteTx(value?: VoteTx): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DelegatecallVoteTx.AsObject
  static toObject(includeInstance: boolean, msg: DelegatecallVoteTx): DelegatecallVoteTx.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: DelegatecallVoteTx, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DelegatecallVoteTx
  static deserializeBinaryFromReader(
    message: DelegatecallVoteTx,
    reader: jspb.BinaryReader
  ): DelegatecallVoteTx
}

export namespace DelegatecallVoteTx {
  export type AsObject = {
    meta?: Meta.AsObject
    voteTx?: VoteTx.AsObject
  }
}

export enum CommentKind {
  COMMENT = 0,
  QUESTION = 1,
  ANSWER = 2
}
