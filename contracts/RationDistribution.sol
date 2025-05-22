
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RationDistribution
 * @dev Government Ration Distribution Tracking System on Blockchain
 */
contract RationDistribution is Ownable {
    // Transaction struct
    struct Transaction {
        uint256 id;
        string beneficiaryName;
        string beneficiaryId;
        string itemType;
        uint256 quantity;
        string shopId;
        string officerName;
        uint256 timestamp;
        bool removed;
        string removalReason;
        string verifierName;
        uint256 removalTimestamp;
    }

    // State variables
    uint256 private transactionCount;
    mapping(uint256 => Transaction) private transactions;
    string public verificationCode;
    
    // Events
    event TransactionAdded(
        uint256 id, 
        string beneficiaryId, 
        string itemType, 
        uint256 quantity, 
        uint256 timestamp
    );
    
    event TransactionRemoved(
        uint256 id, 
        string verifierName, 
        string removalReason, 
        uint256 removalTimestamp
    );

    // Constructor
    constructor(string memory _initialVerificationCode) Ownable(msg.sender) {
        verificationCode = _initialVerificationCode;
        transactionCount = 0;
    }

    /**
     * @dev Add a new transaction to the blockchain
     */
    function addTransaction(
        string memory beneficiaryName,
        string memory beneficiaryId,
        string memory itemType,
        uint256 quantity,
        string memory shopId,
        string memory officerName
    ) public returns (uint256) {
        uint256 newId = transactionCount;
        
        transactions[newId] = Transaction({
            id: newId,
            beneficiaryName: beneficiaryName,
            beneficiaryId: beneficiaryId,
            itemType: itemType,
            quantity: quantity,
            shopId: shopId,
            officerName: officerName,
            timestamp: block.timestamp,
            removed: false,
            removalReason: "",
            verifierName: "",
            removalTimestamp: 0
        });
        
        transactionCount++;
        
        emit TransactionAdded(
            newId, 
            beneficiaryId, 
            itemType, 
            quantity, 
            block.timestamp
        );
        
        return newId;
    }

    /**
     * @dev Request removal of a transaction with verification
     */
    function requestRemoval(
        uint256 transactionId,
        string memory inputVerificationCode,
        string memory verifierName,
        string memory removalReason
    ) public returns (bool) {
        require(transactionId < transactionCount, "Transaction does not exist");
        require(!transactions[transactionId].removed, "Transaction already removed");
        
        bytes32 inputHash = keccak256(abi.encodePacked(inputVerificationCode));
        bytes32 storedHash = keccak256(abi.encodePacked(verificationCode));
        require(inputHash == storedHash, "Invalid verification code");
        
        Transaction storage transaction = transactions[transactionId];
        transaction.removed = true;
        transaction.removalReason = removalReason;
        transaction.verifierName = verifierName;
        transaction.removalTimestamp = block.timestamp;
        
        emit TransactionRemoved(
            transactionId, 
            verifierName, 
            removalReason, 
            block.timestamp
        );
        
        return true;
    }

    /**
     * @dev Update the verification code (only owner)
     */
    function updateVerificationCode(string memory newCode) public onlyOwner {
        verificationCode = newCode;
    }

    /**
     * @dev Get transaction details
     */
    function getTransaction(uint256 transactionId) public view returns (
        uint256 id,
        string memory beneficiaryName,
        string memory beneficiaryId,
        string memory itemType,
        uint256 quantity,
        string memory shopId,
        string memory officerName,
        uint256 timestamp,
        bool removed,
        string memory removalReason,
        string memory verifierName,
        uint256 removalTimestamp
    ) {
        require(transactionId < transactionCount, "Transaction does not exist");
        
        Transaction memory transaction = transactions[transactionId];
        
        return (
            transaction.id,
            transaction.beneficiaryName,
            transaction.beneficiaryId,
            transaction.itemType,
            transaction.quantity,
            transaction.shopId,
            transaction.officerName,
            transaction.timestamp,
            transaction.removed,
            transaction.removalReason,
            transaction.verifierName,
            transaction.removalTimestamp
        );
    }

    /**
     * @dev Get total number of transactions
     */
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    /**
     * @dev Get system statistics
     */
    function getStats() public view returns (
        uint256 totalTransactions,
        uint256 removedTransactions
    ) {
        uint256 removed = 0;
        
        for (uint256 i = 0; i < transactionCount; i++) {
            if (transactions[i].removed) {
                removed++;
            }
        }
        
        return (transactionCount, removed);
    }
}
