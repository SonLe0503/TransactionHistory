
interface Transaction {
  amount: number
  date: string
  description: string
  bankName: string
}

export const sendTransaction = async (transactions: Transaction[]) => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:2000/transaction/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ transactions }),
  });
  if (!response.ok) {
    throw new Error(`Lỗi khi gửi dữ liệu: ${response.statusText}`);
  }
  alert("Đã lấy được dữ liệu giao dịch về hệ thống!");
}