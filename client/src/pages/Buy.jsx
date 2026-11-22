import Listings from '../components/Listings.jsx'
import ClientStories from '../components/ClientStories.jsx'
import { useContent } from '../components/ContentProvider.jsx'

function Buy() {
    const { buy } = useContent().content

    return (
        <>
            <Listings type="sale" title={buy.title} subtitle={buy.subtitle} />
            <ClientStories />
        </>
    )
}

export default Buy