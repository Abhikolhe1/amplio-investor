import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DematPendingDialog from "src/sections/invest/invest-demat-peding";
import RMVerificationPending from "src/sections/invest/invest-rm-verification-pending";
import InvestListView from "src/sections/invest/view/invest-list-view";
import InvestDetails from "src/sections/invest/cards/invest-details-card";
import InvestDetailsView from "src/sections/invest/view/invest-details-view";

const LIST_VIEW_KEY = 'isInvoiceListView';

export default function InvestViewPage() {
    const [listView, setListView] = useState(false);

    useEffect(() => {
        const storedValue = localStorage.getItem(LIST_VIEW_KEY);
        setListView(storedValue === 'true');
    }, []);

    return (
        <>
            <Helmet>
                <title>Invest View</title>
            </Helmet>
{/* 
            {!listView && <RMVerificationPending />}

            <DematPendingDialog />

            {listView && <InvestListView />} */}
            <InvestListView />
            {/* <InvestDetailsView/> */}
        </>
    );
}
