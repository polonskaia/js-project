document.addEventListener('DOMContentLoaded', () => {
  const addClientButton = document.getElementById('add-client__button');
  const closeNewClientFormButton = document.getElementById('add-new-client__close-btn');
  const cancelAddButton = document.getElementById('add-new-client__cancel-btn');
  const addNewClientModalContainer = document.getElementById('add-new-client');
  const addNewClientModal = document.getElementById('add-new-client__modal');
  const addContactContainer = document.getElementById('add-contact-btn__container');
  const addContactBtn = document.getElementById('add-contact__btn');
  const saveNewClientBtn = document.getElementById('add-new-client__save-btn');
  const tableBody = document.querySelector('.table__tbody');
  const contactsList = ['Телефон', 'Доп. телефон', 'Email', 'Vk', 'Facebook', 'Другое'];

  addClientButton.addEventListener('click', () => {
    addNewClientModalContainer.classList.add('visible');
  });

  closeNewClientFormButton.addEventListener('click', () => {
    addNewClientModalContainer.classList.remove('visible');
  });

  cancelAddButton.addEventListener('click', () => {
    addNewClientModalContainer.classList.remove('visible');
  });

  addNewClientModalContainer.addEventListener('click', () => {
    addNewClientModalContainer.classList.remove('visible');
  });

  addNewClientModal.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  addContactBtn.addEventListener('click', () => {
    createContactSelect(addContactContainer, contactsList);
  });

  saveNewClientBtn.addEventListener('click', (event) => {
    event.preventDefault();
    getOptionValue();
    addNewClientModalContainer.classList.remove('visible');
  });

  function createContactSelect(container, list) {
    const selectAndInputContainer = document.createElement('div');
    selectAndInputContainer.classList.add('contact-container');
    container.insertBefore(selectAndInputContainer, addContactBtn);

    const contactSelect = document.createElement('select');
    contactSelect.classList.add('selectCustom')
    selectAndInputContainer.appendChild(contactSelect);

    list.forEach((item) => {
      const contactOption = document.createElement('option');
      contactOption.innerHTML = item;
      contactOption.setAttribute('value', item);
      contactSelect.appendChild(contactOption);
    });

    const contactInput = document.createElement('input');
    contactInput.classList.add('contact-input');
    selectAndInputContainer.appendChild(contactInput);
    contactInput.placeholder = 'Введите данные контакта';

    const deleteContactBtn = document.createElement('button');
    deleteContactBtn.classList.add('delete-contact-btn', 'btn');
    deleteContactBtn.type = 'button';
    selectAndInputContainer.appendChild(deleteContactBtn);
  }

  function getOptionValue() {
    const selects = document.querySelectorAll('.selectCustom');
    selects.forEach((s) => {
      const optionValue = s.options[s.selectedIndex].value;
      console.log(optionValue);
    });
  }

  function createTable(ID, fullName, creatingDate, updatingDate, contacts) {
    const crDate = new Date(creatingDate);
    const updDate = new Date(updatingDate);

    const row = document.createElement('tr');
    tableBody.append(row);

    row.innerHTML = `
    <td>${ID}</td>
    <td>${fullName}</td>
    <td>${crDate}</td>
    <td>${updDate}</td>
    <td>...</td>
    <td>Изменить</td>
    <td>Удалить</td>
    `;
  }

  function addClassesToTableCells() {
    const tdList = document.getElementsByTagName('td');
    const tdArray = Array.from(tdList);

    tdArray.forEach((td) => {
      td.classList.add('table__td');
    });

    const trArray = Array.from(document.getElementsByTagName('tr')).slice(1);

    trArray.forEach((row) => {
      const firstCells = Array.from(row.getElementsByTagName('td'))[0];
      firstCells.classList.add('table__td_id');
    });
  }

  async function getClientsFromServer() {
    const clients = await fetch('http://localhost:3000/api/clients');
    const clientsData = await clients.json();
    return clientsData;
  }

  (async () => {
    const clientsList = await getClientsFromServer();
    console.log(clientsList);

    clientsList.forEach((client) => {
      const id = client.id;
      const fname = [client.surname, client.name, client.lastName].join(' ');
      const create = client.createdAt;
      const update = client.updatedAt;
      const contactsList = client.contacts;
      createTable(id, fname, create, update, contactsList);
    });

    addClassesToTableCells();
  })();

});
