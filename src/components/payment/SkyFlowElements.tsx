import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { Context as CheckoutContext } from '../../hooks/context/checkoutContext'
import Skyflow from 'skyflow-js';

function SkyFlowElements(props: any) {
    const {
        state: {
            skyFlow,
            collectContainer
        },
        actions: { updateStateHandler },
    } = useContext(CheckoutContext)
    useEffect(() => {
        skyFlowTokenization()
    }, [])

    const skyFlowTokenization = async () => {
        try {
            //  const revealView = document.getElementById("revealView");
            //  revealView.style.visibility = "hidden";
            // const url: any = "https://stage.apis.qisstpay.com/order-service/get_skyflow_bearer";

            // const skyflow = Skyflow.init({
            //     vaultID: "qbcfd534f4454a5d92a03cf8ec7d926e", // ID of the vault that the client should connect to.
            //     vaultURL: "https://a370a9658141.vault.skyflowapis-preview.com", // URL of the vault that the client should connect to.
            //     getBearerToken: () => {
            //         return new Promise((resolve, reject) => {
            //             axios
            //                 .get(url)
            //                 .then((response: any) => {
            //                     // console.log(response)
            //                     resolve(response.data.BearerToken);
            //                 })
            //                 .catch((error: any) => {
            //                     // console.log(error)
            //                     reject("Some Error occurred while fetching Bearer Token!");
            //                 });
            //         });
            //     },
            //     options: {
            //         logLevel: Skyflow.LogLevel.ERROR,
            //         env: Skyflow.Env.PROD,
            //     }
            // });

            // create collect Container
            // const collectContainer: any = skyflow.container(Skyflow.ContainerType.COLLECT);

            //custom styles for collect elements
            const collectStylesOptions = {
                inputStyles: {
                    base: {
                        border: "1pt solid #eae8ee",
                        padding: "10pt 16pt",
                        borderRadius: "4pt",
                        color: "#1d1d1d",
                    },
                    complete: {
                        color: "#4caf50",
                    },
                    empty: {},
                    focus: { border: "1pt solid #E82E81", color: "#E82E81" },
                    invalid: {
                        color: "#f44336",
                    },
                },
                labelStyles: {
                    base: {
                        fontSize: "16pt",
                        fontWeight: "bold",
                    },
                },
                errorTextStyles: {
                    base: {
                        color: "#f44336",
                    },
                },
            };

            // create collect elements
            const cardNumberElement: any = await collectContainer.create({
                table: "cards",
                column: "card_number",
                ...collectStylesOptions,
                placeholder: "Please enter 14 digits card number",
                type: Skyflow.ElementType.CARD_NUMBER,
            });

            const cvvElement: any = await collectContainer.create({
                table: "cards",
                column: "card_pin",
                ...collectStylesOptions,
                placeholder: "CVV",
                type: Skyflow.ElementType.CVV,
            });

            const expiryDateElement: any = await collectContainer.create({
                table: "cards",
                column: "expiry_month",
                ...collectStylesOptions,
                placeholder: "MM",
                type: Skyflow.ElementType.EXPIRATION_MONTH,
            }, {
                format: "mm"
            });

            const expiryYearElement: any = await collectContainer.create({
                table: "cards",
                column: "expiry_year",
                ...collectStylesOptions,
                placeholder: "YY",
                type: Skyflow.ElementType.EXPIRATION_YEAR,
            });

            // mount the elements
            await cardNumberElement.mount("#collectCardNumber");
            await cvvElement.mount("#collectCvv");
            await expiryDateElement.mount("#collectExpiryDate");
            await expiryYearElement.mount("#collectExpiryYear");
            // cardHolderNameElement.mount("#collectCardholderName");

            // const element: any = document.getElementById("collectPCIData");
            // element.addEventListener("click", async function () {
            //     await collectContainer.collect().then((res: any) => {
            //         console.log(res)
            //     }).catch((error: any) => {
            //         console.log(error);
            //     })
            // });


            // collect all elements data
            //  const collectButton = document.getElementById("collectPCIData");
            //  if (collectButton) {
            //    collectButton.addEventListener("click", () => {
            //      const collectResponse = collectContainer.collect();
            //      collectResponse
            //        .then((response) => {
            //          document.getElementById("collectResponse").innerHTML =
            //            JSON.stringify(response, null, 2);

            //          revealView.style.visibility = "visible";

            //          const revealStyleOptions = {
            //            inputStyles: {
            //              base: {
            //                border: "1px solid #eae8ee",
            //                padding: "10px 16px",
            //                borderRadius: "4px",
            //                color: "#1d1d1d",
            //                marginTop: "4px",
            //              },
            //            },
            //            labelStyles: {
            //              base: {
            //                fontSize: "16px",
            //                fontWeight: "bold",
            //              },
            //            },
            //            errorTextStyles: {
            //              base: {
            //                color: "#f44336",
            //              },
            //            },
            //          };

            //          // create Reveal Elements With Tokens
            //          const fieldsTokenData = response.records[0].fields;
            //          const revealContainer = skyflow.container(
            //            Skyflow.ContainerType.REVEAL
            //          );
            //          const revealCardNumberElement = revealContainer.create({
            //            token: fieldsTokenData.primary_card.card_number,
            //            label: "Card Number",
            //            ...revealStyleOptions,
            //          });
            //          revealCardNumberElement.mount("#revealCardNumber");

            //          const revealCardCvvElement = revealContainer.create({
            //            token: fieldsTokenData.primary_card.cvv,
            //            label: "CVV",
            //            ...revealStyleOptions,
            //            altText: "###",
            //          });
            //          revealCardCvvElement.mount("#revealCvv");

            //          const revealCardExpiryElement = revealContainer.create({
            //           token: fieldsTokenData.primary_card.expiry_date,
            //           label: "Card Expiry Date",
            //            ...revealStyleOptions,
            //          });
            //          revealCardExpiryElement.mount("#revealExpiryDate");

            //          const revealCardholderNameElement = revealContainer.create({
            //            token: fieldsTokenData.first_name,
            //            label: "Card Holder Name",
            //            ...revealStyleOptions,
            //          });
            //          revealCardholderNameElement.mount("#revealCardholderName");

            //          const revealButton = document.getElementById("revealPCIData");

            //          if (revealButton) {
            //            revealButton.addEventListener("click", () => {
            //             revealContainer.reveal().then((res)=>{
            //               console.log(res);
            //             }).catch((err)=>{
            //               console.log(err);
            //             });
            //            });
            //          }
            //        })
            //        .catch((err) => {
            //          console.log(err);
            //        });
            //    });
            //  }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div>
                <div className="row justify-content-center p-0 m-0">
                    <div style={{ height: "50pt" }} className="col-md-6 text-md-center text-center mt-4">
                        <div id="collectCardNumber" ></div>
                    </div>
                    <div style={{ height: "50pt" }} className="col-md-5 col-4 text-md-center text-center mt-0 ">
                        <div id="collectExpiryDate"></div>
                    </div>
                    <div style={{ height: "50pt" }} className="col-md-6 col-4 text-md-center text-center mt-0 ">
                        <div id="collectExpiryYear"></div>
                    </div>
                    <div style={{ height: "50pt" }} className="col-md-5 col-4 text-md-center text-center mt-0 mt-md-4">
                        <div id="collectCvv"></div>
                    </div>
                </div>



                {/* <div>
                    <button className={`basic-btn margin-top-0`} id="collectPCIData">Collect PCI Data</button>
                </div> */}
            </div>
        </>

    )
}

export default SkyFlowElements