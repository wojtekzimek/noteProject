// zmienne globalne
let filterNotesOption = 0 //zgodnie z index.html
let notesOrder = 1 //zgodnie z index.html
let displayNotesArr = []//posortowana/przefiltrowana tablica notatek do pokazania
let dateRangeHidden = false //fromularz zakresu dat ukryty
let startDate='', endDate=''
let noteId = -1

const divNotesContainer = document.getElementById('notesContainer') //kontener na notatki
const selectFilterNotes = document.getElementById('filterNotes') // lista wyboru filtrowania notatek
const selectSortNotes = document.getElementById('sortNotes') // lista wyboru sortowania notatek
const divDateRange = document.getElementById('dateRange') //div z zakresem dat
// const divDateRangeHamburger = document.getElementById('dataRangeHamburger') //przycisk zakresu dat
// const divDateRangeDisplay = document.getElementById('dateRangeDisplay') //pokazuje zakres wybranych dat
// const divDateRangeForm = document.getElementById('dateRangeForm') //div wyboru dat
const inputDateRangeFrom = document.getElementById('dateRangeFrom') //input daty od
const inputDateRangeTo = document.getElementById('dateRangeTo') //input daty do


//ukrywanie zakresu dat
divDateRange.style.display = 'none'

//zmiana filtrowania notatek
selectFilterNotes.addEventListener('change', e => {
    divDateRange.style.display = 'none'
    filterNotesOption = parseInt(selectFilterNotes.value)
    if(filterNotesOption == 2){
        divDateRange.style.display = 'flex'
    }
    renderNotes()
})

//zmiana sortowania notatek
selectSortNotes.addEventListener('change', e => {
    notesOrder = parseInt(selectSortNotes.value)
    // if(filterNotesOption == 2){
    //     divDateRange.style.display = 'flex'
    // }
    renderNotes()
})

// *** wybór zakresu dat

// usunięcie wybranej daty
inputDateRangeFrom.addEventListener('contextmenu', e => {
    e.preventDefault()
    e.target.value = ''
    e.target.dispatchEvent(new Event('change'))
})
inputDateRangeTo.addEventListener('contextmenu', e => {
    e.preventDefault()
    e.target.value = ''
    e.target.dispatchEvent(new Event('change'))
})

//zmiana wyświetlanego zakresu dat, połącznenie zakresów od / do
inputDateRangeFrom.addEventListener('change', e => {
    inputDateRangeTo.min = e.target.value
    startDate = e.target.value
    renderNotes()
})

inputDateRangeTo.addEventListener('change', e => {
    inputDateRangeFrom.max = e.target.value
    endDate = e.target.value
    renderNotes()
})

const addNewNote = (complDate, shedDate, targetId, note) => {
    if(noteId == -1)
        noteId = notesArr.length==0 ? 0 : notesArr[notesArr.length-1].id + 1
    if(complDate == '') complDate = shedDate
    saveNote({id:noteId, complDate, shedDate, targetId, note, done:false})

    // //!!! Stary kod bez indexDB
    // //nowa notatka jest dodawana
    // if(noteId==-1){
    //     noteId=0
    //     if(noteId==0 && notesArr.length > 0)
    //         id = notesArr[notesArr.length-1].id + 1
    //     //przypisanie do deadLine daty zaplanowania jeżeli deadLine jest puste
    //     if(complDate == '') complDate = shedDate
    //     // tworzenie nowego obiektu w tablicy
    //     notesArr.push({
    //         id,
    //         complDate,
    //         shedDate,
    //         targetId,
    //         note
    //     })
    // }else{ //notatka jest edytowana
    //     let arrId = notesArr.findIndex(n => n.id==noteId)
    //     notesArr[arrId].complDate = complDate
    //     notesArr[arrId].shedDate = shedDate
    //     notesArr[arrId].note = note
    //     notesArr[arrId].targetId = targetId
    // }
    
    noteId=-1
}

