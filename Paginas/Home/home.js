showLoading();

function logout(){
    showLoading();
    firebase.auth().signOut().then(function(){
        window.location.href = "/Paginas/Registro/login.html";
        hideLoading();
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
        <div class="pBar">
        <span class="text">${materia.nome}</span>
            <div class="circular-progress">
                <span class="progress-value">0%</span>
            </div>
        <span class="text">${materia.faltas}/${materia.limite}</span>
        <div class="btn-actions">
            <button class="btn" onclick="maisTask('${materia.uid}')">+</button>  
            <button class="btn" onclick="menosTask('${materia.uid}')">-</button>      
        </div>
        </div>
        `;
        materiasDiv.appendChild(materiaDiv);
    });
    circleBar();
    hideLoading();
};

function circleBar(){
    var materiateste = document.getElementsByClassName("materia");
    for (var i = 0; i < materiateste.length; i++){
        var materia = materiateste[i];
        var limite = materia.getElementsByClassName("text")[1].innerHTML.split("/")[1];
        var faltas = materia.getElementsByClassName("text")[1].innerHTML.split("/")[0];
        var percent = (faltas / limite) * 100;
        var progressValue = materia.getElementsByClassName("progress-value")[0];
        progressValue.innerHTML = percent.toFixed(0) + "%";
        var progressBar = materia.getElementsByClassName("circular-progress")[0];
        progressBar.style.background = `conic-gradient(#ffd6a7 ${percent * 3.6}deg, #302d4c 0deg)`;
    }
}

function maisTask(uid){
    firebase.firestore()
    .collection("materias")
    .doc(uid)
    .get()
    .then((doc) => {
        const materia = {
            uid: doc.id,
            ...doc.data()
        };
        if (materia.faltas < materia.limite){
            firebase.firestore()
            .collection("materias")
            .doc(uid)
            .update({
                faltas: materia.faltas + 1
            })
            .then(() => {
                location.reload();
            });
        }
    });
}

function menosTask(uid){
    firebase.firestore()
    .collection("materias")
    .doc(uid)
    .get()
    .then((doc) => {
        const materia = {
            uid: doc.id,
            ...doc.data()
        };
        if (materia.faltas > 0){
            firebase.firestore()
            .collection("materias")
            .doc(uid)
            .update({
                faltas: materia.faltas - 1
            })
            .then(() => {
                location.reload();
            });
        }
    });
}
