import './index.css';
import { initAll } from './Megamenu';

const options = {
    megamenuClass: 'test-class',
};

document.addEventListener('DOMContentLoaded', () => {
    initAll(options);
});
