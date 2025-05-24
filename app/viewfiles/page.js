const [myFiles, setMyFiles] = useState([]);

const fetchMyFiles = async () => {
  if (!contract) return;
  const files = await contract.getMyFiles();
  setMyFiles(files);
};

useEffect(() => {
  if (contract) fetchMyFiles();
}, [contract]);

return (
  <div className="mt-8">
    <h2 className="text-lg font-semibold">My Uploaded Files:</h2>
    <ul>
      {myFiles.map((file, i) => (
        <li key={i}>
          <a
            href={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 {file.fileName}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
