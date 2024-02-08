import { useState, ChangeEvent } from 'react';
import logo from './assets/Logo-nlw.svg';
import { NewNoteCard } from './components/new-note-cards';
import { NoteCard } from './components/note-card';

interface Note{
  id: string,
  date: Date,
  content: string,
}

export function App() {

  const [search, setSearch] = useState('');
  const [ notes, setNotes ] = useState<Note[]>(() => {

    //Pegando as notas no localStorage
    const notesOnStorage = localStorage.getItem('notes');

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }

    return []
  });

  function onNoteCreated(content: string){

    const newNote = {
      id: crypto.randomUUID(), //Gerando um ID para cada nota
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes ];

    localStorage.setItem('notes', JSON.stringify(notesArray));

  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value;

    setSearch(query)
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }
  
  const filteredNotes = search !== ''
  ? notes.filter(notes => notes.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  : notes


  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0'>

      <img src={logo} alt='nlw expert' />
      
      <form className='w-full'>

        <input
          type="text"
          placeholder='Busque suas notas...'
          onChange={handleSearch}
          className='w-full bg-transparent text-3xl font-semibold tracking-tight placeholder: text-slate-500 outline-none'
        />

      </form>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated}/>
        
        {filteredNotes.map((note) => {
          return (
            <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
          );
        })}
      </div>
    </div>
  );
}
