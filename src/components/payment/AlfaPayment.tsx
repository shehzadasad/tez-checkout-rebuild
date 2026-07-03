import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const AlfaPayment: React.FC = () => {
    const { merchantID } = useParams<{ merchantID?: any }>();
    const { amount } = useParams<{ amount?: any }>();

    useEffect(() => {
        console.log("ALFA COMPONENT")
        axios.get(`https://sandbox.backoffice.qisstpay.com/bank-alfalah/iframe?merchant_id=85058&total_amount=5000&test=1`).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <>
        </>

    )
}

export default AlfaPayment