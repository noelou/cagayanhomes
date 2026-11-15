import Listings from '../components/Listings.jsx'
import ClientStories from '../components/ClientStories.jsx'

function Rent() {
    return (
        <>
            <Listings
                type="rent"
                title="Properties for Rent"
                subtitle="Browse homes and lots available for purchase in Cagayan de Oro."
            />
            <ClientStories />
        </>
    )
}

export default Rent