// funkcja pomocnicza czy daty są równe - porównanie: rok miesiąc dzień
const eqDates = (d1,d2) => {
    d1.setHours(0)
    d1.setMinutes(0)
    d1.setSeconds(0)
    d1.setMilliseconds(0)
    d2.setHours(0)
    d2.setMinutes(0)
    d2.setSeconds(0)
    d2.setMilliseconds(0)
    return d1.getTime() == d2.getTime()
}

//funkcja pomocnicza czy data jest z zakresu
const betweenDates = (d, d1, d2) => {
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    if(d1!=''){
           d1.setHours(0)
        d1.setMinutes(0)
        d1.setSeconds(0)
        d1.setMilliseconds(0) 
    }
    if(d2!=''){
        d2.setHours(0)
        d2.setMinutes(0)
        d2.setSeconds(0)
        d2.setMilliseconds(0)
    }
    if(d1=='' && d2=='') return true
    if(d1 == '') return d.getTime() <= d2.getTime()
    if(d2 == '') return d.getTime() >= d1.getTime()
    return d.getTime()>=d1.getTime() && d.getTime()<=d2.getTime()
}

// funkcja pomocnicza - filtrowanie/sortowanie notatek
const filterArrayNotes = () => {
    //filtrowanie notatek
    switch(filterNotesOption){
        case 0:
            displayNotesArr = notesArr.filter(n => true)
            break
        case 1: 
            let tmpToday = new Date()
            displayNotesArr = notesArr.filter(n => 
                eqDates(new Date(n.shedDate), tmpToday)
            )
            break
        case 2:
            let tmpStartDate='', tmpEndDate=''
            if(startDate!='') tmpStartDate = new Date(startDate)
            if(endDate!='') tmpEndDate = new Date(endDate)
            displayNotesArr = notesArr.filter(n => {
                return betweenDates(new Date(n.shedDate),tmpStartDate,tmpEndDate)
            })
                break
        case 3:
            displayNotesArr = notesArr.filter(n => !n.done)
            break
        case 4:
            displayNotesArr = notesArr.filter(n => n.done)
            break
    }
    //sortowanie notatek
    switch (notesOrder) {
        case 0:
            displayNotesArr.sort((n1, n2) =>
                parseInt(n1.id) - parseInt(n2.id))
            break
        case 1:
            displayNotesArr.sort((n1, n2) => (new Date(n1.shedDate)).getTime() - (new Date(n2.shedDate)).getTime())
            break
        case 2:
            displayNotesArr.sort((n1, n2) =>
                (new Date(n2.shedDate)).getTime() - (new Date(n1.shedDate)).getTime())
            break
    }
}

const renderNotes = () => {
    filterArrayNotes(filterNotesOption)
    divNotesContainer.innerHTML = ''
    displayNotesArr.forEach(n => {
        //tworzenie nowego obiektu
        let noteToDisplay = new Note(
            divNotesContainer, 
            n.id,
            n.complDate,
            n.shedDate,
            n.targetId,
            n.note,
            n.done
            )

            //wypisanie notatki
            noteToDisplay.renderNote()

            //ustawienie nasłuchiwania zdarzenia editNote - edycja notatki
            noteToDisplay.addEventListener('editNote', e => {
                if(formAddNoteBoxHidden) showFormAddNoteBox()
                noteId = e.target.id
                fillForm(
                    dateToLocalDateTime(new Date(e.target.complD)),
                    dateToLocalDateTime(new Date(e.target.shedD)), 
                    e.target.note,
                    e.target.targetId)
            })

            //ustawienie nasłuchiwania zdarzenia doneNote
            noteToDisplay.addEventListener('doneNote', e => {
                saveNote(e.detail)
                // //!!!stary kod bez indexDB
                // notesArr[arrId].done = e.target.done
                // renderNotes()
            })

            //ustawienie nasułuchiwania zdarzenia removeNote
            noteToDisplay.addEventListener('removeNote', e => {
                let delDecision = confirm('Notatka usuwana.')
                if(delDecision){
                    deleteNote(e.detail)
                    // //stary kod bez indexDB
                    // let arrId = notesArr.findIndex(n => n.id == e.target.id)
                    // notesArr.splice(arrId,1) 
                    // console.log(notesArr)
                    // renderNotes()
                }
            })
    })
}
