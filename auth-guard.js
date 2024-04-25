firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      showLoading();
      window.location.href = '/Paginas/Registro/login.html';
    }
});