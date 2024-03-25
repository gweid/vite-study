import PageHeader from '@components/page-header';
import UnoCssCom from '@components/unocss-com';
import StaticCom from '@components/static-com';
import SvgPage from '@components/svg-page';

import './App.css';

function App() {
  return (
    <div className="App">
      <PageHeader />
      <UnoCssCom />
      <StaticCom />
      <SvgPage />
    </div>
  );
}

export default App;
