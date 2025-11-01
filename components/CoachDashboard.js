import { useState } from 'react';
import { FaBasketballBall } from 'react-icons/fa';

export default function CoachDashboard() {
  const [filters, setFilters] = useState({ sport: '', focus: '' });
  const [athletes, setAthletes] = useState([]); // Fetch from API

  const handleSearch = async () => {
    const res = await fetch('/api/athletes/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    const { athletes } = await res.json();
    setAthletes(athletes);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Coach Dashboard</h1>
      <div className="bg-gray-900 p-6 rounded mb-8">
        <select value={filters.sport} onChange={(e) => setFilters({ ...filters, sport: e.target.value })} className="bg-gray-800 p-2 rounded mr-4">
          <option value="">All Sports</option>
          <option value="basketball">Basketball</option>
          {/* Add more */}
        </select>
        <select value={filters.focus} onChange={(e) => setFilters({ ...filters, focus: e.target.value })} className="bg-gray-800 p-2 rounded">
          <option value="">All Focus</option>
          <option value="shooting">Shooting</option>
          {/* Add more */}
        </select>
        <button onClick={handleSearch} className="bg-blue-500 ml-4 px-4 py-2 rounded">Search</button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {athletes.map((a) => (
          <div key={a.id} className="bg-gray-900 p-6 rounded">
            <h3>{a.name}</h3>
            <p>{a.position}</p>
            <div className="flex gap-1">
              {a.focus_areas.map(f => <span key={f} className="bg-blue-500 px-2 py-1 rounded">{f}</span>)}
            </div>
            <button className="bg-blue-500 mt-4 w-full py-2 rounded">Invite</button>
          </div>
        ))}
      </div>
    </div>
  );
}