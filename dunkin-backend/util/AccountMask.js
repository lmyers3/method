function maskAccountNumber(accountNumber) {
    // Ensure the account number is a string
    accountNumber = String(accountNumber);
  
    if (accountNumber.length <= 4) {
      // If the account number is 4 characters or less, return it as is
      return accountNumber;
    }
  
    let maskedSection = accountNumber.slice(0, -4).replace(/./g, '*'); // Replace all but the last four characters with *
    let visibleSection = accountNumber.slice(-4); // Extract the last four characters
  
    return maskedSection + visibleSection; // Return the masked account number
}

module.exports = maskAccountNumber