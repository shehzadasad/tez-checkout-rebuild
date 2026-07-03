import { useEffect, useRef, useState, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { AnyCnameRecord } from "dns";
import InputAdornment from "@mui/material/InputAdornment";
import { Modal } from "react-bootstrap";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import { borderRadius } from "@mui/system";
import { IUpSellResponse } from "../../interfaces/apis/upsell.interface";

interface IProps {
  show: boolean;
  onHide: () => void;
  products: IUpSellResponse[];
  addToCart: Function,
  cartItems: any 
}

const UpsellCard: React.FC<IProps> = (props: IProps) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const[details, setDetails] = useState({
    img: "",
    price: 0,
  id: 0  ,
  isAdded: false
})

const {
  state: { currency },
  actions: { updateStateHandler },
} = useContext(CheckoutContext);

useEffect(() => {
  const obj = {img: "",
  price: 0,
id: 0  ,
isAdded: false}
  if(props.products[activeSlide].product_info.price && props.products[activeSlide].product_info.price){
    obj.img = props.products[activeSlide].product_info.image;
    obj.price = props.products[activeSlide].product_info.price!;
    obj.id = props.products[activeSlide].product_info.id;

  }else{
    obj.img = props.products[activeSlide].product_variants[0].featured_image
    obj.price =props.products[activeSlide].product_variants[0].price
    obj.id =props.products[activeSlide].product_variants[0].id
  }
  obj.isAdded =props.cartItems.some((elem: any) => elem.id == obj.id);
  setDetails({...obj});
},[activeSlide,props.cartItems])

  const nextSlideHandler = () => {
    setActiveSlide((prev) => (prev == props.products.length-1 ? prev : prev + 1));
  };

  const prevSlideHandler = () => {
    setActiveSlide((prev) => (prev == 0 ? prev : prev - 1));
  };
  const addToCartHandler = () => {
    props.addToCart(props.products[activeSlide]);
  }
 
  
  return (
    <div className="center-box">
      <Modal show={props.show}>
        <div style={{top:"10px",right:"10px"}} className="crossBtn" onClick={props.onHide}>
          <img src="/assets/cross.png"></img>
        </div>
        <Modal.Body
          style={{
            margin: "0",
            padding: "0",
            textAlign: "center",
            height: "600px",
          }}
          className="margin-auto"
        >
          <div style={{position:"relative"}}>
            <div style={{ height: "100%", paddingTop: "20px" }}>
              <div style={{ height: "250px", width: "80%", margin: "auto" ,marginBottom:"05px"}}>
                <img
                  style={{ width: "100%", height: "100%" }}
                  className=""
                  src={details.img}
                ></img>
              </div>

              <div
                style={{ textAlign: "start", paddingLeft: "20px" }}
                className=""
              >
                <p>{props.products[activeSlide].product_info.title}</p>
                <p style={{ fontWeight: "bold" }}>{currency}{details.price}</p>
              </div>
              <div style={{ margin: "auto", textAlign: "center" }}>
                
                <button
                  style={{
                    background: details.isAdded ? "grey" : "black",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    paddingRight: "10px",
                    paddingLeft: "20px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    fontSize: "14px",
                  }}
                  onClick={addToCartHandler}
                  disabled={details.isAdded}
                >
                  Add to bag
                </button>
              </div>
            </div>
            <div style={{position:"absolute",left:0,right:0,top:"50%"}}>
            <div style={{display:"flex",justifyContent:"space-between", paddingLeft:"10px",paddingRight:"10px"}}>
              <div onClick={prevSlideHandler} style={{cursor:"pointer"}}>&#8592;	</div>
              <div onClick={nextSlideHandler} style={{cursor:"pointer"}}>&#8594;</div>
            </div>
            </div>
          
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UpsellCard;
