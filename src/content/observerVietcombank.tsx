import { saveTransactions } from "../utils/saveTransactions"
import type { Transaction } from "../utils/types";


export const observerVietcombank = () => {
  const observer = new MutationObserver((mutations) => {
    const button = document.querySelector(".btn-group-1-3")
    if (button) {
      observer.disconnect()
      button.addEventListener("click", () => {
        setTimeout(extractVietcombankTransactions, 1000)
      })
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

const extractVietcombankTransactions = () => {
  const targetElement = document.querySelector(".mt-8.box.ng-star-inserted")
  if (targetElement) {
    const transactions = targetElement.querySelectorAll("a.list-item")
    const transactionData: Transaction[] = Array.from(transactions).map(
      (transaction) => {
        const dateElement = transaction.querySelector(
          ".text-textBaseSecondary.text-14-medium"
        )
        const descriptionElement = transaction.querySelector(".text-16-bold")
        const amountElement = transaction.querySelector(".text-currency-3")
        const amount = amountElement?.textContent?.trim() || ""
        const bankName = "Vietcombank"
        return {
          date: dateElement?.textContent?.trim() || "",
          description: descriptionElement?.textContent?.trim() || "",
          amount: amount.replace("VND", "").trim(),
          bankName: bankName
        }
      }
    )
    saveTransactions(transactionData)
  } 
}