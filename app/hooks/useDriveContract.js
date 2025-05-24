"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../lib/contract";

export const useDriveContract = (signer) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (signer) {
      const driveContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setContract(driveContract);
    }
  }, [signer]);

  return contract;
};
