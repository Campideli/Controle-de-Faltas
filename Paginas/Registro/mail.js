
function validateLogin(){
  var email = form.email().value;
  var password = form.password().value;
  if (isNaN(password) == false || validateEmail(email) == false) {
    form.botaologin().setAttribute("disabled", "disabled");
  } else {
    form.botaologin().removeAttribute("disabled");
  }
  if (validateEmail(email)) {
    form.recupera().style.color = "#EDC18E";
  } else {
    form.recupera().style.color = "#edc18e8f";
  }
}

function validateRegister(){
  var email = form.email().value;
  var password = form.password().value;
  var confirm_password = form.confirm_password().value;
  if (password == confirm_password && password.length >= 6 && confirm_password.length >= 6 && isNaN(email) && isNaN(password) && isNaN(confirm_password) && validateEmail(email)) {
    form.botao().removeAttribute("disabled");
  } else {
    form.botao().setAttribute("disabled", "disabled");
  }
  
  if (validateEmail(email)) {
    form.valido().style.color = "#EDC18E";
  } else {
    form.valido().style.color = "#edc18e8f";
  }
  if (password == confirm_password && isNaN(password) && isNaN(confirm_password)) {
    form.conferem().style.color = "#EDC18E";
  } else {
    form.conferem().style.color = "#edc18e8f";
  }
  
  if (password.length >= 6){ 
    form.minimo().style.color = "#EDC18E";
  } else {
    form.minimo().style.color = "#edc18e8f";
  }
  
  if (isNaN(email) && isNaN(password) && isNaN(confirm_password)) {
    form.vazio().style.color = "#EDC18E";
  } else {
    form.vazio().style.color = "#edc18e8f";
  }
}    

const form = {
  email: () => document.getElementById("email"),
  password: () => document.getElementById("password"),
  confirm_password: () => document.getElementById("confirm_password"),
  botao: () => document.getElementById("botao"),
  botaologin: () => document.getElementById("botaologin"),
  recupera: () => document.getElementById("recupera"),
  valido: () => document.getElementById("valido"),
  conferem: () => document.getElementById("conferem"),
  minimo: () => document.getElementById("minimo"),
  vazio: () => document.getElementById("vazio")
}

function validateEmail(email) { 
  const regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/; 
  return regex.test(email); 
}

function registrar(){
  firebase.auth().createUserWithEmailAndPassword(form.email().value, form.password().value)
    .then(() => {
      console.log("Usuário cadastrado com sucesso!");
      window.location.href = '/index.html';
    })
    .catch((error) => {
      alert("Usuário já cadastrado!");
    });
}

function login(){
  firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value)
    .then(() => {
      console.log("Login successful");
      window.location.href = '/Paginas/Home/home.html';
    })
    .catch((error) => {
      alert("Usuário ou senha inválidos!");
    });
}

function recuperarSenha(){
  firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
    alert("Email enviado com sucesso!");
  }).catch((error) => {
    alert("Email inválido!");
  });
}