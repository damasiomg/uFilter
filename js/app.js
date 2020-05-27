const inputSearch = document.querySelector('#input-search');
const inputButton = document.querySelector('#input-button');
const usersPanel = document.querySelector('#users-panel');
const statisticsPanel = document.querySelector('#statistics-panel');
const txtMen = document.querySelector('#txt-men');
const txtWoman = document.querySelector('#txt-woman');
const txtSum = document.querySelector('#txt-sum');
const txtmedia = document.querySelector('#txt-media');
const formatNumber = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 4 });
let usersData = [];
let filteredData = [];
let statistics = {};

window.addEventListener('load', run => {
    inputSearch.addEventListener('keyup', watchInputSearch);
    inputButton.addEventListener('click', doSearch);
    getData();
    render();
})

const getData = async () => {
    const response = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const data = await response.json();

    usersData = data.results.map(user => {
        return {
            name: `${user.name.first} ${user.name.last}`,
            picture: user.picture.thumbnail,
            age: user.dob.age,
            gender: user.gender
        }
    });
}

const watchInputSearch = (e) => {
    inputSearch.value.length ? inputButton.disabled = false : inputButton.disabled = true;
    if(e.key==='Enter' && inputSearch.value.length){
        doSearch();
    }  
}

const doSearch = () => {
    filteredData = usersData.filter(user => user.name.toLowerCase().search(inputSearch.value.toLowerCase()) !== -1);
    filteredData.sort((a, b) => a.name.localeCompare(b.name));
    calcStatistics();
    render();
}

const render = () => { 
    usersPanel.innerHTML = "";
    if(filteredData.length){
        filteredData.forEach(user => {
            usersPanel.innerHTML += 
            `
                <div class="inline-user">
                    <img class="img-person" src="${user.picture}" alt="${user.name}" width="48"/>

                    <label class="inline-text-user">${user.name}, ${user.age}</label>
                </div>
            `
        })
    }else{
        if(inputSearch.value.length){
            usersPanel.innerHTML = `
            <div class="empty-list">
                <img src="./img/not-found.svg"  width="64" alt="Sem resultado"/>
                Nenhum usuário encontrado
            </div>`;
        }else{
            usersPanel.innerHTML = `
            <div class="empty-list">
                <img src="./img/empty-box.svg"  width="64" alt="Lista vazia"/>
                Lista está vazia
            </div>`;
        }
    }
    txtMen.innerHTML = formatNumber.format(statistics.maleUsers || 0);
    txtWoman.innerHTML = formatNumber.format(statistics.femaleUsers || 0);
    txtSum.innerHTML = formatNumber.format(statistics.totalAge || 0);
    txtmedia.innerHTML = formatNumber.format(statistics.mediaAge || 0);    
}

const calcStatistics = () => {
    statistics['maleUsers'] = (filteredData.filter(user => user.gender === 'male')).length;
    statistics['femaleUsers'] = (filteredData.filter(user => user.gender === 'female')).length;
    statistics['totalAge'] = filteredData.reduce((acumulator, current) =>  acumulator + current.age, 0);
    statistics['mediaAge'] = statistics['totalAge'] / (statistics['maleUsers'] + statistics['femaleUsers']);
};