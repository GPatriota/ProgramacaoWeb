function verifyLogin(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    if (email == ""){
        alert ('Preencha o campo email');
    }

    if(password == ""){
        alert('Preencha uma senha');
    }
    
    if(email == "admin" && password == "admin"){
        

        window.location.href= "../home/home.html";
    } else{
        alert("Digite o cadastro correto")
        return;
}}