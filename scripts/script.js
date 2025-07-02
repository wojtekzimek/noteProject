//pobranie przycisku menu pokaż/ukryj formularz
const divMenuHamburger = document.getElementById('menuHamburger')
//pobranie przycisków zamykających formularz
const divFormAddNoteXcancel = document.getElementById('formAddNoteXcancel')
const btnCloseNoteBtn = document.getElementById('closeNoteBtn')
// pobranie pudełka z formularzem
const divFormAddNoteBox = document.getElementById('formAddNoteBox')

//pobranie elementów formularza
const inputTaskCompletionDate = document.getElementById('taskCompletionDate')
const inputTaskSheduledDate = document.getElementById('taskSheduledDate')
const selectTaskTarget = document.getElementById('taskTarget')
const selectTaskDefaultNote = document.getElementById('taskDefaultNote')
const textareaTaskNote = document.getElementById('taskNote')
const btnAddNoteBtn = document.getElementById('addNoteBtn')

// pobranie kontenera na notatki
const sectionNotes = document.getElementById('notesSection')

// zmienne globalne

// zmienne globalne
// zmienna która określa czy formularz jest ukryty
let formAddNoteBoxHidden = true;
// zmienne do zainicjowania formularza
let initialDeadDate;
let initialSheduldedDate;
let initialTaskTarget;
let initialNote;


//lista "Dla kogo" - wypełnienie list formularza na podstawie danych z tabeli
const fillTargets = () => {
    selectTaskTarget.innerHTML = ''
    taskTargets.forEach(e => {
        let option = document.createElement('option')
        option.value = e.id
        option.innerText = e.descr
        if(e.id == defTarget) option.selected = true
        selectTaskTarget.appendChild(option)
    })
}

//"Domyślna notatka" - wypełnienie listy formularza na podstawie danych z tabeli 
// - funkcja wywoływana przy wybraniu domyślnej notatki
const fillTaskDefaultNote = () => {
    selectTaskDefaultNote.innerText = ''
    const choosenTarget = selectTaskTarget.value
    const filteredArr = defaultNotes.filter( e => e.targetId==choosenTarget)
    filteredArr.forEach(e => {
        let option = document.createElement('option')
        option.value = e.id
        option.innerText = e.descr
        selectTaskDefaultNote.appendChild(option)
    })
}

//zmiana listy domyślnych zadań po zmianie kategorii
selectTaskTarget.addEventListener('change', ()=> fillTaskDefaultNote())

// funkcja pomocnicza wypełnienie pól formularza na podstawie przekazanych danych
const fillForm = (completionDate = '', sheduledDate = '', note = '', targetId = -1) => {
    inputTaskCompletionDate.value = completionDate
    inputTaskSheduledDate.value = sheduledDate
    fillTargets()
    fillTaskDefaultNote()
    textareaTaskNote.innerText = note
    if(targetId >= 0 && targetId<selectTaskTarget.children.length){
        // console.log(selectTaskTarget)
        selectTaskTarget.children[targetId].selected = true
    }    
}

// efekt pozazania formularza i obrotu przycisku
const showFormAddNoteBox = ()=>{
    if(!formAddNoteBoxHidden) return
    divFormAddNoteBox.style.display = 'block'
    divMenuHamburger.style.transform = 'rotate(90deg)'
    formAddNoteBoxHidden = false
}

// efekt ukrycia formularza i obrotu przycisku
const hideFormAddNoteBox = ()=>{
    if(formAddNoteBoxHidden) return
    divFormAddNoteBox.style.display = 'none'
    divMenuHamburger.style.transform = 'rotate(0deg)'
    formAddNoteBoxHidden = true
}

// przyciksk hamburger (trójkąt)
divMenuHamburger.addEventListener('click',()=>{
    formAddNoteBoxHidden ? showFormAddNoteBox() : hideFormAddNoteBox()
    fillForm('', dateToLocalDateTime(new Date()),'')
})

// przycisk X w fomularzu
divFormAddNoteXcancel.addEventListener('click', hideFormAddNoteBox)

// przycisk Anuluj w formularzu
btnCloseNoteBtn.addEventListener('click', hideFormAddNoteBox)

// funkcja pomocnicza przekształcająca datę do formatu datetime-local
const dateToLocalDateTime = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // miesiące 0-11
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// blokowanie daty w okienku wyboru (nie działa z godzinami i miniutami)
// - dla "Dead line"
inputTaskCompletionDate.addEventListener('focus', ()=> {
    let dateToSet = inputTaskSheduledDate.value
    if(dateToSet == '') dateToSet = dateToLocalDateTime(new Date())
    inputTaskCompletionDate.min = dateToSet
})

// blokowanie daty w okienku wyboru (nie działa z godzinami i miniutami)
// - dla "Zaplanuj na"
inputTaskSheduledDate.addEventListener('focus', ()=> {
    inputTaskSheduledDate.min = dateToLocalDateTime(new Date())
})

//walidacja daty "Zaplanuj na"
// - data nie może być mniejsza od aktualnej daty
// - data nie może być mniejsza od daty wykonania zadania
// -- data wykonania zadania jest ustawiana na tę samą datę lub przesuwana jeżeli jest wcześniejsza
inputTaskSheduledDate.addEventListener('change',e => {
    let currentDate = new Date()
    if( new Date(e.target.value) <  currentDate )
        e.target.value = dateToLocalDateTime(currentDate)
    if(!inputTaskCompletionDate.value)
        inputTaskCompletionDate.value = e.target.value
    if( new Date(e.target.value) > new Date(inputTaskCompletionDate.value) )
        inputTaskCompletionDate.value = e.target.value
})

// textarea usunięcie koloru tła (oznaczającego puste pole notatki)
textareaTaskNote.addEventListener('input', e => {
    textareaTaskNote.style.backgroundColor = ''
})

//wypełnienie textarea domyślną notatką - po wybraniu z listy
selectTaskDefaultNote.addEventListener('change', e => {
    const taskId = e.target.value
    textareaTaskNote.innerHTML = 
        defaultNotes.filter(e => e.id==taskId)[0].descr
})

//przycisk formularza - dodanie notatki
btnAddNoteBtn.addEventListener('click', e => {
    if(textareaTaskNote.value.trim() == ''){
        textareaTaskNote.style.backgroundColor = 'rgb(233, 134, 134)'
        return
    }
    addNewNote(inputTaskCompletionDate.value,
        inputTaskSheduledDate.value,
        selectTaskTarget.value,
        textareaTaskNote.value
    ) 
    renderNotes()
    hideFormAddNoteBox()
})

            
