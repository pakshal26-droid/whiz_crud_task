import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:4000/api/notes';
function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setNotes(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notes');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    try {
      if (editingId) {
        // Update
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        // Create
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setForm({ title: '', content: '' });
      setEditingId(null);
      fetchNotes();
    } catch {
      setError('Failed to save note');
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchNotes();
    } catch {
      setError('Failed to delete note');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-2 sm:px-0">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Notes App</h1>
        <form className="flex flex-col gap-4 mb-8" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Note
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setForm({ title: '', content: '' }); setEditingId(null); }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid gap-4">
            {notes.length === 0 ? <p className="text-center text-gray-400">No notes yet.</p> : notes.map(note => (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-2 shadow-sm" key={note._id}>
                <h3 className="text-xl font-semibold text-blue-800 break-words">{note.title}</h3>
                <p className="text-gray-700 break-words">{note.content}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
