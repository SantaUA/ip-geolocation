import { IPLookupProvider } from './contexts/IPLookupProvider';
import { IPLookup } from './components/IPLookup';

function App() {
  return (
    <IPLookupProvider>
      <IPLookup isOpen onClose={() => alert('close action triggered')} />
    </IPLookupProvider>
  );
}

export default App;
