import "../../styles/selectBank.css"
import imageMbbank from "data-base64:../../../assets/images/mbbank.png";
import imageVietcombank from "data-base64:../../../assets/images/vietcombank.png";
type SelectBankProps = {
  navigate: (page: string) => void; 
}
               
const SelectBank = ({navigate}: SelectBankProps) => {
  return (
    <div className="select-bank-container">
      <h2>Chọn ngân hàng</h2>
      <div className="bank-list">
        <div className="bank-item">
          <button>
            <img src={imageMbbank} alt="MBbank" />
          </button>
        </div>
        <div className="bank-item">
          <button>
            <img src={imageVietcombank} alt="Vietcombank" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default SelectBank;