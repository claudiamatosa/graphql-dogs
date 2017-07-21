import React from 'react';

import Photos from './components/Photos';
import './App.css';

const App = () => (
  <div className="App">
    <div className="App-header">
      <h2 className="App-title">
        <span className="App-title-emoji" role="img" aria-label="">🐶</span>
        GraphQL Dogs
        <span className="App-title-emoji"  role="img" aria-label="">💩</span>
        </h2>

      <p>A tribute to <a
        href="https://twitter.com/dog_rates"
        target="_blank"
        rel="noopener noreferrer"
      >WeRateDogs™</a></p>
    </div>

    <section className="App-content">
      <Photos />
    </section>
  </div>
);

export default App;
