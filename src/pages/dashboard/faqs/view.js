import { Helmet } from "react-helmet-async";
import HelpFaqsList from "src/sections/help/help-faqs";

export default function FaqsViewPage(){

    return(
        <>
        <Helmet>
            <title>Faqs</title>
        </Helmet>
        <HelpFaqsList/>
        </>
    )
}