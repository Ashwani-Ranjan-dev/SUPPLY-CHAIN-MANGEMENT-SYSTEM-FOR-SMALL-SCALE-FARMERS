import Register from './pages/Register'
import Login from './pages/Login'
import {BrowserRouter , Router , Routes, Route} from "react-router-dom"
 
const App = () => {
  return (
   <div>
    <BrowserRouter>
   <Routes>
    <Route path='/' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
   </Routes>
   </BrowserRouter>
   </div>
    
  )
}

export default App