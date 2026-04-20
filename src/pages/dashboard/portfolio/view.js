import { Helmet } from "react-helmet-async";
import PortfolioListView from "src/sections/portfolio/view/portfolio-list-view";

export default function PortfolioViewPage() {

    return (
        <>
            <Helmet>
                <title>Portfolio View</title>
            </Helmet>
            <PortfolioListView />
        </>
    );
}
