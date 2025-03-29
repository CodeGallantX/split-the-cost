import OTPForm from "../../components/auth/OTPForm"
import SideIllustration from "../../components/auth/SideIll"

const App = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen items-start md:items-center">
      <SideIllustration />
      <OTPForm />
    </div>
  )
}

export default App
