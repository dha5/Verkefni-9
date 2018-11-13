/*
 * TO DO:
 * -> Breyta dagsettningum
 *  ----> 11. Decembet 1986 --> 1986-12-11
 *  Skráð
 *  Seinast breytt
 *  Rennur út
 */
// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

// Loading
const fetchStart = new Event('fetchStart', { view: document, bubbles: true, cancelable: false });
const fetchEnd = new Event('fetchEnd', { view: document, bubbles: true, cancelable: false });


document.addEventListener('fetchStart', () => {
  const dl = document.createElement('dl');

  const loadimg = new Image(200, 200);
  loadimg.src = 'loading.gif';

  const loadingElement = document.createElement('dt');
  loadingElement.appendChild(loadimg);
  dl.appendChild(loadingElement);
});

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');

  	program.init(domains);
});

document.addEventListener('fetchEnd', () => {
  console.log('hide');
});

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  // Fall til að breyta dagsettningum
  function formatDate(date) {
    // Dagur
    let day = date.substring(0, 2); // "XX" & "X."

    if (day.charAt(1) === '.') { // EF dags. er einn tölustafur
      day = `0${day.substring(0, 1)}`;
      var month = date.substring(3, 6);
    } else {
      var month = date.substring(4, 7);
    }

    switch (month) {
      case 'Jan':
        month = '01';
        break;
      case 'Feb':
        month = '02';
        break;
      case 'Mar':
        month = '03';
        break;
      case 'Apr':
        month = '04';
        break;
      case 'May':
        month = '05';
        break;
      case 'Jun':
        month = '06';
        break;
      case 'Jul':
        month = '07';
        break;
      case 'Aug':
        month = '08';
        break;
      case 'Sep':
        month = '09';
        break;
      case 'Oct':
        month = '10';
        break;
      case 'Nov':
        month = '11';
        break;
      case 'Dec':
        month = '12';
        break;
    }

    const year = date.slice(-4);
    return `${year}-${month}-${day}`;
  }

  // Fall til að birta gögn
  function displayWebsites(domainsList) {
    if (domainsList.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }

    const [{
      domain, registered, lastChange, expires, registrantname, email, address, country,
    }] = domainsList;
    const dl = document.createElement('dl');

    // Breyta dagsettningum


    // Lén
    const domainElement = document.createElement('dt');
    domainElement.appendChild(document.createTextNode('Lén'));
    dl.appendChild(domainElement);

    const domainValueElement = document.createElement('dd');
    domainValueElement.appendChild(document.createTextNode(domain));
    dl.appendChild(domainValueElement);

    // Skráð
    const registeredElement = document.createElement('dt');
    registeredElement.appendChild(document.createTextNode('Skráð'));
    dl.appendChild(registeredElement);

    const registeredValueElement = document.createElement('dd');
    registeredValueElement.appendChild(document.createTextNode(formatDate(registered)));
    dl.appendChild(registeredValueElement);

    // Seinasta breyting
    const lastChangeElement = document.createElement('dt');
    lastChangeElement.appendChild(document.createTextNode('Seinasta breyting'));
    dl.appendChild(lastChangeElement);

    const lastChangeValueElement = document.createElement('dd');
    lastChangeValueElement.appendChild(document.createTextNode(formatDate(lastChange)));
    dl.appendChild(lastChangeValueElement);

    // Rennur út
    const expiresElement = document.createElement('dt');
    expiresElement.appendChild(document.createTextNode('Rennur út'));
    dl.appendChild(expiresElement);

    const expiresValueElement = document.createElement('dd');
    expiresValueElement.appendChild(document.createTextNode(formatDate(expires)));
    dl.appendChild(expiresValueElement);

    // Skráningaraðili
    if (registrantname !== null && registrantname !== '') {
      const registrantnameElement = document.createElement('dt');
      registrantnameElement.appendChild(document.createTextNode('Skráningaraðili'));
      dl.appendChild(registrantnameElement);

      const registrantnameValueElement = document.createElement('dd');
      registrantnameValueElement.appendChild(document.createTextNode(registrantname));
      dl.appendChild(registrantnameValueElement);
    }

    // Netfang
    if (email !== null && email !== '') {
      const emailElement = document.createElement('dt');
      emailElement.appendChild(document.createTextNode('Netfang'));
      dl.appendChild(emailElement);

      const emailValueElement = document.createElement('dd');
      emailValueElement.appendChild(document.createTextNode(email));
      dl.appendChild(emailValueElement);
    }

    // Heimilisfang
    if (address !== null && address !== '') {
      const addressElement = document.createElement('dt');
      addressElement.appendChild(document.createTextNode('Heimilisfang'));
      dl.appendChild(addressElement);

      const addressValueElement = document.createElement('dd');
      addressValueElement.appendChild(document.createTextNode(address));
      dl.appendChild(addressValueElement);
    }

    // Land
    if (country !== null && address !== '') {
      const countryElement = document.createElement('dt');
      countryElement.appendChild(document.createTextNode('Land'));
      dl.appendChild(countryElement);

      const countryValueElement = document.createElement('dd');
      countryValueElement.appendChild(document.createTextNode(country));
      dl.appendChild(countryValueElement);
    }

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dl);
    document.dispatchEvent(fetchEnd);
  }

  // Villur
  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }


  // Sækja gögn
  function fetchData(domain) {
    fetch(`${API_URL}${domain}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Non 200 status');
      })

    // Birtum gögnin ef allt er í lagi
      .then((data) => {
        displayWebsites(data.results);
      })

    // Birtum villu ef
      .catch((error) => {
        displayError('Villa við að sækja gögn');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

	  document.dispatchEvent(fetchStart);
    if (input.value === '') {
      displayError('Leit verður að vera strengur');
      document.dispatchEvent(fetchEnd);
    } else {
      fetchData(input.value);
    }
  }


  function init(_domains) {
    domains = _domains;
    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  	}

  return {
    init,
  };
})();