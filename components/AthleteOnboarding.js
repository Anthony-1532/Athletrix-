import { useState } from 'react';
import { FaBasketballBall, FaFutbol, FaRunning } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const sportCatalogue = [
  { id: 'basketball', emoji: <FaBasketballBall />, label: 'Basketball' },
  { id: 'european-football', emoji: <FaFutbol />, label: 'European Football' },
  { id: 'track-field', emoji: <FaRunning />, label: 'Track & Field' },
];

const physicalFocus = ['strength', 'speed', 'endurance', 'agility', 'power'];

const getSportSkills = (sportId) => {
  const skillsMap = {
    basketball: ['ball control', 'shooting', 'passing', 'tactics', 'dribbling', '3-pt shooting'],
    'european-football': ['ball control', 'shooting', 'passing', 'tactics', 'dribbling'],
    'track-field': ['sprint technique', 'jump form', 'throwing mechanics', 'pace strategy'],
  };
  return skillsMap[sportId] || [];
};

export default function AthleteOnboarding({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedPhysical, setSelectedPhysical] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const toggleFocus = (type, item) => {
    const setter = type === 'physical' ? setSelectedPhysical : setSelectedSkills;
    const current = type === 'physical' ? selectedPhysical : selectedSkills;
    setter(current.includes(item) ? current.filter(i => i !== item) : [...current, item]);
  };

  const handleComplete = async () => {
    const allFocus = [...selectedPhysical, ...selectedSkills];
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').upsert({ user_id: session.user.id, sport: selectedSport.id, focus_areas: allFocus });
    }
    onComplete(allFocus);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Sport</h2>
            <div className="grid grid-cols-2 gap-4">
              {sportCatalogue.map((sport) => (
                <button key={sport.id} onClick={() => { setSelectedSport(sport); setStep(2); }} className="bg-gray-800 p-4 rounded flex flex-col items-center">
                  <div className="text-3xl mb-2">{sport.emoji}</div>
                  <span>{sport.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">What to Improve?</h2>
            {/* Physical */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Physical</h3>
              <div className="grid grid-cols-2 gap-2">
                {physicalFocus.map((item) => (
                  <label key={item} className="flex items-center">
                    <input type="checkbox" checked={selectedPhysical.includes(item)} onChange={() => toggleFocus('physical', item)} />
                    <span className="ml-2">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Skills */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Skills ({selectedSport.label})</h3>
              <div className="grid grid-cols-2 gap-2">
                {getSportSkills(selectedSport.id).map((item) => (
                  <label key={item} className="flex items-center">
                    <input type="checkbox" checked={selectedSkills.includes(item)} onChange={() => toggleFocus('skills', item)} />
                    <span className="ml-2">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-600 py-2 rounded">Back</button>
              <button onClick={handleComplete} className="flex-1 bg-blue-500 py-2 rounded">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}