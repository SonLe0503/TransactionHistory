import { useState } from "react"
import Login from "./components/login"
import Select from "./components/select"
import SynchApi from "./components/transactions/synchApi"
import SynchWeb from "./components/transactions/synchWeb"
function IndexPopup() {       
  const [page, setPage] = useState("login")

  return (
    <>
      {page === "login" && <Login navigate={setPage} />}
      {page === "select" && <Select navigate={setPage} />}
      {page === "Synch-API" && <SynchApi navigate={setPage} />}
      {page === "Synch-Web" && <SynchWeb navigate={setPage} />}
    </>
  )
}

export default IndexPopup
