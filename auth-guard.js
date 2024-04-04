firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      alert("Você não está logado!");
      window.location.href = '/Paginas/Registro/login.html';
    }
});