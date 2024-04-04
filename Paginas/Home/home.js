function logout(){
    firebase.auth().signOut().then(function(){
        window.location.href = "/Paginas/Registro/login.html";
    }).catch(function(error){
        alert('Erro ao deslogar!');
    });
}