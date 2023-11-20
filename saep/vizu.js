'use strict';

const openModal = () => document.getElementById('modal').classList.add('active');
const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
};

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_activities')) ?? [];
const setLocalStorage = (dbActivities) => localStorage.setItem('db_activities', JSON.stringify(dbActivities));

// CRUD - create read update delete
const deleteActivity = (index) => {
    const dbActivities = readActivities();
    dbActivities.splice(index, 1);
    setLocalStorage(dbActivities);
    updateTable();
};

const updateActivity = (index, activity) => {
    const dbActivities = readActivities();
    dbActivities[index] = activity;
    setLocalStorage(dbActivities);
    updateTable();
};

const readActivities = () => getLocalStorage();

const createActivity = (activity) => {
    const dbActivities = getLocalStorage();
    dbActivities.push(activity);
    setLocalStorage(dbActivities);
    updateTable();
};

const isValidFields = () => {
    return document.getElementById('formAtividade').reportValidity();
};

// Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach((field) => (field.value = ''));
    document.getElementById('nomeAtividade').dataset.index = 'new';
};

const saveActivity = (event) => {
    event.preventDefault();

    if (isValidFields()) {
        const activity = {
            nome: document.getElementById('nomeAtividade').value,
        };
        const index = document.getElementById('nomeAtividade').dataset.index;
        if (index == 'new') {
            createActivity(activity);
            closeModal();
        } else {
            updateActivity(index, activity);
            closeModal();
        }
    }
};

const createRow = (activity, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${activity.nome}</td>
        <td>
            <button type="button" class="button green" onclick="visualizarAtividade(${index})">Visualizar</button>
            <button type="button" class="button red" onclick="deleteActivity(${index})">Excluir</button>
        </td>
    `;
    document.querySelector('#tableActivities>tbody').appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tableActivities>tbody tr');
    rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
    const dbActivities = readActivities();
    clearTable();
    dbActivities.forEach(createRow);
};

const visualizarAtividade = (index) => {
    const activity = readActivities()[index];
    document.getElementById('nomeAtividade').value = activity.nome;
    document.getElementById('nomeAtividade').dataset.index = index;
    openModal();
};

const openModalForNewActivity = () => {
    clearFields();
    openModal();
};

updateTable();

// Eventos
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('formAtividade').addEventListener('submit', saveActivity);
document.getElementById('cancelar').addEventListener('click', closeModal);
document.getElementById('addAtividade').addEventListener('click', openModalForNewActivity);
