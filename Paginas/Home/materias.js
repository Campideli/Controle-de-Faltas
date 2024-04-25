function logout(){
    showLoading();
    firebase.auth().signOut().then(function(){
        hideLoading();
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
                    <button onclick="edita('${materia.uid}')">Editar</button>
                    <button onclick="remove('${materia.uid}')">Excluir</button>
                </div>
            </li>
        `;
        materiasDiv.appendChild(materiaDiv);
    });
};

function addMateria() {
    const user = firebase.auth().currentUser;
    const nomeInput = document.getElementById("nome");
    const limiteInput = document.getElementById("limite");
    const nome = nomeInput.value.trim();
    const limite = parseInt(limiteInput.value.trim());

    firebase.firestore().collection("materias").doc().set({
        nome: nome,
        limite: limite,
        faltas: 0,
        usuario: {
            uid: user.uid,
            email: user.email
        }
    })
    .then(() => {
        console.log("Documento adicionado com sucesso!");
        showLoading();
        window.location.reload();
    })
    .catch((error) => {
        console.error("Erro ao adicionar documento: ", error);
    });
    nomeInput.value = "";
    limiteInput.value = "";
}

function deleteTask(uid){
    showLoading();

    firebase.firestore()
    .collection("materias")
    .doc(uid)
    .delete()
    .then(() => {
        window.location.reload();
        hideLoading();
    })
    .catch((error) => {
        alert("Erro ao deletar matéria: " + error.message);
        hideLoading();
    });
}

function remove(uid){
    const removeDiv = document.createElement("div");
    removeDiv.className = "removeDiv";
    removeDiv.innerHTML = `
    <div class="removeForm">
        <span>Tem certeza que deseja excluir?</span>
        <button onclick="deleteTask('${uid}')">Excluir</button>
        <button class="botaoVoltar" onclick="hideRemove()">Voltar</button>
    </div>
    `;
    document.body.append(removeDiv);
}

function hideRemove() {
    var removeDiv = document.querySelector('.removeDiv');
    document.body.removeChild(removeDiv);
}

function validateAdd(){
    var nome = form.nome().value;
    var limite = form.limite().value;

    if (!nome || !limite || nome.length > 24 || nome.length < 1 || nome == "" || nome == null || !isNaN(nome) || 0 > limite || limite > 50 || limite == "" || limite == null || isNaN(limite)) {
        form.botao().disabled = true;
    } else {
        form.botao().disabled = false;
    }

    if (nome.length > 24 || nome.length < 1 || nome == "" || nome == null || !isNaN(nome)){
        form.vnome().style.color = "#edc18e8f";
    } else {
        form.vnome().style.color = "#EDC18E";
    }
    if (0 > limite || limite > 50 || limite == "" || limite == null || isNaN(limite)){
        form.vlimite().style.color = "#edc18e8f";
    } else {
        form.vlimite().style.color = "#EDC18E";
    }
}

const form = {
    nome: () => document.getElementById("nome"),
    limite: () => document.getElementById("limite"),
    botao: () => document.getElementById("botao"),
    botaoEditar: () => document.querySelector(".botaoEditar"),
    vnome: () => document.getElementById("vnome"),
    vlimite: () => document.getElementById("vlimite")
}

function adiciona(){
    const addDiv = document.createElement("div");
    addDiv.className = "addDiv";
    addDiv.innerHTML = `
    <div class="form">
        <button class="close" onclick="hideAdd()">X</button>
        <h1>Adicionar Matéria</h1>
        <form class="teste">
            <label class="texto">Nome da Matéria</label>
            <input onchange="validateAdd()" type="text" id="nome" required>
            <label class="texto">Limite de Faltas</label>
            <input onchange="validateAdd()" type="text" id="limite" required>
            <button class="submit" id="botao" disabled="true" onclick="addMateria()">Adicionar</button>
            <div class="error1" id="vnome">• Nome menor que 24 caracteres</div>
            <div class="error2" id="vlimite">• Limite menos que 50</div>
        </form>
    </div>
    `;
    document.body.append(addDiv);
}

function hideAdd() {
    var addDiv = document.querySelector('.addDiv');
    document.body.removeChild(addDiv);
}

function editTask(uid){
    const nomeInput = document.getElementById("nome");
    const limiteInput = document.getElementById("limite");
    const nome = nomeInput.value.trim();
    const limite = parseInt(limiteInput.value.trim());
    showLoading();
    firebase.firestore()
        .collection("materias")
        .doc(uid)
        .update({
            nome: nome,
            limite: limite
        })
        .then(() => {
            hideLoading();
            window.location.reload();
        })
        .catch((error) => {
            alert("Erro ao editar matéria: " + error.message);
        });

    nomeInput.value = "";
    limiteInput.value = "";
}

function edita(uid){
    showLoading();

    firebase.firestore()
    .collection("materias")
    .doc(uid)
    .get()
    .then((doc) => {
        const materia = doc.data();
        showEdita(materia.nome, materia.limite, uid);
    })
    .catch((error) => {
        alert("Erro ao editar matéria: " + error.message);
    });
}
    
function showEdita(nomeInput, limiteInput, uid){
    const editDiv = document.createElement("div");
    editDiv.className = "editDiv";
    editDiv.innerHTML = `
    <form class="editForm">
        <span>Editar Matéria</span>
        <input type="text" id="nome" onchange="validateEdit()">
        <input type="text" id="limite" onchange="validateEdit()">
        <button class="botaoEditar" onclick="editTask('${uid}')" disabled="true">Editar</button>
        <button class="botaoVoltar" onclick="hideEdita()">Voltar</button>
    </form>
    `;
    document.body.append(editDiv);
    form.nome().value = nomeInput;
    form.limite().value = limiteInput;
}

function hideEdita() {
    var editDiv = document.querySelector('.editDiv');
    document.body.removeChild(editDiv);
}

function validateEdit(){
    var nome = form.nome().value;
    var limite = form.limite().value;

    if (!nome || !limite || nome.length > 24 || nome.length < 1 || nome == "" || nome == null || !isNaN(nome) || 0 > limite || limite > 50 || limite == "" || limite == null || isNaN(limite)) {
        form.botaoEditar().setAttribute("disabled", true);
    } else {
        form.botaoEditar().removeAttribute("disabled");
    }
}