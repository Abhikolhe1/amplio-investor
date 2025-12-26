import { Helmet } from "react-helmet-async";
import InvestDetailsView from "src/sections/invest/view/invest-details-view";

export default function InvestDetialsPage(){
    return(
        <>
        <Helmet>
            <title>Invest Details Page</title>
        </Helmet>
        <InvestDetailsView/>
        </>
    )
}