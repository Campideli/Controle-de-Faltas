function logout(){
    firebase.auth().signOut().then(function(){
        window.location.href = "/index.html";
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
        </div>
        `;
        circleBar();
        materiasDiv.appendChild(materiaDiv);
    });
};

function circleBar(){
    let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");
    let progressStartValue = 0,    
    progressEndValue = 90,    
    speed = 15;

    let progress = setInterval(() => {
    progressStartValue++;
    progressValue.textContent = `${progressStartValue}%`
    circularProgress.style.background = `conic-gradient(#ffd6a7 ${progressStartValue * 3.6}deg, #302d4c 0deg)`
    if(progressStartValue == progressEndValue){
        clearInterval(progress);
    }    
    }, speed);
}
