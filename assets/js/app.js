const cl = console.log;
const playersForm = document.getElementById('playersForm');
const nameControl = document.getElementById('name');
const nicknameControl = document.getElementById('nickname');
const roleControl = document.getElementById('role');
const jerseyNumberControl = document.getElementById('jerseyNumber');
const photoUrlControl = document.getElementById('photoUrl');
const selectedColorControl = document.getElementById('selectedColor');
const cardsContainer = document.getElementById('cardsContainer');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const loader = document.getElementById('loader');
const allData_url = `https://crudbyaniket-default-rtdb.asia-southeast1.firebasedatabase.app/players`

const objToArray = (obj) => {
    let dataArray = []
    for(const key in obj){
        dataArray.push({...obj[key], id: key})
    }
    return dataArray
};

const objFromControls = () => {
    return {
        color: selectedColorControl.value,
        jerseyNumber: jerseyNumberControl.value,
        name: nameControl.value,
        nickname: nicknameControl.value,
        photoUrl: photoUrlControl.value,
        role: roleControl.value
    }
};

const toggleButtons = () => {
    addBtn.classList.toggle('d-none')
    updateBtn.classList.toggle('d-none')
};

const showLoader = () => {
    loader.classList.remove('d-none')
};

const hideLoader = () => {
    loader.classList.add('d-none')
};

const snackBar = (msg, icon) => {
    swal.fire({
        title: msg,
        icon: icon,
        timer: 2000
    })
};

const makeApiCall = (method, url, body) => {
    let jsonBody = body ? JSON.stringify(body) : null
    showLoader()
    return fetch(url, {
        method: method,
        body: jsonBody,
        headers: {
            "auth": "token",
            "conent-type": "application/json"
        }
    })
      .then(res => {
        if(!res.ok){
            throw new Error(`${res.status}: ${res.statusText}`)
        }else{
            return res.json()
        }
      })
      .catch(err => {
        snackBar(err, 'error')
      })
      .finally(() => {
        hideLoader()
      })
};

const templating = (arr) => {
    let result = ``
    arr.forEach(obj => {
        result += `
                    <div class="col-lg-4 col-md-6 mb-3" id="${obj.id}">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h3 class="m-0 font-weight-bolder">IND</h3>
                                <a href="https://www.bcci.tv/" target="_blank"><img src="https://documents.bcci.tv/web-images/bcci-logo-rounded.png" alt="BCCI Logo"></a>
                            </div>
                            <div class="card-body text-center ${obj.color}">
                                <figure><img src="${obj.photoUrl}" alt="Img" title="${obj.name}"></figure>
                                <h4 class="m-0">${obj.name}</h4>
                                <h5 class="m-0">${obj.nickname}</h5>
                                <i onclick="onEdit(this)" role="button" class="fa-solid fa-pen editIcon"></i>
                                <i onclick="onDelete(this)" role="button" class="fa-solid fa-trash deleteIcon"></i>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <span>${obj.role}</span>
                                <span>#${obj.jerseyNumber}</span>
                            </div>
                        </div>
                    </div>`                
    })
    cardsContainer.innerHTML = result
};

const createNewCard = (obj) => {
    let newCol = document.createElement('div')
    newCol.className = `col-lg-4 col-md-6 mb-3`
    newCol.id = obj.id
    newCol.innerHTML = `
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h3 class="m-0 font-weight-bolder">IND</h3>
                                <a href="https://www.bcci.tv/" target="_blank"><img src="https://documents.bcci.tv/web-images/bcci-logo-rounded.png" alt="BCCI Logo"></a>
                            </div>
                            <div class="card-body text-center ${obj.color}">
                                <figure><img src="${obj.photoUrl}" alt="Img" title="${obj.name}"></figure>
                                <h4 class="m-0">${obj.name}</h4>
                                <h5 class="m-0">${obj.nickname}</h5>
                                <i onclick="onEdit(this)" role="button" class="fa-solid fa-pen editIcon"></i>
                                <i onclick="onDelete(this)" role="button" class="fa-solid fa-trash deleteIcon"></i>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <span>${obj.role}</span>
                                <span>#${obj.jerseyNumber}</span>
                            </div>
                        </div>`
    cardsContainer.prepend(newCol)
    snackBar(`New ${obj.name}'s card added successfully`, 'success')                    
};

const patchData = (obj) => {
    selectedColorControl.value = obj.color
    jerseyNumberControl.value = obj.jerseyNumber
    nameControl.value = obj.name
    nicknameControl.value = obj.nickname
    photoUrlControl.value = obj.photoUrl
    roleControl.value = obj.role
    toggleButtons()
    window.scroll({
        top: 0,
        behavior: 'smooth'
    })
};

const updateCardUi = (obj) => {
    let updateCol = document.getElementById(obj.id)
    updateCol.querySelector('.card-body').className = `card-body text-center ${obj.color}`
    updateCol.querySelector('.card-body img').setAttribute('src', obj.photoUrl)
    updateCol.querySelector('.card-body img').setAttribute('title', obj.name)
    updateCol.querySelector('.card-body h4').innerHTML = obj.name
    updateCol.querySelector('.card-body h5').innerHTML = obj.nickname
    updateCol.querySelector('.card-footer').children[0].innerHTML = obj.role
    updateCol.querySelector('.card-footer').children[1].innerHTML = `#${obj.jerseyNumber}`
    toggleButtons()
    let scrollPosition = localStorage.getItem('scrollPosition')
    window.scroll({
        top: scrollPosition,
        behavior: 'smooth'
    })
    snackBar(`${obj.name}'s card updated successfully`, 'success')
};

const fetchAllData = () => {
    makeApiCall('GET', `${allData_url}.json`, null)
      .then(data => {
        let dataArray = objToArray(data)
        templating(dataArray.reverse())
      })
};

fetchAllData();

const onCardAdd = (eve) => {
    eve.preventDefault()
    let newObj = objFromControls()
    makeApiCall('POST', `${allData_url}.json`, newObj)
      .then(data => {
        playersForm.reset()
        createNewCard({...newObj, id: data.name})
      })
};

const onEdit = (ele) => {
    let editId = ele.closest('.col-lg-4').id
    let scrollPosition = window.scrollY
    localStorage.setItem('editId', editId) 
    localStorage.setItem('scrollPosition', scrollPosition)
    let edit_url = `${allData_url}/${editId}.json`
    makeApiCall('GET', edit_url, null)
      .then(data => {
        patchData(data)
      })
};

const onCardUpdate = () => {
    let updateId = localStorage.getItem('editId')
    let update_url = `${allData_url}/${updateId}.json`
    let updatedObj = objFromControls()
    makeApiCall('PATCH', update_url, updatedObj)
      .then(data => {
        playersForm.reset()
        updateCardUi({...data, id: updateId})
      })
};

const onDelete = (ele) => {
    let deleteId = ele.closest('.col-lg-4').id
    let deleteName = document.getElementById(deleteId).querySelector('.card-body h4').innerHTML
    swal.fire({
        title: `Do you really want to delete ${deleteName}'s card?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
      }).then((result) => {
        if (result.isConfirmed){
            let delete_url = `${allData_url}/${deleteId}.json`
            makeApiCall('DELETE', delete_url, null)
              .then(() => {
                document.getElementById(deleteId).remove()
                snackBar(`${deleteName}'s card deleted successfully`, 'success')
              })
        }
      });
}

playersForm.addEventListener('submit', onCardAdd);
updateBtn.addEventListener('click', onCardUpdate);