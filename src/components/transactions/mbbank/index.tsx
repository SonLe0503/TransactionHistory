import { useEffect, useState } from "react"

import { merRequests } from "../../../auth";
import "../../../styles/transaction.css"
interface Transaction {
  transactionDate: string
  creditAmount: string
  debitAmount: string
  currency: string
  refNo: string
  description: string
  benAccountName: string
  benAccountNo: string
  bankName: string
}

interface AuthInfo {
  body: any
  headers: { name: string; value: string }[]
}

interface MBBankProps {
  navigate: (page: string) => void
}
const MBBank = ({ navigate }: MBBankProps) => {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [accountNo, setAccountNo] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null)
  const initializeAuth = async () => {
    const info = await merRequests()
    setAuthInfo(info)
  }

  const formatDateForApi = (date: string) => {
    const [year, month, day] = date.split("-")
    return `${day}/${month}/${year}`
  }

  const handleGetTransaction = async () => {
    if (!authInfo?.body || !authInfo?.headers) {
      console.error("Authentication info not found")
      return;
    }

    const myHeaders = new Headers()
    authInfo.headers.forEach((header) => {
      myHeaders.append(header.name, header.value)
    })
    console.log("myHeaders", myHeaders)
    const rawData = {
      ...authInfo.body,
      fromDate: formatDateForApi(fromDate),
      toDate: formatDateForApi(toDate),
      accountNo: accountNo
    }
    console.log("rawData", rawData)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(rawData),
      redirect: "follow" as RequestRedirect
    }
    console.log("requestOptions", requestOptions)
    try {
      const response = await fetch(
        "https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history",
        requestOptions
      )
      console.log("response", response)
      const result = await response.json()
      console.log("result", result)
      setTransactions(result.transactionHistoryList ?? [])
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const handleSendTransaction = async () => {
   try {
    const transactionData = transactions.map(transaction => {
      const isCredit = transaction.creditAmount !== "0";
      const amount = isCredit ? transaction.creditAmount : `-${transaction.debitAmount}`;
      const bankName = "MBbank"

      return {
        amount: parseFloat(amount),
        date: transaction.transactionDate,
        description: transaction.description,
        bankName: bankName,
      }
    });
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:2000/transaction/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ transactions: transactionData}),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi server: ${response.status} - ${response.statusText}\n` +
        `Chi tiết: ${errorData ? JSON.stringify(errorData) : 'Không có thông tin thêm'}`
      );
    }
    alert("Đã lấy được dữ liệu giao dịch về hệ thống!");
   } catch (error) {
    console.error("Lỗi khi gửi dữ liệu", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
   }
  }

  useEffect(() => {
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)

    const formattedToday = today.toISOString().split("T")[0]
    const formattedLastWeek = lastWeek.toISOString().split("T")[0]

    setFromDate(formattedLastWeek)
    setToDate(formattedToday)
    initializeAuth()
  }, [])

  return (
    <>
      <h2>Request Logger</h2>
      <div id="transactionList">
        <div className="filter-section">
          <div className="date-filter">
            <div className="filter-group">
              <label htmlFor="accountNo">AccountNo:</label>
              <input
                type="text"
                id="accountNo"
                className="date-input"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="fromDate">FromDate:</label>
              <input
                type="date"
                id="fromDate"
                className="date-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="toDate">ToDate:</label>
              <input
                type="date"
                id="toDate"
                className="date-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate}
              />
            </div>
            <button className="transactionBtn" onClick={handleGetTransaction}>
              Filter
            </button>
            <button className="resetFilterBtn">Reset</button>
            <button className="setTransactionApiBtn" onClick={handleSendTransaction}>
              Data synchronization
            </button>
          </div>
        </div>
        <h3>Transactions</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction Date</th>
              <th>Money</th>
              <th>RefNo</th>
              <th>Description</th>
              <th>Beneficiary unit/ Transfer unit</th>
              <th>Account</th>
              <th>Partner bank</th>
            </tr>
          </thead>
          <tbody id="transactionData">
            {transactions.map((transaction, index) => {
              const isCredit = transaction.creditAmount !== "0"
              const amount = isCredit
                ? transaction.creditAmount
                : `-${transaction.debitAmount}`
              const formattedAmount = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: transaction.currency
              }).format(parseFloat(amount))
              return (
                <tr key={index}>
                  <td>{transaction.transactionDate}</td>
                  <td
                    className={
                      parseFloat(amount) >= 0
                        ? "amount-positive"
                        : "amount-negative"
                    }>
                    {formattedAmount}
                    <br />
                    <small
                      className={`transaction-type ${
                        parseFloat(amount) >= 0 ? "type-receive" : "type-send"
                      }`}>
                      {isCredit ? "Nhận tiền" : "Chuyển tiền"}
                    </small>
                  </td>
                  <td>{transaction.refNo}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.benAccountName || ""}</td>
                  <td>{transaction.benAccountNo || ""}</td>
                  <td>{transaction.bankName || ""}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default MBBank
