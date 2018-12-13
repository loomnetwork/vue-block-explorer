import Axios from 'axios'

import { extractTxDataFromStr, IDecodedTx } from './transaction-reader'
import { Client, createJSONRPCClient } from 'loom-js'
import { VMType, DeployResponse, DeployResponseData } from 'loom-js/dist/proto/loom_pb'
import { EvmTxReceipt } from 'loom-js/dist/proto/evm_pb'
import { B64ToUint8Array, bytesToHexAddr, numberToHex } from 'loom-js/dist/crypto-utils'

interface IBlockchainStatusResponse {
  result: {
    sync_info: {
      latest_block_height: number
    }
  }
}

interface IBlockchainBlockMeta {
  block_id: {
    hash: string
  }
  header: {
    height: number
    time: string
    num_txs: number
  }
}

interface IEthReceipt {
  transactionHash: string
  transactionIndex: string
  blockHash: string
  blockNumber: string
  gasUsed: string
  cumulativeGasUsed: string
  contractAddress: string
  logs: Array<any>
  status: string
}

interface IEvmTxDetails {
  type: string
  receipt: Array<any>
}

enum EVMCall {
  DeployEVM = 'deploy.evm',
  CallEVM = 'call.evm'
}

export interface IBlockchainBlock {
  hash: string
  height: number
  time: string
  // Number of transactions that are supposed to be in this block.
  numTxs: number
  isFetchingTxs: boolean
  didFetchTxs: boolean
  // Transactions that have actually been fetched and successfully decoded.
  txs: IBlockchainTransaction[]
}

export interface IBlockchainTransaction {
  hash: string
  blockHeight: number
  txType: string
  time: string
  evmDelayedCall?: Function | null
  sender: string
  data: IDecodedTx
}

interface IBlockchainResponse {
  result: {
    last_height: number
    block_metas: IBlockchainBlockMeta[]
  }
}

interface IBlockResponse {
  result: {
    last_height: number
    block_meta: IBlockchainBlockMeta
    // TODO: Need a better type
    block: any
  }
}

export interface IBlockchainStatus {
  latestBlockHeight: number
}

export class Blockchain {
  chainID: string
  serverUrl: string
  allowedUrls: string[]
  isConnected: boolean = false
  blocks: IBlockchainBlock[] = []
  transactions: IBlockchainTransaction[] = []
  totalNumBlocks: number = 0
  refreshTimer: number | null = null
  client: Client

  constructor(params: { chainID: string; serverUrl: string; allowedUrls: string[] }) {
    this.chainID = params.chainID
    this.serverUrl = params.serverUrl
    this.allowedUrls = params.allowedUrls
    this.startClientConnection()
  }

  dispose() {
    this.clearRefreshTimer()
  }

  async startClientConnection() {
    const writer = createJSONRPCClient({ protocols: [{ url: `${this.serverUrl}/rpc` }] })
    const reader = createJSONRPCClient({ protocols: [{ url: `${this.serverUrl}/query` }] })
    if (this.client) {
      this.client.disconnect()
    }
    this.client = new Client(this.chainID, writer, reader)
  }

  setServerUrl(newUrl: string) {
    if (this.serverUrl !== newUrl) {
      this.clearRefreshTimer()
      this.serverUrl = newUrl
      this.isConnected = false
      this.blocks = []
      this.transactions = []
      this.totalNumBlocks = 0
    }
  }

  setChainID(chainID: string) {
    if (this.chainID !== chainID) {
      this.chainID = chainID
      this.clearRefreshTimer()
      this.startClientConnection()
      this.isConnected = false
      this.blocks = []
      this.transactions = []
      this.totalNumBlocks = 0
    }
  }

  setRefreshTimer() {
    if (this.refreshTimer === null) {
      this.refreshTimer = window.setInterval(async () => {
        const { latestBlockHeight } = await this.fetchStatus()
        this.totalNumBlocks = latestBlockHeight
      }, 5000)
    }
  }

