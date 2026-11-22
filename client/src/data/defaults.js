// Fallback content. Anything saved from the admin "Content" page overrides these.
export const defaultContent = {
  agent: {
    name: 'Carl',
    email: 'carlsantos.realty@gmail.com',
    phoneDisplay: '0917 123 4567',
    location: 'Cagayan de Oro, Philippines',
  },
  hero: {
    title: "Find a Place You'll Love to Call Home.",
    text: "Buying or selling a home can feel overwhelming. I'm here to make it easier, from finding the right property to negotiating and completing the paperwork.",
  },
  why: {
    title: 'Why Work With Me?',
    text: "Buying or selling a home can feel overwhelming. I'm here to make it easier, guiding you through each step from the first conversation to closing.",
    reasons: [
      { title: 'Personal Service', text: 'You work directly with me, not a call center. Every question gets a real answer.' },
      { title: 'Local Knowledge', text: 'Years of experience in the local market means better guidance on price and location.' },
      { title: 'Honest Guidance', text: "No pressure, no upselling — just straightforward advice about what's right for you." },
      { title: 'End-to-End Support', text: "From your first inquiry to signing the final paperwork, I'll be with you the whole way." },
    ],
  },
  about: {
    text:
      "I'm Carl, a real estate agent based in Cagayan de Oro, Philippines. I help families, first-time buyers, and property owners find the right place and close the deal with less stress.\n\nFrom viewing properties to negotiating and completing the paperwork, I'll guide you through every step.",
  },
  buy: {
    title: 'Properties for Sale',
    subtitle: 'Browse homes and lots available for purchase in Cagayan de Oro.',
  },
  rent: {
    title: 'Properties for Rent',
    subtitle: 'Browse homes and lots available for rent in Cagayan de Oro.',
  },
  testimonials: [
    {
      name: 'Maria',
      detail: 'First-time buyer, Condo in Cagayan de Oro',
      quote: 'I had no idea where to start, but everything was explained clearly every step of the way. I found a home I actually love.',
    },
    {
      name: 'Jerome',
      detail: 'Seller, House in Cagayan de Oro',
      quote: 'My property sold faster than I expected. The marketing and photos made a huge difference, and communication was always quick.',
    },
    {
      name: 'Angeli',
      detail: 'Investor, Duplex property',
      quote: 'Straightforward, honest, and genuinely helpful. I never felt pressured, just guided toward the right decision for my budget.',
    },
  ],
}
