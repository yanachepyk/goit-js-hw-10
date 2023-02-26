import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const countrySearchEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

countrySearchEl.addEventListener(
  'input',
  debounce(handleCountrySearch, DEBOUNCE_DELAY)
);

function handleCountrySearch(event) {
  const searchValue = event.target.value;

  if (searchValue.trim() === '') {
    resetMarkup();
    return;
  }

  fetchCountries(searchValue)
    .then(response => {
      if (response.status === 404) {
        return Promise.reject();
      }

      return response;
    })
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          { showOnlyTheLastOne: true }
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = countries
          .map(country => creatCountryListMarkup(country))
          .join('');
      } else {
        const country = countries[0];
        const languages = country.languages
          .map(language => language.name)
          .join('');
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = creatCountryInfoMarkup(country, languages);
      }
    })
    .catch(error => {
      resetMarkup();
      Notify.failure('Oops, there is no country with that name', {
        showOnlyTheLastOne: true,
      });
    });
}

function resetMarkup() {
  countryInfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
}

function creatCountryInfoMarkup(country, languages) {
  return `
    <div class="country-name">
        <img src="${country.flags.svg}" alt="${country.name} flag" width="50">
        <h2>${country.name}</h2>
    </div>
    <p class="category"><span class="category__name">Capital:</span> ${country.capital}</p>
    <p class="category"><span class="category__name">Population:</span> ${country.population}</p>
    <p class="category"><span class="category__name">Languages:</span> ${languages}</p>`;
}

function creatCountryListMarkup(country) {
  return `
  <li>
    <div class="country-name">
    <img src="${country.flags.svg}" alt="${country.name} flag" width="50" >
    <p>${country.name}<p></div>
  </li>`;
}
