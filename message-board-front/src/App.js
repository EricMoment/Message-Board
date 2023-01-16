import React, { useEffect, useState } from 'react';
import './App.css';
//reactJS

function App() {
  const [record, setRecord] = useState(null)
  useEffect(() => {
    (async function test() {
      await fetch(`http://localhost:5000/`)
      .then(res => res.json())
      .then(res => setRecord(res))
      .catch(err => {
        console.log(err)
      })
    })()
  }, [])

  return (
    <div className="App">
      {record}
    </div>
  );
}

export default App;
