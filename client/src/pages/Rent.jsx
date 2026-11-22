import Listings from '../components/Listings.jsx'
import ClientStories from '../components/ClientStories.jsx'
import { useContent } from '../components/ContentProvider.jsx'

function Rent() {
    const { rent } = useContent().content

    return (
        <>
            <Listings type="rent" title={rent.title} subtitle={rent.subtitle} />
            <ClientStories />
        </>
    )
}

export default Rent