let insert = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/page.html');
    xhr.onload = () => {
        document.getElementById('container').innerHTML = xhr.response;
    }
    xhr.send();
}
insert();