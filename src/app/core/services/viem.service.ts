import { Injectable } from '@angular/core';
import {
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

  constructor() {
    this.metaMaskSdk = new MetaMaskSDK({
      dappMetadata: {
        name: 'schedules-dapp',
      },
    });
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
        return this.canConnectWallet;
      } catch (error) {
        console.error(error);
        this.canConnectWallet = false;
        return this.canConnectWallet;
      }
    } else {
      this.canConnectWallet = false;
      console.log('No ethereum provider found');
      return this.canConnectWallet;
    }
  }

  public async getAddress(): Promise<GetAddressesReturnType> {
    return await this.walletClient.getAddresses();
  }
}
