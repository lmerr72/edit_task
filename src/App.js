// Imports
import React from 'react';
import DatatablePage from "./Components/DatatablePage.js";
import {FormattedMessage} from 'react-intl';

// Scripts
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

class App extends React.Component {
  state = {
    tasks: [{},{}]
  };
    
  render() {
    return (
      <div className="App">
        <h1><FormattedMessage id="title" defaultMessage="Edit Tasks"/></h1>
        <DatatablePage/>
      </div>
    );
  }
}

export default App;