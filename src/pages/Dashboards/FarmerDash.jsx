import { useEffect, useState } from "react";
import api from "../../services/api";
import LivestockCard from "../../components/cards/LivestockCard";

export default function FarmerDash() {
  const [animals, setAnimals] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/farmer/livestock").then(res => setAnimals(res.data));
    api.get("/farmer/analytics").then(res => setAnalytics(res.data));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Farmer Dashboard</h1>

      {analytics && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 p-4 rounded">
            Total Animals: {analytics.total_animals}
          </div>
          <div className="bg-blue-100 p-4 rounded">
            Inventory Value: KES {analytics.total_value.toLocaleString()}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {animals.map(animal => (
          <LivestockCard key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
}
