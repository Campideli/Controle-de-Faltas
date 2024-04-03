const firebaseConfig = {
  apiKey: "AIzaSyC9b4UAZfRNza0L2GEWAMfi7lB3NySTuFA",
  authDomain: "controle-de-faltas-ad6ee.firebaseapp.com",
  databaseURL: "https://controle-de-faltas-ad6ee-default-rtdb.firebaseio.com",
  projectId: "controle-de-faltas-ad6ee",
  storageBucket: "controle-de-faltas-ad6ee.appspot.com",
  messagingSenderId: "928864718863",
  appId: "1:928864718863:web:e27bd81046e9f5dfd9137a",
  measurementId: "G-E9TEYX40DP"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth()
  const database = firebase.database()

  var ControleFaltaDB = firebase.database().ref("ControleFalta");

  function validatePassword(){
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var confirm_password = document.getElementById("confirm_password").value;

    if (password == confirm_password && password.length >= 6 && confirm_password.length >= 6 && name != "" && password != "" && confirm_password != "") {
      document.getElementById("botao").removeAttribute("disabled");
    } else {
      document.getElementById("botao").setAttribute("disabled", "disabled");
    }
    
    if (password == confirm_password){
      document.getElementById("conferem").style.color = "white";
    } else {
      document.getElementById("conferem").style.color = "rgba(255, 255, 255, 0.5)";
    }
    
    if (password.length >= 6 || confirm_password.length >= 6){ 
      document.getElementById("minimo").style.color = "white";
    } else {
      document.getElementById("minimo").style.color = "rgba(255, 255, 255, 0.5)";
    }
    
    if (name != "" || password != "" || confirm_password != "") {
      document.getElementById("vazio").style.color = "white";
    } else {
      document.getElementById("vazio").style.color = "rgba(255, 255, 255, 0.5)";
    }
  }    
  
  function salvar(){
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var confirm_password = document.getElementById("confirm_password").value;
    saveMessages(name, password, confirm_password);
    alert("Cadastro realizado com sucesso!");
  }
  
  const saveMessages = (name, password, confirm_password) => {
    var newControleFalta = ControleFaltaDB.push();
  
    newControleFalta.set({
      name: name,
      password: password,
      confirm_password: confirm_password,
    });
  };
  
  const getElementVal = (id) => {
    return document.getElementById(id).value;
  };