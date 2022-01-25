document.addEventListener('DOMContentLoaded', () => {
  const addClientButton = document.getElementById('add-client__button');
  const closeNewClientFormButton = document.getElementById('add-new-client__close-btn');
  const cancelAddButton = document.getElementById('add-new-client__cancel-btn');
  const addNewClientModalContainer = document.getElementById('add-new-client');
  const addNewClientModal = document.getElementById('add-new-client__modal');
  const addContactContainer = document.getElementById('add-contact-btn__container');
  const addContactBtn = document.getElementById('add-contact__btn');
  const saveNewClientBtn = document.getElementById('add-new-client__save-btn');
  const searchInput = document.querySelector('.header__input');
  const buttonFullNameSort = document.querySelector('.th__btn_fullname');
  const buttonIDSort = document.querySelector('.th__btn_id');
  const buttonCreateSort = document.querySelector('.th__btn_create');
  const buttonUpdateSort = document.querySelector('.th__btn_update');
  let tableBody = document.querySelector('.table__tbody');
  let timeOutId;
  let sortedList;

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

  searchInput.addEventListener('input', () => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(searchClients, 300);
  });

  function createContactSelect(container, contactsList) {
    const selectAndInputContainer = document.createElement('div');
    selectAndInputContainer.classList.add('contact-container');
    container.insertBefore(selectAndInputContainer, addContactBtn);

    const contactSelect = document.createElement('select');
    contactSelect.classList.add('selectCustom')
    selectAndInputContainer.appendChild(contactSelect);

    contactsList.forEach((item) => {
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

  function createTable(array) {
    if (tableBody) {
      let newTableBody = document.createElement('tbody')
      newTableBody.classList.add('table__tbody');
      tableBody.parentNode.replaceChild(newTableBody, tableBody);
      tableBody = newTableBody;
    }

    array.forEach((client) => {
      const id = client.id;
      const fullName = [client.surname, client.name, client.lastName].join(' ');
      const creatingDate = client.createdAt;
      const updatingDate = client.updatedAt;
      const contactsList = client.contacts;

      const row = document.createElement('tr');
      tableBody.append(row);

      // ID
      const tableDataID = document.createElement('td');
      tableDataID.innerHTML = id;
      tableDataID.classList.add('table__td_id', 'table__td');
      row.appendChild(tableDataID);

      // Фамилия Имя Отчество
      const tableDataFullName = document.createElement('td');
      tableDataFullName.innerHTML = fullName;
      tableDataFullName.classList.add('table__td');
      row.appendChild(tableDataFullName);

      // Дата и время создания
      const tableDataCreate = document.createElement('td');
      tableDataCreate.innerHTML = formatDate(new Date(creatingDate));
      tableDataCreate.classList.add('table__td');
      row.appendChild(tableDataCreate);

      // Последние изменения
      const tableDataUpdate = document.createElement('td');
      tableDataUpdate.innerHTML = formatDate(new Date(updatingDate));
      tableDataUpdate.classList.add('table__td');
      row.appendChild(tableDataUpdate);

      // Контакты
      const tableDataContacts = document.createElement('td');
      tableDataContacts.classList.add('table__td');
      row.appendChild(tableDataContacts);
      let contactDiv;

      contactsList.forEach((contact) => {
        const contactType = contact.type;
        const contactValue = contact.value;

        const formattedContact = `${contactType}: ${contactValue}`;

        contactDiv = document.createElement('div');
        contactDiv.innerHTML = formattedContact;
        tableDataContacts.appendChild(contactDiv);
      });

      // Действия: изменить
      const tableDataEdit = document.createElement('td');
      tableDataEdit.classList.add('table__td');
      row.appendChild(tableDataEdit);

      const editContactBtn = document.createElement('button');
      editContactBtn.classList.add('btn');
      tableDataEdit.appendChild(editContactBtn);

      const editBtnIcon = document.createElement('img');
      editBtnIcon.src = './img/edit-icon.svg';
      editContactBtn.appendChild(editBtnIcon);
      editContactBtn.insertAdjacentText('beforeEnd', ' Изменить ');

      // Действия: удалить
      const tableDataDelete = document.createElement('td');
      tableDataDelete.classList.add('table__td');
      row.appendChild(tableDataDelete);

      const deleteContactBtn = document.createElement('button');
      deleteContactBtn.classList.add('btn');
      tableDataDelete.appendChild(deleteContactBtn);

      const deleteBtnIcon = document.createElement('img');
      deleteBtnIcon.src = './img/cancel-icon.svg';
      deleteContactBtn.appendChild(deleteBtnIcon);

      deleteContactBtn.insertAdjacentText('beforeEnd', ' Удалить ');
    });
  }

  function formatDate(date) {
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }

    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }

    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours;
    }

    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    return `${[day, month, date.getFullYear()].join('.')} <span class="time">${hours}:${minutes}</span>`;
  }

  // Функция поиска клиентов (фильтрация)
  async function searchClients() {
    const searchString = searchInput.value;
    const searchClients = await fetch(`http://localhost:3000/api/clients?search=${searchString}`);
    const searchClientsData = await searchClients.json();
    console.log(searchClientsData);

    createTable(searchClientsData);

    return searchClientsData;
  }

  // Сортировка
  function sortByField(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
  }

  // Функция сортировки клиентов по ФИО
  async function sortClientsByFullName() {
    let clientsList = await searchClients();
    console.log(clientsList)

    sortedList = clientsList.sort((a, b) => {
      return `${a['surname']} ${a['name']} ${a['lastName']}` > `${b['surname']} ${b['name']} ${b['lastName']}` ? 1 :-1
    });

    if (buttonFullNameSort.textContent === 'А-Я') {
      buttonFullNameSort.textContent = 'Я-А';
      sortedList = clientsList.reverse();
    } else {
      buttonFullNameSort.textContent = 'А-Я';
    }

    createTable(sortedList);
  }

  buttonFullNameSort.addEventListener('click', () => {
    sortClientsByFullName();
  });

  // Функция сортировки клиентов
  async function sortClients(field, button, boolean) {
    let clientsList = await searchClients();

    sortedList = clientsList.sort(sortByField(field));

    button.classList.toggle('flip');

    if (button.classList.contains('flip') === boolean) {
      sortedList = clientsList.reverse();
    }

    createTable(sortedList);
  }

  buttonIDSort.addEventListener('click', () => {
    sortClients('id', buttonIDSort, false);
  });

  buttonCreateSort.addEventListener('click', () => {
    sortClients('createdAt', buttonCreateSort, true);
  });

  buttonUpdateSort.addEventListener('click', () => {
    sortClients('updatedAt', buttonUpdateSort, true);
  });

  async function getClientsFromServer() {
    const clients = await fetch('http://localhost:3000/api/clients');
    const clientsData = await clients.json();
    return clientsData;
  }

  (async () => {
    const clientsList = await getClientsFromServer();
    console.log(clientsList);

    createTable(clientsList);
  })();

});
