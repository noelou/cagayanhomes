import Listings from '../components/Listings.jsx'
import ClientStories from '../components/ClientStories.jsx'

function Buy() {
    return (
        <>
            <Listings
                type="sale"
                title="Properties for Sale"
                subtitle="Browse homes and lots available for purchase in Cagayan de Oro."
            />
            <ClientStories />
        </>
    )
}

export default Buy