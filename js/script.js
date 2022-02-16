document.addEventListener('DOMContentLoaded', () => {
  const addClientButton = document.getElementById('add-client__button');
  const closeNewClientFormButton = document.getElementById('add-new-client__close-btn');
  const cancelAddButton = document.getElementById('add-new-client__cancel-btn');
  const addNewClientModalContainer = document.getElementById('add-new-client');
  const addNewClientModal = document.getElementById('add-new-client__modal');
  const addContactContainer = document.getElementById('add-contact-btn__container');
  const addContactBtn = document.getElementById('add-contact__btn');
  const saveNewClientBtn = document.getElementById('add-new-client__save-btn');
  const addClientSurnameInput = document.getElementById('surname');
  const addClientNameInput = document.getElementById('name');
  const addClientLastNameInput = document.getElementById('lastName');

  const deleteClientModalContainer = document.getElementById('delete-client');
  const deleteClientModal = document.getElementById('delete-client__modal');
  const closeDeleteClientModalButton = document.getElementById('delete-client__close-btn');
  const cancelDeleteButton = document.getElementById('delete-client__cancel-btn');
  const deleteClientBtn = document.getElementById('delete-client__btn');

  const updateClientModalContainer = document.getElementById('update-client');
  const updateClientModal = document.getElementById('update-client__modal');
  const closeUpdateClientModalButton = document.getElementById('update-client__close-btn');
  const buttonForDeleteClientInUpdateModal = document.getElementById('update-client__delete-btn');
  const saveUpdateClientBtn = document.getElementById('update-client__save-btn');
  const clientIdInUpdateModal = document.getElementById('client__id');
  const addContactButtonUpdate = document.getElementById('add-contact__btn_update');
  const addContactContainerUpdate = document.getElementById('add-contact-btn__container_update');

  const updateClientSurnameInput = document.getElementById('update_surname');
  const updateClientNameInput = document.getElementById('update_name');
  const updateClientLastNameInput = document.getElementById('update_lastName');

  const searchInput = document.querySelector('.header__input');
  const buttonFullNameSort = document.querySelector('.th__btn_fullname');
  const buttonIDSort = document.querySelector('.th__btn_id');
  const buttonCreateSort = document.querySelector('.th__btn_create');
  const buttonUpdateSort = document.querySelector('.th__btn_update');

  let tableBody = document.querySelector('.table__tbody');
  let timeOutId;
  let sortedList;
  let targetUser;

  const contactsList = ['Телефон', 'Доп. телефон', 'Email', 'Vk', 'Facebook', 'Другое'];

  // Кнопка "Добавить клиента"
  addClientButton.addEventListener('click', () => {
    addNewClientModalContainer.classList.add('visible');
    addNewClientModal.classList.add('visible');
  });

  // Кнопка закрытия окна добавления клиента
  closeNewClientFormButton.addEventListener('click', () => {
    removeVisible(closeNewClientFormButton, addNewClientModal, addNewClientModalContainer, addContactBtn);
  });

  // Кнопка "Отмена"
  cancelAddButton.addEventListener('click', () => {
    removeVisible(cancelAddButton, addNewClientModal, addNewClientModalContainer, addContactBtn);
  });

  // Область за модальным окном НОВОГО клиента
  addNewClientModalContainer.addEventListener('click', () => {
    removeVisible(addNewClientModalContainer, addNewClientModal, addNewClientModalContainer, addContactBtn);
  });

  // Кнопка "Добавить контакт" в окне НОВОГО клиента
  addContactBtn.addEventListener('click', () => {
    createContactSelect(addContactContainer, contactsList, addContactBtn);

    addContactBtn.classList.add('add-contact__btn_margin');

    hiddenAddContactButton(addContactBtn);

    const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');

    deleteContactBtnsListener(deleteContactBtns, addContactBtn);
  });

  // Кнопка "Сохранить" в окне НОВОГО клиента
  saveNewClientBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const client = {
      name: addClientNameInput.value,
      surname: addClientSurnameInput.value,
      lastName: addClientLastNameInput.value,
      contacts: getContacts()
    }

    removeVisible(saveNewClientBtn, addNewClientModal, addNewClientModalContainer, addContactBtn);
    addClientToServer(client);
  });

  // Кнопка "Удалить" в окне удаления клиента
  deleteClientBtn.addEventListener('click', () => {
    deleteClientModalContainer.classList.remove('visible');

    deleteClientFromServer(targetUser);
  });

  // Кнопка "Сохранить" в окне ИЗМЕНЕНИЯ клиента
  saveUpdateClientBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const client = {
      name: updateClientNameInput.value,
      surname: updateClientSurnameInput.value,
      lastName: updateClientLastNameInput.value,
      contacts: getContacts()
    }

    removeVisible(saveUpdateClientBtn, updateClientModal, updateClientModalContainer, addContactButtonUpdate);
    updateClientOnServer(targetUser, client);
  });

  // Кнопка "Добавить контакт" в окне ИЗМЕНЕНИЯ клиента
  addContactButtonUpdate.addEventListener('click', () => {
    createContactSelect(addContactContainerUpdate, contactsList, addContactButtonUpdate);

    addContactButtonUpdate.classList.add('add-contact__btn_margin');

    hiddenAddContactButton(addContactButtonUpdate);

    const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');
    console.log(deleteContactBtns);

    deleteContactBtnsListener(deleteContactBtns, addContactButtonUpdate);
  })

  // Инпут "Введите запрос"
  searchInput.addEventListener('input', () => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(searchClients, 300);
  });

  // Кнопки сортировки в таблице
  buttonFullNameSort.addEventListener('click', () => {
    sortClientsByFullName();
  });

  buttonIDSort.addEventListener('click', () => {
    sortClients('id', buttonIDSort, false);
  });

  buttonCreateSort.addEventListener('click', () => {
    sortClients('createdAt', buttonCreateSort, true);
  });

  buttonUpdateSort.addEventListener('click', () => {
    sortClients('updatedAt', buttonUpdateSort, true);
  });

  function hiddenAddContactButton(button) {
    const contactContainers = document.querySelectorAll('.contact-container');

    if (contactContainers.length === 10) {
      button.classList.add('hidden');
    }
  }

  function deleteContactBtnsListener(deleteContactBtns, addContactBtn) {
    deleteContactBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const activeDeleteContactBtn = e.currentTarget;
        console.log(activeDeleteContactBtn);
        const activeContactContainer = activeDeleteContactBtn.closest('div');
        activeContactContainer.remove();

        const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');
        if (deleteContactBtns.length < 10 && addContactBtn.classList.contains('hidden')) {
          addContactBtn.classList.remove('hidden');
        }
        if (deleteContactBtns.length === 0) {
          addContactBtn.classList.remove('add-contact__btn_margin');
        }
      });
    });
  }

  function removeVisible(button, element, background, addContactBtn) {
    button.addEventListener('click', () => {
      element.classList.remove('visible');
      background.classList.remove('visible');

      const contactContainers = document.querySelectorAll('.contact-container');

      contactContainers.forEach((contact) => {
        contact.remove();
      });

      addContactBtn.classList.remove('add-contact__btn_margin');
      addContactBtn.classList.remove('hidden');
    });
  }

  // Функция создания контакта в модальном окне ===============================================================================================
  function createContactSelect(container, contactsList, contactBtn, defaultType="Телефон") {
    const selectAndInputContainer = document.createElement('div');
    selectAndInputContainer.classList.add('contact-container');
    container.insertBefore(selectAndInputContainer, contactBtn);

    const activeIndex = contactsList.indexOf(defaultType);

    const select = createCustomDropdownSelect(contactsList, selectAndInputContainer);

    const selectButton = select.querySelector('.custom-select__button');
    const selectList = select.querySelector('.custom-select__list');
    const selectInput = select.querySelector('.custom-select__input');

    if (activeIndex > 0) {
      selectButton.innerText = selectList.childNodes[activeIndex].innerHTML;
      selectInput.value = selectList.childNodes[activeIndex].dataset.value;
    }

    const contactInput = document.createElement('input');
    contactInput.classList.add('contact-input');
    selectAndInputContainer.appendChild(contactInput);

    contactInput.placeholder = 'Введите данные контакта';
    const deleteContactBtn = document.createElement('button');
    deleteContactBtn.classList.add('delete-contact-btn', 'btn');
    deleteContactBtn.type = 'button';
    selectAndInputContainer.appendChild(deleteContactBtn);
  }

  function createCustomDropdownSelect(contactsList, selectAndInputContainer, defaultType="Телефон") {
    const customSelectWrapper = document.createElement('div');
    customSelectWrapper.classList.add('select-wrapper');
    selectAndInputContainer.append(customSelectWrapper);

    const customSelectButton = document.createElement('button');
    customSelectButton.type = 'button';
    customSelectButton.classList.add('custom-select__button');
    customSelectButton.innerText = defaultType;

    const customSelectList = document.createElement('ul');
    customSelectList.classList.add('custom-select__list');
    customSelectWrapper.appendChild(customSelectList);

    customSelectButton.addEventListener('click', () => {
      customSelectList.classList.toggle('custom-select__list_visible');
      customSelectButton.classList.toggle('custom-select__button_is-open');
    });

    customSelectWrapper.appendChild(customSelectButton);

    const customSelectHiddenInput = document.createElement('input');
    customSelectHiddenInput.setAttribute('type', 'text');
    customSelectHiddenInput.name = 'select-category';
    customSelectHiddenInput.setAttribute('value', defaultType);
    customSelectHiddenInput.classList.add('custom-select__input');

    contactsList.forEach((item) => {
      const customSelectOption = document.createElement('li');
      customSelectOption.classList.add('custom-select__item');
      customSelectOption.innerHTML = item;
      customSelectOption.setAttribute('data-value', item);

      customSelectOption.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelectButton.innerText = e.target.innerText;
        customSelectHiddenInput.value = e.target.dataset.value;
        customSelectList.classList.remove('custom-select__list_visible');
        customSelectButton.classList.remove('custom-select__button_is-open');
      });

      customSelectList.appendChild(customSelectOption);
    });

    customSelectWrapper.appendChild(customSelectHiddenInput);

    document.addEventListener('click', (e) => {
      if (e.target !== customSelectButton) {
        customSelectList.classList.remove('custom-select__list_visible');
        customSelectButton.classList.remove('custom-select__button_is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        customSelectList.classList.remove('custom-select__list_visible');
        customSelectButton.classList.remove('custom-select__button_is-open');
      }
    });

    return customSelectWrapper;
  }

  // Функция получения типа и значения контакта из селекта и инпута для отправки на сервер ======================================================
  function getContacts() {
    const contactDivs = document.querySelectorAll('.contact-container');
    let contacts = [];
    contactDivs.forEach(cd => {
      const cs = cd.querySelector('.custom-select__input')
      const input = cd.querySelector('.contact-input')
      contacts.push ({ type: cs.value, value: input.value})
      /*
      const cType = cs.options[cs.selectedIndex].value
      if cType == 'Tele' {}
      validatePhone(input.value)
      */
    })
    return contacts;
  }

  // Функция создания таблицы =======================================================================================================================
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
      row.id = id;
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
      tableDataContacts.classList.add('table__td', 'table__td_contacts');
      row.appendChild(tableDataContacts);
      let contactDiv;

      contactsList.forEach((contact) => {
        const contactType = contact.type;
        const contactValue = contact.value;

        contactDiv = document.createElement('div');
        contactDiv.classList.add('contact-div');
        tableDataContacts.appendChild(contactDiv);

        const telIcon = document.createElement('img');
        telIcon.src = './img/phone-icon.svg';
        telIcon.classList.add('contact-icon');

        const vkIcon = document.createElement('img');
        vkIcon.src = './img/vk-icon.svg';
        vkIcon.classList.add('contact-icon');

        const facebookIcon = document.createElement('img');
        facebookIcon.src = './img/fb-icon.svg';
        facebookIcon.classList.add('contact-icon');

        const emailIcon = document.createElement('img');
        emailIcon.src = './img/mail-icon.svg';
        emailIcon.classList.add('contact-icon');

        const socialIcon = document.createElement('img');
        socialIcon.src = './img/social-icon.svg';
        socialIcon.classList.add('contact-icon');

        const contactTooltip = document.createElement('div');
        contactTooltip.classList.add('contact-tooltip');
        contactTooltip.innerHTML = contactValue;

        if (contactType === 'Телефон' || contactType === 'Доп. телефон') {
          contactDiv.appendChild(contactTooltip);
          contactDiv.appendChild(telIcon);
        } else if (contactType === 'Vk') {
          contactDiv.appendChild(contactTooltip);
          contactDiv.appendChild(vkIcon);
        } else if (contactType === 'Facebook') {
          contactDiv.appendChild(contactTooltip);
          contactDiv.appendChild(facebookIcon);
        } else if (contactType === 'Email') {
          contactDiv.appendChild(contactTooltip);
          contactDiv.appendChild(emailIcon);
        } else if (contactType === 'Другое') {
          contactDiv.appendChild(contactTooltip);
          contactDiv.appendChild(socialIcon);
        }
      });

      // Действия: изменить
      const tableDataEdit = document.createElement('td');
      tableDataEdit.classList.add('table__td');
      row.appendChild(tableDataEdit);

      const editContactBtn = document.createElement('button');
      editContactBtn.classList.add('btn', 'action-btn_edit');
      tableDataEdit.appendChild(editContactBtn);

      const editBtnIcon = document.createElement('img');
      editBtnIcon.src = './img/edit-icon.svg';
      editBtnIcon.classList.add('action-btn_icon');
      editContactBtn.appendChild(editBtnIcon);
      editContactBtn.insertAdjacentText('beforeEnd', ' Изменить ');

      addListenersToUpdateButton(editContactBtn);

      // Действия: удалить
      const tableDataDelete = document.createElement('td');
      tableDataDelete.classList.add('table__td');
      row.appendChild(tableDataDelete);

      const deleteContactBtn = document.createElement('button');
      deleteContactBtn.classList.add('btn', 'action-btn_delete');
      tableDataDelete.appendChild(deleteContactBtn);

      const deleteBtnIcon = document.createElement('img');
      deleteBtnIcon.src = './img/cancel-icon.svg';
      deleteBtnIcon.classList.add('action-btn_icon');
      deleteContactBtn.appendChild(deleteBtnIcon);
      deleteContactBtn.insertAdjacentText('beforeEnd', ' Удалить ');

      addListenersToDeleteButton(deleteContactBtn);

      hideContacts(row, tableDataContacts);
    });
  }

  // Функция скрытия иконок контактов в таблице ===================================================================================================
  function hideContacts(row, tableData) {
    const contactDivs = row.querySelectorAll('.contact-div');

      if (contactDivs.length > 5) {
        for (i = 4; i < contactDivs.length; i++) {
          contactDivs[i].classList.add('hidden');
        }
        const hiddenContactsNumber = document.createElement('button');
        hiddenContactsNumber.classList.add('hidden-contacts__button', 'btn');

        hiddenContactsNumber.innerHTML = `+${contactDivs.length-4}`

        tableData.appendChild(hiddenContactsNumber);

        hiddenContactsNumber.addEventListener('click', () => {
          contactDivs.forEach((div) => {
            div.classList.remove('hidden');
          });

          hiddenContactsNumber.classList.add('hidden');
        })
      }
  }

  // Обработчики, связанные с удалением клиента ===================================================================================================
  function addListenersToDeleteButton(deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      const activeDeleteButton = event.target;
      const activeTableRow = activeDeleteButton.closest('tr');
      const activeID = activeTableRow.id;

      targetUser = activeID;

      deleteClientModalContainer.classList.add('visible');
      deleteClientModal.classList.add('visible');
    });

    removeVisible(closeDeleteClientModalButton, deleteClientModal, deleteClientModalContainer);
    removeVisible(cancelDeleteButton, deleteClientModal, deleteClientModalContainer);
    removeVisible(deleteClientModalContainer, deleteClientModal, deleteClientModalContainer);

    deleteClientModal.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  // Обработчики, связаннеые с изменением клиента ==================================================================================================
  function addListenersToUpdateButton(editButton) {
    editButton.addEventListener('click', (event) => {
      const activeUpdateButton = event.target;
      const activeTableRow = activeUpdateButton.closest('tr');
      const activeID = activeTableRow.id;

      targetUser = activeID;

      updateClientModalContainer.classList.add('visible');
      updateClientModal.classList.add('visible');

      fetchClientInfoByID(targetUser);

      clientIdInUpdateModal.innerHTML = `ID: ${targetUser}`;

      setTimeout(() => {
        const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');
        console.log(deleteContactBtns);
        deleteContactBtnsListener(deleteContactBtns, addContactButtonUpdate);
      }, 100);
    });

    removeVisible(closeUpdateClientModalButton, updateClientModal, updateClientModalContainer, addContactButtonUpdate);
    removeVisible(updateClientModalContainer, updateClientModal, updateClientModalContainer, addContactButtonUpdate);

    buttonForDeleteClientInUpdateModal.addEventListener('click', () => {
      updateClientModalContainer.classList.remove('visible');
      updateClientModal.classList.remove('visible');
      deleteClientModalContainer.classList.add('visible');
      deleteClientModal.classList.add('visible');

    });

    // updateClientModal.addEventListener('click', (event) => {
    //   event.stopPropagation();
    // });
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

  // Функция сортировки клиентов по остальным полям
  async function sortClients(field, button, boolean) {
    let clientsList = await searchClients();

    sortedList = clientsList.sort(sortByField(field));

    button.classList.toggle('flip');

    if (button.classList.contains('flip') === boolean) {
      sortedList = clientsList.reverse();
    }

    createTable(sortedList);
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

  // Получение информации о клиенте с сервера
  async function fetchClientInfoByID(user) {
    const clientById = await fetch(`http://localhost:3000/api/clients/${user}`);
    const clientData = await clientById.json();

    updateClientNameInput.value = clientData.name;
    updateClientLastNameInput.value = clientData.lastName;
    updateClientSurnameInput.value = clientData.surname;

    const contacts = clientData.contacts;

    for (let i = 0; i < contacts.length; i++) {
      createContactSelect(addContactContainerUpdate, contactsList, addContactButtonUpdate, contacts[i].type);

      addContactButtonUpdate.classList.add('add-contact__btn_margin');
    }

    const contactInputs = document.querySelectorAll('.contact-input');

    for (let i = 0; i < contacts.length; i++) {
      contactInputs[i].value = contacts[i].value;
    }

    hiddenAddContactButton(addContactButtonUpdate);
  }

  // Функция отправки клиента на сервер (POST)
  async function addClientToServer(client) {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    const data = await response.json();
    console.log(data);
  }

  // Функция изменения клиента на сервере (PATCH)
  async function updateClientOnServer(user, client) {
    await fetch(`http://localhost:3000/api/clients/${user}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
  }

  // Функция удаления клиента с сервера (DELETE)
  async function deleteClientFromServer(user) {
    await fetch(`http://localhost:3000/api/clients/${user}`, {
      method: 'DELETE',
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

    createTable(clientsList);
  })();

});
