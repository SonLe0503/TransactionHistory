import { saveTransactions } from "../utils/saveTransactions"
import type { Transaction } from "../utils/types";
export const observerMBbank = () => {
  const observer = new MutationObserver((mutations) => {
    const button = document.querySelector(".btn.btn-primary.abtn")
    if (button) {
      observer.disconnect()
      button.addEventListener("click", () => {
        setTimeout(extractMBbankTransactions, 1000)
      })
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

const extractMBbankTransactions = () => {
  const targetElement = document.querySelector("table")
  if ( targetElement) {
    const rows = targetElement.querySelectorAll("tr.ng-star-inserted")
    const transactionData: Transaction[] = Array.from(rows).map((row) => {
      let columns = row.querySelectorAll("td")
      const dateElement = columns[1]
      const descriptionElement = columns[4]
      const amountElement = columns[2]
      const amount = amountElement?.textContent?.trim() || ""
      const bankName = "MBbank"
      return {
        date: dateElement?.textContent?.trim() || "",
        description: descriptionElement?.textContent?.trim() || "",
        amount: amount,
        bankName: bankName
      }      
    })
    saveTransactions(transactionData)
  }
 }
 