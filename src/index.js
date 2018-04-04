import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initAll } from './Megamenu';

const options = {
    megamenuClass: 'test-class',
};

document.addEventListener('DOMContentLoaded', () => {
    initAll(options);
});

ReactDOM.render(<App />, document.getElementById('root'));
