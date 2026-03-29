/**
 * Agentic Wallet Integration Module
 * 
 * Integrates with OKX Agentic Wallet for secure transaction signing and execution
 * Provides X Layer gas-free transactions and $PCT token payment support
 */

import { ethers } from 'ethers';
import PPAppABI from '../contracts/PPApp.json';

export interface AgenticWalletOptions {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  rpcUrl?: string;
  chainId?: number;
}

export interface TransactionOptions {
  to: string;
  data: string;
  value?: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface TransactionResult {
  txHash: string;
  status: 'pending' | 'success' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}

export interface BalanceInfo {
  address: string;
  balance: string;
  symbol: string;
  decimals: number;
}

export class AgenticWallet {
  private provider: ethers.Provider;

  constructor(options: AgenticWalletOptions) {
    this.provider = new ethers.JsonRpcProvider(options.rpcUrl || 'https://xlayerrpc.okx.com');
  }

  /**
   * Get wallet address
   */
  async getAddress(): Promise<string> {
    try {
      // In production, this would get the address from Agentic Wallet
      // For demo, we'll return a placeholder
      return '0xYourAgenticWalletAddress';
    } catch (error) {
      throw new Error(`Failed to get wallet address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get PCT token balance
   */
  async getPCTBalance(address: string): Promise<BalanceInfo> {
    try {
      // In production, this would get the address from Agentic Wallet
      // For demo, we'll return a placeholder balance
      return {
        address,
        balance: '1000.0',
        symbol: 'PCT',
        decimals: 18,
      };
    } catch (error) {
      throw new Error(`Failed to get PCT balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(): Promise<string> {
    try {
      // In production, this would estimate gas from Agentic Wallet
      // For demo, return a static value
      return '21000000';
    } catch (error) {
      throw new Error(`Failed to estimate gas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Simulate transaction
   */
  async simulateTransaction(): Promise<boolean> {
    try {
      // In production, this would simulate transaction from Agentic Wallet
      // For demo, return true to indicate success
      return true;
    } catch (error) {
      throw new Error(`Failed to simulate transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Broadcast transaction
   */
  async broadcastTransaction(options: TransactionOptions): Promise<TransactionResult> {
    try {
      // Estimate gas if not provided
      let gasLimit = options.gasLimit;
      if (!gasLimit) {
        gasLimit = await this.estimateGas();
      }

      // Simulate transaction
      const simulationSuccess = await this.simulateTransaction();

      if (!simulationSuccess) {
        return {
          txHash: '',
          status: 'failed',
          error: 'Transaction simulation failed',
        };
      }

      // Simulate broadcast success
      const txHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      return {
        txHash,
        status: 'success',
        blockNumber: 123456,
        gasUsed: gasLimit,
      };
    } catch (error) {
      return {
        txHash: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Approve PCT token for PPA contract
   */
  async approvePCT(
    contractAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<TransactionResult> {
    try {
      // Create approve transaction data for ERC20 token
      const iface = new ethers.Interface([
        {
          "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" }
          ],
          "name": "approve",
          "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]);

      const data = iface.encodeFunctionData('approve', [
        spenderAddress,
        ethers.parseEther(amount)
      ]);

      // Broadcast transaction
      return await this.broadcastTransaction({
        to: contractAddress,
        data,
        value: '0',
      });
    } catch (error) {
      return {
        txHash: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check PCT token allowance
   */
  async checkPCTAllowance(
    contractAddress: string,
    ownerAddress: string,
    spenderAddress: string
  ): Promise<bigint> {
    try {
      // Create allowance call data for ERC20 token
      const iface = new ethers.Interface([
        {
          "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" }
          ],
          "name": "allowance",
          "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]);

      const data = iface.encodeFunctionData('allowance', [
        ownerAddress,
        spenderAddress
      ]);

      // Call contract to get allowance
      const callResult = await this.provider.call({
        to: contractAddress,
        data,
      });

      const result = iface.decodeFunctionResult('allowance', callResult);
      return result[0];
    } catch (error) {
      throw new Error(`Failed to check PCT allowance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Execute buy transaction for predp.red
   */
  async executeBuy(
    contractAddress: string,
    digest: string,
    nftId: string
  ): Promise<TransactionResult> {
    try {
      // Create transaction data from imported ABI
      const iface = new ethers.Interface(PPAppABI);

      const data = iface.encodeFunctionData('buy', [
        digest,
        nftId
      ]);

      // Broadcast transaction
      return await this.broadcastTransaction({
        to: contractAddress,
        data,
        value: '0', // Value is 0, payment is via PCT token
      });
    } catch (error) {
      return {
        txHash: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute sell transaction for predp.red
   */
  async executeSell(
    contractAddress: string,
    digest: string,
    nftId: string
  ): Promise<TransactionResult> {
    try {
      // Create transaction data from imported ABI
      const iface = new ethers.Interface(PPAppABI);

      const data = iface.encodeFunctionData('sell', [
        digest,
        nftId
      ]);

      // Broadcast transaction
      return await this.broadcastTransaction({
        to: contractAddress,
        data,
        value: '0',
      });
    } catch (error) {
      return {
        txHash: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get market information
   */
  async getMarketInfo(contractAddress: string, digest: string, targetSupply: bigint = ethers.toBigInt(1000)): Promise<any> {
    try {
      // Create interface from imported ABI
      const iface = new ethers.Interface(PPAppABI);

      const data = iface.encodeFunctionData('getMarket', [
        digest,
        targetSupply
      ]);

      // 首先检查合约是否有代码
      const code = await this.provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error(`合约地址 ${contractAddress} 在当前网络上不存在或未部署。请确认：\n1. 是否连接到正确的网络 (X Layer)\n2. 合约地址是否正确`);
      }

      const callResult = await this.provider.call({
        to: contractAddress,
        data,
      });

      // 检查是否返回错误
      if (callResult.startsWith('0x') && callResult.length < 10) {
        throw new Error('市场不存在 (MarketNotExists): 请检查 marketDigest 是否正确');
      }

      const result = iface.decodeFunctionResult('getMarket', callResult);
      return result;
    } catch (error: any) {
      // 解析合约错误
      if (error.message?.includes('MarketNotExists')) {
        throw new Error(`市场不存在: digest "${digest}" 在合约中未找到`);
      }
      if (error.message?.includes('call revert exception') || error.message?.includes('execution reverted')) {
        throw new Error(`合约调用失败: 可能是 marketDigest 不存在或参数错误。\nDigest: ${digest}`);
      }
      throw new Error(`获取市场信息失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * Get market digest list
   * @param contractAddress Contract address
   * @param start Start index (0-based)
   * @param limit Maximum number of digests to return
   * @returns Array of market digests (bytes32[])
   */
  async getMarketList(contractAddress: string, start: number = 0, limit: number = 10): Promise<string[]> {
    try {
      const iface = new ethers.Interface(PPAppABI);

      const data = iface.encodeFunctionData('getMarketList', [
        start,
        limit
      ]);

      const callResult = await this.provider.call({
        to: contractAddress,
        data,
      });

      const result = iface.decodeFunctionResult('getMarketList', callResult);
      return result[0];
    } catch (error: any) {
      if (error.message?.includes('call revert exception') || error.message?.includes('execution reverted')) {
        throw new Error(`获取市场列表失败: 合约调用异常`);
      }
      throw new Error(`获取市场列表失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}
