import React from 'react';
import { useContext, useEffect, useState } from "react";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";




const AlfalahSubmitPage = () => {
    const {
        state: {
            AlfalahHTMLSnippet
        },
        actions: { updateStateHandler },
    } = useContext(CheckoutContext);

    useEffect(() => {
        var checkoutContainer = document.getElementById("my-checkout-container");
        if (checkoutContainer) {
            checkoutContainer.innerHTML = AlfalahHTMLSnippet;
            var scriptsTags = checkoutContainer.getElementsByTagName("script");
            // This is necessary otherwise the scripts tags are not going to be evaluated
            for (var i = 0; i < scriptsTags.length; i++) {
                var parentNode = scriptsTags[i].parentNode!;
                var newScriptTag = document.createElement("script");
                newScriptTag.type = "text/javascript";
                newScriptTag.text = scriptsTags[i].text;
                parentNode.removeChild(scriptsTags[i]);
                parentNode.appendChild(newScriptTag);
            }
        }
    }, []);


    return (
        <div id="my-checkout-container"></div>
    );
};

export default AlfalahSubmitPage;