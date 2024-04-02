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
  
  // initialize firebase
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth()
  const database = firebase.database()

  // reference your database
  var ControleFaltaDB = firebase.database().ref("ControleFalta");
  
  document.getElementById("ControleFalta").addEventListener("Confirm", ConfirmForm);
  
  function ConfirmForm(e) {
    e.preventDefault();
    //   enable alertaa
    document.querySelector(".alert").style.display = "block";
  
    //   remove the alert
    setTimeout(() => {
      document.querySelector(".alert").style.display = "none";
    }, 3000);
  
    //   reset the form
    document.getElementById("ControleFalta").reset();
  }


  function validatePassword(){
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var confirm_password = document.getElementById("confirm_password").value;
        if (password != confirm_password){
      alert("As senhas não conferem");
    } else {
      alert("Usuário criado");
      saveMessages(name, password, confirm_password);
    }
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