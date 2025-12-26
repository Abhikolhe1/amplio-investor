import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DematPendingDialog from "src/sections/invest/invest-demat-peding";
import RMVerificationPending from "src/sections/invest/invest-rm-verification-pending";

export default function InvestViewPage() {

    return (
        <>
            <Helmet>
                <title> Invest View</title>
            </Helmet>
            <RMVerificationPending/>
            <DematPendingDialog/>
                
        </>
    )
}