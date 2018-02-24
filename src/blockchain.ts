import Axios from 'axios'

import { extractTxDataFromStr, DelegateCallTx, TxKind } from './transaction-reader';

interface IBlockchainStatusResponse {
  result: {
    latest_block_height: number
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
  sender: string
  data: DelegateCallTx
}

interface IBlockchainResponse {
  result: {
    block_metas: IBlockchainBlockMeta[]
  }
}

export interface IBlockchainStatus {
  latestBlockHeight: number
}

export class Blockchain {
  serverUrl: string
  isServerUrlEditable: boolean
  isConnected: boolean = false
  blocks: IBlockchainBlock[] = []
  transactions: IBlockchainTransaction[] = []

  constructor(params: { serverUrl: string; isServerUrlEditable?: boolean }) {
    this.serverUrl = params.serverUrl
    this.isServerUrlEditable = params.isServerUrlEditable || false
  }

  async fetchStatus(): Promise<IBlockchainStatus> {
    const statusResp = await Axios.get<IBlockchainStatusResponse>(
      `${this.serverUrl}/status`
    )
    return { latestBlockHeight: statusResp.data.result.latest_block_height }
  }

  async fetchBlocks() {
    try {
      const { latestBlockHeight } = await this.fetchStatus()

      /* Iterate backwards through the blockchain and dumps transaction data */
      /*
      for (let i = lastBlockNum; i > 0; ) {
        const testChainResp = await Axios.get<IBlockchainResponse>(
          `${this.blockchain.serverUrl}/blockchain`, { params: { maxHeight: i } }
        )
        for (let j = 0; j < testChainResp.data.result.block_metas.length; j++) {
          const block = testChainResp.data.result.block_metas[j]
          if (block.header.num_txs > 0) {
            const blockResp = await Axios.get<any>(
              `${this.blockchain.serverUrl}/block`,
              { params: { height: block.header.height } }
            )
            const data = extractTxDataFromStr(blockResp.data.result.block.data.txs[0])
            console.log('block #', block.header.height, ' data: ', data)
          }
        }
        i -= 20
      }
      */

      const firstBlockNum = Math.max(latestBlockHeight - 10, 0)
      const chainResp = await Axios.get<IBlockchainResponse>(
        `${this.serverUrl}/blockchain`,
        {
          params: {
            minHeight: firstBlockNum,
            maxHeight: latestBlockHeight
          }
        }
      )
      this.isConnected = true
      this.blocks = chainResp.data.result.block_metas.map<IBlockchainBlock>(meta => ({
        hash: meta.block_id.hash,
        height: meta.header.height,
        time: meta.header.time,
        numTxs: meta.header.num_txs,
        isFetchingTxs: false,
        didFetchTxs: false,
        txs: []
      }))
      /*
      this.transactions = this.blocks.map<IBlockchainTransaction>(block => {
        if (block.numTxs > 0) {
          // TODO: Pull tx data out of somewhere
        }
        return {
          hash: meta.block_id.hash,
          blockHeight: meta.header.height,
          txType: 'question',
          time: meta.header.time,
          sender: 'alice'
        }
      })
      */
      // TODO: Connect to the websocket for updates.
      setTimeout(() => {
        this.fetchBlocks()
      }, 1000)
    } catch (e) {
      console.log(e)
      this.isConnected = false
      // Try fetching again a bit later.
      setTimeout(() => {
        this.fetchBlocks()
      }, 2000)
    }
  }

  async fetchTxsInBlock(block: IBlockchainBlock) {
    if ((block.numTxs === 0) || block.isFetchingTxs || block.didFetchTxs) {
      return
    }
    try {
      block.isFetchingTxs = true
      const blockResp = await Axios.get<any>(
        `${this.serverUrl}/block`,
        { params: { height: block.height } }
      )
      const rawTxs: any[] = blockResp.data.result.block.data.txs
      block.txs = []
      for (let i = 0; i < rawTxs.length; i++) {
        try {
          const data = extractTxDataFromStr(rawTxs[i])
          block.txs.push({
            hash: block.hash, // TODO: figure out where the tx hash is
            blockHeight: block.height,
            txType: getTxType(data),
            time: block.time,
            sender: getTxSender(data),
            data
          })
        } catch (e) {
          console.log(e)
        }
      }
      block.didFetchTxs = true
    } catch (e) {
      console.log(e)
    } finally {
      block.isFetchingTxs = false
    }
  }
}


function getTxType(tx: DelegateCallTx): string {
  switch (tx.txKind) {
    case TxKind.PostComment:
      return tx.kind
    default:
      return tx.txKind
  }
}

function getTxSender(tx: DelegateCallTx): string {
  switch (tx.txKind) {
    case TxKind.CreateAccount:
      return tx.username
    case TxKind.PostComment:
      return tx.author
    case TxKind.AcceptAnswer:
      return tx.acceptor
    case TxKind.Vote:
      return tx.voter
  }
}
