import './style.css'
import { Allat } from './allat.ts'

const SERVER = 'http://localhost:3000';

let allatok: Allat[];

let table = document.querySelector('#allatok') as HTMLTableSectionElement;

document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector('#addform') as HTMLFormElement;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let name = (document.querySelector('#addname') as HTMLInputElement).value;
    let species = (document.querySelector('#addspecies') as HTMLInputElement).value;
    let age = parseInt((document.querySelector('#addage') as HTMLInputElement).value);
    fetch(`${SERVER}/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, species, age})
    }).then(() => {
      allatokLekerdez();
      form.reset();
    });
  });
});

function allatokLekerdez(): void {
  fetch(`${SERVER}/animals`)
    .then(response => response.json())
    .then(data => {
      allatok = data.map((allat: Allat) => allat);
      table.innerHTML = '';
      allatok.forEach(allat => {
        table.innerHTML += `
          <tr>
            <td>${allat.id}</td>
            <td>${allat.name}</td>
            <td>${allat.species}</td>
            <td>${allat.age}</td>
            <td class="btncol"><button class="deletebtn" allatid="${allat.id}">Törlés</button></td>
          </tr>
        `;
      });
      torolGombok();
    });
  fetch(`${SERVER}/animals/bySpecies`)
    .then(response => response.json())
    .then(data => {
      let fajok = document.querySelector('#fajok') as HTMLTableSectionElement;
      fajok.innerHTML = '';
      data.forEach((faj: {species: string, _count: number}) => {
        fajok.innerHTML += `
          <tr>
            <td>${faj.species}</td>
            <td>${faj._count}</td>
          </tr>
        `;
      });
    });
}

function allatTorol(id: string) {
  if (!confirm("Biztosan törli a kiválasztott állatot?")) return;
  fetch(`${SERVER}/animals/${id}`, {
    method: 'DELETE'
  }).then(() => {
    allatokLekerdez();
  });
}

function torolGombok() {
  let buttons = document.querySelectorAll('.deletebtn');
  buttons.forEach(button => {
    button.addEventListener("click", ()=>{ allatTorol(button.getAttribute("allatid") as string); })
  });
}

allatokLekerdez();