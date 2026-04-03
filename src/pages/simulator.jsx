import Navbar from '../components/Navbar'
export default function SimulatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-vanilla">
      <Navbar />
      <div className="flex-1 w-full bg-white relative">
        <iframe src="/simulator/index.html" title="Crop Simulator" className="absolute inset-0 w-full h-full border-0" />
      </div>
    </div>
  )
}
