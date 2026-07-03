import { Modal } from "react-bootstrap";

interface IProps {
  show: boolean;
  handleClose: () => void;
}

const HelpUsModal: React.FC<IProps> = ({ handleClose, show }: IProps) => {
  return (
    <Modal fullscreen={true} id="custom-how" show={show} onHide={handleClose}>
      <div onClick={handleClose} className="crossBtn">
        <img src="/assets/cross.png"></img>
      </div>
      <Modal.Body
        style={{ margin: "0", padding: "0", textAlign: "center" }}
        className="margin-auto"
      >
        <div className="svgUpperDiv"></div>
        <img className="w-100 helpUSvg" src="/assets/helpus.svg"></img>
        <div className="svgLowerDiv"></div>
      </Modal.Body>
    </Modal>
  );
};

export default HelpUsModal;
