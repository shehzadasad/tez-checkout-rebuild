import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useHistory } from 'react-router-dom';
import { usePaymentSelectionHook } from '../../hooks/custom/usePaymentSelection'
import { routes } from '../../router/routes';
import '../../styles/checkout.css'

const AlfalahPayment: React.FC = () => {
    const { sessionID } = useParams<{ sessionID?: string | any }>();
    const { orderID } = useParams<{ orderID?: any }>();
    const { amount } = useParams<{ amount?: any }>();
    const [innerHTML, setInnerHTML] = useState("Press Button To Pay With Alfalah")

    useEffect(() => {
        var html = atob(orderID)
        console.log("Alfalah HTML: ", html)
        setInnerHTML(html)
        setTimeout(() => {
            var container = document.getElementById("alfalah-container")
            if (container) {
                container.innerHTML = html.toString()
                console.log("INNNNNNNNNNN");
            }
        }, 3000);
    }, [orderID])


    // const callBackSuccess = (): string => {
    //     console.log("Payment Successful")
    //     window.localStorage.setItem('alfalahRedirectURL', 'https://stage.apis.qisstpay.com/order-service/call_back?payment_gateway=alfalah');
    //     return "https://stage.apis.qisstpay.com/order-service/call_back?payment_gateway=alfalah"
    // }

    // useEffect(() => {
    //     console.log("Alfalah Component")
    //     console.log("Params: ", sessionID, orderID, amount)

    //     const script = document.createElement('script');
    //     script.src = "https://test-bankalfalah.gateway.mastercard.com/checkout/version/54/checkout.js";
    //     script.async = true;
    //     script.setAttribute("data-complete", callBackSuccess())
    //     script.setAttribute("data-error", "https://stage.apis.qisstpay.com/order-service/call_back?payment_gateway=alfalah")
    //     document.head.appendChild(script);

    //     script.onload = async () => {
    //         callPayment();
    //         (window as any).Checkout.showPaymentPage();
    //         // setNewRedirectURLAlfalah("https://stage.apis.qisstpay.com/order-service/call_back?payment_gateway=alfalah")
    //         // history.push(routes.paymentSelectionPage)
    //     }

    //     //callPayment()
    // }, [])

    // const callPayment = async () => {
    //     let jSon = {
    //         merchant: 'TESTQISSTPAY1',//merchant ID
    //         session: {
    //             id: sessionID
    //         },
    //         order: {
    //             amount: amount,
    //             currency: 'PKR',
    //             description: 'Ordered goods',
    //             id: orderID
    //         },
    //         interaction: {
    //             operation: 'PURCHASE', // set this field to 'PURCHASE' for <<checkout>> to perform a Pay Operation.
    //             merchant: {
    //                 name: 'Bank Alfalah',
    //                 address: {
    //                     line1: '200 Sample St',
    //                     line2: '1234 Example Town'
    //                 }
    //             }
    //         }
    //     };
    //     await (window as any).Checkout.configure(
    //         jSon
    //     )

    // }

    return (
        <>
            {/* <Helmet>
                <script
                    async
                    type="text/javascript"
                    src="https://test-bankalfalah.gateway.mastercard.com/checkout/version/54/checkout.js"
                    data-complete="https://stage.apis.qisstpay.com/order-service/call_back?payment_gateway=alfalah"
                ></script>
            </Helmet> */}
            {/* <button onClick={() => {
                callPayment()
            }}>
                Configure
            </button> */}
            <div id='alfalah-container'>
            </div>

        </>


    )
}

export default AlfalahPayment