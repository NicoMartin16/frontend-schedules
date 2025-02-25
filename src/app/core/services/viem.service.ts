import { Injectable } from '@angular/core';
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  GetAddressesReturnType,
  http,
  PublicClient,
  WalletClient,
} from 'viem';
import { environment } from '../../../environments/environment.development';
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';

@Injectable({
  providedIn: 'root',
})
export class ViemService {
  
  public walletClient!: WalletClient;
  public publicClient!: PublicClient;
  public canConnectWallet: boolean = false;
  private metaMaskSdk: MetaMaskSDK;
  private ethereum: SDKProvider | undefined;
  private apiUrl = '/api/evt';

  constructor() {
    this.metaMaskSdk = new MetaMaskSDK({
      dappMetadata: {
        name: 'schedules-dapp',
      },
    });
    this.restoreConnection();
  }

  private async restoreConnection(): Promise<void> {
    const connected = localStorage.getItem('walletConnected');
    if (connected === 'true') {
      await this.connectWallet();
    }
  }

  public async connectWallet(): Promise<boolean> {
    await this.metaMaskSdk.connect();
    this.ethereum = this.metaMaskSdk.getProvider();
    if (this.ethereum) {
      try {
        await this.ethereum.request({
          method: 'eth_requestAccounts',
          params: [],
        });
        this.walletClient = createWalletClient({
          chain: environment.chain,
          transport: custom(this.ethereum),
        });
        this.publicClient = createPublicClient({
          chain: environment.chain,
          transport: http(),
        });
        this.canConnectWallet = true;
        if (this.canConnectWallet) {
          localStorage.setItem('walletConnected', 'true');
        } else {
          localStorage.removeItem('walletConnected');
        }
        return this.canConnectWallet;
      } catch (error) {
        console.error(error);
        this.canConnectWallet = false;
        localStorage.removeItem('walletConnected');
        return this.canConnectWallet;
      }
    } else {
      this.canConnectWallet = false;
      console.log('No ethereum provider found');
      localStorage.removeItem('walletConnected');
      return this.canConnectWallet;
    }
  }

  public async getAddress(): Promise<GetAddressesReturnType> {
    return await this.walletClient.getAddresses();
  }

  public async getConnectedAddress(): Promise<Address | null> {
    if (this.ethereum) {
      const accounts = await this.ethereum.request({ method: 'eth_accounts' }) as Address[];
      return accounts.length > 0 ? accounts[0] : null;
    }
    return null;
  }
  
}
