import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData,
    });

    const data = await res.json();
    setIpfsHash(data.IpfsHash);
  };

  return (
    <div className="p-4 border rounded-lg">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Upload
      </button>
      {ipfsHash && (
        <div className="mt-4">
          <p>Uploaded to IPFS:</p>
          <a
            href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
            target="_blank"
            className="text-blue-500 underline"
            rel="noreferrer"
          >
            View File
          </a>
        </div>
      )}
    </div>
  );
}
