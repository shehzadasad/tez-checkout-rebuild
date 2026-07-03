import React from "react";
import { Modal } from "react-bootstrap";
import { EActiveInstructionSlide } from "../../hooks/custom/usePaymentSelection";

interface IProps {
  show: boolean;
  onHide: () => void;
  prevSlide: () => void;
  nextSlide: () => void;
  activeSlide: EActiveInstructionSlide;
}

const PaymentInstructionModal: React.FC<IProps> = ({
  show,
  onHide,
  nextSlide,
  prevSlide,
  activeSlide,
}: IProps) => {
  return (
    <Modal
      fullscreen={true}
      id="custom-how"
      dialogClassName="modal-90vh"
      show={show}
      onHide={onHide}
    >
      <div onClick={onHide} className="crossBtn">
        <img src="/assets/cross.png"></img>
      </div>
      <Modal.Body style={{ margin: "0", padding: "0" }} className="margin-auto">
        <div
          style={{ height: "100%", overflow: "hidden" }}
          className="relative"
        >
          {activeSlide == EActiveInstructionSlide.ONE && (
            <img
              style={{ height: "110vh" }}
              className="w-100"
              src="/assets/opt-ed-6.gif"
              alt="Loading..."
            ></img>
          )}
          {activeSlide == EActiveInstructionSlide.TOW && (
            <img
              style={{ height: "110vh" }}
              className="w-100"
              src="/assets/opt-ed-8.gif"
              alt="Loading..."
            ></img>
          )}
          {activeSlide == EActiveInstructionSlide.THREE && (
            <img
              style={{ height: "110vh" }}
              className="w-100"
              src="/assets/opt-ed-7.gif"
              alt="Loading..."
            ></img>
          )}
          {activeSlide == EActiveInstructionSlide.FOUR && (
            <img
              style={{ height: "110vh" }}
              className="w-100"
              src="/assets/opt-ed-9.gif"
              alt="Loading..."
            ></img>
          )}
          <div className="w-100 drop-heading-container absolute howitworks">
            <button onClick={prevSlide} className="howitworks_btn">
              Previous
            </button>

            {activeSlide != EActiveInstructionSlide.FOUR && (
              <button onClick={nextSlide} className="howitworks_btn">
                Next
              </button>
            )}
            {activeSlide == EActiveInstructionSlide.FOUR && (
              <button onClick={onHide} className="howitworks_btn">
                Close
              </button>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentInstructionModal;
