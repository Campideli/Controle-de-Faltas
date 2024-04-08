function logout(){
    firebase.auth().signOut().then(function(){
        window.location.href = "/Paginas/Registro/login.html";
    }).catch(function(error){
        alert('Erro ao deslogar!');
    });
}

findMateria();

function findMateria(){
    setTimeout(() => {
        addMateriasToScreen(fakeMateria);
    }, 0);
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
                    <button onclick="editTask()">Editar</button>
                    <button onclick="deleteTask()">Excluir</button>
                </div>
            </li>
        `;
        materiasDiv.appendChild(materiaDiv);
    });
    };

fakeMateria = [{
    nome: "Cálculo",
    limite: 25,
},{
    nome: "Matemática Discreta",
    limite: 17,
},{
    nome: "Estrutura de Dados",
    limite: 25,
},{
    nome: "Arquitetura de Comp.",
    limite: 17,
},{
    nome: "Noções de Direito",
    limite: 8,
}];