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
  VMType
} from 'loom-js/dist/proto/loom_pb'
import { MapEntry } from '@/pbs/common_pb'
import { sha256 } from 'js-sha256'
import { bytesToHex } from 'loom-js/dist/crypto-utils'

export interface ISigned {
  sig: Uint8Array
  pubkey: Uint8Array
}

export interface IOneSigTx {
  tx: IDecodedTx
  signed: ISigned
  txHash: string
}

export interface IDecodedTx {
  method: string
  arrData: Array<any>
  vmType?: VMType
}

export function extractTxDataFromStr(base64Str: string): IOneSigTx {
  const pbBuf = CryptoUtils.bufferToProtobufBytes(CryptoUtils.B64ToUint8Array(base64Str))
  let lastError = Error || null
  try {
    const txHash = extractTxHashFromPB(pbBuf)
    const signed = readTxSignature(pbBuf)
    const tx = readTxPayload(pbBuf)
    return { tx, signed, txHash }
  } catch (e) {
    if (e instanceof Error) {
      throw lastError
    } else {
      lastError = e
    }
  }
  throw lastError
}

function extractTxHashFromPB(pbBuf: Uint8Array): string {
  return bytesToHex(Buffer.from(sha256(pbBuf), 'hex').subarray(0, 20))
}

function readTxPayload(i: Uint8Array): IDecodedTx {
  const deSignedTx = SignedTx.deserializeBinary(i)
  const deNonceTx = NonceTx.deserializeBinary(deSignedTx.toArray()[0])
  const deTransaction = Transaction.deserializeBinary(deNonceTx.toArray()[0])
  const deMessageTx = MessageTx.deserializeBinary(deTransaction.toArray()[1])
  const deCallTx = CallTx.deserializeBinary(deMessageTx.toArray()[2])

  let txArrData = {} as IDecodedTx
  if (deCallTx.getVmType() == VMType.PLUGIN) {
    const deRequest = Request.deserializeBinary(deCallTx.toArray()[1])
    const deContractMethodCall = ContractMethodCall.deserializeBinary(deRequest.toArray()[2])
    txArrData = readProtoData(deContractMethodCall)
  } else {
    txArrData.method = 'EVM Call'
  }

  txArrData.vmType = deCallTx.getVmType()
  return txArrData
}

function readProtoData(cmc: ContractMethodCall): IDecodedTx {
  const methodName = cmc.toObject().method
  const txData = MapEntry.deserializeBinary(cmc.toArray()[1])
  const txStringArrData = txData.toArray()
  return { method: methodName, arrData: txStringArrData }
}

function readTxSignature(i: Uint8Array): ISigned {
  const deSignedTx = SignedTx.deserializeBinary(i)
  const deSignedTxArr = deSignedTx.toArray()
  const sig = deSignedTxArr[2]
  const pubkey = deSignedTxArr[1]
  return { sig, pubkey }
}
