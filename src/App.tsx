import './App.css';
import Panel from './components/Panel.component';

function App() {
  return (
    <div className="App">
      <Panel></Panel>
      <div className='list-wrapper'>
        <p>Przykładowe operatory:</p>
        <ul>
          <li>E (stała e)</li>
          <li>PI (stała pi)</li>
          <li>x!</li>
          <li>exp x (e^x)</li>
          <li>sqrt x (pierwiastek kwadratowy z x)</li>
          <li>cbrt x (pierwiastek sześcienny z x)</li>
          <li>cos x</li>
          <li>acos x</li>
          <li>sin x</li>
          <li>asin x</li>

          <li>tan x</li>
          <li>atan x</li>
          <li>ln x</li>
          <li>log10 x</li>
          <li>log2 x</li>

        </ul>
      </div>
    </div>
  );
}

export default App;
