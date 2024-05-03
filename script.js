//All constants for code
const notes = document.getElementById('notes');
const addBtn = document.getElementById('add');
const mainBtn = document.getElementById('main');
const archiveBtn = document.getElementById('archive');
const addForm = document.getElementById('addForm');
const emptyMessage = document.getElementById('emptyMessage');

const modal = new bootstrap.Modal(document.getElementById('addModal'));
let page = 1;

//Main Array to start
let mainTasks = [
    {
        name: 'Elizabeth',
        description: 'Do homework',
        time:getDateInFormat(new Date())
    },
    {
        name: 'Elizabeth',
        description: 'Eat food',
        time:getDateInFormat(new Date())
    },
    {
        name: 'Elizabeth',
        description: 'Go sleep at 21:00',
        time:getDateInFormat(new Date())
    }
];
//Archive Array to start
let archiveTasks = [
    {
        name: 'Elizabeth',
        description: 'Go sleep at 21:00',
        time:getDateInFormat(new Date())
    }
];
//Check if u have localStorage and set localStorage if u don't
function checkLocalStorage(){
    if (localStorage.getItem('mainTasks') === null){
        localStorage.setItem('mainTasks', JSON.stringify(mainTasks));
    }
    
    if(localStorage.getItem('archiveTasks') === null) {
        localStorage.setItem('archiveTasks', JSON.stringify(archiveTasks));
    }
}

addEventListener('load', main);
//Main options
function main(){
        mainBtn.classList.add('active');
        archiveBtn.classList.remove('active');
        checkLocalStorage();
        let MainDraw = JSON.parse(localStorage.getItem('mainTasks'));
        if(MainDraw.length === 0){
            emptyMessage.style.display = 'flex';
        } else {
            emptyMessage.style.display = 'none';
        }
        draw(MainDraw, 'main');
        
        page = 1;
}
//Archive options
function archive(){
    mainBtn.classList.remove('active');
    archiveBtn.classList.add('active');
    checkLocalStorage();
    let ArchiveDraw = JSON.parse(localStorage.getItem('archiveTasks'));
    if(ArchiveDraw.length === 0){
        emptyMessage.style.display = 'flex';
    } else {
        emptyMessage.style.display = 'none';
    }
    draw(ArchiveDraw, 'archive');

    page = 2;
}

let currentTaskId = null;
//Event for open modal window when u click in Add button
addBtn.addEventListener('click', ()=>{
    modal.show();
    currentTaskId = null;
});
//Open modal and Texting text in modal when user click in Edit button
function editTextInModal(element){
    const index = element.getAttribute('data-index');
    modal.show();
    currentTaskId = index;
    checkLocalStorage();
    let EditTextMain = JSON.parse(localStorage.getItem('mainTasks'));
    let EditTextArchive = JSON.parse(localStorage.getItem('archiveTasks'));
    switch(page){
        case 1: 
        addForm.name.value = EditTextMain[index].name;
        addForm.task.value = EditTextMain[index].description;
        main();
        break;
        case 2: 
        addForm.name.value = EditTextArchive[index].name;
        addForm.task.value = EditTextArchive[index].description;
        archive();
        break;
    }
}
//Handler for Edit and Add Task
function handleAddTask(){
    if(addForm.name.value || addForm.task.value){
        if(currentTaskId){
            editTask(currentTaskId);
        } else {
            addNewTask();
        }

    } else {
        alert('Fill out the form');
    }
};
//Edit task in list
function editTask(element){
    const index = element;
    checkLocalStorage();
    switch(page){
        case 1: 
        let EditMain = JSON.parse(localStorage.getItem('mainTasks'));
        EditMain[index].name = addForm.name.value,
        EditMain[index].description = addForm.task.value,
        EditMain[index].time = getDateInFormat(new Date());
        localStorage.setItem('mainTasks', JSON.stringify(EditMain));
        main();
        break;

        case 2: 
        let EditArchive = JSON.parse(localStorage.getItem('archiveTasks'));
        EditArchive[index].name = addForm.name.value,
        EditArchive[index].description = addForm.task.value,
        EditArchive[index].time = getDateInFormat(new Date());
        localStorage.setItem('archiveTasks', JSON.stringify(EditArchive));
        archive();
        break;
    }
    console.log(`edit element ${index}`);
    addForm.name.value="";
    addForm.task.value="";
    modal.hide();
}
//Add task in List
function addNewTask(){
    checkLocalStorage();
    let addTask = JSON.parse(localStorage.getItem('mainTasks'));
    addTask.push({
        name: addForm.name.value,
        description: addForm.task.value,
        time:getDateInFormat(new Date())
    })
    addForm.name.value="";
    addForm.task.value="";
    modal.hide();
    localStorage.setItem('mainTasks', JSON.stringify(addTask));
    main();
}

//Events
mainBtn.addEventListener('click', main);
archiveBtn.addEventListener('click', archive);

//Archiving and Deleting tasks
function ArchivingAndDeleted(element){
    const index = element.getAttribute('data-index');
    checkLocalStorage();
    switch(page){
        case 1: 
        let MainTaskArch = JSON.parse(localStorage.getItem('mainTasks'));
        let ArchiveTaskArch = JSON.parse(localStorage.getItem('archiveTasks'));
        ArchiveTaskArch.push(MainTaskArch[index]);
        MainTaskArch.splice(index, 1); 
        localStorage.setItem('mainTasks', JSON.stringify(MainTaskArch));
        localStorage.setItem('archiveTasks', JSON.stringify(ArchiveTaskArch));
        main();
        console.log(`archive element ${index}`);
        break;

        case 2: 
        let ArchiveTaskDel = JSON.parse(localStorage.getItem('archiveTasks'));
        ArchiveTaskDel.splice(index, 1); 
        localStorage.setItem('archiveTasks', JSON.stringify(ArchiveTaskDel));
        archive();
        console.log(`delete element ${index}`);
        break;
    }
}
//Data format
function getDateInFormat(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const formattedMinutes = minute < 10 ? `0${minute}` : minute;

    return `${hour}:${formattedMinutes}\n${day}/${month}/${year}`;
}
//Close button with dsnt save edits
function CloseBtn(){
    addForm.name.value="";
    addForm.task.value="";
};
//LocalStorage Checker
function checkLocalStorageAvailability() {
    if (!localStorage.getItem('mainTasks') || !localStorage.getItem('archiveTasks')) {
        location.reload();
    }
}
setInterval(checkLocalStorageAvailability, 5000);
//Draw list function
function draw(Array, mode){
    
    const html = Array.map((task, index)=> {
        const buttonIcon = mode === 'main' ? 'fa-file-zipper' : 'fa-trash';
        const archiveClass = mode === 'archive' ? 'archiveElement' : '';

        return `
            <div class="note" id="note">
                <div class="elements ${archiveClass}">
                    <div class="name text-wrap">${task.name}</div>
                    <div class="tasks">
                        <ul>
                            <li class="text-wrap">${task.description}</li>
                        </ul>
                        <p>${task.time}</p>
                    </div>
                </div>
                <div class="editBtn" data-index="${index}" onclick="editTextInModal(this)" >
                    <button><i class="fa-regular fa-pen-to-square"></i></button>                
                </div>
                <div class="archiving" data-index="${index}" onclick="ArchivingAndDeleted(this)">
                    <button><i class="fa-solid ${buttonIcon}"></i></button>                
                </div>
            </div>
            `}).join(' ');
        notes.innerHTML=html;
}