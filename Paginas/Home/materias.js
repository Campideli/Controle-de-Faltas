function logout(){
    firebase.auth().signOut().then(function(){
        window.location.href = "/Paginas/Registro/login.html";
    }).catch(function(error){
        alert('Erro ao deslogar!');
    });
}

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        findMateria(user);
    }
});

function findMateria(user){
    firebase.firestore()
    .collection("materias")
    .where("usuario.uid", "==", user.uid)
    .get()
    .then((snapshot) => {
        const materias = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));
        addMateriasToScreen(materias);
    });
}

function addMateriasToScreen(materias){
    const materiasDiv = document.getElementById("materias");

    materias.forEach(materia => {
        const materiaDiv = document.createElement("div");
        materiaDiv.className = "materia";
        materiaDiv.innerHTML = `
            <li>
                <h2>${materia.nome}</h2>
                <p>Limite de faltas: ${materia.limite}</p>
                <div class="task-actions">
                    <button onclick="editTask('${materia.uid}')">Editar</button>
                    <button onclick="deleteTask('${materia.uid}')">Excluir</button>
                </div>
            </li>
        `;
        materiasDiv.appendChild(materiaDiv);
    });
};

function addMateria() {
    const nome = prompt("Digite o nome da matéria:");
    const limite = prompt("Digite o limite de faltas:");

    const user = firebase.auth().currentUser;

    if (!nome || !limite) {
        alert("Preencha todos os campos!");
        return;
    }

    if (nome.length > 24 || nome.length < 1 || nome == "" || nome == null || !isNaN(nome)){
        alert("Nome da matéria inválido!");
        return;
    }

    if (0 > limite || limite > 50 || limite == "" || limite == null || isNaN(limite)){
        alert("Limite de faltas inválido!");
        return;
    }

    firebase.firestore()
        .collection("materias")
        .add({
            nome: nome,
            limite: limite,
            faltas: 0,
            usuario: {
                uid: user.uid,
                email: user.email
            }
        })
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            alert("Erro ao adicionar matéria: " + error.message);
        });
}

function editTask(uid){
    const nome = prompt("Digite o nome da matéria:");
    const limite = prompt("Digite o limite de faltas:");

    if (!nome || !limite) {
        alert("Preencha todos os campos!");
        return;
    }

    if (nome.length > 20 || nome.length < 1 || nome == "" || nome == null || !isNaN(nome)){
        alert("Nome da matéria inválido!");
        return;
    }

    if (0 > limite || limite > 50 || limite == "" || limite == null || isNaN(limite)){
        alert("Limite de faltas inválido!");
        return;
    }

    firebase.firestore()
        .collection("materias")
        .doc(uid)
        .update({
            nome: nome,
            limite: limite
        })
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            alert("Erro ao editar matéria: " + error.message);
        });
}

function deleteTask(uid){
    if (confirm("Tem certeza que deseja excluir essa matéria?")) {
        firebase.firestore()
        .collection("materias")
        .doc(uid)
        .delete()
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            alert("Erro ao deletar matéria: " + error.message);
        });
    } else {
        return;
    }
}

