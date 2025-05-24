export const uploadFileToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload to IPFS failed");

  const data = await res.json();
  return {
    cid: data.IpfsHash,
    fileName: file.name,
  };
};
