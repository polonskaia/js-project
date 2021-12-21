document.addEventListener('DOMContentLoaded', () => {
  const addClientButton = document.getElementById('add-client__button');
  const closeNewClientFormButton = document.getElementById('add-new-client__close-btn');
  const cancelAddButton = document.getElementById('add-new-client__cancel-btn');
  const addNewClientModalContainer = document.getElementById('add-new-client');
  const addNewClientModal = document.getElementById('add-new-client__modal');

  addClientButton.addEventListener('click', () => {
    addNewClientModalContainer.classList.add('modal-visible');
  });

  closeNewClientFormButton.addEventListener('click', () => {
    addNewClientModalContainer.classList.remove('modal-visible');
  });

  cancelAddButton.addEventListener('click', () => {
    addNewClientModalContainer.classList.remove('modal-visible');
  });

  addNewClientModalContainer.addEventListener('click', () => {
    addNewClientModalContainer.classList.remove('modal-visible');
  });

  addNewClientModal.addEventListener('click', (event) => {
    event.stopPropagation();
  });

});
