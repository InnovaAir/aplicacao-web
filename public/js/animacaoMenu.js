function abrirMenu() {
    document.getElementById("menu").classList.add("menu-aberto");
    document.getElementById("tela").classList.add("tela-movida");
  }
  function fecharMenu() {
    document.getElementById("menu").classList.remove("menu-aberto");
    document.getElementById("tela").classList.remove("tela-movida");
  }

  function abrirMenuMobile() {
    const menuMobile = document.querySelector('.menu_mobile');
    const novoMenu = document.querySelector('.novo_menu');

    if (novoMenu.style.display === 'flex') {
        novoMenu.style.display = 'none';
    } else {
        novoMenu.style.display = 'flex';
    }
}