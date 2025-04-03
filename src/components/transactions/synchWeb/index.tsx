import { sendTransaction } from "~utils/sendTransaction"

import "../../../styles/transactions.css"

type SynchWebProps = {
  navigate: (page: string) => void
}

const SynchWeb = ({ navigate }: SynchWebProps) => {
  const handleSendTransaction = async () => {
    try {
      const transactions = await chrome.storage.local.get("transactions")
      if (!transactions.transactions || transactions.transactions.length === 0) {
        alert("Không có dữ liệu giao dịch!")
        return;
      }
      const transactionData = transactions.transactions.map((transaction) => {
        const amountStr = transaction.amount.replace(/[,\s]/g, '')
        
        return {
          amount: parseFloat(amountStr),
          date: transaction.date,
          description: transaction.description,
          bankName: transaction.bankName,
        }
      })
      await sendTransaction(transactionData)
      await chrome.storage.local.remove("transactions")
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu", error)
      alert("Có lỗi xảy ra, vui lòng thử lại!")
    }
  }
  return (
    <>
      <div className="transaction-container">
        <button className="transactionBtn" onClick={handleSendTransaction}>
          Data synchronization
        </button>
      </div>
    </>
  )
}

export default SynchWeb
