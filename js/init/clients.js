import fetch from "node-fetch"

const clients = [
  {
    name: 'Скворцов',
    surname: 'Денис',
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
    name: 'Куприянов',
    surname: 'Арсений',
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
    name: 'Константинопольская',
    surname: 'Людмила',
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
    name: 'Дмитриевский',
    surname: 'Олег',
    lastName: 'Алексеевич',
    contacts: [
      {
        type: 'Телефон',
        value: '+71236528622'
      }
    ]
  },
  {
    name: 'Александрова',
    surname: 'Татьяна',
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
