import { useState } from "react"
import Login from "./components/login"
import SelectBank from "./components/select"
import MBBank from "./components/transactions/mbbank"
function IndexPopup() {       
  const [page, setPage] = useState("login")

  return (
    <>
      {page === "login" && <Login navigate={setPage} />}
      {page === "select-bank" && <SelectBank navigate={setPage} />}
      {page === "MBbank" && <MBBank navigate={setPage} />}
    </>
  )
}

export default IndexPopup
