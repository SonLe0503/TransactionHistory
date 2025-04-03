
interface Transaction {
  date: string
  description: string
  amount: string
  bankName: string
}

export const saveTransactions = async (transactions: Transaction[]) => {
  try {
    if (transactions.length > 0) {
      await chrome.storage.local.set({ transactions })
    } else {
      console.log("No transactions to save")
    }
  } catch (error) {
    console.error("Error saving transactions:", error)
  }
}