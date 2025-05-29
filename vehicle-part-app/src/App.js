import React, { useState, useEffect } from 'react';

function PartsLookup() {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const [partNos, setPartNos] = useState([]); // Changed to array to show multiple parts

  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const baseURL = "http://localhost/vehicle-parts-project/vehicle-parts-api";

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await fetch(`${baseURL}/getMakes.php`);
        const data = await res.json();
        setMakes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([]);
        setSelectedModel('');
        return;
      }
      try {
        const res = await fetch(`${baseURL}/getModels.php?make=${selectedMake}`);
        const data = await res.json();
        setModels(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchModels();
  }, [selectedMake]);

  useEffect(() => {
    const fetchTypes = async () => {
      if (!selectedMake) {
        setTypes([]);
        setSelectedType('');
        return;
      }

      // Optionally, build URL with or without model
      let url = `${baseURL}/getTypes.php?make=${selectedMake}`;
      if (selectedModel) {
        url += `&model=${selectedModel}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setTypes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTypes();
  }, [selectedMake, selectedModel]);  // also watch selectedMake to refetch when it changes


  const handleSearch = async () => {
    try {
      let url = `${baseURL}/getPart.php`;
      const params = new URLSearchParams();
      if (selectedMake) params.append("make", selectedMake);
      if (selectedModel) params.append("model", selectedModel);
      if (selectedType) params.append("type", selectedType);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setPartNos(data);
      setSearchPerformed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedType('');
    setModels([]);
    setTypes([]);
    setPartNos([]);
    setSearchPerformed(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Vehicle Part Finder</h2>

      <select value={selectedMake} onChange={e => setSelectedMake(e.target.value)}>
        <option value="">Select Make</option>
        {makes.map(make => <option key={make} value={make}>{make}</option>)}
      </select>

      <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
        <option value="">Select Model</option>
        {models.map(model => <option key={model} value={model}>{model}</option>)}
      </select>

      <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
        <option value="">Select Type</option>
        {types.map(type => <option key={type} value={type}>{type}</option>)}
      </select>

      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
        Get Part Number
      </button>

      <button onClick={handleClear} style={{ marginLeft: '10px' }}>
        Clear
      </button>

      {partNos.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <em>Please click 'Clear' before making a new search.</em>
          <div style={{ marginTop: '20px' }}>
          <strong>Part Numbers:</strong>
          <ul>
            {partNos.map((part, index) => (
              <li key={index}>{part}</li>
            ))}
          </ul>
          </div>
        </div>
      )}

      {searchPerformed && partNos.length === 0 && (
        <div style={{ marginTop: '20px' }}>
          <em>No parts found. Try different selections.</em>
        </div>
      )}
    </div>
  );
}

export default PartsLookup;
