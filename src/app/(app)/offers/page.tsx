import { ComingNext } from "@/components/ui/ComingNext";

export default function OffersPage() {
  return (
    <ComingNext
      screen="Partner Offers"
      description="Local NYC partner offers — claim, redeem, and track economic impact. Every view/claim/redeem writes an OfferRedemption record used by the admin analytics cards."
      nextPrompt={`Build /offers: filter pills by category (dining/attraction/hotel/transit/retail), grid of offer cards from seed.offers, 'Claim' button that calls useApp.claimOffer(id) and analytics.track('offer_claimed', {id}). Show a small 'Economic impact est.: usd(estimatedTicket)' label on each card.`}
    />
  );
}
