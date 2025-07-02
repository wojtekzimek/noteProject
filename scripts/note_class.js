class Note extends EventTarget{
    constructor(parent, id, complD, shedD, targetId, note, done=false){
        super()
        this.parent = parent
        this.id = id
        this.complD = complD
        this.shedD = shedD
        this.targetId = targetId
        this.note = note
        this.done = done
        this.mouseDown = false
        this.currentX = 0
        this.currentY = 0
    }

    // metody prywatne tworzące notatkę
    // generowanie głównego pudełka
    #renderMainNoteBox(){
        this.divNote = document.createElement('div')
        this.divNote.classList.add('div-note')
        switch(parseInt(this.targetId)){
            case 0:
                this.divNote.classList.add('div-note-0')
                break
            case 1:
                this.divNote.classList.add('div-note-1')
                break
            case 2:
                this.divNote.classList.add('div-note-2')
                break

        }
        this.parent.appendChild(this.divNote)
    }

    // generowanie nagłówka notatki
    // -header
    // --div
    // ---h2 - sheduledDate
    // ----span sheduledDate
    // ----span sheduledTime
    // ---h2 - deadLine
    // --div
    // ---div - edit
    // ---div - delete
    #renderHeaderNoteBox(){
        //tworzenie elementu header
        let headerNote = document.createElement('header')
        this.divNote.appendChild(headerNote)
        headerNote.classList.add('note-header')
        // tworzenie div na daty
        let divDates = document.createElement('div')
        headerNote.appendChild(divDates)
        //tworzenie elementu h2 - zaplanowana data+czas
        let h2ShedDate = document.createElement('h2')
        divDates.appendChild(h2ShedDate)
        let spanShedDate = document.createElement('span')
        h2ShedDate.appendChild(spanShedDate)
        spanShedDate.innerHTML = this.shedD.slice(0,10)
        let spanShedTime = document.createElement('span')
        h2ShedDate.appendChild(spanShedTime)
        spanShedTime.innerHTML = this.shedD.slice(11)
        // tworzenie elementu div "dead line"
        let h2ComplDate = document.createElement('h2')
        divDates.appendChild(h2ComplDate)
        h2ComplDate.innerText = 'Dead line: '
        h2ComplDate.innerText += this.complD.slice(0,10)
        // tworzenie div edycja, usuń
        let divOptions = document.createElement('div')
        headerNote.appendChild(divOptions)
        //tworzenie div z przyciskiem edytuj
        this.divEditNote = document.createElement('div')
        divOptions.appendChild(this.divEditNote)
        this.divEditNote.addEventListener('click', () => this.editNote())
        this.divEditNote.innerHTML = '&#128395;'
        //tworzenie div z przyciskiem usuń
        this.divDeleteNote = document.createElement('div')
        divOptions.appendChild(this.divDeleteNote)
        this.divDeleteNote.innerHTML = '&#128500;'
        this.divDeleteNote.addEventListener('click', () => this.removeNote())
    }

    // generowanie stopki notatki
    // -footer
    // --div
    // ---label
    // ---input:checkbox
    #renderFooterNoteBox(){
        //tworzenie elementu footer
        this.footerNote = document.createElement('footer')
        this.divNote.appendChild(this.footerNote)
        this.footerNote.classList.add('note-footer')
        //tworzenie div dla etykiety i checkbox
        let divFormElementGroup = document.createElement('div')
        this.footerNote.appendChild(divFormElementGroup)
        //tworzenie etykiety "wykonane"
        let labelFooterNote = document.createElement('label')
        divFormElementGroup.appendChild(labelFooterNote)
        labelFooterNote.innerText = 'Wykonane'
        labelFooterNote.setAttribute('for',`checkTaskCompleted${this.id}`)
        //tworzenie input checkbox
        this.checkTaskCompleted = document.createElement('input')
        divFormElementGroup.appendChild(this.checkTaskCompleted)
        this.checkTaskCompleted.type = 'checkbox'
        this.checkTaskCompleted.id = `checkTaskCompleted${this.id}` //potrzebne do połączenia z etykietą
        //zmiana ostylowani stopki gdy notatka jest wykonana
        if(this.done){
            this.checkTaskCompleted.checked = true
            this.footerNote.classList.add('note-done')
        }
        this.checkTaskCompleted.addEventListener('change', () => {
            if(this.checkTaskCompleted.checked){
                this.footerNote.classList.add('note-done')
                this.divNoteDone.style.display = 'block'
                this.done = true
            }else{
                this.footerNote.classList.remove('note-done')
                this.divNoteDone.style.display = 'none'
                this.done = false
            }
            this.doneNote()
        })
    }

    // generowanie treści notatki
    // -div
    // --p - treść notatki
    // --div - znaczek checked
    #renderNoteContentBox(){
        // tworzenie elementu div z notatką
        let divNoteContent = document.createElement('div')
        this.divNote.appendChild(divNoteContent)
        divNoteContent.classList.add('note-content')
        let pNoteContent = document.createElement('p')
        divNoteContent.appendChild(pNoteContent)
        pNoteContent.innerHTML = this.note
        this.divNoteDone = document.createElement('div')
        divNoteContent.appendChild(this.divNoteDone)
        this.divNoteDone.innerHTML += '&#10004;'
        if(!this.done) this.divNoteDone.style.display = 'none'
    }

    // generowanie "szpilki" do przesuwania
    #renderNotePin(){
        this.divNotePin = document.createElement('div')
        this.divNote.appendChild(this.divNotePin)
        this.divNotePin.classList.add('note-pin')
        // this.divNotePin.innerHTML = '&#128400;'
        this.divNotePin.innerHTML = '&#128308;'
    }

    //renderowanie całej notatki
    // -funkcje renderujące
    // -zdarzenie edycji
    // -!!!!!!!!!!!!!!!!!!!!!!!testowe zdarzenie contextmenu
    renderNote(){
        //tworzymy główne pudełko notatki
        this.#renderMainNoteBox()
        this.#renderHeaderNoteBox()
        this.#renderNoteContentBox()
        this.#renderFooterNoteBox()
        this.#renderNotePin()
    }

    //zdarzenie edycja notatki
    editNote(){
        const editNoteEvent = new CustomEvent('editNote', {detail: {
            id: this.id, 
            complD: this.complD, 
            shedD: this.shedD, 
            targetId: this.targetId,
            note: this.note, 
            done: this.done
        }})
        this.dispatchEvent(editNoteEvent)
    }
    
    //zdarzenie notatka wykonana
    doneNote(){
        const doneNoteEvent = new CustomEvent('doneNote', {detail: {
            id: this.id, 
            complDate: this.complD, 
            shedDate: this.shedD, 
            targetId: this.targetId,
            note: this.note, 
            done: this.done
        }})
        this.dispatchEvent(doneNoteEvent)
    }

    //zdarzenie notatka usuwana
    removeNote(){
        const removeNote = new CustomEvent('removeNote', {detail: {
            id: this.id,
            noteThis: this
        }})
        this.dispatchEvent(removeNote)
    }
}