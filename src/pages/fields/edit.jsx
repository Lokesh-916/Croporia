import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

export default function FieldEdit() {
  const { id } = useParams()
  return (
    <div className="min-h-screen bg-vanilla font-sans text-black-forest">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="font-cinzel text-2xl font-bold text-black-forest mb-4">Edit Field</p>
        <p className="text-ash mb-6">Field editing is coming soon. For now, delete and re-register your field.</p>
        <Link to={`/fields/${id}`} className="text-forest font-semibold underline">Back to Field Details</Link>
      </div>
    </div>
  )
}
