let notesArr = []

const request = indexedDB.open('notesDB',1)

request.onupgradeneeded = function (event){
    const db = event.target.result
    db.createObjectStore('notes',{keyPath: 'id'})
}

request.onsuccess = updateNotesArr 

function updateNotesArr(){
    const request = indexedDB.open('notesDB',1)
    request.onsuccess = e => {
        const db = e.target.result
        const transaction = db.transaction('notes','readonly')
        const store = transaction.objectStore('notes')
        const getAllRequest = store.getAll()
        getAllRequest.onsuccess = e => {
            notesArr = e.target.result
            renderNotes()
            console.log(notesArr)
        }
    }
}

function saveNote(note){
    const dbRequest = indexedDB.open('notesDB',1)
    
    dbRequest.onsuccess = function (e){
        const db = e.target.result
        const transaction = db.transaction('notes','readwrite')
        const store = transaction.objectStore('notes')
        store.put(note)
        updateNotesArr()
    }
    dbRequest.onerror = function (e){
        console.log('Błąd przy otwieraniu bazy do zapisu')
    }
}

function deleteNote(note){
    const dbRequest = indexedDB.open('notesDB',1)
    
    dbRequest.onsuccess = function (e) {
        const db = e.target.result
        const transaction = db.transaction('notes','readwrite')
        const store = transaction.objectStore('notes')
        store.delete(note.id)
        updateNotesArr()
    }
}