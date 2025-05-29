import React, { useState, useEffect } from 'react';

function PartsLookup() {
  //states for storing the fetched data arrays
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const [partNos, setPartNos] = useState([]); // Changed to array to show multiple parts

  //state to check if serach is performed
  const [searchPerformed, setSearchPerformed] = useState(false);
  //state to check the current selected options
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedType, setSelectedType] = useState('');

  //backend api url
  const baseURL = "http://localhost/vehicle-parts-project/vehicle-parts-api";

  //useEffect hook to fetch makes everytime the mounting happens
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        //async request for fetching the makes
        const res = await fetch(`${baseURL}/getMakes.php`);
        //convert body of response to JS object array
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
      //check if any make is selected
      if (!selectedMake) {
        setModels([]);
        setSelectedModel('');
        return;
      }
      try {
        //fetch models based on selected make
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

      // build URL with or without model
      let url = `${baseURL}/getTypes.php?make=${selectedMake}`;
      if (selectedModel) {
        url += `&model=${selectedModel}`;
      }

      try {
        //fetch types based on selected make and/or model
        const res = await fetch(url);
        const data = await res.json();
        setTypes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTypes();
  }, [selectedMake, selectedModel]);  // also watch selectedMake to refetch when it changes


  //event handler when search button is pressed
  const handleSearch = async () => {
    try {
      //fetch request for part no.
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

  //event handler when clear button is pressed
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
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Make</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Model</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Part No</th>
            </tr>
          </thead>
          <tbody>
            {partNos.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.make}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.model}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.type}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.part}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
