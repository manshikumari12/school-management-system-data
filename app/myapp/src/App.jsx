import { Routes,Route } from 'react-router-dom';
import './App.css';
import Signup from './Page/Signup';
import Login from './Page/Login';
import AdminDashboard from './Page/AdminDashboard';
import CreateStudent from './Page/CreateStudent';
import StudentList from './Page/StudentList';
import ViewStudent from './Page/ViewStudent';
import EditStudent from './Page/EditStudent';
import UserData from './Page/UserData';
function App() {
  return (
<>
<Routes>
  <Route path="/" element ={<Signup/>}/>
  <Route path="/login" element ={<Login/>}/>
  <Route path="/admin-dashboard" element ={<AdminDashboard/>}/>
  <Route path="/students/create" element ={<CreateStudent/>}/>
<Route path="/dashboard" element={<UserData/>} />
<Route path="/students" element={<StudentList/>} />
<Route path="/students/:id" element={<ViewStudent/>} />
<Route path="/students/edit/:id" element={<EditStudent/>} />


</Routes>
</>
  );
}

export default App;