  clearRefreshTimer() {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  async fetchStatus(): Promise<IBlockchainStatus> {
    const statusResp = await Axios.get<IBlockchainStatusResponse>(`${this.serverUrl}/rpc/status`)
    const latestBlockHeight = statusResp.data.result.sync_info.latest_block_height
    this.totalNumBlocks = latestBlockHeight
    return { latestBlockHeight }
  }

  /**
   * Fetches blocks from the blockchain, when called without any options will fetch up to 20
   * of the most recent blocks.
   *
   * @param opts Options object that can be used to specify which blocks are fetched.
   */
  async fetchBlocks(opts?: {
    minHeight?: number
    maxHeight?: number
    limit?: number
    autoFetch: boolean
  }): Promise<IBlockchainBlock[]> {
    this.clearRefreshTimer()
    try {
      // When a block range isn't specified we'll fetch the most recent ones, but to do that
      // we need to find out how many blocks there are.
      if (!opts || (opts.maxHeight === undefined && opts.minHeight === undefined)) {
        const { latestBlockHeight } = await this.fetchStatus()
        this.totalNumBlocks = latestBlockHeight
      }

      let maxBlocksToFetch = (opts && opts.limit) || 20
      let firstBlockNum = Math.max(this.totalNumBlocks - (maxBlocksToFetch - 1), 1)
      let lastBlockNum = this.totalNumBlocks
      // NOTE: the blockchain API endpoint currently only returns max of 20 blocks per request
      if (opts && opts.minHeight !== undefined) {
        firstBlockNum = opts.minHeight
        lastBlockNum = opts.maxHeight || firstBlockNum + maxBlocksToFetch - 1
      } else if (opts && opts.maxHeight !== undefined) {
        firstBlockNum = Math.max(opts.maxHeight - (maxBlocksToFetch - 1), 0)
        lastBlockNum = opts.maxHeight
      }
      const chainResp = await Axios.get<IBlockchainResponse>(`${this.serverUrl}/rpc/blockchain`, {
        params: {
          minHeight: firstBlockNum,
          maxHeight: lastBlockNum
        }
      })
      this.totalNumBlocks = chainResp.data.result.last_height
      this.isConnected = true
      // TODO: Connect to the websocket for updates instead of hammering the server.
      if (opts && opts.autoFetch) {
        this.setRefreshTimer()
      }
      return chainResp.data.result.block_metas.map<IBlockchainBlock>(meta => ({
        hash: meta.block_id.hash,
        height: meta.header.height,
        time: meta.header.time,
        numTxs: meta.header.num_txs,
        isFetchingTxs: false,
        didFetchTxs: false,
        txs: []
      }))
    } catch (e) {
      this.isConnected = false
      throw e
    }
  }

  async fetchBlock(blockHeight: number): Promise<IBlockchainBlock> {
    const chainResp = await Axios.get<IBlockResponse>(`${this.serverUrl}/rpc/block`, {
      params: { height: blockHeight }
    })
    const meta = chainResp.data.result.block_meta
    const block = {
      hash: meta.block_id.hash,
      height: meta.header.height,
      time: meta.header.time,
      numTxs: meta.header.num_txs,
      isFetchingTxs: false,
      didFetchTxs: false,
      txs: []
    }
    return block
  }

  private _createReceiptResult(receipt: EvmTxReceipt): IEthReceipt {
    const transactionHash = bytesToHexAddrLC(receipt.getTxHash_asU8())
    const transactionIndex = numberToHexLC(receipt.getTransactionIndex())
    const blockHash = bytesToHexAddrLC(receipt.getBlockHash_asU8())
    const blockNumber = numberToHexLC(receipt.getBlockNumber())
    const contractAddress = bytesToHexAddrLC(receipt.getContractAddress_asU8())
    const logs = receipt.getLogsList().map((logEvent: any, index: number) => {
      const logIndex = numberToHexLC(index)
      let data = bytesToHexAddrLC(logEvent.getEncodedBody_asU8())

      if (data === '0x') {
        data = '0x0'
      }

      return {
        logIndex,
        address: contractAddress,
        blockHash,
        blockNumber,
        transactionHash: bytesToHexAddrLC(logEvent.getTxHash_asU8()),
        transactionIndex,
        type: 'mined',
        data,
        topics: logEvent.getTopicsList().map((topic: string) => topic.toLowerCase())
      }
    })

    return {
      transactionHash,
      transactionIndex,
      blockHash,
      blockNumber,
      contractAddress,
      gasUsed: numberToHexLC(receipt.getGasUsed()),
      cumulativeGasUsed: numberToHexLC(receipt.getCumulativeGasUsed()),
      logs,
      status: numberToHexLC(receipt.getStatus())
    } as IEthReceipt
  }

  async fetchEVMTxDetails(txHash: string): Promise<IEvmTxDetails> {
    const txResp = await Axios.get<any>(`${this.serverUrl}/rpc/tx`, {
      params: { hash: `0x${txHash}` }
    })

    const { tx_result } = txResp.data.result
    let loomEVMtxHash: Uint8Array

    // If is a deploy rather than a call need to inspect into protobuf
    if (tx_result.info == EVMCall.DeployEVM) {
      const deployResponse = DeployResponse.deserializeBinary(B64ToUint8Array(tx_result.data))
      const deployResponseData = DeployResponseData.deserializeBinary(
        deployResponse.getOutput_asU8()
      )
      loomEVMtxHash = deployResponseData.getTxHash_asU8()
    } else {
      loomEVMtxHash = B64ToUint8Array(tx_result.data)
    }

    const evmTxReceiptResp = await this.client.getEvmTxReceiptAsync(loomEVMtxHash)
    const evmTxReceipt = this._createReceiptResult(evmTxReceiptResp!)

    // Turn into already used structure for key/value
    const evmTxReceiptArray = Object.keys(evmTxReceipt).map((key: string) => ({
      key,
      value: (evmTxReceipt as any)[key]
    }))

    return { type: tx_result.info, receipt: evmTxReceiptArray }
  }

  async fetchTxsInBlock(block: IBlockchainBlock) {
    if (block.numTxs === 0 || block.isFetchingTxs || block.didFetchTxs) {
      return
    }
    try {
      block.isFetchingTxs = true
      const blockResp = await Axios.get<any>(`${this.serverUrl}/rpc/block`, {
        params: { height: block.height }
      })
      const rawTxs: any[] = blockResp.data.result.block.data.txs
      block.txs = []
      for (let i = 0; i < rawTxs.length; i++) {
        try {
          const data = extractTxDataFromStr(rawTxs[i])
          let txData = {} as IDecodedTx
          let txType = ''
          let evmDelayedCall

          if (data.tx.vmType === VMType.EVM) {
            evmDelayedCall = async () => {
              const evmTxDetails = await this.fetchEVMTxDetails(data.txHash)

              if (!evmTxDetails) {
                throw Error('Cannot retrieve EVM tx details')
              }

              txData.method = evmTxDetails.type
              txData.arrData = evmTxDetails.receipt
            }

            txType = 'EVM Call'
          } else {
            txData = data.tx
            txType = getTxType(data.tx)
          }

          block.txs.push({
            hash: data.txHash,
            blockHeight: block.height,
            txType,
            time: block.time,
            evmDelayedCall,
            sender: getTxSender(data.tx),
            data: txData
          })
        } catch (e) {
          console.error(e)
        }
      }
      block.didFetchTxs = true
    } catch (e) {
      console.error(e)
    } finally {
      block.isFetchingTxs = false
    }
  }
}

export function getShortTxHash(longHash: string): string {
  return '0x' + longHash.slice(0, 8)
}

function getTxType(tx: IDecodedTx): string {
  return tx.method
}

function getTxSender(tx: IDecodedTx): string {
  // you could use the app user as the sender, please check delegatecall for example
  return 'default'
}

function bytesToHexAddrLC(bytes: Uint8Array): string {
  return bytesToHexAddr(bytes).toLowerCase()
}

function numberToHexLC(num: number): string {
  return numberToHex(num).toLowerCase()
}
