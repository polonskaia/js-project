document.addEventListener('DOMContentLoaded', () => {
  const addClientButton = document.getElementById('add-client__button');
  const modalBackground = document.getElementById('modal__background');
  // Модальное окно "Добавить клиента"
  const addNewClientModal = document.getElementById('add-client-modal');
  const addClientForm = document.querySelector('.add-client-modal__form');
  const closeButtonInAddClientModal = document.getElementById('add-client-modal__close-button');
  const addContactContainer = document.getElementById('add-contact-button__wrapper_add-client');
  const addContactButton = document.getElementById('add-contact__btn');
  const cancelButtonInAddClientModal = document.getElementById('add-client-modal__cancel-button');
  const saveNewClientBtn = document.getElementById('save-client__button');
  const addClientSurnameInput = document.getElementById('surname');
  const addClientNameInput = document.getElementById('name');
  const addClientLastNameInput = document.getElementById('lastName');
  const formInputsAddClient = document.querySelectorAll('.form-input_add');
  const requiredInputsAdd = document.querySelectorAll('.form-input_add_required');
  // Модальное окно "Изменить клиента"
  const updateClientModal = document.getElementById('update-client-modal');
  const updateClientForm = document.querySelector('.update-client-modal__form');
  const closeUpdateClientModalButton = document.getElementById('update-client-modal__close-button');
  const buttonForDeleteClientInUpdateModal = document.getElementById('update-client-modal__delete-button');
  const saveUpdatingClientButton = document.getElementById('save-updating-client__button');
  const clientIdInUpdateModal = document.getElementById('client__id');
  const addContactContainerUpdate = document.getElementById('add-contact-button__wrapper_update-client');
  const addContactButtonUpdate = document.getElementById('add-contact__btn_update');
  const updateClientSurnameInput = document.getElementById('update_surname');
  const updateClientNameInput = document.getElementById('update_name');
  const updateClientLastNameInput = document.getElementById('update_lastName');
  const formInputsUpdateClient = document.querySelectorAll('.form-input_update');
  const requiredInputsUpdate = document.querySelectorAll('.form-input_update_required');
  // Модальное окно "Удалить клиента"
  const deleteClientModal = document.getElementById('delete-client-modal');
  const closeDeleteClientModalButton = document.getElementById('delete-client-modal__close-button');
  const cancelDeleteButton = document.getElementById('delete-client-modal__cancel-button');
  const deleteClientBtn = document.getElementById('delete-client-modal__delete-button');

  const searchInput = document.querySelector('.header__input');
  const buttonFullNameSort = document.querySelector('.th__btn_fullname');
  const buttonIDSort = document.querySelector('.th__btn_id');
  const buttonCreateSort = document.querySelector('.th__btn_create');
  const buttonUpdateSort = document.querySelector('.th__btn_update');

  let tableBody = document.querySelector('.table__tbody');
  let timeOutId;
  let sortedList;
  let targetUser;

  const contactsList = ['Телефон', 'Доп. телефон', 'Email', 'Vk', 'Facebook', 'Twitter'];

  // Кнопка "Добавить клиента"
  addClientButton.addEventListener('click', () => {
    modalBackground.classList.add('visible');
    addNewClientModal.classList.add('visible');
  });

  // Кнопка закрытия окна добавления клиента
  closeButtonInAddClientModal.addEventListener('click', () => {
    removeVisible(addNewClientModal);
    removeServerErrors(addContactContainer);
    removeClassesFromAddContactButton(addContactButton);
    removeContactContainers();
    formInputsAddClient.forEach((input) => {
      input.value = '';
      input.classList.remove('form-input_error');
    });
  });

  // Кнопка "Отмена" в окне добавления нового клиента
  cancelButtonInAddClientModal.addEventListener('click', () => {
    removeVisible(addNewClientModal);
    removeServerErrors(addContactContainer);
    removeClassesFromAddContactButton(addContactButton);
    removeContactContainers();
    formInputsAddClient.forEach((input) => {
      input.value = '';
      input.classList.remove('form-input_error');
    });
  });

  // Область за модальным окном
  modalBackground.addEventListener('click', () => {
    if (addNewClientModal.classList.contains('visible')) {
      removeVisible(addNewClientModal);
      removeServerErrors(addContactContainer);
      removeClassesFromAddContactButton(addContactButton);
      formInputsAddClient.forEach((input) => {
        input.value = '';
        input.classList.remove('form-input_error');
      });
    } else if (updateClientModal.classList.contains('visible')) {
      removeVisible(updateClientModal);
      removeServerErrors(addContactContainerUpdate);
      removeClassesFromAddContactButton(addContactButtonUpdate);
    } else if (deleteClientModal.classList.contains('visible')) {
      removeVisible(deleteClientModal);
    }

    removeContactContainers();
  });

  // Кнопка "Добавить контакт" в окне НОВОГО клиента
  addContactButton.addEventListener('click', () => {
    removeServerErrors(addContactContainer);
    createContactInModal(addContactContainer, contactsList, addContactButton);

    addContactButton.classList.add('add-contact__btn_margin');

    hiddenAddContactButton(addContactButton);

    const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');

    deleteContactsInModal(deleteContactBtns, addContactButton);
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

    removeServerErrors(addContactContainer);

    if (validateForm(requiredInputsAdd, formInputsAddClient)) {
      addClientToServer(client);
    }
  });

  closeDeleteClientModalButton.addEventListener('click', () => {
    removeVisible(deleteClientModal);
  });

  cancelDeleteButton.addEventListener('click', () => {
    removeVisible(deleteClientModal);
  });

  // Кнопка "Удалить" в окне удаления клиента
  deleteClientBtn.addEventListener('click', () => {
    deleteClientFromServer(targetUser);
  });

  // Кнопка закрытия окна изменения клиента
  closeUpdateClientModalButton.addEventListener('click', () => {
    removeVisible(updateClientModal);
    removeServerErrors(addContactContainerUpdate);
    removeClassesFromAddContactButton(addContactButtonUpdate);
    removeContactContainers();
  });

  // Кнопка удаления клиента в окне изменения
  buttonForDeleteClientInUpdateModal.addEventListener('click', () => {
    updateClientModal.classList.remove('visible');
    deleteClientModal.classList.add('visible');
    removeServerErrors(addContactContainerUpdate);
    removeClassesFromAddContactButton(addContactButtonUpdate);
    removeContactContainers();
  });

  // Кнопка "Добавить контакт" в окне ИЗМЕНЕНИЯ клиента
  addContactButtonUpdate.addEventListener('click', () => {
    removeServerErrors(addContactContainerUpdate);
    createContactInModal(addContactContainerUpdate, contactsList, addContactButtonUpdate);

    addContactButtonUpdate.classList.add('add-contact__btn_margin');

    hiddenAddContactButton(addContactButtonUpdate);

    const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');

    deleteContactsInModal(deleteContactBtns, addContactButtonUpdate);
  });

   // Кнопка "Сохранить" в окне ИЗМЕНЕНИЯ клиента
  saveUpdatingClientButton.addEventListener('click', (event) => {
    event.preventDefault();
    removeServerErrors(addContactContainerUpdate);

    const client = {
      name: updateClientNameInput.value,
      surname: updateClientSurnameInput.value,
      lastName: updateClientLastNameInput.value,
      contacts: getContacts()
    }

    if (validateForm(requiredInputsUpdate, formInputsUpdateClient)) {
      updateClientOnServer(targetUser, client);
    }

    locationHashChanged();
  });

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

  function deleteContactsInModal(deleteContactBtns, addContactBtn) {
    deleteContactBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const activeDeleteContactBtn = e.currentTarget;
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

  function removeVisible(element) {
    element.classList.remove('visible');
    modalBackground.classList.remove('visible');

    locationHashChanged();
  }

  function removeContactContainers() {
    const contactContainers = document.querySelectorAll('.contact-container');

    if (contactContainers.length > 0) {
      contactContainers.forEach((contact) => {
        contact.remove();
      });
    }
  }

  function removeServerErrors(addButtonWrapper) {
    const errorsWrapper = document.querySelector('.server-errors__wrapper');

    if (errorsWrapper) {
      errorsWrapper.remove();
    }

    addButtonWrapper.classList.remove('contact-wrapper__margin-bottom');
  }

  function removeClassesFromAddContactButton(addContactBtn) {
    addContactBtn.classList.remove('add-contact__btn_margin');
    addContactBtn.classList.remove('hidden');
  }

  // Функция создания контакта в модальном окне ===============================================================================================
  function createContactInModal(container, contactsList, contactBtn, defaultType="Телефон") {
    const selectAndInputContainer = document.createElement('div');
    selectAndInputContainer.classList.add('contact-container');
    container.insertBefore(selectAndInputContainer, contactBtn);
    setTimeout(() => selectAndInputContainer.style.opacity = '1');

    const activeIndex = contactsList.indexOf(defaultType);

    const select = createCustomDropdownSelect(contactsList, selectAndInputContainer);

    const selectButton = select.querySelector('.custom-select__button');
    const selectList = select.querySelector('.custom-select__list');
    const selectInput = select.querySelector('.custom-select__input');
    const selectOptions = selectList.querySelectorAll('.custom-select__item');

    if (activeIndex > 0) {
      selectButton.innerText = selectList.childNodes[activeIndex].innerHTML;
      selectInput.value = selectList.childNodes[activeIndex].dataset.value;
    }

    selectOptions.forEach((option) => {
      if (selectButton.innerHTML === option.innerHTML) {
        option.classList.add('hidden');
      }
    });

    const contactInput = document.createElement('input');
    contactInput.classList.add('contact-input');
    contactInput.placeholder = 'Введите данные контакта';
    selectAndInputContainer.appendChild(contactInput);

    const deleteContactBtn = document.createElement('button');
    deleteContactBtn.classList.add('delete-contact-btn', 'btn');
    deleteContactBtn.type = 'button';
    selectAndInputContainer.appendChild(deleteContactBtn);

    const deleteContactTooltip = document.createElement('div');
    deleteContactTooltip.classList.add('delete-contact-tooltip');
    deleteContactTooltip.innerText = 'Удалить контакт';
    deleteContactBtn.appendChild(deleteContactTooltip);
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

        const customSelectOptions = document.querySelectorAll('.custom-select__item');

        customSelectOptions.forEach((option) => {
          option.classList.remove('hidden');
        });

        e.target.classList.add('hidden');
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
    contactDivs.forEach(cdiv => {
      const contactSelect = cdiv.querySelector('.custom-select__input');
      const contactInput = cdiv.querySelector('.contact-input');
      contacts.push ({ type: contactSelect.value, value: contactInput.value})
    });

    return contacts;
  }

  // Функция валидации формы =====================================================================================================================
  function validateForm(requiredInputs, formInputs) {
    let isValid = true;

    // Валидация ФИО
    requiredInputs.forEach((reqInput) => {
      const reqInputValue = String(reqInput.value).trim();

      if (reqInputValue.length === 0) {
        console.log('Укажите фамилию и имя');
        reqInput.classList.add('form-input_error');

        reqInput.addEventListener('input', () => {
          reqInput.classList.remove('form-input_error');
        });

        isValid = false;
      }
    });

    formInputs.forEach((input) => {
      if ((/[0-9]/.test(input.value) || /[^А-Яа-яЁёA-Za-z0-9-]/.test(input.value)) && input.value.length > 0) {
        console.log(input.value)
        console.log('Поле должно содержать только буквы');

        input.classList.add('form-input_error');

        input.addEventListener('input', () => {
          input.classList.remove('form-input_error');
        });

        isValid = false;
      }
    });

    // Валидация контактов
    const contactDivs = document.querySelectorAll('.contact-container');

    contactDivs.forEach(cd => {
      const contactSelect = cd.querySelector('.custom-select__input');
      const contactInput = cd.querySelector('.contact-input');

      const contactType = contactSelect.value;
      const contactValue = String(contactInput.value).trim();

      if (contactValue.length === 0) {
        console.log('Добавленный контакт должен быть заполнен');
        contactInput.closest('div').classList.add('contact-input_error');

        contactInput.addEventListener('input', () => {
          contactInput.closest('div').classList.remove('contact-input_error');
        });

        isValid = false;
        return;
      }

      if (contactType === 'Телефон' || contactType === 'Доп. телефон') {
        if (/\+[0-9]+/.test(contactValue) === false || contactValue.length < 12) {
          console.log('Поле должно содержать символ "+" и 11 цифр');
          contactInput.closest('div').classList.add('contact-input_error');

          isValid = false;
        }
      }

      if (contactType === 'Email') {
        if (/^(?!.*@.*@.*$)(?!.*@.*--.*\..*$)(?!.*@.*-\..*$)(?!.*@.*-$)((.*)?@.+(\..{1,11})?)$/.test(contactValue) === false) {
          console.log('Некорректный e-mail')
          contactInput.closest('div').classList.add('contact-input_error');

          isValid = false;
        }
      }

      if (contactType === 'Vk' || contactType === 'Facebook' || contactType === 'Twitter') {
        if (/[А-Яа-яЁё]+/.test(contactValue)) {
          console.log('Поле не должно содержать кириллические символы')
          contactInput.closest('div').classList.add('contact-input_error');

          isValid = false;
        }
      }

      contactInput.addEventListener('input', () => {
        contactInput.closest('div').classList.remove('contact-input_error');
      });
    });

    return isValid;
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
        contactTooltip.innerHTML = `${contactType}: `;

        const contactLink = document.createElement('a');
        contactLink.classList.add('contact-link');
        contactLink.innerHTML = contactValue;
        contactLink.href = '#';
        contactTooltip.appendChild(contactLink);

        if (contactType === 'Телефон' || contactType === 'Доп. телефон') {
          contactLink.classList.add('contact-link_tel');
          contactLink.innerHTML = `${contactValue.slice(0, 2)} (${contactValue.slice(2, 5)}) ${contactValue.slice(5, 8)}-${contactValue.slice(8, 10)}-${contactValue.slice(10)}`;
          contactLink.href = `tel:${contactValue}`;
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
        } else if (contactType === 'Twitter') {
          contactDiv.appendChild(contactTooltip);
          contactDiv.appendChild(socialIcon);
        }
      });

      // Действия
      const tableDataActions = document.createElement('td');
      tableDataActions.classList.add('table__td', 'table__td_actions');
      row.appendChild(tableDataActions);

      const editContactBtn = document.createElement('button');
      editContactBtn.classList.add('btn', 'action-btn_edit');
      tableDataActions.appendChild(editContactBtn);

      const editBtnIcon = document.createElement('img');
      editBtnIcon.src = './img/edit-icon.svg';
      editBtnIcon.classList.add('action-btn_icon');
      editContactBtn.appendChild(editBtnIcon);
      editContactBtn.insertAdjacentText('beforeEnd', ' Изменить ');

      addListenersToUpdateButton(editContactBtn);

      const deleteContactBtn = document.createElement('button');
      deleteContactBtn.classList.add('btn', 'action-btn_delete');
      tableDataActions.appendChild(deleteContactBtn);

      const deleteBtnIcon = document.createElement('img');
      deleteBtnIcon.src = './img/cancel-icon.svg';
      deleteBtnIcon.classList.add('action-btn_icon');
      deleteContactBtn.appendChild(deleteBtnIcon);
      deleteContactBtn.insertAdjacentText('beforeEnd', ' Удалить ');

      addListenerToDeleteButton(deleteContactBtn);

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

  // Обработчики кнопки "удалить" в таблице ===================================================================================================
  function addListenerToDeleteButton(deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      const activeDeleteButton = event.target;
      const activeTableRow = activeDeleteButton.closest('tr');
      const activeID = activeTableRow.id;

      targetUser = activeID;

      modalBackground.classList.add('visible');
      deleteClientModal.classList.add('visible');
    });
  }

  // Обработчики кнопки "изменить" в таблице ==================================================================================================
  function addListenersToUpdateButton(editButton) {
    editButton.addEventListener('click', (event) => {
      const activeUpdateButton = event.target;
      const activeTableRow = activeUpdateButton.closest('tr');
      const activeID = activeTableRow.id;

      targetUser = activeID;

      modalBackground.classList.add('visible');
      updateClientModal.classList.add('visible');

      fetchClientInfoByID(targetUser);

      clientIdInUpdateModal.innerHTML = `ID: ${targetUser}`;

      location.hash = activeID;

      setTimeout(() => {
        const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');
        deleteContactsInModal(deleteContactBtns, addContactButtonUpdate);
      }, 100);
    });
  }

  (function () {
    if (location.hash) {
      let hash = location.hash.slice(1);

      modalBackground.classList.add('visible');
      updateClientModal.classList.add('visible');

      fetchClientInfoByID(hash);

      clientIdInUpdateModal.innerHTML = `ID: ${hash}`;

      setTimeout(() => {
        const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');
        deleteContactsInModal(deleteContactBtns, addContactButtonUpdate);
      }, 100);
    }
  })();

  function locationHashChanged() {
    if (location.hash) {
      history.pushState("", document.title, window.location.pathname);
    }
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
      createContactInModal(addContactContainerUpdate, contactsList, addContactButtonUpdate, contacts[i].type);

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

    if (response.status !== 200 || response.status !== 201) {
      showServerErrors(data, addClientForm, saveNewClientBtn, addContactContainer, formInputsAddClient);
    }
  }

  function showServerErrors(data, form, button, addButtonWrapper, formInputs) {
    if (data.errors.length > 0) {
      const serverErrorWrapper = document.createElement('div');
      serverErrorWrapper.classList.add('server-errors__wrapper');
      form.insertBefore(serverErrorWrapper, button);

      data.errors.forEach(error => {
        const serverError = document.createElement('div');
        serverError.classList.add('server-errors__error-descr');
        serverError.innerHTML = `Ошибка: ${error.message.toLowerCase()}!`;
        serverErrorWrapper.appendChild(serverError);
        setTimeout(() => {serverError.style.opacity = '1'}, 100);
      });

      addButtonWrapper.classList.add('contact-wrapper__margin-bottom');

      formInputs.forEach((input) => {
        input.addEventListener('input', () => {
          removeServerErrors(addButtonWrapper);
        });
      });

      const contactInputs = document.querySelectorAll('.contact-input');
      contactInputs.forEach((input) => {
        input.addEventListener('input', () => {
          removeServerErrors(addButtonWrapper);
        });
      });
    }
  }

  // Функция изменения клиента на сервере (PATCH)
  async function updateClientOnServer(user, client) {
    const response = await fetch(`http://localhost:3000/api/clients/${user}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    const data = await response.json();
    console.log(data);

    if (response.status !== 200 || response.status !== 201) {
      showServerErrors(data, updateClientForm, saveUpdatingClientButton, addContactContainerUpdate, formInputsUpdateClient);
    }
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
