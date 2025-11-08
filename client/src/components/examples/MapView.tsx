import MapView from '../MapView';

export default function MapViewExample() {
  const mockLocations = [
    { id: "1", name: "Downtown Food Bank", type: "food_bank" as const, latitude: 40.7128, longitude: -74.0060 },
    { id: "2", name: "Community Fridge #1", type: "community_fridge" as const, latitude: 40.7580, longitude: -73.9855 },
    { id: "3", name: "Fresh Produce Available", type: "food_listing" as const, latitude: 40.7489, longitude: -73.9680, freshnessScore: 94 },
    { id: "4", name: "Bakery Surplus", type: "food_listing" as const, latitude: 40.7614, longitude: -73.9776, freshnessScore: 88 },
    { id: "5", name: "Community Fridge #2", type: "community_fridge" as const, latitude: 40.7282, longitude: -73.7949 },
    { id: "6", name: "Eastside Food Bank", type: "food_bank" as const, latitude: 40.7589, longitude: -73.9851 },
  ];

  return (
    <div className="max-w-4xl">
      <MapView locations={mockLocations} />
    </div>
  );
}
