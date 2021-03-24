import { SideBar } from './components/SideBar';
import { Content } from './components/Content';
import './styles/global.scss';
import './styles/sidebar.scss';
import './styles/content.scss';
import { MovieProvider } from './hook/useMovie';

export function App() {
  return (
    <MovieProvider>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <SideBar />
        <Content />
      </div>
    </MovieProvider>
  )
}