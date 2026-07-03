import React from "react";
// import Iframe from 'react-iframe'
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const OpenCheckout = () => {
  const theme = useTheme();

  const [pageURL, setPageURL] = useState(window.location.href);
  const query = new URLSearchParams(window.location.search);
  const identityToken = query.get("identity-token");
  const queryUrl = query.get("queryUrl");
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  //ms.tezcheckout.qisstpay.com/open-checkout-iframe/?identity-token={identityToken}&queryUrl={queryURL}
  return (
    <>
      {pageURL && (
        // <Iframe
        //   url={`https://ms.tezcheckout.qisstpay.com/?identity-token=${identityToken}&queryurl=${queryUrl}`}
        //   position='absolute'
        //   width='100%'
        //   id='myId'
        //   className='myClassname'
        //   height='100%'
        //   styles={{ height: '25px' }}
        // />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // margin: "px 10px",
            background: "#F5F5F5",
            height: "100vh",
            padding: "30px 10px",
          }}
        >
          <iframe
            id="qisstpayifram"
            title="xxx"
            width={isMdDown ? "100%" : "35%"}
            height="700"
            frameBorder="0"
            allowTransparency
            style={{
              background: "white",
              borderRadius: "22px",
              padding: "0px",
            }}
            src={
              window.location.protocol +
              "//" +
              window.location.host +
              "/" +
              `?identity-token=${identityToken}&queryUrl=${queryUrl}&is_headless=1`
            }
          />
        </div>
      )}
    </>
  );
};

export default OpenCheckout;
