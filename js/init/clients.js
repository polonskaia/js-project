import fetch from "node-fetch"

const clients = [
  {
    name: 'Денис',
    surname: 'Скворцов',
    lastName: 'Юрьевич',
    contacts: [
      {
        type: 'Vk',
        value: '@skvorets.den'
      },
      {
        type: 'Facebook',
        value: 'https://facebook.com/den-skvortsov-the-best'
      },
      {
        type: 'Телефон',
        value: '+71234567890'
      },
      {
        type: 'Email',
        value: 'skvorets_den@xyz.com'
      },
      {
        type: 'Другое',
        value: 't.me/deniska'
      },
      {
        type: 'Другое',
        value: 't.me/skvorets'
      },
      {
        type: 'Другое',
        value: '@denchik'
      },
      {
        type: 'Другое',
        value: 'twitter.com/deniSkvortsov'
      }
    ]
  },
  {
    name: 'Арсений',
    surname: 'Куприянов',
    lastName: 'Валерьевич',
    contacts: [
      {
        type: 'Телефон',
        value: '+71234539520'
      },
      {
        type: 'Email',
        value: 'boss_arsen@xyz.com'
      }
    ]
  },
  {
    name: 'Людмила',
    surname: 'Константинопольская',
    lastName: 'Александровна',
    contacts: [
      {
        type: 'Facebook',
        value: 'https://facebook.com/ludochka73'
      },
      {
        type: 'Телефон',
        value: '+71234578643'
      },
      {
        type: 'Email',
        value: 'ludmila-konst@xyz.com'
      }
    ]
  },
  {
    name: 'Олег',
    surname: 'Дмитриевский',
    lastName: 'Алексеевич',
    contacts: [
      {
        type: 'Телефон',
        value: '+71236528622'
      }
    ]
  },
  {
    name: 'Татьяна',
    surname: 'Александрова',
    lastName: 'Павловна',
    contacts: [
      {
        type: 'Vk',
        value: '@tanya88'
      },
      {
        type: 'Телефон',
        value: '+71234789432'
      },
      {
        type: 'Email',
        value: 'alexandrova@xyz.com'
      }
    ]
  },
  {
    name: 'Николай',
    surname: 'Васнецов',
    lastName: 'Павлович',
    contacts: [
      {
        type: 'Телефон',
        value: '+71334668667'
      },
      {
        type: 'Доп. телефон',
        value: '+71134665443'
      },
      {
        type: 'Facebook',
        value: 'https://facebook.com/palych54'
      },
      {
        type: 'Email',
        value: 'kolya54@xyz.com'
      }
    ]
  }
];

async function createClient(client) {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  });
  const data = await response.json();
  console.log(data);
}

clients.forEach((client) => {
  createClient(client);
});
