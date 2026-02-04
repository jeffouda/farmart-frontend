export default function LivestockCard({ animal }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold text-lg">{animal.animal_type}</h3>

      <p className="text-sm text-gray-600">
        {animal.location} • {animal.weight}kg
      </p>

      <p className="text-green-600 font-bold mt-2">
        KES {animal.price.toLocaleString()}
      </p>

      {!animal.is_available && (
        <span className="text-red-500 text-sm">Sold</span>
      )}
    </div>
  );
}
