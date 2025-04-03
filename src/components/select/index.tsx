import "../../styles/selectBank.css";
type SelectProps = {
  navigate: (page: string) => void; 
}
               
const Select = ({navigate}: SelectProps) => {
  return (
    <div className="select-bank-container">
      <h2>Chọn ngân hàng</h2>
      <div className="bank-list">
        <div className="bank-item">
          <button onClick={() => navigate('Synch-API')}>
            Synch API
          </button>
        </div>
        <div className="bank-item">
          <button onClick={() => navigate("Synch-Web")}>
            Synch Web
          </button>
        </div>
      </div>
    </div>
  )
}
export default Select;