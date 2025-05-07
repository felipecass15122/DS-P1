function verifyLogin(){
    const usuarioStr = localStorage.getItem('usuarioAutenticado');

    if (!usuarioStr || usuarioStr.length === 0) {     
        window.location.href = '/authPage'; 
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    verifyLogin
});
  