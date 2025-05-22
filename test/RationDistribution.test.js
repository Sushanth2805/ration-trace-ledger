
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RationDistribution Contract", function () {
  let rationDistribution;
  let owner;
  let addr1;
  let addr2;
  let verificationCode = "GOVT2024";

  beforeEach(async function () {
    // Get contract factories and signers
    const RationDistribution = await ethers.getContractFactory("RationDistribution");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract with initial verification code
    rationDistribution = await RationDistribution.deploy(verificationCode);
    await rationDistribution.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rationDistribution.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should add a new transaction", async function () {
      const tx = await rationDistribution.addTransaction(
        "John Doe",
        "BEN123",
        "Rice",
        100,
        "SHOP001",
        "Officer Smith"
      );
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Check transaction count
      expect(await rationDistribution.getTransactionCount()).to.equal(1);
      
      // Get transaction details
      const transaction = await rationDistribution.getTransaction(0);
      
      // Verify transaction details
      expect(transaction.beneficiaryName).to.equal("John Doe");
      expect(transaction.beneficiaryId).to.equal("BEN123");
      expect(transaction.itemType).to.equal("Rice");
      expect(transaction.quantity).to.equal(100);
      expect(transaction.shopId).to.equal("SHOP001");
      expect(transaction.officerName).to.equal("Officer Smith");
      expect(transaction.removed).to.equal(false);
    });

    it("Should mark a transaction as removed", async function () {
      // Add a transaction
      await rationDistribution.addTransaction(
        "Jane Doe",
        "BEN456",
        "Wheat",
        50,
        "SHOP002",
        "Officer Johnson"
      );
      
      // Request removal
      const tx = await rationDistribution.requestRemoval(
        0,
        verificationCode,
        "Verifier Adams",
        "Duplicate entry"
      );
      
      await tx.wait();
      
      // Get transaction details
      const transaction = await rationDistribution.getTransaction(0);
      
      // Verify transaction is marked as removed
      expect(transaction.removed).to.equal(true);
      expect(transaction.removalReason).to.equal("Duplicate entry");
      expect(transaction.verifierName).to.equal("Verifier Adams");
    });

    it("Should fail with incorrect verification code", async function () {
      // Add a transaction
      await rationDistribution.addTransaction(
        "Alice Smith",
        "BEN789",
        "Sugar",
        25,
        "SHOP003",
        "Officer Davis"
      );
      
      // Try to remove with incorrect code
      await expect(
        rationDistribution.requestRemoval(
          0,
          "WRONG_CODE",
          "Verifier Wilson",
          "Error in entry"
        )
      ).to.be.revertedWith("Invalid verification code");
    });
  });

  describe("Statistics", function () {
    it("Should return correct statistics", async function () {
      // Add transactions
      await rationDistribution.addTransaction(
        "User 1",
        "ID1",
        "Rice",
        10,
        "S1",
        "O1"
      );
      
      await rationDistribution.addTransaction(
        "User 2",
        "ID2",
        "Wheat",
        20,
        "S2",
        "O2"
      );
      
      await rationDistribution.requestRemoval(
        0,
        verificationCode,
        "Verifier",
        "Test"
      );
      
      // Get stats
      const stats = await rationDistribution.getStats();
      
      // Verify stats
      expect(stats.totalTransactions).to.equal(2);
      expect(stats.removedTransactions).to.equal(1);
    });
  });
});
