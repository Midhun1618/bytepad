import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Plus, Bold, Italic, Underline, CheckSquare, Highlighter, Link, Check, BookOpen, Edit3, Image as ImageIcon
} from 'lucide-react';
import './NoteMain.css';


const NoteMain = () => {
  const [books, setBooks] = useState([
    { id: 1, name: 'Personal', emoji: '📝', color: 'book-blue' },
    { id: 2, name: 'Work', emoji: '💼', color: 'book-purple' },
    { id: 3, name: 'Ideas', emoji: '💡', color: 'book-yellow' }
  ]);

  const [notes, setNotes] = useState({
    1: [
      { id: 1, title: 'Daily Journal', content: 'Today was a productive day...', preview: 'Today was a productive day...' },
      { id: 2, title: 'Weekend Plans', content: 'Need to plan activities for the weekend', preview: 'Need to plan activities for the weekend' }
    ],
    2: [
      { id: 3, title: 'Project Ideas', content: 'Brainstorming new project concepts', preview: 'Brainstorming new project concepts' },
      { id: 4, title: 'Meeting Notes', content: 'Important points from today\'s meeting', preview: 'Important points from today\'s meeting' }
    ],
    3: [
      { id: 5, title: 'App Concepts', content: 'New mobile app ideas to explore', preview: 'New mobile app ideas to explore' }
    ]
  });

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const editorRef = useRef(null);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setSelectedNote(null);
    setEditorContent('');
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setEditorContent(note.content);
  };

  const handleAddBook = () => {
    const newBook = {
      id: Date.now(),
      name: `Book ${books.length + 1}`,
      emoji: '📚',
      color: 'book-random'
    };
    setBooks([...books, newBook]);
  };

  const handleAddNote = () => {
    if (!selectedBook) return;
    const newNote = {
      id: Date.now(),
      title: `New Note ${(notes[selectedBook.id] || []).length + 1}`,
      content: '',
      preview: 'Start writing your note...'
    };
    setNotes(prev => ({
      ...prev,
      [selectedBook.id]: [...(prev[selectedBook.id] || []), newNote]
    }));
  };

  const handleSave = () => {
    if (selectedNote) {
      setNotes(prev => ({
        ...prev,
        [selectedBook.id]: prev[selectedBook.id].map(note =>
          note.id === selectedNote.id
            ? { ...note, content: editorContent, preview: editorContent.slice(0, 50) + '...' }
            : note
        )
      }));
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => !selectedBook && setSidebarExpanded(false)}
        initial={{ width: 60 }}
        animate={{ width: sidebarExpanded ? 220 : 60 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <BookOpen className="icon" />
          {sidebarExpanded && <h1>My Books</h1>}
        </div>

        <div className="book-list">
          {books.map((book) => (
            <motion.div
              key={book.id}
              className={`book ${book.color} ${selectedBook?.id === book.id ? 'selected' : ''}`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleBookClick(book)}
            >
              <span className="emoji">{book.emoji}</span>
              {sidebarExpanded && <span className="book-name">{book.name}</span>}
            </motion.div>
          ))}

          <motion.button 
            className="add-book"
            whileHover={{ scale: 1.05 }}
            onClick={handleAddBook}
          >
            <Plus className="icon" /> {sidebarExpanded && 'Add Book'}
          </motion.button>
        </div>
      </motion.div>

      {/* Notes Drawer */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            className="notes-drawer"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.4 }}
          >
            <div className="drawer-header">
              <h2>{selectedBook.emoji} {selectedBook.name}</h2>
              <motion.button whileHover={{ scale: 1.1 }} onClick={handleAddNote}>
                <Plus className="icon" />
              </motion.button>
            </div>
            <div className="notes-list">
              {(notes[selectedBook.id] || []).map(note => (
                <motion.div 
                  key={note.id}
                  className={`note-card ${selectedNote?.id === note.id ? 'active' : ''}`}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleNoteClick(note)}
                >
                  <h3>{note.title}</h3>
                  <p>{note.preview}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="editor">
        {selectedNote ? (
          <>
            <div className="toolbar">
              <div className="toolbar-group">
                <button onClick={() => formatText('bold')}><Bold className="icon" /></button>
                <button onClick={() => formatText('italic')}><Italic className="icon" /></button>
                <button onClick={() => formatText('underline')}><Underline className="icon" /></button>
              </div>
              <div className="toolbar-group">
                <button><CheckSquare className="icon" /></button>
                <button><Highlighter className="icon" /></button>
                <button><Link className="icon" /></button>
                <button><img className="icon" /></button>
              </div>
              <button className="save-btn" onClick={handleSave}>
                {showSaved ? <><Check className="icon" /> Saved!</> : <><Edit3 className="icon" /> Save</>}
              </button>
            </div>

            <div className="editor-body">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => {
                  const updatedTitle = e.target.value;
                  setSelectedNote(prev => ({ ...prev, title: updatedTitle }));
                  setNotes(prev => ({
                    ...prev,
                    [selectedBook.id]: prev[selectedBook.id].map(note =>
                      note.id === selectedNote.id ? { ...note, title: updatedTitle } : note
                    )
                  }));
                }}
                className="note-title"
                placeholder="Note title..."
              />

              <div
                ref={editorRef}
                contentEditable
                className="note-editor"
                onInput={(e) => setEditorContent(e.target.innerHTML)}
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Edit3 className="icon big" />
            <h2>Select a note to start writing</h2>
            <p>Choose a book from the sidebar and pick a note to edit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteMain;
