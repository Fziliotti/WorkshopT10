var versao = 8
var arquivos = [
    "css/main.css",
    "css/bootstrap4.css",
    "css/sweetalert.css",
    "js/sweetalert2.js",
    "offline/index.html"
]

// Intalação do service worker
self.addEventListener("install",() => {
    this.skipWaiting(); // força o sw a esperar para se tornar ativo
    console.log("Instalou service worker!")
})

// Ativação e callback que irá excluir as versões anteriores do service worker
self.addEventListener("activate", () => {
    console.log("Service worker vai ser ativado e atualizado caso necessario, excluindo caches anteriores!")
    caches.open("todo-arquivos-" + versao).then(cache => {
        cache.addAll(arquivos)
            .then(function () {
                caches.delete("todo-arquivos-" + (versao - 1))
                caches.delete("todo-arquivos")
            })

    })
})
// fetch que irá tratar as chamadas nos pedidos e verificar se está em cache
self.addEventListener("fetch", (event) => {
    // console.log(event.request)
    let pedido = event.request
    event.respondWith(
        caches.match(pedido)
        .then(respostaCache => {
            let resposta = respostaCache ? respostaCache : fetch(pedido)
            return resposta
        })
        .catch(() => {
            return caches.match('offline/index.html');
        })
    )
})



