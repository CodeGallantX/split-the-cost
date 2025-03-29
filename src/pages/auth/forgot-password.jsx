import ForgotPassword from "../../components/auth/ForgotPassword"
import SideIllustration from "../../components/auth/SideIll"

const App = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen items-start md:items-center">
      <SideIllustration />
      <ForgotPassword />
    </div>
  )
}

export default App
