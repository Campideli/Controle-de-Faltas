function showLoading() {
    var loadingDiv = document.createElement('div');
    loadingDiv.className = 'loadingDiv';
    loadingDiv.innerHTML = `
        <span class="loading"></span>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    var loadingDiv = document.querySelector('.loadingDiv');
    document.body.removeChild(loadingDiv);
}