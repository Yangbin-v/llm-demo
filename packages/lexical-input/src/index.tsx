import {createRoot} from 'react-dom/client';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const rootElement = createRoot(root);
rootElement.render(<div>Hello World</div>);
