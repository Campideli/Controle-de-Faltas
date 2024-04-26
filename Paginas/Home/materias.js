showLoading();

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
                    <button onclick="edita('${materia.uid}', '${materia.nome}', '${materia.limite}')">Editar</button>
                    <button onclick="remove('${materia.uid}')">Excluir</button>
                </div>
            </li>
        `;
        materiasDiv.appendChild(materiaDiv);
    });
    hideLoading();
};

function addMateria() {
    const user = firebase.auth().currentUser;
    const nomeInput = document.getElementById("nome");
    const limiteInput = document.getElementById("limite");
    const nome = nomeInput.value.trim();
    const limite = parseInt(limiteInput.value.trim());

    firebase.firestore()
    .collection("materias")
    .doc()
    .set({
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
        window.location.reload();
    })
    .catch((error) => {
        console.error("Erro ao adicionar documento: ", error);
    });
    nomeInput.value = "";
    limiteInput.value = "";
}

function deleteTask(uid){
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

function edita(uid, nome, limite){
    const editDiv = document.createElement("div");
    editDiv.className = "editDiv";
    editDiv.innerHTML = `
    <div class="editForm">
        <button class="botaoVoltar" onclick="hideEdit()">Voltar</button>
        <h1>Editar Matéria</h1>
        <form class="teste">
            <label class="texto">Nome da Matéria</label>
            <input type="text" id="nome" onchange="validateEdit()" value="${nome}" required>
            <label class="texto">Limite de Faltas</label>
            <input type="text" id="limite" onchange="validateEdit()" value="${limite}" required>
            <button class="botaoEditar" onclick="editMateria('${uid}')">Editar</button>
        </form>
    </div>
    `;
    document.body.append(editDiv);
}

function hideEdit() {
    var editDiv = document.querySelector('.editDiv');
    document.body.removeChild(editDiv);
}

function editMateria(uid){
    const nomeInput = document.getElementById("nome");
    const limiteInput = document.getElementById("limite");
    const nome = nomeInput.value.trim();
    const limite = parseInt(limiteInput.value.trim());

    firebase.firestore()
    .collection("materias")
    .doc(uid)
    .update({
        nome: nome,
        limite: limite
    })
    .then(() => {
        console.log("Documento editado com sucesso!");
        window.location.reload();
    })
    .catch((error) => {
        console.error("Erro ao editar documento: ", error);
    });
    nomeInput.value = "";
    limiteInput.value = "";
}

function validateEdit(){
    var nome = form.nome().value;
    var limite = form.limite().value;

    if (!nome || !limite || nome.length > 24 || nome.length < 1 || nome == "" || nome == null || !isNaN(nome) || 0 > limite || limite > 50 || limite == "" || limite == null || isNaN(limite)) {
        form.botaoEditar().disabled = true;
    } else {
        form.botaoEditar().disabled = false;
    }
}

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