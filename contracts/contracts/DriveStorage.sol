// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DriveStorage {
    struct File {
        string cid;
        string fileName;
        address uploader;
        address owner;
        uint256 timestamp;
    }

    mapping(address => File[]) private userFiles;
    mapping(string => address[]) private sharedWith;
    mapping(string => address[]) private ownershipHistory;
    address[] private uploaders;
    mapping(address => bool) private hasUploaded;

    event FileUploaded(address indexed user, string cid, string fileName);
    event FileShared(string cid, address indexed from, address indexed to);
    event OwnershipTransferred(string cid, address indexed from, address indexed to);

    // Upload new file (caller is the uploader & owner)
    function uploadFile(string memory _cid, string memory _fileName) external {
        File memory newFile = File(_cid, _fileName, msg.sender, msg.sender, block.timestamp);
        userFiles[msg.sender].push(newFile);
        ownershipHistory[_cid].push(msg.sender); // initial owner

        if (!hasUploaded[msg.sender]) {
            uploaders.push(msg.sender);
            hasUploaded[msg.sender] = true;
        }

        emit FileUploaded(msg.sender, _cid, _fileName);
    }

    // Share file with another user (only current owner can share)
    function shareFile(string memory _cid, address _recipient) external {
        bool found = false;

        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            if (keccak256(bytes(userFiles[msg.sender][i].cid)) == keccak256(bytes(_cid))) {
                if (userFiles[msg.sender][i].owner == msg.sender) {
                    found = true;
                    break;
                }
            }
        }

        require(found, "Only owner can share this file");
        sharedWith[_cid].push(_recipient);
        emit FileShared(_cid, msg.sender, _recipient);
    }

    // Transfer ownership (only current owner can do this)
    function transferOwnership(string memory _cid, address _newOwner) external {
        bool transferred = false;

        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            File storage f = userFiles[msg.sender][i];

            if (keccak256(bytes(f.cid)) == keccak256(bytes(_cid)) && f.owner == msg.sender) {
                f.owner = _newOwner;
                ownershipHistory[_cid].push(_newOwner);
                emit OwnershipTransferred(_cid, msg.sender, _newOwner);

                // Move file to new owner's list
                userFiles[_newOwner].push(f);
                // Remove from old owner's list
                removeFileFromOwner(msg.sender, i);
                transferred = true;
                break;
            }
        }

        require(transferred, "Ownership transfer failed. Not owner or file not found.");

        if (!hasUploaded[_newOwner]) {
            uploaders.push(_newOwner);
            hasUploaded[_newOwner] = true;
        }
    }

    // Internal: remove file at index from user's list
    function removeFileFromOwner(address user, uint index) internal {
        uint len = userFiles[user].length;
        if (index < len - 1) {
            userFiles[user][index] = userFiles[user][len - 1];
        }
        userFiles[user].pop();
    }

    // Get caller's files (still only the ones they currently "own")
    function getMyFiles() external view returns (File[] memory) {
        return userFiles[msg.sender];
    }

    // Get files shared with the caller
    function getSharedFiles() external view returns (File[] memory) {
        uint total = 0;

        for (uint u = 0; u < uploaders.length; u++) {
            address userAddress = uploaders[u];
            File[] memory files = userFiles[userAddress];

            for (uint i = 0; i < files.length; i++) {
                address[] memory sharedUsers = sharedWith[files[i].cid];
                for (uint j = 0; j < sharedUsers.length; j++) {
                    if (sharedUsers[j] == msg.sender) {
                        total++;
                        break;
                    }
                }
            }
        }

        File[] memory result = new File[](total);
        uint index = 0;

        for (uint u = 0; u < uploaders.length; u++) {
            address userAddress = uploaders[u];
            File[] memory files = userFiles[userAddress];

            for (uint i = 0; i < files.length; i++) {
                address[] memory sharedUsers = sharedWith[files[i].cid];
                for (uint j = 0; j < sharedUsers.length; j++) {
                    if (sharedUsers[j] == msg.sender) {
                        result[index] = files[i];
                        index++;
                        break;
                    }
                }
            }
        }

        return result;
    }

    // Get ownership history for a file
    function getOwnershipHistory(string memory _cid) external view returns (address[] memory) {
        return ownershipHistory[_cid];
    }
}
