import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  return (
    
      <div className="flex min-h-screen">
        <Sidebar/>
        <Outlet/>
      </div>
    
  )
}

export default Layout
