"use client";

import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers"; // ethers v6

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Prevents hydration errors
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const connectWallet = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const newProvider = new BrowserProvider(window.ethereum);
          const newSigner = await newProvider.getSigner();
          const address = await newSigner.getAddress();

          setProvider(newProvider);
          setSigner(newSigner);
          setAccount(address);
        } catch (error) {
          console.error("Wallet connection failed:", error);
        }
      } else {
        alert("Please install MetaMask");
      }
    };

    connectWallet();
  }, [isClient]);

  return { account, signer, provider };
};
